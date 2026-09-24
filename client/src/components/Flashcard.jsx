function Flashcard({
  card,
  showAnswer,
  onReveal
}) {
  return (
    <div
      className={`flashcard ${
        showAnswer ? "revealed" : ""
      }`}
    >
      <div className="flashcard-top">
        <span
          className={`difficulty ${card.difficulty}`}
        >
          {card.difficulty}
        </span>

        <span className="card-type">
          Flashcard
        </span>
      </div>

      <div className="flashcard-content">
        {!showAnswer ? (
          <>
            <span className="content-label">
              QUESTION
            </span>

            <h3>{card.question}</h3>

            <button
              type="button"
              className="reveal-button"
              onClick={onReveal}
            >
              Reveal answer
            </button>
          </>
        ) : (
          <>
            <span className="content-label">
              ANSWER
            </span>

            <h3>{card.answer}</h3>

            <button
              type="button"
              className="secondary-button"
              onClick={onReveal}
            >
              Hide answer
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Flashcard;