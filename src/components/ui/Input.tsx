import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { uiFieldClasses, uiTextClasses } from "./styles";

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
        <span className={uiTextClasses.label}>{label}</span>
      ) : null}
      <input id={inputId} className={cn(uiFieldClasses, className)} {...props} />
      {helperText ? (
        <span className={cn("block", uiTextClasses.helper)}>{helperText}</span>
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
        <span className={uiTextClasses.label}>{label}</span>
      ) : null}
      <textarea
        id={textareaId}
        className={cn(uiFieldClasses, "min-h-32 resize-y", className)}
        {...props}
      />
      {helperText ? (
        <span className={cn("block", uiTextClasses.helper)}>{helperText}</span>
      ) : null}
    </label>
  );
}
