import { MessageBubble } from "@/components/debate/MessageBubble";
import type { DebateMessage } from "@/types/debate";

export function DebateTranscript({ messages }: { messages: DebateMessage[] }) {
  if (messages.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-white/15 bg-slate-900/50 p-6 text-center text-sm text-slate-400">
        Kritik gagasan, bukan pribadi.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </div>
  );
}
