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
export type DebateMode = "DUEL_WACANA_AI" | "KURSI_PANAS_AI" | "PRIVATE_OPINION";
export type DebateInputMode = "TEXT" | "VOICE" | "VOICE_CAMERA";
export type VoiceArenaState =
  | "IDLE"
  | "READY"
  | "USER_LISTENING"
  | "USER_SPEAKING"
  | "USER_SILENCE_PENDING"
  | "TRANSCRIBING"
  | "TRANSCRIPT_REVIEW"
  | "SUBMITTING_ARGUMENT"
  | "AI_THINKING"
  | "AI_STREAMING_TEXT"
  | "AI_SYNTHESIZING"
  | "AI_SPEAKING"
  | "AI_INTERRUPTED"
  | "ROUND_TRANSITION"
  | "ERROR_FALLBACK_TEXT";

export type InputSource =
  | "TEXT"
  | "BROWSER_STT"
  | "OPENROUTER_STT"
  | "TRANSCRIPT_EDIT";

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
  inputSource?: InputSource;
}

export interface DebateSession {
  id: string;
  version: 1;
  mode: DebateMode;
  inputMode: DebateInputMode;
  topic: DebateTopic;
  userSide: DebateSide;
  opponentSide: DebateSide;
  startedAt: string;
  completedAt?: string;
  status: DebateStatus;
  currentRound: RoundId;
  messages: DebateMessage[];
  report?: JudgeReport;
  deliveryReport?: DeliveryReport;
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

export interface DeliverySignals {
  durationMs: number;
  wordsPerMinute: number;
  pauseRatio: number;
  fillerWordCount: number;
  responseLatencyMs: number;
  volumeStability: number;
  interruptionCount: number;
}

export interface DeliveryReport {
  signals: DeliverySignals;
  summary: string;
  suggestions: string[];
  disclaimer: string;
}

export interface AnalyticsEvent {
  name:
    | "app_opened"
    | "mode_selected"
    | "topic_selected"
    | "device_check_opened"
    | "camera_permission_granted"
    | "camera_permission_denied"
    | "mic_permission_granted"
    | "mic_permission_denied"
    | "voice_mode_started"
    | "voice_capture_started"
    | "voice_capture_ended"
    | "transcript_edited"
    | "argument_submitted"
    | "tts_started"
    | "tts_failed"
    | "browser_tts_fallback_used"
    | "text_fallback_used"
    | "ai_voice_interrupted"
    | "round_completed"
    | "debate_completed"
    | "judge_report_viewed"
    | "delivery_report_viewed";
  createdAt: string;
  sessionId?: string;
  metadata?: Record<string, string | number | boolean | null>;
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
