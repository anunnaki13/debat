import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export interface ErrorStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryAction?: ReactNode;
}

export function ErrorState({
  title,
  description,
  actionLabel,
  onAction,
  secondaryAction,
}: ErrorStateProps) {
  return (
    <Card variant="outline" className="border-[var(--ra-coral)] bg-[var(--ra-coral-soft)]">
      <div className="flex items-start gap-4">
        <span className="rounded-[var(--ra-radius-md)] bg-[var(--ra-coral-soft)] p-3 text-[var(--ra-coral-bright)]">
          <AlertTriangle size={20} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-xl font-bold leading-tight text-[var(--ra-text-primary)]">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-[var(--ra-text-secondary)]">
            {description}
          </p>
          {actionLabel || secondaryAction ? (
            <div className="mt-5 flex flex-wrap gap-3">
              {actionLabel && onAction ? (
                <Button variant="outline" onClick={onAction}>
                  {actionLabel}
                </Button>
              ) : null}
              {secondaryAction}
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
