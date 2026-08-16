import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { AuthUser } from "../types/auth.types";

interface AuthContext {
  user: AuthUser | null;
  accessToken: string | null;
}

interface AuthContextValue {
  authContext: AuthContext | null;
  setAuthContext: (authContext: AuthContext | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readAuthContextFromStorage(): AuthContext | null {
  const cxtStr = localStorage.getItem("authContext") ?? "";
  try {
    return JSON.parse(cxtStr) as AuthContext;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authContext, setAuthContextState] = useState<AuthContext | null>(
    readAuthContextFromStorage,
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      authContext,
      setAuthContext: (next: AuthContext | null) => {
        setAuthContextState(next);
        if (next) localStorage.setItem("authContext", JSON.stringify(next));
        else localStorage.removeItem("authContext");
      },
      logout: () => {
        setAuthContextState(null);
        localStorage.removeItem("authContext");
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
