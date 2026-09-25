# StudyFlow AI

> Turn your study notes into interactive flashcards and quizzes using AI.

StudyFlow AI is a full-stack AI-powered study assistant built as part of a frontend engineering assignment.

Users can paste study material or notes, and the application uses a Large Language Model (LLM) to generate a structured study set containing:

* Flashcards
* Difficulty levels
* Multiple-choice quiz questions
* Correct answers
* Explanations
* Interactive review flows

The application is designed with a strong focus on **frontend architecture, structured AI output, validation, error handling, responsive UX, and predictable state management**.

---

## Features

### AI Study Set Generation

* Accepts free-form study material.
* Sends the material securely to a backend API.
* Uses Groq as the LLM provider.
* Requests structured JSON from the model.
* Generates 5–10 flashcards.
* Generates 5–10 multiple-choice questions.
* Each quiz question contains exactly four options.
* Each question contains a zero-based correct answer index.
* Each quiz question contains an explanation.

### Interactive Flashcards

* Reveal/hide answers.
* Difficulty indicators.
* Previous/next navigation.
* Mark cards as:

  * `I knew it`
  * `Didn't know`
* Track known cards.
* Track cards that need review.
* Flashcard completion screen.
* Review only missed cards.
* Re-review cards that are still incorrect.
* Automatically remove a card from the review list once it is answered correctly.

### Interactive Quiz

* Select one of four answers.
* Submit and immediately receive feedback.
* Correct/incorrect visual states.
* Explanation after submission.
* Score tracking.
* Quiz completion screen.
* Retry the complete quiz.
* Review only previously incorrect questions.
* Corrected questions are removed from the remaining review list.
* Review button becomes disabled when there are no remaining incorrect questions.

### Keyboard Interaction

#### Flashcards

* `←` Previous card
* `→` Next card
* `Space` Reveal/hide answer

#### Quiz

* `1` Select option A
* `2` Select option B
* `3` Select option C
* `4` Select option D
* `Enter` Submit answer / continue

### Robust Error Handling

The application handles:

* Empty input
* Input below the minimum length
* Input exceeding the maximum length
* Invalid AI responses
* Malformed JSON
* Empty AI responses
* Incorrect JSON structure
* Invalid difficulty values
* Invalid quiz option counts
* Invalid `correctAnswer` indexes
* Missing required fields
* API failures
* Slow requests
* Request cancellation
* Stale responses

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
                            Validate user input
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
                         │   JSON.parse()      │
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
                    │ Flashcards      Quiz         │
                    └──────────────────────────────┘
