import { Circle } from "lucide-react";
import { useChat } from "../../context/ChatContext";

export function ChatHeader() {
  const { rooms, activeRoomId, onlineUserIds } = useChat();
  const room = rooms.find((r) => r.id === activeRoomId);

  if (!room) return null;

  const isOnline =
    room.type === "Direct" && room.lastMessage
      ? onlineUserIds.has(room.lastMessage.sender.id)
      : false;

  return (
    <header className="flex items-center justify-between border-b border-paper-200 bg-white px-6 py-4">
      <div>
        <h1 className="font-[Space_Grotesk] text-base font-semibold text-ink-950">
          {room.name}
        </h1>
        {room.type === "Direct" ? (
          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-600">
            <Circle
              size={7}
              className={isOnline ? "fill-live-400 text-live-400" : "fill-ink-600/30 text-ink-600/30"}
            />
            {isOnline ? "Đang hoạt động" : "Ngoại tuyến"}
          </div>
        ) : (
          <p className="mt-0.5 text-xs text-ink-600">Nhóm chat</p>
        )}
      </div>
    </header>
  );
}
