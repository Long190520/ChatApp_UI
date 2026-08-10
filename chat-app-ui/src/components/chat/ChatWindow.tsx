import { useEffect, useRef } from "react";
import { useChat } from "../../context/ChatContext";
import { MessageBubble } from "./MessageBubble";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import { EmptyState } from "./EmptyState";

export function ChatWindow() {
  const { activeRoomId, activeMessages, currentUserId } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages.length]);

  if (!activeRoomId) return <EmptyState />;

  return (
    <div className="flex h-full flex-1 flex-col bg-paper-50">
      <ChatHeader />

      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
        {activeMessages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.sender.id === currentUserId}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      <MessageInput />
    </div>
  );
}
