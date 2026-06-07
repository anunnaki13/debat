# REPUBLIK ARGUMEN — MVP AI DEBATE BLUEPRINT

**Document type:** Codex implementation blueprint  
**Version:** `0.1.0-personal-mvp`  
**Target:** A minimal web application for personal testing  
**Primary mode:** Text debate against an AI opponent, followed by an independent AI Judge evaluation  
**Optional enhancement:** Browser-based voice input and text-to-speech output  
**AI gateway:** OpenRouter  

---

## 0. Instructions for Codex

Build the application in this document **incrementally**. Do not add features outside the stated MVP scope. Prioritize a working end-to-end debate flow over decorative complexity.

The first usable result must support:

1. Open the web app.
2. Select a debate topic.
3. Select the user's position: `PRO` or `CONTRA`.
4. Start a three-round debate against an AI opponent.
5. Submit arguments by typing.
6. Optionally dictate arguments through the browser microphone when supported.
7. Receive AI opponent responses through OpenRouter.
8. Optionally play the AI response as audio through browser text-to-speech.
9. End the debate.
10. Send the complete transcript to a separate AI Judge through OpenRouter.
11. Render a structured score report and improvement suggestions.
12. Store the latest sessions locally in the browser.

Do not implement authentication, database storage, payment, multiplayer, clans, public spectators, trending-topic crawlers, moderation dashboards, or mobile-native apps in this MVP.

---

# 1. Product Goal

## 1.1 What is being tested?

This MVP exists to answer four questions:

1. Is debating against an AI opponent enjoyable enough to repeat?
2. Does the AI opponent challenge the user without becoming hostile or excessively verbose?
3. Does the AI Judge produce useful, credible, and understandable feedback?
4. Is voice input useful enough to justify a more advanced voice mode later?

## 1.2 What this MVP is not

This is **not** yet a social network, public debate platform, political forum, commercial subscription product, or anti-buzzer system.

It is a private personal prototype that proves the core loop:

```text
Choose Topic
   -> Choose Position
   -> Debate Against AI Opponent
   -> Finish Debate
   -> AI Judge Evaluation
   -> Review Strengths and Improvements
   -> Start Another Debate
```

---

# 2. MVP Scope

## 2.1 Must-have features

| Area | Required MVP feature |
|---|---|
| Topic selection | Select one topic from a curated local list |
| Position | Choose `PRO`, `CONTRA`, or random assignment |
| Debate format | Three structured rounds |
| User input | Textarea and submit button |
| Voice input | Browser microphone button when supported |
| AI opponent | Separate OpenRouter call using configurable key and model |
| AI Judge | Separate OpenRouter call using configurable key and model |
| Judge output | Structured JSON rendered into a result page |
| Voice output | Browser text-to-speech for AI opponent responses |
| Persistence | Store recent sessions in `localStorage` |
| Export | Export one session as a `.json` file |
| Reset | Reset current debate and start again |
| Responsive layout | Comfortable on desktop and acceptable on mobile browser |

## 2.2 Explicitly postponed

Do **not** build these features now:

- Login or registration
- Supabase, PostgreSQL, Redis, or external database
- Payment gateway
- Membership trial logic
- Human-vs-human debate
- Public spectator mode
- Ranked system
- Clan or fictional party system
- User-generated public topics
- Real-time websocket infrastructure
- Social sharing cards
- News crawling or trending-topic automation
- Advanced fact-checking or RAG
- Content moderation pipeline beyond basic local safety rules
- Native mobile application
- Audio recording upload, transcription API, or voice cloning
- Analytics platform integration

---

# 3. Recommended Technology Stack

Use a single Next.js application so the MVP is easy to run locally and deploy to a VPS.

| Layer | Recommended choice | Reason |
|---|---|---|
| Framework | Next.js with App Router | One project for UI and server routes |
| Language | TypeScript | Safer API contracts and structured judge output |
| Styling | Tailwind CSS | Fast UI iteration |
| UI icons | `lucide-react` | Lightweight and consistent |
| Validation | `zod` | Validate API requests and AI Judge JSON |
| State | React `useReducer` or a small custom hook | Avoid unnecessary state libraries |
| Persistence | Browser `localStorage` | No database required |
| AI API | Raw `fetch()` to OpenRouter | Minimal dependencies and easy debugging |
| Voice input | Web Speech API feature detection | No extra API cost |
| Voice output | Browser `speechSynthesis` | No extra API cost |
| Deployment | Docker or standard Node.js deployment | Suitable for VPS |

Avoid adding complex libraries unless required to fix a specific problem.

---

# 4. High-Level Architecture

```text
Browser
  |
  |-- Home / Topic Selection UI
  |-- Debate Arena UI
  |-- Result Report UI
  |-- Browser localStorage
  |-- Web Speech API (optional voice input)
  |-- speechSynthesis (optional AI voice output)
  |
  v
Next.js Server Route: POST /api/debate/opponent
  |
  |-- reads server-only opponent OpenRouter key
  |-- sends topic, assigned position, current round, and bounded transcript
  v
OpenRouter Chat Completions API
  |
  v
AI Opponent Response

Browser
  |
  v
Next.js Server Route: POST /api/debate/judge
  |
  |-- reads server-only judge OpenRouter key
  |-- sends complete bounded transcript and scoring rubric
  |-- requests JSON Schema output when supported
  v
OpenRouter Chat Completions API
  |
  v
Structured Judge Report
```