```

---

# Tech Stack

## Frontend

* React
* Vite
* JavaScript
* React Hooks
* CSS

## Backend

* Node.js
* Express
* Groq SDK
* Zod
* dotenv
* CORS

## AI

* Groq API
* Structured JSON generation
* `openai/gpt-oss-20b`

---

# Project Structure

```text
study_assistant/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ErrorState.jsx
│   │   │   ├── Flashcard.jsx
│   │   │   ├── FlashcardComplete.jsx
│   │   │   ├── FlashcardDeck.jsx
│   │   │   ├── LoadingState.jsx
│   │   │   ├── PromptInput.jsx
│   │   │   ├── QuizComplete.jsx
│   │   │   ├── QuizQuestion.jsx
│   │   │   ├── QuizView.jsx
│   │   │   ├── ResultView.jsx
│   │   │   ├── StudyHeader.jsx
│   │   │   └── ViewTabs.jsx
│   │   │
│   │   ├── lib/
│   │   │   ├── api.js
│   │   │   └── validateResult.js
│   │   │
│   │   ├── types/
│   │   │   └── result.js
│   │   │
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server/
│   ├── routes/
│   │   └── study.js
│   │
│   ├── services/
│   │   ├── groqService.js
│   │   ├── normalizeStudySet.js
│   │   └── aiTestService.js
│   │
│   ├── validation/
│   │   ├── inputSchema.js
│   │   └── studySchema.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── .env.example
├── .gitignore
└── README.md
```

---

# Data Contract

The application uses a clearly defined contract between the backend and frontend.

The AI is responsible for generating content, while the application is responsible for:

* Validation
* IDs
* State
* Interaction
* Rendering

Example response:

```json
{
  "title": "Java Collections",
  "description": "Core concepts of Java Collections",
  "cards": [
    {
      "question": "What is ArrayList?",
      "answer": "ArrayList is a resizable array implementation of List.",
      "difficulty": "easy"
    }
  ],
  "quiz": [
    {
      "question": "Which collection stores key-value pairs?",
      "options": [
        "ArrayList",
        "HashMap",
        "HashSet",
        "LinkedList"
      ],
      "correctAnswer": 1,
      "explanation": "HashMap stores key-value pairs."
    }
  ]
}
```

The backend then adds application-owned IDs:

```json
{
  "id": "card-1"
}
```

and:

```json
{
  "id": "question-1"
}
```

The model does not control these IDs.

---

# AI Response Validation

One of the most important design decisions in StudyFlow AI is that **AI output is never trusted directly**.

An LLM can return:

* malformed JSON
* missing properties
* unexpected property types
* invalid enum values
* incomplete arrays
* invalid indexes
* incomplete quiz questions

Therefore, the application uses **two validation layers**.

```text
                    Groq LLM
                       │
                       ▼
                 Raw AI output
                       │
                       ▼
                JSON.parse()
                       │
                       ▼
        ┌──────────────────────────────┐
        │ Backend Zod Validation       │
        │                              │
        │ studySetSchema.safeParse()   │
        └──────────────┬───────────────┘
                       │
                 Valid response
                       │
                       ▼
                 Normalize IDs
                       │
                       ▼
                 HTTP Response
                       │
                       ▼
        ┌──────────────────────────────┐
        │ Frontend Validation          │
        │                              │
        │ validateStudyResult()        │
        └──────────────┬───────────────┘
                       │
                 Valid response
                       │
                       ▼
                 Render UI
```

This provides defense in depth.

---

# Backend JSON Validation

The backend uses Zod to enforce the study-set contract.

The main schema validates:

### Study set

* `title` must be a non-empty string.
* `description` must be a non-empty string.
* `cards` must be an array.
* `cards` must contain between 5 and 10 items.
* `quiz` must be an array.
* `quiz` must contain between 5 and 10 items.

### Flashcards

Each card requires:

* `question`
* `answer`
* `difficulty`

Difficulty must be one of:

```text
easy
medium
hard
```

### Quiz questions

Each question requires:

* `question`
* exactly 4 `options`
* `correctAnswer`
* `explanation`

`correctAnswer` must be an integer between:

```text
0
1
2
3
```

because it represents the zero-based option index.

---

# Why Backend Validation Is Important

The frontend must not be responsible for determining whether the AI response is valid.

The backend acts as a trust boundary:

```text
External AI
    ↓
Untrusted data
    ↓
Backend validation
    ↓
Trusted application data
```

For example, if the model returns:

```json
{
  "title": "Java Collections",
  "cards": "invalid"
}
```

the backend rejects the response instead of sending it to React.

The API returns:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_AI_RESPONSE",
    "message": "The AI returned an invalid study set. Please try again."
  }
}
```

with an HTTP `502` response.

---

# Frontend JSON Validation

The frontend also validates the received response using:

```text
client/src/lib/validateResult.js
```

This is an additional defensive layer.

The frontend verifies:

* response exists
* response is an object
* title is a string
* description is a string
* cards is an array
* quiz is an array
* card IDs exist
* card questions exist
* card answers exist
* difficulty is valid
* quiz options exist
* exactly four quiz options exist
* correct answer is within the valid range
* explanations exist

Only after this validation succeeds is the result passed into the interactive UI.

---

# Why Two Validation Layers?

The two validation layers have different responsibilities.

### Backend validation

