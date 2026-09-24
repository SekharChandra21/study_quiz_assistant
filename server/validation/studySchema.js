const { z } = require("zod");

const studySetSchema = z.object({
  title: z.string().trim().min(1),
  
  description: z.string().trim().min(1),

  cards: z
    .array(
      z.object({
        question: z.string().trim().min(1),
        answer: z.string().trim().min(1),
        difficulty: z.enum(["easy", "medium", "hard"])
      })
    )
    .min(5)
    .max(10),

  quiz: z
    .array(
      z.object({
        question: z.string().trim().min(1),

        options: z
          .array(z.string().trim().min(1))
          .length(4),

        correctAnswer: z
          .number()
          .int()
          .min(0)
          .max(3),

        explanation: z.string().trim().min(1)
      })
    )
    .min(5)
    .max(10)
});

module.exports = {
  studySetSchema
};