"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useId, useRef } from "react";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/cn";

export interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

export function Modal({
  open,
  title,
  description,
  children,
  footer,
  onOpenChange,
  className,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    const panel = panelRef.current;
    const previousActiveElement = document.activeElement;
    const firstFocusable = panel?.querySelector<HTMLElement>(
      "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
    );
    firstFocusable?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (previousActiveElement instanceof HTMLElement) {
        previousActiveElement.focus();
      }
    };
  }, [onOpenChange, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-[var(--ra-bg-overlay)] px-4"
      style={{ zIndex: "var(--ra-z-modal)" }}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onOpenChange(false);
        }
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          "w-full max-w-lg rounded-[var(--ra-radius-xl)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] p-5 text-[var(--ra-text-primary)] shadow-[var(--ra-shadow-overlay)]",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h2
              id={titleId}
              className="font-serif text-2xl font-bold leading-tight"
            >
              {title}
            </h2>
            {description ? (
              <p
                id={descriptionId}
                className="text-sm leading-6 text-[var(--ra-text-secondary)]"
              >
                {description}
              </p>
            ) : null}
          </div>
          <IconButton
            icon={<X size={18} aria-hidden="true" />}
            label="Tutup modal"
            onClick={() => onOpenChange(false)}
          />
        </div>
        <div className="mt-5">{children}</div>
        {footer ? <div className="mt-6 flex flex-wrap gap-3">{footer}</div> : null}
      </div>
    </div>
  );
}
