import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const fieldClasses =
  "w-full rounded-[var(--ra-radius-md)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] px-4 py-3 text-sm leading-6 text-[var(--ra-text-primary)] transition duration-150 placeholder:text-[var(--ra-text-muted)] hover:border-[var(--ra-border-strong)] focus-visible:border-[var(--ra-cyan)] disabled:bg-[var(--ra-bg-surface)] disabled:text-[var(--ra-text-disabled)]";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
}

export function Input({
  label,
  helperText,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="block space-y-2" htmlFor={inputId}>
      {label ? (
        <span className="text-sm font-semibold text-[var(--ra-text-secondary)]">
          {label}
        </span>
      ) : null}
      <input id={inputId} className={cn(fieldClasses, className)} {...props} />
      {helperText ? (
        <span className="block text-xs leading-5 text-[var(--ra-text-muted)]">
          {helperText}
        </span>
      ) : null}
    </label>
  );
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
}

export function Textarea({
  label,
  helperText,
  className,
  id,
  ...props
}: TextareaProps) {
  const textareaId = id ?? props.name;

  return (
    <label className="block space-y-2" htmlFor={textareaId}>
      {label ? (
        <span className="text-sm font-semibold text-[var(--ra-text-secondary)]">
          {label}
        </span>
      ) : null}
      <textarea
        id={textareaId}
        className={cn(fieldClasses, "min-h-32 resize-y", className)}
        {...props}
      />
      {helperText ? (
        <span className="block text-xs leading-5 text-[var(--ra-text-muted)]">
          {helperText}
        </span>
      ) : null}
    </label>
  );
}
