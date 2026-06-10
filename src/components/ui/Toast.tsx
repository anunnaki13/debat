import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { uiFeedbackSurfaceClasses, uiTextClasses } from "./styles";

type ToastTone = "info" | "success" | "warning" | "error";

const toneClasses: Record<ToastTone, string> = {
  info: "border-[var(--ra-cyan)] bg-[var(--ra-cyan-soft)]",
  success: "border-[var(--ra-emerald)] bg-[var(--ra-emerald-soft)]",
  warning: "border-[var(--ra-amber)] bg-[var(--ra-amber-soft)]",
  error: "border-[var(--ra-coral)] bg-[var(--ra-coral-soft)]",
};

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  tone?: ToastTone;
  title: string;
  description?: string;
  icon?: ReactNode;
}

export function Toast({
  tone = "info",
  title,
  description,
  icon,
  className,
  ...props
}: ToastProps) {
  return (
    <div
      role="status"
      aria-label={title}
      className={cn(
        uiFeedbackSurfaceClasses,
        "flex max-w-md items-start gap-3 p-4",
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {icon ? <span className="mt-0.5 shrink-0">{icon}</span> : null}
      <div className="space-y-1">
        <p className="text-sm font-bold">{title}</p>
        {description ? <p className={uiTextClasses.description}>{description}</p> : null}
      </div>
    </div>
  );
}
