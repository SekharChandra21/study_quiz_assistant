function QuizQuestion({
  question,
  selectedAnswer,
  submitted,
  onSelect,
  onSubmit
}) {
  const getOptionClass = (index) => {
    if (!submitted) {
      return selectedAnswer === index
        ? "quiz-option selected"
        : "quiz-option";
    }

    if (index === question.correctAnswer) {
      return "quiz-option correct";
    }

    if (
      index === selectedAnswer &&
      selectedAnswer !== question.correctAnswer
    ) {
      return "quiz-option incorrect";
    }

    return "quiz-option disabled";
  };

  return (
    <div className="quiz-question-card">
      <div className="quiz-question-header">
        <span className="content-label">QUESTION</span>

        <span className="quiz-single-answer">
          Select one answer
        </span>
      </div>

      <h3>{question.question}</h3>

      <div className="quiz-options">
        {question.options.map((option, index) => (
          <button
            key={option}
            type="button"
            className={getOptionClass(index)}
            onClick={() => onSelect(index)}
            disabled={submitted}
          >
            <span className="option-letter">
              {String.fromCharCode(65 + index)}
            </span>

            <span className="option-text">
              {option}
            </span>

            {submitted &&
              index === question.correctAnswer && (
                <span className="option-status">✓</span>
              )}

            {submitted &&
              index === selectedAnswer &&
              selectedAnswer !== question.correctAnswer && (
                <span className="option-status">✕</span>
              )}
          </button>
        ))}
      </div>

      {!submitted && (
        <button
          type="button"
          className="submit-answer"
          onClick={onSubmit}
          disabled={selectedAnswer === null}
        >
          Check Answer
        </button>
      )}

      {submitted && (
        <div
          className={
            selectedAnswer === question.correctAnswer
              ? "quiz-feedback correct-feedback"
              : "quiz-feedback incorrect-feedback"
          }
        >
          <div className="feedback-heading">
            <strong>
              {selectedAnswer === question.correctAnswer
                ? "Correct!"
                : "Not quite"}
            </strong>
          </div>

          <p>{question.explanation}</p>
        </div>
      )}
    </div>
  );
}

export default QuizQuestion;