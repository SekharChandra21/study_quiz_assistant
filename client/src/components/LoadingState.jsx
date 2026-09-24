function LoadingState() {
  return (
    <div className="loading-state">
      <div className="spinner" />

      <h2>Creating your study set...</h2>

      <p>
        The AI is analyzing your material and
        generating flashcards and quiz questions.
      </p>
    </div>
  );
}

export default LoadingState;