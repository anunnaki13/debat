import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type CardVariant = "surface" | "elevated" | "outline" | "selected";

const cardVariants: Record<CardVariant, string> = {
  surface:
    "border-[var(--ra-border-subtle)] bg-[var(--ra-bg-surface)] shadow-[var(--ra-shadow-card)]",
  elevated:
    "border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] shadow-[var(--ra-shadow-elevated)]",
  outline:
    "border-[var(--ra-border-default)] bg-[var(--ra-bg-glass)] shadow-[var(--ra-shadow-card)]",
  selected:
    "border-[var(--ra-theme-accent,var(--ra-cyan))] bg-[var(--ra-theme-accent-soft,var(--ra-cyan-soft))] shadow-[var(--ra-theme-glow,var(--ra-glow-user))]",
};

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

export function Card({
  variant = "surface",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--ra-radius-lg)] border p-4 text-[var(--ra-text-primary)] md:p-5",
        cardVariants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-2", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "font-serif text-xl font-bold leading-tight text-[var(--ra-text-primary)]",
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm leading-6 text-[var(--ra-text-secondary)]", className)}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-4", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mt-5 flex flex-wrap items-center gap-3", className)} {...props} />
  );
}
