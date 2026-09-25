const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function getErrorMessage(code, serverMessage, status) {
  if (code === "INVALID_INPUT") {
    return serverMessage || "Please provide more study material and try again.";
  }

  if (code === "INVALID_AI_RESPONSE") {
    return "The AI returned an unusable study set. Please try again.";
  }

  if (code === "AI_REQUEST_FAILED") {
    return "The AI service could not complete the request. Please try again in a moment.";
  }

  if (status === 502) {
    return "The AI returned an unusable study set. Please try again.";
  }

  return serverMessage || "The study service is temporarily unavailable. Please try again.";
}

class StudyApiError extends Error {
  constructor(message, { code = "UNKNOWN_ERROR", status = null, requestId } = {}) {
    super(message);
    this.name = "StudyApiError";
    this.code = code;
    this.status = status;
    this.requestId = requestId;
  }
}

export async function generateStudySet(input, signal, requestId) {
  console.info("[study-api] Sending study generation request", {
    requestId,
    inputLength: input.length
  });

  const response = await fetch(
    `${API_BASE_URL}/api/study/generate`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "X-Request-Id": requestId
      },

      body: JSON.stringify({
        input
      }),

      signal
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    console.info("[study-api] Response was not valid JSON", {
      requestId,
      status: response.status
    });
    throw new StudyApiError(
      "The server returned an invalid response. Please try again.",
      {
        code: "INVALID_RESPONSE",
        status: response.status,
        requestId
      }
    );
  }

  console.info("[study-api] Received study generation response", {
    requestId,
    status: response.status,
    ok: response.ok,
    success: data?.success,
    hasData: Boolean(data?.data),
    dataSummary: data?.data
      ? {
          title: data.data.title,
          cardCount: data.data.cards?.length,
          quizCount: data.data.quiz?.length
        }
      : null,
    error: data?.error || null
  });

  if (!response.ok) {
    const errorCode = data?.error?.code || "REQUEST_FAILED";
    const fallbackMessage =
      response.status === 400
        ? "The study material could not be accepted. Please check it and try again."
        : response.status === 502
          ? "The AI returned an unusable study set. Please try again."
          : "The study service is temporarily unavailable. Please try again.";

    throw new StudyApiError(
      getErrorMessage(errorCode, data?.error?.message || fallbackMessage, response.status),
      {
        code: errorCode,
        status: response.status,
        requestId
      }
    );
  }

  if (!data.success || !data.data) {
    throw new StudyApiError(
      "The server returned an incomplete study set. Please try again.",
      {
        code: "INVALID_STUDY_SET",
        status: response.status,
        requestId
      }
    );
  }

  return data.data;
}