function QuizComplete({
  score,
  total,
  wrongQuestions,
  onRetry,
  onReviewWrong
}) {
  const percentage =
    total === 0 ? 0 : Math.round((score / total) * 100);

  const getMessage = () => {
    if (percentage === 100) {
      return "Perfect score. Excellent work!";
    }

    if (percentage >= 80) {
      return "Great job. You have a strong understanding of this topic.";
    }

    if (percentage >= 60) {
      return "Good progress. A little more review will strengthen your understanding.";
    }

    return "Keep practicing. Review the missed questions and try again.";
  };

  return (
    <div className="quiz-complete">
      <div className="completion-icon">
        ✓
      </div>

      <span className="study-label">
        QUIZ COMPLETE
      </span>

      <h2>Nice work!</h2>

      <p className="completion-message">
        {getMessage()}
      </p>

      <div className="score-card">
        <div className="score-main">
          <strong>{percentage}%</strong>
          <span>Accuracy</span>
        </div>

        <div className="score-divider" />

        <div className="score-stat">
          <strong>{score}</strong>
          <span>Correct</span>
        </div>

        <div className="score-stat">
          <strong>{total - score}</strong>
          <span>Incorrect</span>
        </div>
      </div>

      <div className="completion-actions">
        <button
            type="button"
            className="secondary-action"
            onClick={onReviewWrong}
            disabled={wrongQuestions.length === 0}
        >
            {wrongQuestions.length === 0
            ? "All answers correct"
            : "Review wrong answers"}
        </button>

        <button
            type="button"
            className="primary-action"
            onClick={onRetry}
        >
            Retry quiz
        </button>
      </div>
    </div>
  );
}

export default QuizComplete;