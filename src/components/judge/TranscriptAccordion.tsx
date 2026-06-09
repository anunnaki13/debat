"use client";

import { MessageBubble } from "@/components/debate/MessageBubble";
import type { DebateMessage } from "@/types/debate";

export function TranscriptAccordion({
  messages,
}: {
  messages: DebateMessage[];
}) {
  return (
    <details className="rounded-[var(--ra-radius-xl)] border border-[rgba(90,142,255,0.24)] bg-[rgba(5,12,28,0.82)] p-4 shadow-[var(--ra-shadow-card)]">
      <summary className="cursor-pointer text-sm font-black uppercase tracking-wide text-[var(--ra-text-primary)]">
        Transcript Arena
      </summary>
      <div className="mt-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>
    </details>
  );
}
