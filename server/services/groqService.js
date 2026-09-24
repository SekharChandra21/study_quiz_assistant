const Groq = require("groq-sdk");
require("dotenv").config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function generateStudySet(input, requestId) {
  console.info("[study-llm] Sending request to Groq", {
    requestId,
    model: "openai/gpt-oss-20b",
    inputLength: input.length
  });

  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",

    temperature: 0.2,

    messages: [
      {
        role: "system",
        content: `
You are an expert study assistant.

Your task is to transform the user's study material into a useful
interactive study set.

Generate:
1. A concise title.
2. A short description.
3. 5 to 10 flashcards.
4. 5 to 10 multiple-choice quiz questions.

Flashcards should:
- Focus on important concepts.
- Have clear questions.
- Have accurate and concise answers.
- Have difficulty: easy, medium, or hard.

Quiz questions should:
- Have exactly 4 answer options.
- Have exactly one correct answer.
- Use correctAnswer as a zero-based index.
- Include a short explanation.

Use ONLY information supported by the provided study material.
Do not invent unrelated facts.

Return only the requested structured data.
        `.trim()
      },
      {
        role: "user",
        content: `
Create a study set from the following material:

${input}
        `.trim()
      }
    ],

    response_format: {
      type: "json_schema",
      json_schema: {
        name: "study_set",
        strict: true,

        schema: {
          type: "object",

          properties: {
            title: {
              type: "string"
            },

            description: {
              type: "string"
            },

            cards: {
              type: "array",

              items: {
                type: "object",

                properties: {
                  question: {
                    type: "string"
                  },

                  answer: {
                    type: "string"
                  },

                  difficulty: {
                    type: "string",
                    enum: ["easy", "medium", "hard"]
                  }
                },

                required: [
                  "question",
                  "answer",
                  "difficulty"
                ],

                additionalProperties: false
              }
            },

            quiz: {
              type: "array",

              items: {
                type: "object",

                properties: {
                  question: {
                    type: "string"
                  },

                  options: {
                    type: "array",
                    items: {
                      type: "string"
                    }
                  },

                  correctAnswer: {
                    type: "integer"
                  },

                  explanation: {
                    type: "string"
                  }
                },

                required: [
                  "question",
                  "options",
                  "correctAnswer",
                  "explanation"
                ],

                additionalProperties: false
              }
            }
          },

          required: [
            "title",
            "description",
            "cards",
            "quiz"
          ],

          additionalProperties: false
        }
      }
    }
  });

  const content = response.choices?.[0]?.message?.content;

  console.info("[study-llm] Received response from Groq", {
    requestId,
    finishReason: response.choices?.[0]?.finish_reason,
    contentType: typeof content,
    contentLength: content?.length || 0,
    usage: response.usage || null
  });

  if (!content) {
    throw new Error("AI returned an empty response.");
  }

  const parsedStudySet = JSON.parse(content);

  console.info("[study-llm] Parsed Groq study-set response", {
    requestId,
    responseType: typeof parsedStudySet,
    title: parsedStudySet.title,
    cardCount: parsedStudySet.cards?.length,
    quizCount: parsedStudySet.quiz?.length
  });

  return parsedStudySet;
}

module.exports = {
  generateStudySet
};