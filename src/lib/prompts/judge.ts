import type { DebateSession } from "@/types/debate";

export const judgeSystemPrompt = `You are the independent AI Judge for Republik Argumen, an educational debate game.

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
9. Return only the requested JSON structure.`;

export const judgeJsonSchema = {
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
      "disclaimer",
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
          integrity: { $ref: "#/$defs/scoreDetail" },
        },
      },
      strengths: {
        type: "array",
        minItems: 1,
        maxItems: 4,
        items: { type: "string" },
      },
      improvements: {
        type: "array",
        minItems: 1,
        maxItems: 4,
        items: { type: "string" },
      },
      recommendedExercise: { type: "string" },
      playfulTitle: { type: "string" },
      overallScore: { type: "integer", minimum: 0, maximum: 100 },
      disclaimer: { type: "string" },
    },
    $defs: {
      scoreDetail: {
        type: "object",
        additionalProperties: false,
        required: ["score", "explanation"],
        properties: {
          score: { type: "integer", minimum: 0, maximum: 100 },
          explanation: { type: "string" },
        },
      },
    },
  },
} as const;

export function buildJudgeInput(session: DebateSession): string {
  const transcript = session.messages
    .map(
      (message) =>
        `[${message.round}] ${message.speaker}: ${message.content.trim()}`,
    )
    .join("\n\n");

  return `TOPIC:
${session.topic.title}

CONTEXT:
${session.topic.shortContext}

USER SIDE:
${session.userSide}

OPPONENT SIDE:
${session.opponentSide}

TRANSCRIPT:
${transcript}`;
}