## 4.1 Critical security rule

OpenRouter keys must **never** be exposed in client-side JavaScript.

Do not use names such as:

```text
NEXT_PUBLIC_OPENROUTER_API_KEY
```

Any environment variable prefixed with `NEXT_PUBLIC_` may be exposed to the browser bundle. All OpenRouter calls must be made from server-side route handlers.

---

# 5. Environment Variables

Create `.env.example` and `.env.local`.

## 5.1 `.env.example`

```bash
# Shared fallback key. Optional when separate role-specific keys are provided.
OPENROUTER_API_KEY=

# Recommended: configure separate OpenRouter keys for cost visibility and independent replacement.
OPENROUTER_OPPONENT_API_KEY=
OPENROUTER_JUDGE_API_KEY=

# Choose model identifiers from the OpenRouter dashboard.
# The opponent model should be fast and reasonably inexpensive.
OPENROUTER_OPPONENT_MODEL=

# The judge model should be reliable at structured JSON output.
OPENROUTER_JUDGE_MODEL=

# Optional app attribution headers sent from the server to OpenRouter.
OPENROUTER_SITE_URL=http://localhost:3000
OPENROUTER_APP_NAME=Republik Argumen Personal MVP

# Basic app settings
NEXT_PUBLIC_APP_NAME=Republik Argumen
NEXT_PUBLIC_ENABLE_VOICE_INPUT=true
NEXT_PUBLIC_ENABLE_VOICE_OUTPUT=true
```

## 5.2 Key resolution logic

Implement a utility with this behavior:

```ts
const opponentApiKey =
  process.env.OPENROUTER_OPPONENT_API_KEY ??
  process.env.OPENROUTER_API_KEY;

const judgeApiKey =
  process.env.OPENROUTER_JUDGE_API_KEY ??
  process.env.OPENROUTER_API_KEY;
```

If a required key or model is missing, return a safe server error with an actionable message. Never return the actual key value.

---

# 6. OpenRouter Integration

## 6.1 API endpoint

Use OpenRouter's Chat Completions endpoint:

```text
POST https://openrouter.ai/api/v1/chat/completions
```

Required request header:

```http
Authorization: Bearer <SERVER_SIDE_API_KEY>
Content-Type: application/json
```

Optional attribution headers:

```http
HTTP-Referer: <OPENROUTER_SITE_URL>
X-OpenRouter-Title: <OPENROUTER_APP_NAME>
```

## 6.2 Separate AI roles

Use two independent AI configurations:

| Role | Purpose | Environment model variable | Environment key variable |
|---|---|---|---|
| AI Opponent | Responds during debate | `OPENROUTER_OPPONENT_MODEL` | `OPENROUTER_OPPONENT_API_KEY` |
| AI Judge | Scores transcript after debate | `OPENROUTER_JUDGE_MODEL` | `OPENROUTER_JUDGE_API_KEY` |

This separation is important because the two roles have different quality, latency, and cost requirements.

## 6.3 Keep model identifiers configurable

Do not hardcode a model identifier in application logic. OpenRouter offers many models, availability and pricing may change, and the user must be able to swap models by editing `.env.local` and restarting the app.

## 6.4 Streaming decision

For the first working version:

- Implement the opponent endpoint as **non-streaming**.
- Render a loading indicator while waiting.
- Add streaming later only after the complete flow works reliably.

OpenRouter supports both streaming and non-streaming chat completion modes, but streaming adds implementation complexity. Keep it as an optional post-MVP improvement.

---

# 7. Debate Rules for the Personal MVP

## 7.1 Match format

Each debate has three rounds:

| Round | Name | Purpose | User input limit |
|---:|---|---|---:|
| 1 | Opening Statement | Establish the core position | 1,200 characters |
| 2 | Rebuttal | Respond to the opponent's reasoning | 1,200 characters |
| 3 | Closing Statement | Summarize and strengthen the final position | 1,000 characters |

The AI opponent answers once after every user submission.

A complete debate contains:

```text
User Opening
AI Opening Response
User Rebuttal
AI Rebuttal Response
User Closing
AI Closing Response
Judge Evaluation
```

## 7.2 Position assignment

On the setup page, allow:

- User chooses `PRO`
- User chooses `CONTRA`
- `ACAKKAN POSISI`

The AI opponent always receives the opposing side.

## 7.3 Timer

For this personal MVP, the timer is informative only:

- Default: 180 seconds per user turn
- User may continue submitting after the timer reaches zero
- Display a subtle warning after time expires

Do not block submissions based on time during the personal testing phase.

## 7.4 Tone rules

The AI opponent must:

