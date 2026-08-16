import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import { Sidebar } from "./components/layout/Sidebar";
import { ChatWindow } from "./components/chat/ChatWindow";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";

// Không dùng react-router — pet project chỉ có 3 màn hình, state đơn giản
// là đủ. Nếu sau này thêm nhiều route hơn, đây là chỗ đáng cân nhắc đổi
// sang react-router-dom.
type AuthView = "login" | "signup";

function AuthGate() {
  const [view, setView] = useState<AuthView>("login");

  if (view === "login") {
    return <LoginPage onSwitchToSignup={() => setView("signup")} />;
  }
  return <SignupPage onSwitchToLogin={() => setView("login")} />;
}

export default function App() {
  const { authContext } = useAuth();
  const isAuthenticated = Boolean(
    authContext?.accessToken && authContext?.user,
  );

  if (!isAuthenticated) {
    return <AuthGate />;
  }

  return (
    <ChatProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        <Sidebar />
        <ChatWindow />
      </div>
    </ChatProvider>
  );
}
