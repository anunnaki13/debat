import { Bot, UserRound } from "lucide-react";
import { ROUND_DEFINITIONS } from "@/lib/debate/rules";
import type { DebateMessage } from "@/types/debate";
import { SpeakResponseButton } from "@/components/debate/SpeakResponseButton";

export function MessageBubble({ message }: { message: DebateMessage }) {
  const isUser = message.speaker === "USER";

  return (
    <article
      className={`rounded-lg border p-4 ${
        isUser
          ? "border-cyan-300/25 bg-cyan-300/10"
          : "border-red-300/20 bg-red-300/10"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border ${
              isUser
                ? "border-cyan-300/30 text-cyan-100"
                : "border-red-300/30 text-red-100"
            }`}
          >
            {isUser ? (
              <UserRound size={17} aria-hidden="true" />
            ) : (
              <Bot size={17} aria-hidden="true" />
            )}
          </span>
          <div>
            <p className="text-sm font-semibold text-white">
              {isUser ? "Anda" : "AI Opponent"}
            </p>
            <p className="text-xs text-slate-400">
              {ROUND_DEFINITIONS[message.round].label}
            </p>
          </div>
        </div>
        {!isUser ? <SpeakResponseButton text={message.content} /> : null}
      </div>
      <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-100">
        {message.content}
      </p>
    </article>
  );
}