- remain respectful;
- challenge the user's claims;
- avoid personal attacks;
- avoid pretending its claims are verified facts when they are not;
- acknowledge uncertainty where appropriate;
- avoid excessive verbosity;
- avoid declaring a winner;
- respond in Indonesian unless the user writes in another language.

---

# 8. Curated Initial Topic List

Create a local file such as `src/data/topics.ts` with at least ten topics.

```ts
export const debateTopics = [
  {
    id: "ai-jobs",
    title: "Apakah AI akan lebih banyak menciptakan pekerjaan baru daripada menggantikan pekerjaan manusia?",
    category: "Teknologi & Pekerjaan",
    difficulty: "menengah",
    shortContext:
      "Bahas dampak otomatisasi, produktivitas, reskilling, dan distribusi manfaat ekonomi.",
  },
  {
    id: "remote-work",
    title: "Apakah perusahaan sebaiknya memberi opsi bekerja jarak jauh minimal dua hari per minggu?",
    category: "Pekerjaan",
    difficulty: "pemula",
    shortContext:
      "Pertimbangkan produktivitas, kolaborasi, biaya, budaya kerja, dan fleksibilitas.",
  },
  {
    id: "cashless",
    title: "Apakah transaksi non-tunai sebaiknya menjadi pilihan utama dalam layanan publik?",
    category: "Ekonomi Digital",
    difficulty: "menengah",
    shortContext:
      "Pertimbangkan efisiensi, inklusi, keamanan, dan akses masyarakat.",
  },
  {
    id: "public-transport",
    title: "Apakah kota besar sebaiknya lebih memprioritaskan transportasi publik daripada pelebaran jalan?",
    category: "Kebijakan Kota",
    difficulty: "menengah",
    shortContext:
      "Pertimbangkan biaya, kemacetan, emisi, dan aksesibilitas.",
  },
  {
    id: "school-skill",
    title: "Apakah sekolah sebaiknya memberi porsi lebih besar untuk keterampilan praktis dibanding hafalan?",
    category: "Pendidikan",
    difficulty: "pemula",
    shortContext:
      "Bahas fondasi ilmu, kemampuan berpikir, kesiapan kerja, dan karakter.",
  },
  {
    id: "electric-vehicle",
    title: "Apakah subsidi kendaraan listrik merupakan penggunaan anggaran publik yang tepat?",
    category: "Energi & Transportasi",
    difficulty: "lanjutan",
    shortContext:
      "Pertimbangkan emisi, keadilan subsidi, infrastruktur, dan industri nasional.",
  },
  {
    id: "four-day-workweek",
    title: "Apakah sistem kerja empat hari per minggu layak diterapkan secara luas?",
    category: "Pekerjaan",
    difficulty: "menengah",
    shortContext:
      "Bahas produktivitas, jenis industri, kesejahteraan, dan layanan publik.",
  },
  {
    id: "university-degree",
    title: "Apakah gelar sarjana masih menjadi indikator penting dalam proses rekrutmen?",
    category: "Pendidikan & Karier",
    difficulty: "pemula",
    shortContext:
      "Bahas kompetensi, pengalaman, kredensial, dan kebutuhan perusahaan.",
  },
  {
    id: "social-media-age",
    title: "Apakah akses media sosial perlu dibatasi berdasarkan usia?",
    category: "Teknologi & Sosial",
    difficulty: "menengah",
    shortContext:
      "Bahas perlindungan anak, kebebasan, verifikasi usia, dan literasi digital.",
  },
  {
    id: "city-green-space",
    title: "Apakah kota harus mengurangi ruang komersial untuk memperluas ruang terbuka hijau?",
    category: "Lingkungan & Kota",
    difficulty: "pemula",
    shortContext:
      "Pertimbangkan ekonomi, kesehatan, iklim mikro, dan tata ruang.",
  },
];
```

Avoid real-person accusations, election campaigning, identity-based topics, or current breaking political controversies in this MVP.

---

# 9. Data Types

Create `src/types/debate.ts`.

```ts
export type DebateSide = "PRO" | "CONTRA";
export type Speaker = "USER" | "OPPONENT";
export type RoundId = "OPENING" | "REBUTTAL" | "CLOSING";

export interface DebateTopic {
  id: string;
  title: string;
  category: string;
  difficulty: "pemula" | "menengah" | "lanjutan";
  shortContext: string;
}

export interface DebateMessage {
  id: string;
  speaker: Speaker;
  round: RoundId;
  content: string;
  createdAt: string;
}

export interface DebateSession {
  id: string;
  version: 1;
  topic: DebateTopic;
  userSide: DebateSide;
  opponentSide: DebateSide;
  startedAt: string;
  completedAt?: string;
  status: "SETUP" | "IN_PROGRESS" | "AWAITING_JUDGE" | "COMPLETED";
  currentRound: RoundId;
  messages: DebateMessage[];
  report?: JudgeReport;
}

export interface ScoreDetail {
  score: number;
  explanation: string;
}

export interface JudgeReport {
  summary: string;
  strongestPoint: string;
  biggestImprovementArea: string;
  scores: {
    speakByData: ScoreDetail;
    structure: ScoreDetail;
    logic: ScoreDetail;
    rebuttal: ScoreDetail;
    integrity: ScoreDetail;
  };
  strengths: string[];
  improvements: string[];
  recommendedExercise: string;
  playfulTitle: string;
  overallScore: number;
  disclaimer: string;
}
```

