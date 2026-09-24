function normalizeStudySet(studySet) {
  return {
    title: studySet.title,
    description: studySet.description,

    cards: studySet.cards.map((card, index) => ({
      id: `card-${index + 1}`,
      question: card.question,
      answer: card.answer,
      difficulty: card.difficulty
    })),

    quiz: studySet.quiz.map((question, index) => ({
      id: `question-${index + 1}`,
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation
    }))
  };
}

module.exports = {
  normalizeStudySet
};