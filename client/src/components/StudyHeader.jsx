function StudyHeader({ studySet }) {
  return (
    <div className="study-header">
      <div>
        <span className="study-label">
          YOUR STUDY SET
        </span>

        <h2>{studySet.title}</h2>

        <p>{studySet.description}</p>
      </div>

      <div className="study-counts">
        <div>
          <strong>{studySet.cards.length}</strong>
          <span>Cards</span>
        </div>

        <div>
          <strong>{studySet.quiz.length}</strong>
          <span>Quiz</span>
        </div>
      </div>
    </div>
  );
}

export default StudyHeader;