---

# 10. API Route: AI Opponent

Create:

```text
src/app/api/debate/opponent/route.ts
```

## 10.1 Request payload

```ts
interface OpponentRequest {
  topic: DebateTopic;
  userSide: DebateSide;
  opponentSide: DebateSide;
  currentRound: RoundId;
  messages: DebateMessage[];
}
```

## 10.2 Response payload

```ts
interface OpponentResponse {
  content: string;
  model?: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}
```

## 10.3 Request validation

Use `zod` to enforce:

- topic title length: maximum 300 characters;
- topic context length: maximum 1,000 characters;
- message content length: maximum 1,500 characters;
- message count: maximum 12;
- accepted enum values only;
- strip or reject empty messages.

## 10.4 Transcript bounding

For this MVP, a debate has only six transcript messages. Still implement a safe bounded transcript utility so the app remains robust.

Rules:

- keep only the latest 12 messages;
- trim each content item to 1,500 characters;
- reject a request if the body is too large;
- do not forward irrelevant browser metadata.

## 10.5 Opponent system prompt

Create `src/lib/prompts/opponent.ts`.

```text
You are an AI debate sparring partner inside a premium educational web game named Republik Argumen.

Your role is to challenge the user respectfully and intelligently. You are not a hostile troll and you are not a judge.

DEBATE TOPIC:
{{topic}}

CONTEXT:
{{context}}

YOUR ASSIGNED POSITION:
{{opponentSide}}

CURRENT ROUND:
{{currentRound}}

RULES:
1. Reply in clear Indonesian unless the user clearly uses another language.
2. Defend only your assigned position for this match.
3. Respond to the user's latest argument, not merely to the general topic.
4. Be concise: normally 120-220 words.
5. Use a respectful but challenging tone.
6. Distinguish facts, assumptions, and examples. Do not invent citations or precise statistics.
7. If you mention a number that is not provided in the debate context, frame it as an illustrative example or state that it should be verified.
8. Do not attack the user's character, identity, intelligence, or motives.
9. Do not declare yourself the winner.
10. End with one sharp but respectful question that pressures the user to clarify or defend a key point.
11. For the Closing Statement round, provide a concise final counter-position and one closing question only if useful.
```

## 10.6 OpenRouter request body

```ts
{
  model: process.env.OPENROUTER_OPPONENT_MODEL,
  messages: [
    { role: "system", content: opponentSystemPrompt },
    ...mappedTranscript,
  ],
  temperature: 0.7,
  max_completion_tokens: 500,
}
```

Do not include secrets in logs.

---

# 11. API Route: AI Judge

Create:

```text
src/app/api/debate/judge/route.ts
```

## 11.1 Request payload

```ts
interface JudgeRequest {
  session: DebateSession;
}
```

## 11.2 Response payload

```ts
interface JudgeResponse {
  report: JudgeReport;
  model?: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}
```

## 11.3 Judge behavior

The Judge is independent. It evaluates the **user's performance**, not whether the assigned position is objectively correct.

The result must not shame the user. It must explain improvement opportunities clearly.

## 11.4 Judge scoring rubric

Use five dimensions, each scored `0-100`:

| Dimension | What it measures |
|---|---|
| Speak by Data | Use of evidence, examples, and appropriate factual framing |
| Structure | Clarity of opening, reasoning sequence, and closing summary |
| Logic | Consistency, causal reasoning, avoidance of obvious fallacies |
| Rebuttal | Ability to address the opponent's actual arguments |
| Integrity | Respectful tone, intellectual honesty, acknowledgment of uncertainty |

Compute the final score as a simple average unless later changed.

## 11.5 Judge system prompt

Create `src/lib/prompts/judge.ts`.

```text
You are the independent AI Judge for Republik Argumen, an educational debate game.

Evaluate the USER's debate performance only. Do not score whether the user's assigned position is politically or morally correct. Score how well the user argued the assigned side.

Use the transcript and topic context. Be fair, practical, respectful, and specific.

SCORING DIMENSIONS:
- speakByData: use of evidence, examples, and appropriate factual framing
- structure: clarity and organization
- logic: consistency and reasoning quality
- rebuttal: whether the user addresses the opponent's actual arguments
- integrity: respectful tone and intellectual honesty

RULES:
1. Each score must be an integer from 0 to 100.
2. Explain each score briefly using concrete transcript observations.
3. Do not invent sources, facts, or quotations.
4. Do not shame the user.
5. Identify strengths as well as improvements.
6. Give one practical exercise for the next debate.
7. Create one playful but respectful Indonesian title for the user's debate style.
8. Add a disclaimer that the assessment is an AI-generated coaching aid, not an objective measurement of the user's intelligence or personal value.
9. Return only the requested JSON structure.
```

