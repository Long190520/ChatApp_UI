import * as signalR from "@microsoft/signalr";
import type {
  MessageDto,
  OnlineStatusEvent,
  SendMessageRequest,
} from "../types/chat.types";

/**
 * ==========================================================================
 *  KHU VỰC THỰC HÀNH — SignalR client
 * ==========================================================================
 * File này là nơi bạn nối React với `ChatHub` đã build ở backend.
 * Tất cả phần UI (Sidebar, ChatWindow, MessageInput...) đã hoàn chỉnh và
 * gọi vào đúng các method public của class này (qua hooks/useSignalR.ts) —
 * bạn không cần sửa UI, chỉ cần lấp đầy các khối TODO bên dưới.
 *
 * Nhắc lại nhanh những gì backend đã có (từ ChatHub.cs bạn đã tự viết):
 *   - Hub route:            /hubs
 *   - Auth:                 JWT qua query string "access_token" (chỉ áp
 *                            dụng cho path /hubs, đã cấu hình OnMessageReceived)
 *   - Server -> Client:
 *       "ReceiveMessage"      (MessageDto)               — tin nhắn mới trong room
 *       "OnUserOnline"        (userId: string)            — bạn bè/roommate online
 *       "OnUserOffline"       (userId: string)             — bạn bè/roommate offline
 *       "OnConnectionError"   (message: string)            — lỗi xác thực/kết nối
 *   - Client -> Server (hub methods bạn invoke):
 *       "JoinRoom"   (roomId: string)                      — join group của room
 *       "SendMessage"(request: SendMessageRequest)         — gửi tin nhắn
 * ==========================================================================
 */

