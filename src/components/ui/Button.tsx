import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "prestige";
type ButtonSize = "sm" | "md" | "lg" | "icon";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-transparent bg-[var(--ra-action)] text-[var(--ra-text-inverse)] shadow-[var(--ra-glow-user)] hover:bg-[var(--ra-action-hover)] active:bg-[var(--ra-cyan)]",
  secondary:
    "border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] text-[var(--ra-text-primary)] hover:bg-[var(--ra-bg-panel-strong)] active:bg-[var(--ra-bg-elevated)]",
  outline:
    "border-[var(--ra-border-default)] bg-transparent text-[var(--ra-text-primary)] hover:border-[var(--ra-cyan)] hover:bg-[var(--ra-cyan-soft)]",
  ghost:
    "border-transparent bg-transparent text-[var(--ra-text-secondary)] hover:bg-[var(--ra-bg-panel)] hover:text-[var(--ra-text-primary)]",
  danger:
    "border-transparent bg-[var(--ra-negative)] text-[var(--ra-text-primary)] hover:bg-[var(--ra-coral-bright)]",
  prestige:
    "border-transparent bg-[image:var(--ra-gradient-gold)] text-[var(--ra-text-inverse)] shadow-[var(--ra-glow-gold)] hover:brightness-110",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-10 px-3 py-2 text-sm",
  md: "min-h-11 px-4 py-2 text-sm",
  lg: "min-h-12 px-5 py-3 text-base",
  icon: "h-11 w-11 p-0",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  isLoading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  leadingIcon,
  trailingIcon,
  isLoading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[var(--ra-radius-md)] border font-semibold transition-[background,border-color,color,box-shadow,transform,filter] duration-150 ease-out active:translate-y-px disabled:border-[var(--ra-border-subtle)] disabled:bg-[var(--ra-bg-panel)] disabled:text-[var(--ra-text-disabled)] disabled:shadow-none",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
          aria-hidden="true"
        />
      ) : (
        leadingIcon
      )}
      {children}
      {trailingIcon}
    </button>
  );
}
