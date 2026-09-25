# StudyFlow AI

> Turn your study notes into interactive flashcards and quizzes using AI.

StudyFlow AI is a full-stack AI-powered study assistant built as part of a frontend engineering assignment.

Users can paste study material or notes, and the application uses a Large Language Model (LLM) to generate a structured study set containing:

- Flashcards
- Difficulty levels
- Multiple-choice quiz questions
- Correct answers
- Explanations
- Interactive review flows

The application is designed with a strong focus on **frontend architecture, structured AI output, validation, error handling, responsive UX, and predictable state management**.

---

## Features

### AI Study Set Generation

- Accepts free-form study material.
- Sends the material securely to a backend API.
- Uses Groq as the LLM provider.
- Requests structured JSON from the model.
- Generates 5–10 flashcards.
- Generates 5–10 multiple-choice questions.
- Each quiz question contains exactly four options.
- Each question contains a zero-based correct answer index.
- Each quiz question contains an explanation.

### Interactive Flashcards

- Reveal/hide answers.
- Difficulty indicators.
- Previous/next navigation.
- Mark cards as:
  - `I knew it`
  - `Didn't know`
- Track known cards.
- Track cards that need review.
- Flashcard completion screen.
- Review only missed cards.
- Re-review cards that are still incorrect.
- Automatically remove a card from the review list once it is answered correctly.

### Interactive Quiz

- Select one of four answers.
- Submit and immediately receive feedback.
- Correct/incorrect visual states.
- Explanation after submission.
- Score tracking.
- Quiz completion screen.
- Retry the complete quiz.
- Review only previously incorrect questions.
- Corrected questions are removed from the remaining review list.
- Review button becomes disabled when there are no remaining incorrect questions.

### Keyboard Interaction

#### Flashcards

| Key | Action |
|---|---|
| `←` | Previous card |
| `→` | Next card |
| `Space` | Reveal/hide answer |

#### Quiz

| Key | Action |
|---|---|
| `1` | Select option A |
| `2` | Select option B |
| `3` | Select option C |
| `4` | Select option D |
| `Enter` | Submit answer / continue |

### Robust Error Handling

The application handles:

- Empty input
- Input below the minimum length
- Input exceeding the maximum length
- Invalid AI responses
- Malformed JSON
- Empty AI responses
- Incorrect JSON structure
- Invalid difficulty values
- Invalid quiz option counts
- Invalid `correctAnswer` indexes
- Missing required fields
- API failures
- Slow requests
- Request cancellation
- Stale responses

---

# Architecture

```text
                         ┌─────────────────────┐
                         │       Browser       │
                         │    React + Vite     │
                         └──────────┬──────────┘
                                    │
                           POST /api/study
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Express Backend   │
                         │      Node.js        │
                         └──────────┬──────────┘
                                    │
                             Validate input
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    Groq Service     │
                         │       LLM API       │
                         └──────────┬──────────┘
                                    │
                             Structured JSON
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     JSON.parse()    │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    Zod Validation   │
                         │   Backend Contract  │
                         └──────────┬──────────┘
                                    │
                              Valid response
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │  Normalize IDs      │
                         │  Server-owned state │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   React Frontend    │
                         │   Client Validation │
                         └──────────┬──────────┘
                                    │
                                    ▼
                    ┌──────────────────────────────┐
                    │ Interactive Study Experience │
                    │                              │
                    │ Flashcards       Quiz        │
                    └──────────────────────────────┘