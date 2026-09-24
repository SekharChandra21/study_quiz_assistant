export function validateStudyResult(data) {
  if (!data || typeof data !== "object") {
    return false;
  }

  if (
    typeof data.title !== "string" ||
    typeof data.description !== "string"
  ) {
    return false;
  }

  if (!Array.isArray(data.cards) || data.cards.length === 0) {
    return false;
  }

  if (!Array.isArray(data.quiz) || data.quiz.length === 0) {
    return false;
  }

  const validCards = data.cards.every((card) => {
    return (
      typeof card.id === "string" &&
      typeof card.question === "string" &&
      typeof card.answer === "string" &&
      ["easy", "medium", "hard"].includes(card.difficulty)
    );
  });

  if (!validCards) {
    return false;
  }

  const validQuiz = data.quiz.every((question) => {
    return (
      typeof question.id === "string" &&
      typeof question.question === "string" &&
      Array.isArray(question.options) &&
      question.options.length === 4 &&
      typeof question.correctAnswer === "number" &&
      question.correctAnswer >= 0 &&
      question.correctAnswer <= 3 &&
      typeof question.explanation === "string"
    );
  });

  return validQuiz;
}