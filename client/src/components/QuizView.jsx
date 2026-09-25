import { useCallback, useEffect, useState } from "react";
import QuizQuestion from "./QuizQuestion";
import QuizComplete from "./QuizComplete";

function QuizView({ questions }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const [score, setScore] = useState(0);

  // Track missed questions.
  const [wrongQuestions, setWrongQuestions] = useState([]);

  // Store review snapshot.
  const [reviewQuestions, setReviewQuestions] = useState([]);

  const [isReviewMode, setIsReviewMode] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Choose questions for the current mode.
  const activeQuestions = isReviewMode
    ? reviewQuestions
    : questions;

  const currentQuestion = activeQuestions[currentIndex];
  const totalQuestions = activeQuestions.length;

  // Select an answer.
  const handleSelectAnswer = (index) => {
    if (submitted) {
      return;
    }

    setSelectedAnswer(index);
  };

  // Handle answer scoring.
  const handleSubmit = useCallback(() => {
    if (
      selectedAnswer === null ||
      submitted ||
      !currentQuestion
    ) {
      return;
    }

    setSubmitted(true);

    const isCorrect =
      selectedAnswer === currentQuestion.correctAnswer;

    // Score the original quiz.
    if (!isReviewMode) {
      if (isCorrect) {
        setScore((previous) => previous + 1);
      } else {
        setWrongQuestions((previous) => {
          const alreadyExists = previous.some(
            (question) =>
              question.id === currentQuestion.id
          );

          if (alreadyExists) {
            return previous;
          }

          return [...previous, currentQuestion];
        });
      }

      return;
    }

    // Update the review list.
    if (isCorrect) {
      setScore((previous) => previous + 1);

      setWrongQuestions((previous) =>
        previous.filter(
          (question) =>
            question.id !== currentQuestion.id
        )
      );
    } else {
      // Keep missed questions available.
      setWrongQuestions((previous) => {
        const alreadyExists = previous.some(
          (question) =>
            question.id === currentQuestion.id
        );

        if (alreadyExists) {
          return previous;
        }

        return [...previous, currentQuestion];
      });
    }
  }, [currentQuestion, isReviewMode, selectedAnswer, submitted]);

  // Advance or finish the quiz.
  const handleNext = useCallback(() => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((previous) => previous + 1);
      setSelectedAnswer(null);
      setSubmitted(false);
      return;
    }

    setCompleted(true);
  }, [currentIndex, totalQuestions]);

  // Restart the original quiz.
  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setSubmitted(false);
    setScore(0);

    setWrongQuestions([]);
    setReviewQuestions([]);

    setIsReviewMode(false);
    setCompleted(false);
  };

  // Start a review of missed questions.
  const handleReviewWrong = () => {
    if (wrongQuestions.length === 0) {
      return;
    }

    // Snapshot the current missed questions.
    setReviewQuestions([...wrongQuestions]);

    setIsReviewMode(true);

    setCurrentIndex(0);
    setSelectedAnswer(null);
    setSubmitted(false);
    setScore(0);
    setCompleted(false);
  };

  // Support keyboard shortcuts.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (completed || !currentQuestion) {
        return;
      }

      const target = event.target;

      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (!submitted) {
        const key = Number(event.key);

        if (key >= 1 && key <= 4) {
          const answerIndex = key - 1;

          if (answerIndex < currentQuestion.options.length) {
            setSelectedAnswer(answerIndex);
          }
        }

        if (event.key === "Enter" && selectedAnswer !== null) {
          handleSubmit();
        }
      } else if (event.key === "Enter") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    completed,
    currentQuestion,
    handleNext,
    handleSubmit,
    selectedAnswer,
    submitted
  ]);

  // Handle an empty quiz.
  if (!currentQuestion && !completed) {
    return null;
  }

  // Show the completion screen.
  if (completed) {
    return (
      <QuizComplete
        score={score}
        total={totalQuestions}
        wrongQuestions={wrongQuestions}
        onRetry={handleRetry}
        onReviewWrong={handleReviewWrong}
        isReviewMode={isReviewMode}
      />
    );
  }

  const progress =
    ((currentIndex + (submitted ? 1 : 0)) /
      totalQuestions) *
    100;

  return (
    <section className="quiz-view">
      {isReviewMode && (
        <div className="review-banner">
          <span>REVIEW MODE</span>

          <p>
            You're reviewing only the questions you
            missed.
          </p>
        </div>
      )}

      <div className="quiz-progress-section">
        <div className="quiz-progress-info">
          <span>
            Question {currentIndex + 1} of{" "}
            {totalQuestions}
          </span>

          <span>
            {score} correct
          </span>
        </div>

        <div className="progress-track">
          <div
            className="progress-bar"
            style={{
              width: `${progress}%`
            }}
          />
        </div>
      </div>

      <QuizQuestion
        question={currentQuestion}
        selectedAnswer={selectedAnswer}
        submitted={submitted}
        onSelect={handleSelectAnswer}
        onSubmit={handleSubmit}
      />

      {submitted && (
        <button
          type="button"
          className="next-question"
          onClick={handleNext}
        >
          {currentIndex === totalQuestions - 1
            ? "See Results"
            : "Next Question →"}
        </button>
      )}

      <p className="keyboard-hint">
        Tip: Press 1–4 to select an answer and Enter
        to check
      </p>
    </section>
  );
}

export default QuizView;