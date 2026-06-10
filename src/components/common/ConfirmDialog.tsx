"use client";

import { X } from "lucide-react";
import { useId } from "react";
import { Button, IconButton } from "@/components/ui";

export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  onCancel,
  onConfirm,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const titleId = useId();
  const messageId = useId();

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-[var(--ra-bg-overlay)] px-4"
      role="presentation"
      style={{ zIndex: "var(--ra-z-modal)" }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
        className="w-full max-w-md rounded-[var(--ra-radius-xl)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] p-5 text-[var(--ra-text-primary)] shadow-[var(--ra-shadow-overlay)]"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="font-serif text-xl font-bold leading-tight">
              {title}
            </h2>
            <p
              id={messageId}
              className="mt-2 text-sm leading-6 text-[var(--ra-text-secondary)]"
            >
              {message}
            </p>
          </div>
          <IconButton
            icon={<X size={18} aria-hidden="true" />}
            label="Tutup"
            onClick={onCancel}
          />
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel}>
            Batal
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
