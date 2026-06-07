export type DebateSide = "PRO" | "CONTRA";
export type SideSelection = DebateSide | "RANDOM";
export type Speaker = "USER" | "OPPONENT";
export type RoundId = "OPENING" | "REBUTTAL" | "CLOSING";
export type DebateStatus =
  | "SETUP"
  | "IN_PROGRESS"
  | "AWAITING_JUDGE"
  | "COMPLETED";
export type AiProvider = "openrouter" | "gemini";

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
  status: DebateStatus;
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

export interface UserPreferences {
  autoSpeakOpponent: boolean;
  voiceInputEnabled: boolean;
  aiProvider: AiProvider;
  openRouterApiKey: string;
  openRouterOpponentModel: string;
  openRouterJudgeModel: string;
  geminiApiKey: string;
  geminiOpponentModel: string;
  geminiJudgeModel: string;
}

export interface ApiErrorResponse {
  error: {
    code:
      | "CONFIG_MISSING"
      | "INVALID_REQUEST"
      | "OPENROUTER_TIMEOUT"
      | "OPENROUTER_ERROR"
      | "GEMINI_TIMEOUT"
      | "GEMINI_ERROR"
      | "JUDGE_PARSE_ERROR"
      | "INTERNAL_ERROR";
    message: string;
    retryable: boolean;
  };
}

export interface AiUsage {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
}
