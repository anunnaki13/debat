import { Bot, UserRound } from "lucide-react";
import { ROUND_DEFINITIONS } from "@/lib/debate/rules";
import type { DebateMessage } from "@/types/debate";
import { SpeakResponseButton } from "@/components/debate/SpeakResponseButton";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/cn";

export function MessageBubble({ message }: { message: DebateMessage }) {
  const isUser = message.speaker === "USER";

  return (
    <article
      className={cn(
        "rounded-[var(--ra-radius-lg)] border p-4 shadow-[var(--ra-shadow-card)]",
        isUser
          ? "border-[var(--ra-cyan)] bg-[var(--ra-cyan-soft)]"
          : "border-[var(--ra-coral)] bg-[var(--ra-coral-soft)]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--ra-radius-md)] border bg-[var(--ra-bg-glass)]",
              isUser
                ? "border-[var(--ra-cyan)] text-[var(--ra-cyan-bright)]"
                : "border-[var(--ra-coral)] text-[var(--ra-coral-bright)]",
            )}
          >
            {isUser ? (
              <UserRound size={17} aria-hidden="true" />
            ) : (
              <Bot size={17} aria-hidden="true" />
            )}
          </span>
          <div>
            <p className="text-sm font-semibold text-[var(--ra-text-primary)]">
              {isUser ? "Anda" : "AI Opponent"}
            </p>
            <Badge tone={isUser ? "user" : "ai"} className="mt-1">
              {ROUND_DEFINITIONS[message.round].label}
            </Badge>
          </div>
        </div>
        {!isUser ? <SpeakResponseButton text={message.content} /> : null}
      </div>
      <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[var(--ra-text-primary)]">
        {message.content}
      </p>
    </article>
  );
}
