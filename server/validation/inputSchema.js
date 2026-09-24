const { z } = require("zod");

const studyInputSchema = z.object({
  input: z
    .string()
    .trim()
    .min(10, "Please provide at least 10 characters of study material.")
    .max(5000, "Study material cannot exceed 5000 characters.")
});

module.exports = {
  studyInputSchema
};