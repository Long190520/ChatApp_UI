import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { AuthLayout } from "../components/auth/AuthLayout";
import { FormField } from "../components/auth/FormField";
import { useRegisterMutation } from "../hooks/useAuthMutations";
import { ApiError } from "../services/api.client";

export function SignupPage({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const mutation = useRegisterMutation();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate({ username, email, password });
  };

  if (mutation.isSuccess) {
    return (
      <AuthLayout
        title="Đăng ký thành công"
        subtitle="Tài khoản của bạn đã sẵn sàng."
        footer={null}
      >
        <div className="flex flex-col items-center gap-4 rounded-xl border border-paper-200 bg-white px-6 py-8 text-center">
          <CheckCircle2 size={40} className="text-live-400" />
          <p className="text-sm text-ink-600">
            Đăng ký thành công cho <strong className="text-ink-900">{username}</strong>.
            Giờ bạn có thể đăng nhập.
          </p>
          <button
            onClick={onSwitchToLogin}
            className="w-full rounded-xl bg-signal-500 py-2.5 text-sm font-medium text-white hover:bg-signal-600"
          >
            Về trang đăng nhập
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Tạo tài khoản"
      subtitle="Đăng ký để bắt đầu thử nghiệm chat realtime."
      footer={
        <>
          Đã có tài khoản?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-medium text-signal-600 hover:underline"
          >
            Đăng nhập
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          id="username"
          label="Username"
          type="text"
          autoComplete="username"
          placeholder="hoanglong"
          minLength={3}
          maxLength={50}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <FormField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="long@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <FormField
          id="password"
          label="Mật khẩu"
          type="password"
          autoComplete="new-password"
          placeholder="Tối thiểu 6 ký tự"
          minLength={6}
          maxLength={100}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {mutation.isError && (
          <div className="rounded-lg bg-danger-500/10 px-3.5 py-2.5 text-sm text-danger-500">
            {mutation.error instanceof ApiError
              ? mutation.error.message
              : "Đăng ký thất bại, vui lòng thử lại."}
          </div>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-signal-500 py-2.5 text-sm font-medium text-white transition-opacity hover:bg-signal-600 disabled:opacity-60"
        >
          {mutation.isPending && <Loader2 size={16} className="animate-spin" />}
          {mutation.isPending ? "Đang đăng ký…" : "Đăng ký"}
        </button>
      </form>
    </AuthLayout>
  );
}