Protects the API and establishes the application's data contract.

```text
Groq → Backend
```

### Frontend validation

Protects the React application from unexpected or malformed API responses.

```text
Backend → React
```

This means the application does not assume:

> "The AI generated JSON, therefore the JSON must be correct."

Instead:

> "The AI generated a response, therefore the response must be parsed and validated before the application trusts it."

---

# Input Validation

User input is validated on both sides.

The frontend prevents obvious invalid submissions:

```text
Minimum: 10 characters
Maximum: 5000 characters
```

The backend independently validates the same contract using Zod.

This prevents someone from bypassing the React UI and directly calling the API with invalid input.

Example:

```text
POST /api/study/generate
```

with:

```json
{
  "input": "Java"
}
```

returns a `400` response.

---

# API Endpoint

## Generate Study Set

```text
POST /api/study/generate
```

Request:

```json
{
  "input": "React is a JavaScript library..."
}
```

Successful response:

```json
{
  "success": true,
  "data": {
    "title": "React Fundamentals",
    "description": "Core React concepts",
    "cards": [],
    "quiz": []
  }
}
```

Error response:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_AI_RESPONSE",
    "message": "The AI returned an invalid study set. Please try again."
  }
}
```

---

# Health Endpoint

The backend exposes:

```text
GET /api/health
```

Example response:

```json
{
  "success": true,
  "message": "StudyFlow AI backend is running"
}
```

This can be used to quickly verify that the backend is running.

---

# Client-Side API Handling

The frontend communicates with the backend through:

```text
client/src/lib/api.js
```

The API helper:

1. Sends the study material.
2. Uses `AbortSignal` for cancellation.
3. Parses the server response.
4. Checks the HTTP status.
5. Checks the `success` flag.
6. Checks that study-set data exists.
7. Returns the validated API payload to the React application.

The API key is never exposed to the browser.

---

# Secure API Key Handling

The Groq API key is stored only on the backend.

```text
server/.env
```

Example:

```env
GROQ_API_KEY=your_groq_api_key
PORT=5000
```

The frontend never receives the Groq API key.

The browser communicates only with:

```text
React
  ↓
Express API
  ↓
Groq
```

rather than:

```text
React
  ↓
Groq
```

This prevents exposing the API credential in browser JavaScript.

---

# Environment Variables

Create:

```text
server/.env
```

with:

```env
GROQ_API_KEY=your_groq_api_key
PORT=5000
```

An example file is provided:

```text
.env.example
```

Example:

```env
GROQ_API_KEY=
PORT=5000
```

Never commit the real `.env` file.

---

# Installation

## Prerequisites

Make sure the following are installed:

* Node.js
* npm
* Git
* A Groq API key

---

# Backend Setup

Open a terminal:

```powershell
cd F:\ReactProjects\study_assistant\server
```

Install dependencies:

```powershell
npm install
```

Create:

```text
server/.env
```

and add:

```env
GROQ_API_KEY=your_groq_api_key
PORT=5000
```

Start the development server:

```powershell
npm run dev
```

The backend should run on:

```text
http://localhost:5000
```

---

# Frontend Setup

Open another terminal:

```powershell
cd F:\ReactProjects\study_assistant\client
```

Install dependencies:

```powershell
npm install
```

Start Vite:

```powershell
npm run dev
```

Open the URL shown by Vite, usually:

```text
http://localhost:5173
```

---

# Deployment

Deploy the `server` directory to Render and the `client` directory to Vercel.
Deploy the backend first so the frontend can use its public API URL.

## Deploy the Server to Render

### Render dashboard

1. Create a new Web Service from this repository.
2. Set the root directory to `server`.
3. Set the runtime to `Node`.
4. Set the build command to:

```text
npm install
```

5. Set the start command to:

```text
npm start
```

6. Add this Render environment variable:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Render supplies the `PORT` variable automatically. Do not hardcode it.

7. Create the service and copy its public URL.
8. Verify the deployment at:

```text
https://your-render-service.onrender.com/api/health
```

The health response should contain `"success": true`.

The repository also includes `render.yaml` with these settings.

### Render Blueprint

In Render, choose **New > Blueprint** and select this repository.
Render reads `render.yaml`, creates the web service, and asks for:
`GROQ_API_KEY` because it is marked as a secret.

### Render CLI

Render deployments are usually created from the dashboard or Blueprint.
After creating the service, trigger a deploy from the Render dashboard.

```powershell
curl https://your-render-service.onrender.com/api/health
```

Keep the generated Render API URL for Vercel.

## Deploy the Client to Vercel

### Vercel dashboard

1. Import this repository into Vercel.
2. Set the project root directory to `client`.
3. Use `npm run build` as the build command.
4. Use `dist` as the output directory.
5. Add this environment variable:

```env
VITE_API_BASE_URL=https://your-render-service.onrender.com
```

6. Deploy the project.

The `client/vercel.json` file configures the Vite build and SPA fallback.

### Vercel CLI

Install and authenticate with the Vercel CLI, then run:

```powershell
cd F:\ReactProjects\study_assistant\client
npm install
npm run build
npx vercel login
npx vercel
npx vercel env add VITE_API_BASE_URL production
npx vercel --prod
```

Enter the Render public URL when Vercel requests the environment value.

## Deployment Checks

Run these checks before deploying:

```powershell
cd F:\ReactProjects\study_assistant\client
npm run lint
npm run build

