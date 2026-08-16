import { LogOut, MessageCircleMore } from "lucide-react";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import { ConnectionStatus } from "./ConnectionStatus";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "vừa xong";
  if (mins < 60) return `${mins}p`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export function Sidebar() {
  const { rooms, activeRoomId, selectRoom, onlineUserIds, connectionStatus } =
    useChat();
  const { authContext, logout } = useAuth();

  return (
    <aside className="flex h-full w-80 shrink-0 flex-col bg-ink-950 text-paper-50">
      <div className="flex items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal-500">
            <MessageCircleMore size={18} strokeWidth={2.25} />
          </div>
          <span className="font-[Space_Grotesk] text-lg font-semibold tracking-tight">
            ChatApp
          </span>
        </div>
        <button
          onClick={logout}
          title="Đăng xuất"
          className="rounded-lg p-1.5 text-ink-600 hover:bg-ink-800 hover:text-paper-50"
        >
          <LogOut size={16} />
        </button>
      </div>

      <div className="px-5 pb-4">
        <ConnectionStatus status={connectionStatus} />
      </div>

      {authContext?.user && (
        <div className="mx-5 mb-4 flex items-center gap-2 rounded-xl bg-ink-900 px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-signal-500 text-xs font-semibold">
            {initials(authContext.user.username)}
          </div>
          <span className="truncate text-sm text-paper-100">
            {authContext.user.username}
          </span>
        </div>
      )}

      <div className="px-5 pb-2 font-mono text-[11px] uppercase tracking-wider text-ink-600">
        Conversations
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        {rooms.map((room) => {
          const isActive = room.id === activeRoomId;
          const isOnline =
            room.type === "Direct" && room.lastMessage
              ? onlineUserIds.has(room.lastMessage.sender.id)
              : false;

          return (
            <button
              key={room.id}
              onClick={() => selectRoom(room.id)}
              className={`mb-1 flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                isActive ? "bg-ink-800" : "hover:bg-ink-900"
              }`}
            >
              <div className="relative shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-700 font-[Space_Grotesk] text-sm font-medium text-paper-100">
                  {initials(room.name)}
                </div>
                {isOnline && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-ink-950 bg-live-400" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium text-paper-50">
                    {room.name}
                  </span>
                  {room.lastMessage && (
                    <span className="shrink-0 font-mono text-[10px] text-ink-600">
                      {timeAgo(room.lastMessage.sentAt)}
                    </span>
                  )}
                </div>
                <div className="mt-0.5 flex items-center justify-between gap-2">
                  <span className="truncate text-xs text-ink-600">
                    {room.lastMessage?.content ?? "Chưa có tin nhắn"}
                  </span>
                  {room.unreadCount > 0 && (
                    <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-signal-500 px-1.5 text-[10px] font-semibold text-white">
                      {room.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
