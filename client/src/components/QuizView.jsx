import { useEffect, useState } from "react";
import QuizQuestion from "./QuizQuestion";
import QuizComplete from "./QuizComplete";

function QuizView({ questions }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const [score, setScore] = useState(0);

  // Questions that are currently still wrong.
  const [wrongQuestions, setWrongQuestions] = useState([]);

  // Snapshot used only for the current review session.
  const [reviewQuestions, setReviewQuestions] = useState([]);

  const [isReviewMode, setIsReviewMode] = useState(false);
  const [completed, setCompleted] = useState(false);

  /*
   * In normal mode:
   *   activeQuestions = original quiz
   *
   * In review mode:
   *   activeQuestions = snapshot of questions being reviewed
   */
  const activeQuestions = isReviewMode
    ? reviewQuestions
    : questions;

  const currentQuestion = activeQuestions[currentIndex];
  const totalQuestions = activeQuestions.length;

  /*
   * Reset everything when a completely new study set is generated.
   */
  useEffect(() => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setSubmitted(false);
    setScore(0);

    setWrongQuestions([]);
    setReviewQuestions([]);

    setIsReviewMode(false);
    setCompleted(false);
  }, [questions]);

  /*
   * Keyboard shortcuts:
   * 1-4 -> select answer
   * Enter -> submit / next
   */
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

          if (
            answerIndex <
            currentQuestion.options.length
          ) {
            setSelectedAnswer(answerIndex);
          }
        }

        if (
          event.key === "Enter" &&
          selectedAnswer !== null
        ) {
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
    submitted,
    selectedAnswer
  ]);

  /*
   * Select an answer.
   */
  const handleSelectAnswer = (index) => {
    if (submitted) {
      return;
    }

    setSelectedAnswer(index);
  };

  /*
   * Submit the current answer.
   */
  const handleSubmit = () => {
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

    /*
     * NORMAL QUIZ
     */
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

    /*
     * REVIEW MODE
     *
     * If the user gets a previously wrong question
     * correct, remove it from wrongQuestions.
     */
    if (isCorrect) {
      setScore((previous) => previous + 1);

      setWrongQuestions((previous) =>
        previous.filter(
          (question) =>
            question.id !== currentQuestion.id
        )
      );
    } else {
      /*
       * If they get it wrong again, make sure it
       * remains in wrongQuestions.
       */
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
  };

  /*
   * Move to next question.
   */
  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((previous) => previous + 1);
      setSelectedAnswer(null);
      setSubmitted(false);
      return;
    }

    setCompleted(true);
  };

  /*
   * Start the complete original quiz again.
   */
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

  /*
   * Start a NEW review session using only the
   * questions that are currently wrong.
   */
  const handleReviewWrong = () => {
    if (wrongQuestions.length === 0) {
      return;
    }

    /*
     * Take a snapshot of the CURRENT wrong questions.
     */
    setReviewQuestions([...wrongQuestions]);

    setIsReviewMode(true);

    setCurrentIndex(0);
    setSelectedAnswer(null);
    setSubmitted(false);
    setScore(0);
    setCompleted(false);
  };

  /*
   * If there are no questions.
   */
  if (!currentQuestion && !completed) {
    return null;
  }

  /*
   * Completion screen.
   */
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