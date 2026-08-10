import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import { Sidebar } from "./components/layout/Sidebar";
import { ChatWindow } from "./components/chat/ChatWindow";

export default function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <div className="flex h-screen w-screen overflow-hidden">
          <Sidebar />
          <ChatWindow />
        </div>
      </ChatProvider>
    </AuthProvider>
  );
}