cd ..\server
node --check server.js
```

After deployment:

1. Open the Render `/api/health` endpoint.
2. Open the Vercel application URL.
3. Generate a study set using at least ten characters.
4. Check the browser console for API request errors.

Never add `GROQ_API_KEY` to Vercel. It belongs only in Render.

---

# Application Flow

The complete application flow is:

```text
1. User pastes study material
             ↓
2. React validates basic input
             ↓
3. React sends POST request
             ↓
4. Express validates input with Zod
             ↓
5. Backend sends prompt to Groq
             ↓
6. Groq returns structured JSON
             ↓
7. Backend parses JSON
             ↓
8. Backend validates JSON with Zod
             ↓
9. Backend generates application IDs
             ↓
10. Backend returns validated study set
             ↓
11. React validates response again
             ↓
12. Study set enters React state
             ↓
13. Flashcards / Quiz rendered
             ↓
14. User interacts with study material
```

---

# Flashcard State Management

Flashcards maintain separate state for:

```text
currentIndex
showAnswer
knownCards
unknownCards
reviewCards
isReviewMode
completed
```

This separation is important because:

* `cards` represents the original generated study set.
* `unknownCards` represents cards that still require review.
* `reviewCards` represents the current review-session snapshot.
* `isReviewMode` determines which collection is displayed.

This prevents stale review state from accidentally displaying the entire original deck.

---

# Quiz State Management

The quiz maintains:

```text
currentIndex
selectedAnswer
submitted
score
wrongQuestions
reviewQuestions
isReviewMode
completed
```

The application distinguishes between:

```text
questions
```

and:

```text
wrongQuestions
```

This allows the user to review only questions they answered incorrectly.

When a previously incorrect question is answered correctly during review, it is removed from `wrongQuestions`.

If all previously incorrect questions are corrected:

```text
wrongQuestions = []
```

and the:

```text
Review wrong answers
```

action becomes disabled.

---

# Stale Request Protection

Multiple generation requests can potentially overlap.

For example:

```text
Request A ────────────────────────→
Request B ───────→
```

Request B may finish first.

The application uses a request ID with `useRef`:

```text
Request A → requestId 1
Request B → requestId 2
```

When a response arrives, the application verifies that it belongs to the latest request.

An older response cannot overwrite the newer study set.

---

# Request Timeout

The frontend uses `AbortController` to cancel requests that take too long.

Current timeout:

```text
30 seconds
```

If the request is aborted because it takes too long, the user receives a retryable error state rather than an indefinitely loading interface.

---

# Loading State

While the AI request is running, the application displays a dedicated loading state.

The input and generation button are disabled to prevent accidental duplicate submissions.

```text
Creating your study set...

