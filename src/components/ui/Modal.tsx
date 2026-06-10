"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useId, useRef } from "react";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/cn";
import {
  uiDialogFooterClasses,
  uiDialogPanelClasses,
  uiOverlayClasses,
  uiTextClasses,
} from "./styles";

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
      className={cn(uiOverlayClasses, "flex items-center justify-center px-4")}
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
          uiDialogPanelClasses,
          "w-full max-w-lg rounded-[var(--ra-radius-xl)] p-5",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h2
              id={titleId}
              className={cn(uiTextClasses.title, "text-2xl")}
            >
              {title}
            </h2>
            {description ? (
              <p
                id={descriptionId}
                className={uiTextClasses.description}
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
        {footer ? <div className={uiDialogFooterClasses}>{footer}</div> : null}
      </div>
    </div>
  );
}
