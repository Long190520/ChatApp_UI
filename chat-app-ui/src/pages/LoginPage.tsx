import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "../components/auth/AuthLayout";
import { FormField } from "../components/auth/FormField";
import { useLoginMutation } from "../hooks/useAuthMutations";
import { ApiError } from "../services/api.client";

export function LoginPage({ onSwitchToSignup }: { onSwitchToSignup: () => void }) {
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const mutation = useLoginMutation();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate({ loginName, password });
  };

  return (
    <AuthLayout
      title="Đăng nhập"
      subtitle="Nhập tài khoản để tiếp tục cuộc trò chuyện."
      footer={
        <>
          Chưa có tài khoản?{" "}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="font-medium text-signal-600 hover:underline"
          >
            Đăng ký ngay
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          id="loginName"
          label="Username hoặc Email"
          type="text"
          autoComplete="username"
          placeholder="long hoặc long@email.com"
          value={loginName}
          onChange={(e) => setLoginName(e.target.value)}
          required
        />
        <FormField
          id="password"
          label="Mật khẩu"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {mutation.isError && (
          <div className="rounded-lg bg-danger-500/10 px-3.5 py-2.5 text-sm text-danger-500">
            {mutation.error instanceof ApiError
              ? mutation.error.message
              : "Đăng nhập thất bại, vui lòng thử lại."}
          </div>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-signal-500 py-2.5 text-sm font-medium text-white transition-opacity hover:bg-signal-600 disabled:opacity-60"
        >
          {mutation.isPending && <Loader2 size={16} className="animate-spin" />}
          {mutation.isPending ? "Đang đăng nhập…" : "Đăng nhập"}
        </button>
      </form>
    </AuthLayout>
  );
}
