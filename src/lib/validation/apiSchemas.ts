import { z } from "zod";
import { judgeReportSchema } from "@/lib/validation/judgeReportSchema";

export const MAX_API_BODY_BYTES = 100_000;
export const MAX_TRANSCRIPT_MESSAGES = 12;
export const MAX_MESSAGE_CHARS = 1500;

export const debateSideSchema = z.enum(["PRO", "CONTRA"]);
export const roundIdSchema = z.enum(["OPENING", "REBUTTAL", "CLOSING"]);
export const speakerSchema = z.enum(["USER", "OPPONENT"]);
export const debateModeSchema = z.enum([
  "DUEL_WACANA_AI",
  "KURSI_PANAS_AI",
  "PRIVATE_OPINION",
]);
export const debateInputModeSchema = z.enum(["TEXT", "VOICE", "VOICE_CAMERA"]);
export const inputSourceSchema = z.enum([
  "TEXT",
  "BROWSER_STT",
  "OPENROUTER_STT",
  "TRANSCRIPT_EDIT",
]);

export const debateTopicSchema = z.object({
  id: z.string().min(1).max(80),
  title: z.string().min(1).max(300),
  category: z.string().min(1).max(120),
  difficulty: z.enum(["pemula", "menengah", "lanjutan"]),
  shortContext: z.string().min(1).max(1000),
  spiceLevel: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional(),
  custom: z.boolean().optional(),
});

export const debateMessageSchema = z.object({
  id: z.string().min(1).max(120),
  speaker: speakerSchema,
  round: roundIdSchema,
  content: z.string().trim().min(1).max(MAX_MESSAGE_CHARS),
  createdAt: z.string().datetime(),
  inputSource: inputSourceSchema.optional(),
});

export const debateSessionSchema = z.object({
  id: z.string().min(1).max(120),
  version: z.literal(1),
  mode: debateModeSchema.default("DUEL_WACANA_AI"),
  inputMode: debateInputModeSchema.default("TEXT"),
  topic: debateTopicSchema,
  userSide: debateSideSchema,
  opponentSide: debateSideSchema,
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
  status: z.enum(["SETUP", "IN_PROGRESS", "AWAITING_JUDGE", "COMPLETED"]),
  currentRound: roundIdSchema,
  messages: z.array(debateMessageSchema).max(MAX_TRANSCRIPT_MESSAGES),
  report: judgeReportSchema.optional(),
});

export const opponentRequestSchema = z.object({
  topic: debateTopicSchema,
  userSide: debateSideSchema,
  opponentSide: debateSideSchema,
  currentRound: roundIdSchema,
  messages: z.array(debateMessageSchema).min(1).max(MAX_TRANSCRIPT_MESSAGES),
}).strict();

export const judgeRequestSchema = z.object({
  session: debateSessionSchema.extend({
    messages: z.array(debateMessageSchema).min(1).max(MAX_TRANSCRIPT_MESSAGES),
  }),
}).strict();

export function isBodyTooLarge(request: Request): boolean {
  const contentLength = request.headers.get("content-length");
  return contentLength ? Number(contentLength) > MAX_API_BODY_BYTES : false;
}

export function boundTranscript<T extends { content: string }>(messages: T[]): T[] {
  return messages.slice(-MAX_TRANSCRIPT_MESSAGES).map((message) => ({
    ...message,
    content: message.content.slice(0, MAX_MESSAGE_CHARS).trim(),
  }));
}
