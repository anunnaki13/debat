"use client";

import { MessageBubble } from "@/components/debate/MessageBubble";
import type { DebateMessage } from "@/types/debate";

export function TranscriptAccordion({
  messages,
}: {
  messages: DebateMessage[];
}) {
  return (
    <details className="rounded-lg border border-white/10 bg-slate-950/75 p-4">
      <summary className="cursor-pointer text-sm font-semibold text-white">
        Transcript
      </summary>
      <div className="mt-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>
    </details>
  );
}
