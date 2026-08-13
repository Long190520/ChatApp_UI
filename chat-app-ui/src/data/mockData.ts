import type { MessageDto, RoomSummary } from "../types/chat.types";

// Dữ liệu giả để bạn nhìn thấy UI hoạt động ngay cả khi chưa nối SignalR.
// Khi bạn wire xong hooks/useSignalR.ts + service thật, hãy xoá import các
// hàm này khỏi ChatContext và thay bằng dữ liệu thật load từ REST API / hub.

export const mockRooms: RoomSummary[] = [
  {
    id: "962ef432-647f-423e-9051-3534e3280166",
    name: "Lê Phạm Hoàng Long",
    type: "Direct",
    avatarUrl: null,
    unreadCount: 2,
    isMemberOnline: true,
    lastMessage: {
      id: "msg-3",
      roomId: "962ef432-647f-423e-9051-3534e3280166",
      sender: { id: "user-2", username: "Long" },
      content: "Mai deploy thử lên server nhé",
      messageType: "Text",
      sentAt: new Date(Date.now() - 5 * 60_000).toISOString(),
    },
  },
  {
    id: "room-2",
    name: "SignalR Study Group",
    type: "Group",
    avatarUrl: null,
    unreadCount: 0,
    lastMessage: {
      id: "msg-4",
      roomId: "room-2",
      sender: { id: "user-3", username: "Minh" },
      content: "JoinRoom nhớ check membership trước nhé",
      messageType: "Text",
      sentAt: new Date(Date.now() - 60 * 60_000).toISOString(),
    },
  },
];

export const mockMessagesByRoom: Record<string, MessageDto[]> = {
  "room-1": [
    {
      id: "msg-1",
      roomId: "room-1",
      sender: { id: "user-2", username: "Long" },
      content: "Ê, ChatHub connect ổn không?",
      messageType: "Text",
      sentAt: new Date(Date.now() - 20 * 60_000).toISOString(),
    },
    {
      id: "msg-2",
      roomId: "room-1",
      sender: { id: "user-1", username: "Bạn" },
      content: "Ổn rồi, JWT qua query string chạy ngon",
      messageType: "Text",
      sentAt: new Date(Date.now() - 15 * 60_000).toISOString(),
    },
    {
      id: "msg-3",
      roomId: "room-1",
      sender: { id: "user-2", username: "Long" },
      content: "Mai deploy thử lên server nhé",
      messageType: "Text",
      sentAt: new Date(Date.now() - 5 * 60_000).toISOString(),
    },
  ],
  "room-2": [
    {
      id: "msg-4",
      roomId: "room-2",
      sender: { id: "user-3", username: "Minh" },
      content: "JoinRoom nhớ check membership trước nhé",
      messageType: "Text",
      sentAt: new Date(Date.now() - 60 * 60_000).toISOString(),
    },
  ],
};
