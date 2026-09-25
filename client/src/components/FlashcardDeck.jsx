import { useCallback, useEffect, useState } from "react";
import Flashcard from "./Flashcard";

function FlashcardDeck({ cards }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const [knownCards, setKnownCards] = useState([]);
  const [unknownCards, setUnknownCards] = useState([]);

  const currentCard = cards[currentIndex];

  const totalCards = cards.length;
  const currentNumber = currentIndex + 1;

  const progress =
    (currentNumber / totalCards) * 100;

  const goNext = useCallback(() => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex((index) => index + 1);
      setShowAnswer(false);
    }
  }, [currentIndex, totalCards]);

  const goPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((index) => index - 1);
      setShowAnswer(false);
    }
  }, [currentIndex]);

  const markCard = (known) => {
    const cardId = currentCard.id;

    if (known) {
      setKnownCards((previous) => {
        if (previous.includes(cardId)) {
          return previous;
        }

        return [...previous, cardId];
      });

      setUnknownCards((previous) =>
        previous.filter((id) => id !== cardId)
      );
    } else {
      setUnknownCards((previous) => {
        if (previous.includes(cardId)) {
          return previous;
        }

        return [...previous, cardId];
      });

      setKnownCards((previous) =>
        previous.filter((id) => id !== cardId)
      );
    }

    goNext();
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;

      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (event.key === "ArrowRight") {
        goNext();
      }

      if (event.key === "ArrowLeft") {
        goPrevious();
      }

      if (event.key === " ") {
        event.preventDefault();
        setShowAnswer((visible) => !visible);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [goNext, goPrevious]);

  if (!currentCard) {
    return null;
  }

  return (
    <section className="flashcard-deck">
      <div className="progress-section">
        <div className="progress-info">
          <span>
            Card {currentNumber} of {totalCards}
          </span>

          <span>
            {knownCards.length} known
          </span>

          <span>
            {unknownCards.length} to review
          </span>
        </div>

        <div className="progress-track">
          <div
            className="progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <Flashcard
        card={currentCard}
        showAnswer={showAnswer}
        onReveal={() =>
          setShowAnswer((visible) => !visible)
        }
      />

      {showAnswer && (
        <div className="confidence-actions">
          <p>
            How well did you know this?
          </p>

          <div>
            <button
              type="button"
              className="didnt-know"
              onClick={() => markCard(false)}
            >
              ✕ Didn't know
            </button>

            <button
              type="button"
              className="knew-it"
              onClick={() => markCard(true)}
            >
              ✓ I knew it
            </button>
          </div>
        </div>
      )}

      <div className="navigation">
        <button
          type="button"
          onClick={goPrevious}
          disabled={currentIndex === 0}
        >
          ← Previous
        </button>

        <button
          type="button"
          onClick={goNext}
          disabled={currentIndex === totalCards - 1}
        >
          Next →
        </button>
      </div>

      <p className="keyboard-hint">
        Tip: Use ← → to navigate and Space to reveal
      </p>
    </section>
  );
}

export default FlashcardDeck;