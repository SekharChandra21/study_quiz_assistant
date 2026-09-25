import { useRef, useState } from "react";

import PromptInput from "./components/PromptInput";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import ResultView from "./components/ResultView";

import { generateStudySet } from "./lib/api";
import { validateStudyResult } from "./lib/validateResult";

function App() {
  const [input, setInput] = useState("");
  const [studySet, setStudySet] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const requestIdRef = useRef(0);
  const abortControllerRef = useRef(null);

  const handleGenerate = async () => {
    const trimmedInput = input.trim();

    console.info("[study-ui] Generate requested", {
      inputLength: trimmedInput.length
    });

    if (trimmedInput.length < 10) {
      console.info("[study-ui] Generate blocked by client validation", {
        inputLength: trimmedInput.length
      });

      setError(
        "Please enter at least 10 characters of study material."
      );

      return;
    }

    // Cancel previous request.
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();

    abortControllerRef.current = controller;

    const requestId = ++requestIdRef.current;
    const correlationId = crypto.randomUUID();

    setLoading(true);
    setError("");
    setStudySet(null);

    try {
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 30000);

      const result = await generateStudySet(
        trimmedInput,
        controller.signal,
        correlationId
      );

      clearTimeout(timeoutId);

      // Ignore stale response.
      if (requestId !== requestIdRef.current) {
        console.info("[study-ui] Ignoring stale study response", {
          requestId: correlationId
        });
        return;
      }

      // Validate response shape.
      const isValidResult = validateStudyResult(result);

      console.info("[study-ui] Validating response received from API", {
        requestId: correlationId,
        isValidResult,
        title: result?.title,
        cardCount: result?.cards?.length,
        quizCount: result?.quiz?.length
      });

      if (!isValidResult) {
        throw new Error(
          "The server returned an invalid study set."
        );
      }

      setStudySet(result);
      console.info("[study-ui] Study set rendered", {
        requestId: correlationId,
        title: result.title
      });
    } catch (error) {
      console.info("[study-ui] Study generation failed", {
        requestId: correlationId,
        name: error.name,
        code: error.code || "UNKNOWN_ERROR",
        status: error.status || null,
        message: error.message
      });

      if (error.name === "AbortError") {
        if (requestId === requestIdRef.current) {
          setError(
            "The request took too long. Please try again."
          );
        }

        return;
      }

      if (requestId !== requestIdRef.current) {
        return;
      }

      const message = error.name === "TypeError"
        ? "The study service could not be reached. Check that the server is running and try again."
        : error.message || "Unable to generate the study set. Please try again.";

      setError(
        message
      );
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  return (
    <main className="app">
      <header className="app-header">
        <p className="eyebrow">
          AI STUDY ASSISTANT
        </p>

        <h1>
          StudyFlow AI
        </h1>

        <p>
          Turn your notes into interactive
          flashcards and quizzes.
        </p>
      </header>

      <PromptInput
        value={input}
        onChange={setInput}
        onSubmit={handleGenerate}
        loading={loading}
      />

      {loading && <LoadingState />}

      {!loading && error && (
        <ErrorState
          message={error}
          onRetry={handleGenerate}
        />
      )}

      {!loading && studySet && !error && (
        <ResultView
          key={studySet.cards[0]?.id || studySet.title}
          studySet={studySet}
        />
      )}
    </main>
  );
}

export default App;