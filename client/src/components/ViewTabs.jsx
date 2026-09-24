function ViewTabs({ activeView, onChange }) {
  return (
    <div className="view-tabs">
      <button
        type="button"
        className={
          activeView === "flashcards"
            ? "tab active"
            : "tab"
        }
        onClick={() => onChange("flashcards")}
      >
        Flashcards
      </button>

      <button
        type="button"
        className={
          activeView === "quiz"
            ? "tab active"
            : "tab"
        }
        onClick={() => onChange("quiz")}
      >
        Quiz
      </button>
    </div>
  );
}

export default ViewTabs;