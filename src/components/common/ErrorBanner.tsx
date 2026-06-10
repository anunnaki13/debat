import { AlertTriangle } from "lucide-react";

export function ErrorBanner({ message }: { message: string }) {
  if (!message) {
    return null;
  }

  return (
    <div
      className="flex items-start gap-3 rounded-[var(--ra-radius-md)] border border-[var(--ra-coral)] bg-[var(--ra-coral-soft)] px-4 py-3 text-sm text-[var(--ra-coral-bright)]"
      role="alert"
    >
      <AlertTriangle className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
