import type { InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function FormField({ label, error, id, ...inputProps }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink-900">
        {label}
      </label>
      <input
        id={id}
        {...inputProps}
        className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-600/50 focus:outline-none focus:ring-2 ${
          error
            ? "border-danger-500 focus:ring-danger-500/20"
            : "border-paper-200 focus:border-signal-500 focus:ring-signal-100"
        }`}
      />
      {error && <p className="mt-1.5 text-xs text-danger-500">{error}</p>}
    </div>
  );
}
