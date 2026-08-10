import type { MessageDto } from "../../types/chat.types";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MessageBubble({
  message,
  isOwn,
}: {
  message: MessageDto;
  isOwn: boolean;
}) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[70%] flex-col ${isOwn ? "items-end" : "items-start"}`}>
        {!isOwn && (
          <span className="mb-1 px-1 text-xs font-medium text-ink-600">
            {message.sender.username}
          </span>
        )}
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            isOwn
              ? "rounded-tr-sm bg-signal-500 text-white"
              : "rounded-tl-sm bg-white text-ink-900 shadow-sm ring-1 ring-paper-200"
          }`}
        >
          {message.content}
        </div>
        <span className="mt-1 px-1 font-mono text-[10px] text-ink-600/70">
          {formatTime(message.sentAt)}
        </span>
      </div>
    </div>
  );
}
