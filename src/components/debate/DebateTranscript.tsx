import { MessageBubble } from "@/components/debate/MessageBubble";
import type { DebateMessage } from "@/types/debate";

export function DebateTranscript({
  messages,
  streamingMessageId,
}: {
  messages: DebateMessage[];
  streamingMessageId?: string;
}) {
  if (messages.length === 0) {
    return (
      <div className="rounded-[var(--ra-radius-xl)] border border-dashed border-[var(--ra-border-strong)] bg-[var(--ra-bg-panel)] p-8 text-center">
        <p className="font-serif text-2xl font-bold text-[var(--ra-text-primary)]">
          Arena siap.
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--ra-text-muted)]">
          Kritik gagasan, bukan pribadi. Mulai argumen untuk membuka ronde.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4" aria-live={streamingMessageId ? "polite" : undefined}>
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isStreaming={message.id === streamingMessageId}
        />
      ))}
    </div>
  );
}
