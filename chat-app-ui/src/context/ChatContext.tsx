import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";
import type {
  ConnectionStatus,
  MessageDto,
  MessageType,
  RoomSummary,
} from "../types/chat.types";
import { mockMessagesByRoom, mockRooms } from "../data/mockData";
import { signalRService } from "../services/signalr.service";
import { useAuth } from "./AuthContext";

interface ChatState {
  rooms: RoomSummary[];
  messagesByRoom: Record<string, MessageDto[]>;
  activeRoomId: string | null;
  onlineUserIds: Set<string>;
  connectionStatus: ConnectionStatus;
}

type ChatAction =
  | { type: "SELECT_ROOM"; roomId: string }
  | { type: "MESSAGE_RECEIVED"; message: MessageDto }
  | { type: "ONLINE_STATUS_CHANGED"; userId: string; isOnline: boolean }
  | { type: "CONNECTION_STATUS_CHANGED"; status: ConnectionStatus };

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "SELECT_ROOM":
      return {
        ...state,
        activeRoomId: action.roomId,
        rooms: state.rooms.map((r) =>
          r.id === action.roomId ? { ...r, unreadCount: 0 } : r,
        ),
      };

    case "MESSAGE_RECEIVED": {
      const { message } = action;
      const existing = state.messagesByRoom[message.roomId] ?? [];
      const isActiveRoom = state.activeRoomId === message.roomId;

      return {
        ...state,
        messagesByRoom: {
          ...state.messagesByRoom,
          [message.roomId]: [...existing, message],
        },
        rooms: state.rooms.map((r) =>
          r.id === message.roomId
            ? {
                ...r,
                lastMessage: message,
                unreadCount: isActiveRoom ? 0 : r.unreadCount + 1,
              }
            : r,
        ),
      };
    }

    case "ONLINE_STATUS_CHANGED": {
      const next = new Set(state.onlineUserIds);
      if (action.isOnline) next.add(action.userId);
      else next.delete(action.userId);
      return { ...state, onlineUserIds: next };
    }

    case "CONNECTION_STATUS_CHANGED":
      return { ...state, connectionStatus: action.status };

    default:
      return state;
  }
}

interface ChatContextValue extends ChatState {
  activeMessages: MessageDto[];
  currentUserId: string;
  selectRoom: (roomId: string) => void;
  sendMessage: (content: string, messageType?: MessageType) => Promise<void>;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { authContext } = useAuth();

  const [state, dispatch] = useReducer(chatReducer, {
    rooms: mockRooms,
    messagesByRoom: mockMessagesByRoom,
    activeRoomId: mockRooms[0]?.id ?? null,
    onlineUserIds: new Set<string>(),
    connectionStatus: "disconnected",
  });

  useEffect(() => {
    if (!authContext?.accessToken || !authContext?.user) return;

    let unsubscribeMessage: (() => void) | undefined;
    let unsubscribeOnlineStatus: (() => void) | undefined;
    let unsubscribeConnectionState: (() => void) | undefined;

    (async () => {
      try {
        dispatch({ type: "CONNECTION_STATUS_CHANGED", status: "connecting" });
        await signalRService.connect(authContext.accessToken!);
        dispatch({ type: "CONNECTION_STATUS_CHANGED", status: "connected" });

        unsubscribeMessage = signalRService.onReceiveMessage((message) =>
          dispatch({ type: "MESSAGE_RECEIVED", message }),
        );

        unsubscribeOnlineStatus = signalRService.onOnlineStatusChanged(
          ({ userId, isOnline }) =>
            dispatch({ type: "ONLINE_STATUS_CHANGED", userId, isOnline }),
        );

        unsubscribeConnectionState = signalRService.onConnectionStateChanged(
          (hubState) =>
            dispatch({
              type: "CONNECTION_STATUS_CHANGED",
              status: mapHubState(hubState),
            }),
        );
      } catch (err) {
        console.warn("[SignalR] Lỗi kết nối:", (err as Error).message);
        dispatch({ type: "CONNECTION_STATUS_CHANGED", status: "disconnected" });
      }
    })();

    return () => {
      unsubscribeMessage?.();
      unsubscribeOnlineStatus?.();
      unsubscribeConnectionState?.();
      signalRService.disconnect().catch(() => {});
    };
  }, [authContext?.accessToken]);

  const selectRoom = useCallback((roomId: string) => {
    dispatch({ type: "SELECT_ROOM", roomId });
    signalRService
      .joinRoom(roomId)
      .catch((err) =>
        console.warn("[SignalR] joinRoom lỗi:", (err as Error).message),
      );
  }, []);

  const sendMessage = useCallback(
    async (content: string, messageType: MessageType = "Text") => {
      if (!state.activeRoomId || !content.trim()) return;

      try {
        await signalRService.sendMessage({
          roomId: state.activeRoomId,
          content,
          messageType,
        });
      } catch (err) {
        console.warn("[SignalR] sendMessage lỗi:", (err as Error).message);
        dispatch({
          type: "MESSAGE_RECEIVED",
          message: {
            id: crypto.randomUUID(),
            roomId: state.activeRoomId!,
            sender: {
              id: authContext?.user?.id ?? "",
              username: authContext?.user?.username ?? "",
            },
            content,
            messageType,
            sentAt: new Date().toISOString(),
          },
        });
      }
    },
    [state.activeRoomId, authContext?.user],
  );

  const activeMessages = state.activeRoomId
    ? (state.messagesByRoom[state.activeRoomId] ?? [])
    : [];

  return (
    <ChatContext.Provider
      value={{
        ...state,
        activeMessages,
        currentUserId: authContext?.user?.id ?? "",
        selectRoom,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

function mapHubState(state: string): ConnectionStatus {
  switch (state) {
    case "Connected":
      return "connected";
    case "Connecting":
      return "connecting";
    case "Reconnecting":
      return "reconnecting";
    default:
      return "disconnected";
  }
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat phải được dùng bên trong <ChatProvider>");
  return ctx;
}
