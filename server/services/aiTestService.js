function getTestResponse(testCase) {
  const validResponse = {
    title: "Java Collections",
    description: "Core Java collection concepts",
    cards: [
      {
        question: "What is ArrayList?",
        answer: "ArrayList is a resizable array implementation of List.",
        difficulty: "easy"
      },
      {
        question: "What is HashMap?",
        answer: "HashMap stores key-value pairs.",
        difficulty: "easy"
      },
      {
        question: "What is HashSet?",
        answer: "HashSet stores unique elements.",
        difficulty: "easy"
      },
      {
        question: "What is LinkedList?",
        answer: "LinkedList is a doubly linked list implementation.",
        difficulty: "medium"
      },
      {
        question: "What is TreeMap?",
        answer: "TreeMap stores key-value pairs in sorted key order.",
        difficulty: "medium"
      }
    ],
    quiz: [
      {
        question: "Which collection stores key-value pairs?",
        options: [
          "ArrayList",
          "HashMap",
          "HashSet",
          "LinkedList"
        ],
        correctAnswer: 1,
        explanation: "HashMap stores key-value pairs."
      },
      {
        question: "Which collection stores unique elements?",
        options: [
          "HashSet",
          "ArrayList",
          "LinkedList",
          "Vector"
        ],
        correctAnswer: 0,
        explanation: "HashSet stores unique elements."
      },
      {
        question: "Which collection maintains insertion order?",
        options: [
          "HashSet",
          "ArrayList",
          "TreeSet",
          "HashMap"
        ],
        correctAnswer: 1,
        explanation: "ArrayList maintains insertion order."
      },
      {
        question: "Which collection sorts keys?",
        options: [
          "HashMap",
          "TreeMap",
          "ArrayList",
          "HashSet"
        ],
        correctAnswer: 1,
        explanation: "TreeMap maintains keys in sorted order."
      },
      {
        question: "Which interface does ArrayList implement?",
        options: [
          "List",
          "Map",
          "Set",
          "Queue"
        ],
        correctAnswer: 0,
        explanation: "ArrayList implements the List interface."
      }
    ]
  };

  switch (testCase) {
    case "empty-response":
      return "";

    case "malformed-json":
      return `{
        "title": "Java Collections",
        "cards": [
          { "question": "What is ArrayList?"
      `;

    case "missing-title":
      return JSON.stringify({
        ...validResponse,
        title: ""
      });

    case "invalid-cards":
      return JSON.stringify({
        ...validResponse,
        cards: "this should be an array"
      });

    case "too-few-cards":
      return JSON.stringify({
        ...validResponse,
        cards: validResponse.cards.slice(0, 2)
      });

    case "invalid-difficulty":
      return JSON.stringify({
        ...validResponse,
        cards: [
          {
            ...validResponse.cards[0],
            difficulty: "very-hard"
          },
          ...validResponse.cards.slice(1)
        ]
      });

    case "invalid-options":
      return JSON.stringify({
        ...validResponse,
        quiz: [
          {
            ...validResponse.quiz[0],
            options: [
              "ArrayList",
              "HashMap"
            ]
          },
          ...validResponse.quiz.slice(1)
        ]
      });

    case "invalid-correct-answer":
      return JSON.stringify({
        ...validResponse,
        quiz: [
          {
            ...validResponse.quiz[0],
            correctAnswer: 7
          },
          ...validResponse.quiz.slice(1)
        ]
      });

    case "missing-explanation":
      return JSON.stringify({
        ...validResponse,
        quiz: [
          {
            question: validResponse.quiz[0].question,
            options: validResponse.quiz[0].options,
            correctAnswer: validResponse.quiz[0].correctAnswer
          },
          ...validResponse.quiz.slice(1)
        ]
      });

    case "valid":
      return JSON.stringify(validResponse);

    default:
      return JSON.stringify(validResponse);
  }
}

module.exports = {
  getTestResponse
};