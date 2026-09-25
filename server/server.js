const express = require("express");
const cors = require("cors");
require("dotenv").config();

const studyRouter = require("./routes/study");

const app = express();

const PORT = process.env.PORT || 5000;

// Register middleware.
app.use(cors());
app.use(express.json());

// Register routes.
app.use("/api/study", studyRouter);

// Expose health check.
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Health is up and running!"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});