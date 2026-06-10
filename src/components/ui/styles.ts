export const uiControlMotionClasses =
  "transition-[background,border-color,color,box-shadow,transform,filter] duration-150 ease-out";

export const uiControlBaseClasses =
  "inline-flex items-center justify-center gap-2 border font-semibold";

export const uiControlDisabledClasses =
  "disabled:cursor-not-allowed disabled:border-[var(--ra-border-subtle)] disabled:bg-[var(--ra-bg-panel)] disabled:text-[var(--ra-text-disabled)] disabled:shadow-none";

export const uiTextClasses = {
  label: "text-sm font-semibold text-[var(--ra-text-secondary)]",
  helper: "text-xs leading-5 text-[var(--ra-text-muted)]",
  description: "text-sm leading-6 text-[var(--ra-text-secondary)]",
  title: "font-serif font-bold leading-tight text-[var(--ra-text-primary)]",
} as const;

export const uiFieldClasses =
  "w-full rounded-[var(--ra-radius-md)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] px-4 py-3 text-sm leading-6 text-[var(--ra-text-primary)] transition duration-150 placeholder:text-[var(--ra-text-muted)] hover:border-[var(--ra-border-strong)] focus-visible:border-[var(--ra-focus-ring)] disabled:bg-[var(--ra-bg-surface)] disabled:text-[var(--ra-text-disabled)]";

export const uiOverlayClasses =
  "fixed inset-0 bg-[var(--ra-bg-overlay)]";

export const uiDialogPanelClasses =
  "border border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] text-[var(--ra-text-primary)] shadow-[var(--ra-shadow-overlay)]";

export const uiDialogFooterClasses = "mt-6 flex flex-wrap gap-3";

export const uiFeedbackSurfaceClasses =
  "rounded-[var(--ra-radius-lg)] border text-[var(--ra-text-primary)] shadow-[var(--ra-shadow-card)]";

export const uiSkeletonSurfaceClasses =
  "relative overflow-hidden rounded-[var(--ra-radius-md)] bg-[var(--ra-bg-panel)]";