type ReceiveMessageHandler = (message: MessageDto) => void;
type OnlineStatusHandler = (event: OnlineStatusEvent) => void;
type ConnectionErrorHandler = (message: string) => void;
type ConnectionStateHandler = (state: signalR.HubConnectionState) => void;

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private stateHandler: ConnectionStateHandler | null = null;

  /**
   * TODO 1 — Khởi tạo kết nối
   * ---------------------------------------------------------------------
   * Gợi ý cấu trúc dùng `HubConnectionBuilder`:
   *
   *   this.connection = new signalR.HubConnectionBuilder()
   *     .withUrl(`${HUB_BASE_URL}/hubs`, {
   *       accessTokenFactory: () => accessToken,   // <-- đây chính là cách
   *                                                 //     client gửi JWT,
   *                                                 //     SignalR SDK sẽ tự
   *                                                 //     gắn nó vào query
   *                                                 //     string ?access_token=...
   *     })
   *     .withAutomaticReconnect()   // để tự reconnect khi rớt mạng — nhớ bài
   *                                 // học về xử lý mất kết nối/OnDisconnectedAsync
   *     .configureLogging(signalR.LogLevel.Information)
   *     .build();
   *
   * Việc cần làm:
   *   1. Đọc `HUB_BASE_URL` từ biến môi trường Vite (xem ghi chú cuối file)
   *   2. Gọi `await this.connection.start()`
   *   3. Bọc try-catch, ném lỗi rõ ràng nếu connect thất bại (để hook phía
   *      trên biết mà cập nhật ConnectionStatus = "disconnected")
   */
  async connect(accessToken: string): Promise<void> {
    try {
      if (this.connection) {
        await this.connection.stop();
      }

      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(`${import.meta.env.VITE_HUB_BASE_URL}/hubs`, {
          accessTokenFactory: () => accessToken,
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

      this.connection.onreconnecting((error) =>
        this.stateHandler?.(signalR.HubConnectionState.Reconnecting),
      );
      this.connection.onreconnected((error) =>
        this.stateHandler?.(signalR.HubConnectionState.Connected),
      );
      this.connection.onclose((error) =>
        this.stateHandler?.(signalR.HubConnectionState.Disconnected),
      );
      await this.connection.start();
    } catch (error) {
      throw new Error(`Kết nối SignalR thất bại: ${(error as Error).message}`);
    }
  }

  /**
   * TODO 2 — Ngắt kết nối chủ động
   * ---------------------------------------------------------------------
   * Gọi khi user logout, hoặc component unmount.
   * Gợi ý: `await this.connection?.stop()`, nhớ set `this.connection = null`
   * sau khi stop để tránh giữ tham chiếu tới 1 connection đã chết.
   */
  async disconnect(): Promise<void> {
    try {
      await this.connection?.stop();
      this.connection = null;
    } catch (error) {
      throw new Error(
        `Ngắt kết nối SignalR thất bại: ${(error as Error).message}`,
      );
    }
  }

  /**
   * TODO 3 — Join room
   * ---------------------------------------------------------------------
   * Gọi hub method "JoinRoom" mà bạn đã viết ở ChatHub.cs.
   * Gợi ý: `await this.connection?.invoke("JoinRoom", roomId)`
   *
   * Nhắc lại từ bài học: bạn nên gọi hàm này ngay khi user MỞ 1 room trên
   * UI (xem nơi gọi trong hooks/useSignalR.ts — đã có sẵn chỗ gọi, bạn chỉ
   * cần cài đặt logic thật ở đây).
   */
  async joinRoom(roomId: string): Promise<void> {
    try {
      await this.connection?.invoke("JoinRoom", roomId);
    } catch (error) {
      throw new Error(`Gia nhập phòng thất bại: ${(error as Error).message}`);
    }
  }

  /**
   * TODO 4 — Gửi tin nhắn
   * ---------------------------------------------------------------------
   * Gọi hub method "SendMessage" — nhớ rằng bạn KHÔNG gửi senderId (server
   * tự lấy từ JWT), chỉ gửi đúng các field của SendMessageRequestDto.
   * Gợi ý: `await this.connection?.invoke("SendMessage", request)`
   *
   * Lưu ý quan trọng: method này KHÔNG return message vừa tạo — kết quả sẽ
   * tới qua event "ReceiveMessage" (xem TODO 5), kể cả cho chính người gửi.
   * Đừng cố lấy return value của invoke() để hiển thị optimistic update
   * trừ khi bạn chủ động muốn làm thêm phần đó sau này.
   */
  async sendMessage(request: SendMessageRequest): Promise<void> {
    try {
      await this.connection?.invoke("SendMessage", request);
    } catch (error) {
      throw new Error(`Gửi tin nhắn thất bại: ${(error as Error).message}`);
    }
  }

  /**
   * TODO 5 — Lắng nghe sự kiện "ReceiveMessage"
   * ---------------------------------------------------------------------
   * Gợi ý: `this.connection?.on("ReceiveMessage", handler)`
   * Nhớ trả về 1 hàm "unsubscribe" (gọi `.off(...)`) để hook phía trên có
   * thể dọn dẹp listener khi component unmount — tránh đăng ký listener
   * trùng lặp mỗi lần re-render (đây là lỗi rất phổ biến khi mới học React
   * + SignalR: mở DevTools sẽ thấy 1 tin nhắn hiện ra N lần nếu quên unsubscribe).
   */
  onReceiveMessage(handler: ReceiveMessageHandler): () => void {
    try {
      this.connection?.on("ReceiveMessage", handler);
      return () => {
        this.connection?.off("ReceiveMessage", handler);
      };
    } catch (error) {
      throw new Error(`Nhận tin nhắn thất bại: ${(error as Error).message}`);
    }
  }

  /**
   * TODO 6 — Lắng nghe "OnUserOnline" / "OnUserOffline"
   * ---------------------------------------------------------------------
   * Cả 2 event chỉ gửi kèm `userId: string`. Gợi ý gộp chung 1 method,
   * tự chuẩn hoá thành `OnlineStatusEvent { userId, isOnline }` để phần UI
   * (RoomList) xử lý thống nhất, không cần biết tên event gốc.
   *
   *   this.connection?.on("OnUserOnline", (userId: string) =>
   *     handler({ userId, isOnline: true }));
   *   this.connection?.on("OnUserOffline", (userId: string) =>
   *     handler({ userId, isOnline: false }));
   *
   * Đừng quên trả về hàm unsubscribe gỡ CẢ 2 listener.
   */
  onOnlineStatusChanged(handler: OnlineStatusHandler): () => void {
    try {
      const onlineHandler = (userId: string) =>
        handler({ userId, isOnline: true });
      const offlineHandler = (userId: string) =>
        handler({ userId, isOnline: false });

      this.connection?.on("OnUserOnline", onlineHandler);
      this.connection?.on("OnUserOffline", offlineHandler);
      return () => {
        this.connection?.off("OnUserOnline", onlineHandler);
        this.connection?.off("OnUserOffline", offlineHandler);
      };
    } catch (error) {
      throw new Error(
        `Thay đổi trạng thái online thất bại: ${(error as Error).message}`,
      );
    }
  }

  /**
   * TODO 7 — Lắng nghe "OnConnectionError"
   * ---------------------------------------------------------------------
   * Đây là event bạn tự thiết kế ở OnConnectedAsync/OnDisconnectedAsync để
   * gửi message lỗi rõ ràng (nhớ lại quyết định "giữ SendAsync thay vì
   * HubException" mà bạn đã chọn). Bắt sự kiện này để hiển thị toast lỗi
   * cho người dùng thay vì để họ chỉ thấy "mất kết nối" không rõ lý do.
   */
  onConnectionError(handler: ConnectionErrorHandler): () => void {
    try {
      this.connection?.on("OnConnectionError", handler);
      return () => {
        this.connection?.off("OnConnectionError", handler);
      };
    } catch (error) {
      throw new Error(
        `Lắng nghe lỗi kết nối thất bại: ${(error as Error).message}`,
      );
    }
  }

  /**
   * TODO 8 (tuỳ chọn, nâng cao) — Theo dõi trạng thái kết nối tổng quát
   * ---------------------------------------------------------------------
   * `HubConnection` có các sự kiện built-in: `onreconnecting`, `onreconnected`,
   * `onclose`. Map chúng sang `ConnectionStatus` ("connecting" | "connected" |
   * "reconnecting" | "disconnected") để hiển thị lên UI (xem
   * components/layout/ConnectionStatus.tsx — đã có sẵn UI, chỉ cần bạn bắn
   * đúng state vào).
   */
  onConnectionStateChanged(handler: ConnectionStateHandler): () => void {
    try {
      this.stateHandler = handler;
      return () => {
        this.stateHandler = null;
      };
    } catch (error) {
      throw new Error(
        `Lắng nghe trạng thái kết nối thất bại: ${(error as Error).message}`,
      );
    }
  }
}

// Singleton — toàn app dùng chung 1 kết nối SignalR duy nhất.
export const signalRService = new SignalRService();

// TODO 0 — cấu hình URL backend
// Tạo file `.env.local` ở root project với nội dung:
//   VITE_HUB_BASE_URL=https://localhost:7039
// (đổi cổng cho khớp với backend của bạn — chính là ValidIssuer trong
// appsettings.json JWT section bạn đã cấu hình)
// Sau đó dùng: const HUB_BASE_URL = import.meta.env.VITE_HUB_BASE_URL;
