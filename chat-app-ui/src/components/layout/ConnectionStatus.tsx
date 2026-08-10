import type { ConnectionStatus as Status } from "../../types/chat.types";

const STATUS_CONFIG: Record<Status, { label: string; dot: string; pulse?: boolean }> = {
  connected: { label: "connected", dot: "bg-live-400" },
  connecting: { label: "connecting…", dot: "bg-signal-500", pulse: true },
  reconnecting: { label: "reconnecting…", dot: "bg-live-500", pulse: true },
  disconnected: { label: "disconnected", dot: "bg-ink-600" },
};

export function ConnectionStatus({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status];

  return (
    <div className="flex items-center gap-2 rounded-full border border-ink-700 bg-ink-800 px-3 py-1.5 font-mono text-[11px] tracking-wide text-paper-200">
      <span
        className={`h-1.5 w-1.5 rounded-full ${cfg.dot} ${cfg.pulse ? "animate-pulse-live" : ""}`}
      />
      hub://{cfg.label}
    </div>
  );
}
