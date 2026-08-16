import { MessageCircleMore } from "lucide-react";
import type { ReactNode } from "react";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div className="hidden w-1/2 flex-col justify-between bg-ink-950 p-12 text-paper-50 lg:flex">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-signal-500">
            <MessageCircleMore size={20} strokeWidth={2.25} />
          </div>
          <span className="font-[Space_Grotesk] text-xl font-semibold tracking-tight">
            ChatApp
          </span>
        </div>

        <div className="max-w-md">
          <p className="font-mono text-xs uppercase tracking-widest text-signal-500">
            hub://signalr-playground
          </p>
          <h2 className="mt-3 font-[Space_Grotesk] text-3xl font-semibold leading-tight">
            Pet project chat realtime, xây bằng SignalR + React.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-600">
            Đăng nhập để mở kết nối WebSocket tới ChatHub và bắt đầu nhắn tin
            realtime.
          </p>
        </div>

        <p className="font-mono text-[11px] text-ink-600">
          © {new Date().getFullYear()} — pet project, không phải sản phẩm thật.
        </p>
      </div>

      <div className="flex w-full flex-1 items-center justify-center bg-paper-50 px-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-signal-500 text-white">
              <MessageCircleMore size={20} strokeWidth={2.25} />
            </div>
          </div>

          <h1 className="font-[Space_Grotesk] text-2xl font-semibold text-ink-950">
            {title}
          </h1>
          <p className="mt-1.5 text-sm text-ink-600">{subtitle}</p>

          <div className="mt-8">{children}</div>

          <div className="mt-6 text-center text-sm text-ink-600">{footer}</div>
        </div>
      </div>
    </div>
  );
}
