const express = require("express");

const { generateStudySet } = require("../services/groqService");
const { studyInputSchema } = require("../validation/inputSchema");
const { studySetSchema } = require("../validation/studySchema");
const { normalizeStudySet } = require("../services/normalizeStudySet");
const { randomUUID } = require("crypto");

const router = express.Router();

router.post("/generate", async (req, res) => {
  const requestId = req.get("X-Request-Id") || randomUUID();

  console.info("[study-api] Received study generation request", {
    requestId,
    bodyKeys: Object.keys(req.body || {}),
    inputLength: typeof req.body?.input === "string"
      ? req.body.input.length
      : null
  });

  try {

    // Validate user input

    const inputResult = studyInputSchema.safeParse(req.body);

    if (!inputResult.success) {
      console.info("[study-api] Request rejected by input validation", {
        requestId,
        issues: inputResult.error.issues
      });

      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_INPUT",
          message:
            inputResult.error.issues[0]?.message ||
            "Invalid study input."
        }
      });
    }

    const { input } = inputResult.data;

    // Call Groq

    const aiResult = await generateStudySet(input, requestId);

    // Validate AI response

    const validationResult = studySetSchema.safeParse(aiResult);

    if (!validationResult.success) {
      console.info("[study-api] AI response rejected by schema validation", {
        requestId,
        issues: validationResult.error.flatten()
      });

      return res.status(502).json({
        success: false,
        error: {
          code: "INVALID_AI_RESPONSE",
          message:
            "The AI returned an invalid study set. Please try again."
        }
      });
    }

    // Generate application IDs

    const studySet = normalizeStudySet(
      validationResult.data
    );

    console.info("[study-api] Sending validated study set to browser", {
      requestId,
      title: studySet.title,
      cardCount: studySet.cards.length,
      quizCount: studySet.quiz.length,
      responseKeys: Object.keys(studySet)
    });

    // Return validated result

    return res.status(200).json({
      success: true,
      data: studySet
    });

  } catch (error) {
    console.error("[study-api] Unable to generate the study set", {
      requestId,
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    return res.status(500).json({
      success: false,
      error: {
        code: "AI_REQUEST_FAILED",
        message:
          "Unable to generate the study set. Please try again."
      }
    });
  }
});

module.exports = router;