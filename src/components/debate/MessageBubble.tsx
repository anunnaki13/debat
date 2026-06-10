import { Bot, UserRound } from "lucide-react";
import { ROUND_DEFINITIONS } from "@/lib/debate/rules";
import type { DebateMessage } from "@/types/debate";
import { SpeakResponseButton } from "@/components/debate/SpeakResponseButton";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/cn";

export function MessageBubble({
  message,
  isStreaming = false,
}: {
  message: DebateMessage;
  isStreaming?: boolean;
}) {
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
            <div className="mt-1 flex flex-wrap gap-2">
              <Badge tone={isUser ? "user" : "ai"}>
                {ROUND_DEFINITIONS[message.round].label}
              </Badge>
              {isStreaming ? <Badge tone="warning">Streaming</Badge> : null}
            </div>
          </div>
        </div>
        {!isUser && !isStreaming ? (
          <SpeakResponseButton text={message.content} />
        ) : null}
      </div>
      <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[var(--ra-text-primary)]">
        {message.content}
        {isStreaming ? (
          <span
            className="ml-1 inline-block h-4 w-2 translate-y-0.5 bg-[var(--ra-coral-bright)] align-baseline"
            style={{ animation: "ra-halo-pulse 0.9s ease-in-out infinite" }}
            aria-hidden="true"
          />
        ) : null}
      </p>
    </article>
  );
}
