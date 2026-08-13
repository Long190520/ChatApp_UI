import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

/**
 * Placeholder cho hệ thống auth bạn đã tự implement (login/logout/refresh...).
 * File này CHỈ cung cấp đúng 1 thứ mà phần SignalR cần: accessToken hiện tại.
 *
 * Cách wire vào auth thật của bạn: thay `useState` bên dưới bằng cách đọc
 * token từ nơi bạn đang lưu nó thật sự (context/store hiện có của bạn), hoặc
 * đơn giản là render <AuthProvider> lồng bên trong provider auth thật và
 * lấy accessToken từ đó truyền xuống.
 */

interface AuthContext {
  user: UserContext | null;
  accessToken: string | null;
}

interface UserContext {
  id: string,
  username: string,
  email: string,
  avatarUrl: string | null
}

interface AuthContextValue {
  authContext: AuthContext | null;
  setAuthContext: (authContext: AuthContext | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // TODO: thay bằng token thật lấy từ hệ thống auth bạn đã build.
  // Tạm thời đọc từ localStorage để bạn có thể tự set tay lúc test:
  //   localStorage.setItem("accessToken", "<token bạn copy từ Postman/response Login>")
  const [authContext, setAuthContext] = useState<AuthContext | null>(
    () => {
      var cxtStr = localStorage.getItem("authContext") ?? "";
      try {
        return JSON.parse(cxtStr) as AuthContext;
      } catch {
        return null;
      }
    },
  );

  const value = useMemo(
    () => ({
      authContext,
      setAuthContext: (authContext: AuthContext | null) => {
        setAuthContext(authContext);
        if (authContext) localStorage.setItem("authContext", JSON.stringify(authContext));
        else localStorage.removeItem("authContext");
      },
    }),
    [authContext],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phải được dùng bên trong <AuthProvider>");
  return ctx;
}