## 11.6 Structured output schema

OpenRouter supports `response_format` with `type: "json_schema"` for compatible models. Use this when possible.

```ts
const judgeJsonSchema = {
  name: "republik_argumen_judge_report",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: [
      "summary",
      "strongestPoint",
      "biggestImprovementArea",
      "scores",
      "strengths",
      "improvements",
      "recommendedExercise",
      "playfulTitle",
      "overallScore",
      "disclaimer"
    ],
    properties: {
      summary: { type: "string" },
      strongestPoint: { type: "string" },
      biggestImprovementArea: { type: "string" },
      scores: {
        type: "object",
        additionalProperties: false,
        required: ["speakByData", "structure", "logic", "rebuttal", "integrity"],
        properties: {
          speakByData: { $ref: "#/$defs/scoreDetail" },
          structure: { $ref: "#/$defs/scoreDetail" },
          logic: { $ref: "#/$defs/scoreDetail" },
          rebuttal: { $ref: "#/$defs/scoreDetail" },
          integrity: { $ref: "#/$defs/scoreDetail" }
        }
      },
      strengths: {
        type: "array",
        minItems: 1,
        maxItems: 4,
        items: { type: "string" }
      },
      improvements: {
        type: "array",
        minItems: 1,
        maxItems: 4,
        items: { type: "string" }
      },
      recommendedExercise: { type: "string" },
      playfulTitle: { type: "string" },
      overallScore: { type: "integer", minimum: 0, maximum: 100 },
      disclaimer: { type: "string" }
    },
    $defs: {
      scoreDetail: {
        type: "object",
        additionalProperties: false,
        required: ["score", "explanation"],
        properties: {
          score: { type: "integer", minimum: 0, maximum: 100 },
          explanation: { type: "string" }
        }
      }
    }
  }
};
```

For the Judge route, include `provider.require_parameters: true` so the routed provider is required to support the requested structured-output parameters.

OpenRouter request body:

```ts
{
  model: process.env.OPENROUTER_JUDGE_MODEL,
  messages: [
    { role: "system", content: judgeSystemPrompt },
    { role: "user", content: judgeInputText },
  ],
  temperature: 0.2,
  max_completion_tokens: 1400,
  response_format: {
    type: "json_schema",
    json_schema: judgeJsonSchema,
  },
  provider: {
    require_parameters: true,
  },
}
```

## 11.7 Judge fallback parser

Some model configurations may not support structured outputs perfectly. Implement resilience:

1. Try structured output.
2. Parse returned JSON.
3. Validate with `zod`.
4. If validation fails, retry once with a stricter prompt that includes: `Return valid JSON only. No markdown fences.`
5. If retry fails, show a friendly error and allow the user to retry evaluation manually.

Do not silently render malformed AI output.

---

# 12. Voice Features: Optional Progressive Enhancement

## 12.1 Objective

Voice support should make personal testing more immersive without adding paid speech APIs.

Use browser APIs only:

- speech-to-text: `SpeechRecognition` or `webkitSpeechRecognition`
- text-to-speech: `window.speechSynthesis`

Typing must always remain available.

## 12.2 Voice input feature detection

Create `src/hooks/useSpeechRecognition.ts`.

Pseudo-code:

```ts
const SpeechRecognitionConstructor =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const isSupported = Boolean(SpeechRecognitionConstructor);
```

When supported:

```ts
recognition.lang = "id-ID";
recognition.continuous = false;
recognition.interimResults = true;
recognition.maxAlternatives = 1;
```

UX states:

```text
unsupported -> microphone button hidden or disabled with explanation
idle        -> button: "Mulai Bicara"
listening   -> animated microphone + partial transcript
processing  -> finalize transcript into textarea
error       -> show simple error and preserve typed text
```

The transcript should populate the textarea first. The user must be able to edit it before submission.

## 12.3 Voice output

Create `src/lib/speech/speakText.ts`.

Use:

```ts
const utterance = new SpeechSynthesisUtterance(text);
utterance.lang = "id-ID";
utterance.rate = 1;
window.speechSynthesis.cancel();
window.speechSynthesis.speak(utterance);
```

Add controls:

- `Bacakan Jawaban AI`
- `Stop Suara`
- checkbox or toggle: `Bacakan jawaban AI otomatis`

Store the auto-play preference in localStorage.

## 12.4 Voice limitation notice

Display a short note in settings:

```text
Fitur mikrofon bergantung pada dukungan browser. Bila tidak tersedia, gunakan input ketik. Pada sebagian browser, pengenalan suara dapat diproses oleh layanan milik platform browser.
```

Do not upload raw audio to the Republik Argumen backend in this MVP.

---

# 13. User Interface

Use a premium dark UI inspired by the previously generated mockup, but keep implementation minimal and functional.

## 13.1 Visual direction

| Element | Guidance |
|---|---|
| Background | Deep navy / charcoal |
| Primary accent | Cyan / teal |
| Secondary accent | Muted gold |
| Opponent accent | Subtle red |
| Cards | Glass-like dark panels with clear borders |
| Typography | Modern sans-serif, readable, not overly decorative |
| Motion | Subtle transitions only |
| Layout | Desktop-first, mobile usable |