The AI is analyzing your material and
generating flashcards and quiz questions.
```

---

# Error State

Errors are displayed through a reusable:

```text
ErrorState
```

component.

The user receives:

* a clear error message
* a retry action

The UI does not expose internal implementation details such as API keys or stack traces.

---

# Responsive Design

The application is designed for:

* Desktop
* Tablet
* Mobile

Important layouts were tested against:

```text
375 × 667
390 × 844
768 × 1024
1440 × 900
```

The interface adapts:

* study cards
* quiz options
* completion screens
* buttons
* spacing
* typography
* navigation

for smaller screens.

---

# Accessibility and Keyboard Interaction

The application uses semantic buttons and form controls.

Interactive elements have:

* visible labels
* disabled states
* keyboard interaction
* focusable controls
* meaningful UI feedback

Keyboard shortcuts are provided for frequent study actions.

### Flashcards

```text
← →     Navigate
Space   Reveal/hide
```

### Quiz

```text
1–4     Select answer
Enter   Submit / continue
```

---

# Error Scenarios Considered

The application is designed to handle the following AI failure cases:

### Empty AI response

```text
AI → ""
```

The backend rejects the response.

### Malformed JSON

```text
AI → {"title": "React", "cards":
```

`JSON.parse()` fails and the request is handled as an AI generation failure.

### Wrong JSON shape

```json
{
  "title": "React",
  "cards": "invalid"
}
```

Zod rejects the response.

### Too few cards

```text
cards.length < 5
```

Rejected by the schema.

### Too many cards

```text
cards.length > 10
```

Rejected by the schema.

### Invalid difficulty

```json
{
  "difficulty": "extreme"
}
```

Rejected because only:

```text
easy
medium
hard
```

are allowed.

### Invalid quiz options

```text
options.length !== 4
```

Rejected by validation.

### Invalid correct answer

```text
correctAnswer < 0
correctAnswer > 3
```

Rejected by validation.

### Missing explanation

A quiz question without an explanation is rejected.

---

# Development Test Strategy

During development, AI failure scenarios can be simulated without relying on the LLM to randomly produce malformed output.

The important principle is:

```text
Test malformed responses deterministically
instead of waiting for the AI to fail naturally.
```

Examples of test cases include:

```text
empty-response
malformed-json
missing-title
invalid-cards
too-few-cards
invalid-difficulty
invalid-options
invalid-correct-answer
missing-explanation
valid
```

These test cases are useful for verifying the complete validation pipeline:

```text
Test AI response
       ↓
JSON.parse()
       ↓
Zod
       ↓
Normalization
       ↓
Express response
       ↓
React validation
       ↓
Error / Study UI
```

Development-only test functionality should be disabled before production/submission.

---

# Design Decisions

## Why React + Vite?

React provides a component-based architecture that fits the interactive nature of the application.

Vite provides a lightweight and fast development environment.

---

## Why Express?

The backend provides a secure boundary between the browser and the Groq API.

It also allows server-side validation and controlled error handling.

---

## Why Zod?

AI-generated data is untrusted external data.

Zod provides runtime validation rather than relying only on JavaScript's static assumptions.

---

## Why Structured JSON?

Without structured output, the frontend would need to parse natural-language AI responses.

Structured JSON makes the contract explicit:

```text
AI
 ↓
Predictable schema
 ↓
Validation
 ↓
UI
```

---

## Why Generate IDs on the Server?

The AI should generate study content, not application state identifiers.

The server generates IDs such as:

```text
card-1
card-2
question-1
question-2
```

This makes IDs deterministic and controlled by the application.

---

# Known Limitations

* Study sets are generated dynamically by an external LLM.
* AI-generated content may still contain factual inaccuracies.
* Generation quality depends on the quality and completeness of the user's input.
* The application does not currently persist study sessions.
* There is no authentication system.
* There is no database.
* Study progress is lost when the generated study set is replaced or the page is refreshed.
* The application currently processes a single study set at a time.
* The application does not currently provide spaced-repetition scheduling.

These limitations are intentionally outside the scope of the assignment.

---

# Future Improvements

Possible future improvements include:

* Persistent study history
* User accounts
* Spaced repetition
* Study-set bookmarking
* Difficulty-based filtering
* Progress analytics
* Multiple AI providers
* Streaming AI generation
* Rich markdown support
* PDF/document upload
* RAG-based study material
* Server-side rate limiting
* Automated integration tests
* End-to-end browser tests

---

# AI Usage

AI tools were used during development as development assistance for:

* Brainstorming architecture
* Reviewing component structure
* Generating initial implementation ideas
* Debugging state-management issues
* Improving error handling
* Refining prompts
* Reviewing edge cases
* Improving documentation

The final application architecture and implementation were reviewed and adapted to meet the assignment requirements.

The AI generation functionality itself uses the Groq API.

---

# Security Considerations

The Groq API key is kept on the server and is never exposed to the frontend.

The application also:

* validates user input
* validates AI output
* avoids trusting arbitrary AI-generated IDs
* limits input length
* limits generated content sizes
* handles failed requests
* handles request cancellation
* ignores stale responses
* avoids exposing server stack traces to users

---

# Running the Application

Run both applications simultaneously.

### Terminal 1 — Backend

```powershell
cd server
npm install
npm run dev
```

### Terminal 2 — Frontend

```powershell
cd client
npm install
npm run dev
```

Then open the Vite development URL.

---

# Example Study Material

You can test the application with material such as:

```text
React is a JavaScript library used for building user interfaces,
especially single-page applications.

React applications are built using reusable components.

Props are used to pass data from a parent component to a child
component. Props are read-only.

State is data managed by a component that can change over time.
The useState hook is commonly used to manage state.

The useEffect hook is used to perform side effects such as
fetching data from an API or subscribing to events.

useRef creates a mutable reference that persists between renders
without causing a re-render when its value changes.

React encourages one-way data flow from parent components to
children through props.
```

---

# Evaluation Focus

The project was designed around the key evaluation areas:

| Area                          | Implementation                                              |
| ----------------------------- | ----------------------------------------------------------- |
| React / Frontend Architecture | Component-based UI, React Hooks, isolated state             |
| AI Integration                | Groq API with structured JSON output                        |
| AI Data Handling              | JSON parsing + backend Zod validation + frontend validation |
| Bad AI Output                 | Malformed JSON and schema validation handling               |
| UI / UX                       | Responsive interactive flashcards and quizzes               |
| State Management              | Review flows, scoring, completion, stale request handling   |
| Error Handling                | Input, API, timeout, malformed AI output and retry states   |
| Security                      | API key remains on backend                                  |
| Communication                 | Architecture and design decisions documented here           |

---

# Key Engineering Principle

The most important principle behind the application is:

> **Never trust AI output directly.**

The AI is treated as an external, potentially unreliable data source.

The application therefore follows:

```text
                 AI OUTPUT
                    │
                    ▼
              JSON Parsing
                    │
                    ▼
             Backend Zod
              Validation
                    │
              ┌─────┴─────┐
              │           │
           Invalid       Valid
              │           │
              ▼           ▼
           Reject      Normalize
                          │
                          ▼
                     API Response
                          │
                          ▼
                  Frontend Validation
                          │
                    ┌─────┴─────┐
                    │           │
                 Invalid       Valid
                    │           │
                    ▼           ▼
                 Error       React State
                                │
                                ▼
                         Interactive UI
```

This validation pipeline keeps malformed AI responses from reaching the application's interactive state and makes the frontend behavior predictable even when the external AI service behaves unexpectedly.

---

# License

This project was created as part of a frontend engineering assignment.
