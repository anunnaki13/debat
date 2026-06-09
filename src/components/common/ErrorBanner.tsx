import { AlertTriangle } from "lucide-react";

export function ErrorBanner({ message }: { message: string }) {
  if (!message) {
    return null;
  }

  return (
    <div className="flex items-start gap-3 rounded-md border border-red-300/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
      <AlertTriangle className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