## 13.2 Required pages

### A. `/` — Home and setup

Display:

- Product title: `Republik Argumen`
- Tagline: `Naik pangkat bukan karena paling berisik, tetapi karena paling bernas.`
- Topic card grid
- Selected topic context
- Position selection buttons
- Button: `Mulai Debat`
- Link: `Riwayat Debat Lokal`
- Small label: `Personal MVP — data tersimpan di browser ini`

### B. `/debate/[sessionId]` — Debate arena

Display:

- Topic title
- User assigned side and AI assigned side
- Current round badge
- Round progress indicator
- Timer
- Transcript area
- User textarea
- Character counter
- Submit button
- Optional microphone button
- Loading indicator while AI responds
- Speak / stop voice controls for AI messages
- Button: `Akhiri dan Minta Penilaian` after final AI response
- Button: `Batalkan Debat`

### C. `/result/[sessionId]` — Judge report

Display:

- Overall score
- Playful title
- Summary
- Five score bars
- Explanation below each score
- Strongest point
- Biggest improvement area
- Strength list
- Improvement list
- Recommended exercise
- Disclaimer
- Transcript accordion
- Buttons:
  - `Debat Lagi dengan Topik Ini`
  - `Pilih Topik Baru`
  - `Export JSON`

### D. `/history` — Local history

Display locally stored completed sessions:

- date;
- topic;
- side;
- final score;
- playful title;
- open report button;
- delete session button;
- delete all local data button with confirmation.

---

# 14. UI Components

Suggested components:

```text
src/components/
  layout/
    AppHeader.tsx
    PageShell.tsx
  topics/
    TopicCard.tsx
    TopicSelector.tsx
    SideSelector.tsx
  debate/
    DebateHeader.tsx
    RoundStepper.tsx
    DebateTranscript.tsx
    MessageBubble.tsx
    DebateComposer.tsx
    TurnTimer.tsx
    VoiceInputButton.tsx
    SpeakResponseButton.tsx
  judge/
    ScoreBar.tsx
    JudgeReportPanel.tsx
    TranscriptAccordion.tsx
  history/
    LocalHistoryList.tsx
  common/
    ErrorBanner.tsx
    LoadingDots.tsx
    ConfirmDialog.tsx
```

Keep components small and easy to inspect.

---

# 15. Local Persistence

## 15.1 Storage strategy

Use localStorage key:

```text
republik-argumen.sessions.v1
```

Store a JSON array of `DebateSession` objects.

Use another key:

```text
republik-argumen.preferences.v1
```

Store:

```ts
interface UserPreferences {
  autoSpeakOpponent: boolean;
  voiceInputEnabled: boolean;
}
```

## 15.2 Retention limit

Keep only the most recent 20 sessions locally. When a 21st session is created, remove the oldest one.

## 15.3 Export session

Allow export of one session:

```text
republik-argumen-session-YYYY-MM-DD-<sessionId>.json
```

Never export API keys.

---

# 16. Debate State Machine

Implement the core flow as an explicit state machine or reducer.

```text
SETUP
  |
  v
IN_PROGRESS: OPENING_WAITING_FOR_USER
  |
  v
IN_PROGRESS: OPENING_WAITING_FOR_AI
  |
  v
IN_PROGRESS: REBUTTAL_WAITING_FOR_USER
  |
  v
IN_PROGRESS: REBUTTAL_WAITING_FOR_AI
  |
  v
IN_PROGRESS: CLOSING_WAITING_FOR_USER
  |
  v
IN_PROGRESS: CLOSING_WAITING_FOR_AI
  |
  v
AWAITING_JUDGE
  |
  v
COMPLETED
```

Disable duplicate submits while waiting for AI.

If an AI opponent call fails:

- keep the user's submitted text;
- show `Coba Lagi`;
- do not advance the round until AI response succeeds.

If the Judge call fails:

- keep the full transcript;
- show `Ulangi Penilaian`;
- do not delete the session.

---

# 17. Minimal Input Safety

This personal MVP is not public, so do not overbuild moderation. Still implement:

- Trim whitespace.
- Reject blank submissions.
- Enforce per-round character limits.
- Reject excessive request body size.
- Escape rendered text; never inject AI content as raw HTML.
- Do not use `dangerouslySetInnerHTML` for model responses.
- Add a short UI note: `Kritik gagasan, bukan pribadi.`
- Add server timeouts for OpenRouter calls.
- Do not log secrets.

When the project later becomes public, add a separate moderation pipeline and abuse prevention layer.

---

# 18. Error Handling

Create a consistent API error format:

```ts
interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    retryable: boolean;
  };
}
```

Recommended codes:

| Code | Meaning | Retryable |
|---|---|---:|
| `CONFIG_MISSING` | Environment key or model missing | No |
| `INVALID_REQUEST` | Request validation failed | No |
| `OPENROUTER_TIMEOUT` | Upstream timeout | Yes |
| `OPENROUTER_ERROR` | OpenRouter returned an error | Usually yes |
| `JUDGE_PARSE_ERROR` | Judge output failed JSON validation | Yes |
| `INTERNAL_ERROR` | Unexpected application error | Sometimes |

Display friendly Indonesian messages in the UI.

---

# 19. Folder Structure

Use a clear folder structure such as:

```text
republik-argumen-mvp/
  .env.example
  .gitignore
  README.md
  package.json
  next.config.ts
  tailwind.config.ts
  tsconfig.json
  Dockerfile
  docker-compose.yml
  src/
    app/
      layout.tsx
      page.tsx
      globals.css
      debate/
        [sessionId]/
          page.tsx
      result/
        [sessionId]/
          page.tsx
      history/
        page.tsx
      api/
        debate/
          opponent/
            route.ts
          judge/
            route.ts
    components/
      common/
      debate/
      history/
      judge/
      layout/
      topics/
    data/
      topics.ts
    hooks/
      useDebateSession.ts
      useLocalSessions.ts
      useSpeechRecognition.ts
    lib/
      openrouter/
        client.ts
        config.ts
      prompts/
        opponent.ts
        judge.ts
      speech/
        speakText.ts
      storage/
        localSessions.ts
      validation/
        apiSchemas.ts
        judgeReportSchema.ts
      utils/
        ids.ts
        downloadJson.ts
    types/
      debate.ts
```

---

# 20. OpenRouter Client Utility

Create:

```text
src/lib/openrouter/client.ts
```

Responsibilities:

- accept role-specific key, model, messages, and optional response format;
- set `Authorization` header;
- set optional attribution headers;
- set timeout with `AbortController`;
- parse OpenRouter errors safely;
- return content, model identifier, and token usage when available;
- never expose or log keys.

Pseudo-code:

```ts
export async function sendOpenRouterChat({
  apiKey,
  model,
  messages,
  temperature,
  maxCompletionTokens,
  responseFormat,
}: OpenRouterChatOptions) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45_000);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...(process.env.OPENROUTER_SITE_URL
          ? { "HTTP-Referer": process.env.OPENROUTER_SITE_URL }
          : {}),
        ...(process.env.OPENROUTER_APP_NAME
          ? { "X-OpenRouter-Title": process.env.OPENROUTER_APP_NAME }
          : {}),
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_completion_tokens: maxCompletionTokens,
        ...(responseFormat ? { response_format: responseFormat } : {}),
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`OpenRouter request failed with HTTP ${response.status}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    if (typeof content !== "string" || !content.trim()) {
      throw new Error("OpenRouter returned empty content");
    }

    return {
      content,
      model: data.model,
      usage: data.usage,
    };
  } finally {
    clearTimeout(timer);
  }
}
```

Convert upstream exceptions into the standard API error format at the route-handler layer.

---

# 21. README Requirements

Create a practical `README.md` with:

## 21.1 Local setup

```bash
npm install
cp .env.example .env.local
# Edit .env.local and add OpenRouter API key(s) and model identifiers
npm run dev
```

Open:

```text
http://localhost:3000
```

## 21.2 Production build

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run start
```

## 21.3 Docker

Provide a minimal Docker configuration.

Example commands:

```bash
docker compose up --build -d
docker compose logs -f
```

## 21.4 Required configuration note

Explain clearly:

- where the OpenRouter key is placed;
- how to replace the opponent model;
- how to replace the judge model;
- how to use separate keys or one shared fallback key;
- why keys must not be prefixed with `NEXT_PUBLIC_`.

---

# 22. Testing Strategy

Use lightweight automated tests and a manual checklist.

## 22.1 Unit tests

Test:

- round progression;
- opposite-side assignment;
- transcript bounding;
- localStorage serializer and retention limit;
- judge schema validation;
- overall score calculation;
- session export filename;
- missing environment variables;
- OpenRouter error mapping.

## 22.2 Manual tests

### Core flow

- [ ] Home page loads without console errors.
- [ ] User can select a topic.
- [ ] User can select `PRO`, `CONTRA`, or random.
- [ ] Debate session opens.
- [ ] Blank argument cannot be submitted.
- [ ] Character limit is enforced.
- [ ] User can submit Opening Statement.
- [ ] AI opponent responds.
- [ ] User can submit Rebuttal.
- [ ] AI opponent responds.
- [ ] User can submit Closing Statement.
- [ ] AI opponent responds.
- [ ] Judge report can be requested.
- [ ] Judge report renders all five scores.
- [ ] Session appears in local history.
- [ ] Session can be exported as JSON.
- [ ] Session can be deleted locally.

### Failure flow

- [ ] Missing OpenRouter key shows actionable error.
- [ ] Invalid opponent model shows retryable error.
- [ ] Invalid judge model shows retryable error.
- [ ] AI timeout does not erase user input.
- [ ] Judge output parsing failure allows retry.
- [ ] Duplicate submission is disabled while waiting for AI.

### Voice

