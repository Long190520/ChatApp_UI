import { Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useChat } from "../../context/ChatContext";

export function MessageInput() {
  const { sendMessage } = useChat();
  const [value, setValue] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const content = value.trim();
    if (!content) return;
    setValue("");
    await sendMessage(content);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-3 border-t border-paper-200 bg-white px-6 py-4"
    >
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
        rows={1}
        placeholder="Nhập tin nhắn…"
        className="max-h-32 flex-1 resize-none rounded-xl border border-paper-200 bg-paper-50 px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-600/50 focus:border-signal-500 focus:outline-none focus:ring-2 focus:ring-signal-100"
      />
      <button
        type="submit"
        disabled={!value.trim()}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-signal-500 text-white transition-opacity disabled:opacity-30"
        aria-label="Gửi tin nhắn"
      >
        <Send size={17} strokeWidth={2.25} />
      </button>
    </form>
  );
}
