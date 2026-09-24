const API_BASE_URL = "http://localhost:5000";

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
    throw new Error("The server returned an invalid response.");
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
    throw new Error(
      data?.error?.message ||
        "Unable to generate the study set."
    );
  }

  if (!data.success || !data.data) {
    throw new Error(
      "The server returned an invalid study set."
    );
  }

  return data.data;
}