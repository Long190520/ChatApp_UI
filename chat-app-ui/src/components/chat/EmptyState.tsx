import { MessageCircleMore } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-3 bg-paper-50 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-signal-100 text-signal-600">
        <MessageCircleMore size={26} />
      </div>
      <p className="font-[Space_Grotesk] text-lg font-semibold text-ink-950">
        Chọn một cuộc trò chuyện
      </p>
      <p className="max-w-xs text-sm text-ink-600">
        Chọn 1 room ở sidebar bên trái để bắt đầu — hoặc kiểm tra lại kết nối
        SignalR nếu danh sách room trống.
      </p>
    </div>
  );
}
