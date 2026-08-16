export type MessageType = "Text" | "Image" | "File" | "System";

export interface SenderDto {
  id: string; // Guid
  username: string;
  avatarUrl?: string | null;
}

export interface MessageDto {
  id: string;
  roomId: string;
  sender: SenderDto;
  content?: string | null;
  replyToMessageId?: string | null;
  messageType: MessageType;
  sentAt: string; // ISO datetime string
  editedAt?: string | null;
}

// Payload gửi lên hub method "SendMessage" — khớp SendMessageRequestDto
export interface SendMessageRequest {
  roomId: string;
  content?: string;
  replyToMessageId?: string;
  messageType: MessageType;
}

export interface RoomSummary {
  id: string;
  name: string;
  type: "Direct" | "Group";
  avatarUrl?: string | null;
  lastMessage?: MessageDto | null;
  unreadCount: number;
  isMemberOnline?: boolean; // chỉ có ý nghĩa với room Direct
}

// Trạng thái kết nối SignalR — hiển thị trực tiếp trên UI (phần "network console")
export type ConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "reconnecting";

export interface OnlineStatusEvent {
  userId: string;
  isOnline: boolean;
}