- [ ] Typing works on all tested browsers.
- [ ] Microphone button only appears when supported.
- [ ] Dictated transcript enters textarea before submit.
- [ ] User can edit transcript before submit.
- [ ] AI text-to-speech can be started and stopped.
- [ ] Voice unsupported state is explained gracefully.

---

# 23. Codex Implementation Order

Codex should work in the following sequence.

## Step 1 — Bootstrap

- Create Next.js TypeScript project.
- Add Tailwind CSS.
- Add `zod` and `lucide-react`.
- Create `.env.example`.
- Create base layout and dark theme.

**Gate:** home page loads.

## Step 2 — Static topic setup

- Add `topics.ts`.
- Build topic cards.
- Build side selector.
- Create a local debate session.

**Gate:** user can choose a topic and position, then open a debate session page.

## Step 3 — Debate state machine

- Add session types.
- Add localStorage persistence.
- Add round stepper.
- Add transcript and composer.
- Add timer.

**Gate:** user can progress through mocked AI responses for three rounds.

## Step 4 — OpenRouter opponent route

- Add server-only configuration.
- Add OpenRouter client utility.
- Add `/api/debate/opponent`.
- Replace mocked opponent with real OpenRouter calls.

**Gate:** AI opponent responds through OpenRouter without exposing keys.

## Step 5 — OpenRouter Judge route

- Add Judge prompt.
- Add structured output schema.
- Add zod validation and one retry fallback.
- Add result page.

**Gate:** completed debate produces a validated report with five scores.

## Step 6 — Local history and export

- Add history page.
- Add JSON export.
- Add delete session and delete-all controls.

**Gate:** completed debates can be reopened and exported.

## Step 7 — Optional voice enhancement

- Add voice input hook.
- Add microphone control.
- Add speech synthesis.
- Add graceful unsupported state.

**Gate:** typing remains fully usable even if voice APIs are unavailable.

## Step 8 — Quality pass

- Add loading states.
- Add Indonesian error messages.
- Add responsive layout.
- Add tests.
- Add README.
- Add Docker files.

**Gate:** manual checklist passes.

---

# 24. Definition of Done

The personal MVP is complete only when:

1. It can be cloned from GitHub.
2. `.env.local` can be configured without source-code edits.
3. Opponent and Judge can use different OpenRouter API keys.
4. Opponent and Judge can use different OpenRouter models.
5. Keys remain server-side.
6. A user can complete a three-round debate.
7. The Judge returns a validated structured report.
8. Recent sessions survive browser refresh through localStorage.
9. One session can be exported as JSON.
10. Typing works reliably.
11. Voice input works when supported and fails gracefully when unsupported.
12. AI voice output can be started and stopped.
13. The app builds successfully with `npm run build`.
14. The README explains local and Docker deployment.
15. No postponed feature is accidentally added.

---

# 25. Nice-to-Have Improvements After the First Test

Only consider these after the MVP passes personal testing:

1. Stream AI opponent responses for better perceived speed.
2. Add model selection in a password-protected local settings page.
3. Add more AI opponent personas.
4. Add debate difficulty settings.
5. Add report comparison across sessions.
6. Add markdown-free visual quote cards.
7. Add PostgreSQL and authentication.
8. Add public membership logic.
9. Add safety moderation.
10. Add human-vs-human debate.

Do not implement these automatically during the first build.

---

# 26. Known Limitations

This MVP intentionally accepts the following limitations:

- Sessions exist only in the current browser unless exported.
- There is no login.
- There is no public content.
- Judge scoring is an AI-generated coaching aid, not an objective measurement.
- Browser speech recognition support varies.
- Some browsers may use an external browser-platform service for recognition.
- There is no fact-checking database.
- AI responses may still contain errors.
- A public launch would require stronger moderation, privacy, abuse prevention, and legal review.

---

# 27. Official Technical References

Use official documentation as the source of truth during implementation:

1. OpenRouter quickstart  
   `https://openrouter.ai/docs/quickstart`

2. OpenRouter API authentication  
   `https://openrouter.ai/docs/api/reference/authentication`

3. OpenRouter Chat Completions API  
   `https://openrouter.ai/docs/api/api-reference/chat/send-chat-completion-request`

4. OpenRouter structured outputs  
   `https://openrouter.ai/docs/guides/features/structured-outputs`

5. MDN Web Speech API  
   `https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API`

6. MDN SpeechRecognition  
   `https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition`

7. MDN SpeechSynthesis  
   `https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis`

---

# 28. Final Instruction to Codex

Build only the personal MVP described above. Work in small verified increments. After every major step:

1. run lint;
2. run type checking;
3. run tests;
4. run production build;
5. fix errors before moving forward;
6. update README when setup changes;
7. avoid introducing external dependencies unless justified;
8. do not expose OpenRouter secrets;
9. do not add postponed features;
10. leave the repository in a runnable state.

The priority order is:

```text
Reliable core debate flow
  > reliable independent Judge report
  > safe server-side OpenRouter configuration
  > local persistence
  > optional voice enhancement
  > visual polish
```

