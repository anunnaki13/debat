export const raColors = {
  backgrounds: {
    deep: "var(--ra-bg-deep)",
    base: "var(--ra-bg-base)",
    surface: "var(--ra-bg-surface)",
    panel: "var(--ra-bg-panel)",
    panelStrong: "var(--ra-bg-panel-strong)",
    elevated: "var(--ra-bg-elevated)",
    glass: "var(--ra-bg-glass)",
    overlay: "var(--ra-bg-overlay)",
  },
  text: {
    primary: "var(--ra-text-primary)",
    secondary: "var(--ra-text-secondary)",
    muted: "var(--ra-text-muted)",
    disabled: "var(--ra-text-disabled)",
    inverse: "var(--ra-text-inverse)",
  },
  accents: {
    cyan: "var(--ra-cyan)",
    blue: "var(--ra-blue)",
    gold: "var(--ra-gold)",
    coral: "var(--ra-coral)",
    emerald: "var(--ra-emerald)",
    violet: "var(--ra-violet)",
    amber: "var(--ra-amber)",
  },
} as const;

export const raRadii = {
  xs: "var(--ra-radius-xs)",
  sm: "var(--ra-radius-sm)",
  md: "var(--ra-radius-md)",
  lg: "var(--ra-radius-lg)",
  xl: "var(--ra-radius-xl)",
  pill: "var(--ra-radius-pill)",
} as const;

export const raSpacing = {
  1: "var(--ra-space-1)",
  2: "var(--ra-space-2)",
  3: "var(--ra-space-3)",
  4: "var(--ra-space-4)",
  5: "var(--ra-space-5)",
  6: "var(--ra-space-6)",
  8: "var(--ra-space-8)",
  10: "var(--ra-space-10)",
  12: "var(--ra-space-12)",
  16: "var(--ra-space-16)",
  20: "var(--ra-space-20)",
} as const;

export const raZIndex = {
  base: "var(--ra-z-base)",
  card: "var(--ra-z-card)",
  sticky: "var(--ra-z-sticky)",
  dropdown: "var(--ra-z-dropdown)",
  modal: "var(--ra-z-modal)",
  toast: "var(--ra-z-toast)",
  critical: "var(--ra-z-critical)",
} as const;

export const arenaVisualStates = [
  "ready",
  "user_listening",
  "user_speaking",
  "transcribing",
  "transcript_review",
  "ai_thinking",
  "ai_streaming_text",
  "ai_generating_voice",
  "ai_speaking",
  "interrupting",
  "round_transition",
  "judging",
  "complete",
  "recoverable_error",
  "fatal_error",
] as const;

export type ArenaVisualState = (typeof arenaVisualStates)[number];
