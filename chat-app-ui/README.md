# ChatApp UI — SignalR Practice Kit

UI đã hoàn chỉnh (sidebar, room list, chat window, message bubble, input,
connection status pill). Phần **duy nhất** bạn cần tự làm là nối SignalR
thật — toàn bộ nằm gọn trong **1 file**: `src/services/signalr.service.ts`.

## Setup

```bash
npm install
cp .env.local.example .env.local   # rồi sửa VITE_HUB_BASE_URL cho khớp backend
npm run dev
```

Mặc định UI chạy với **mock data** (xem `src/data/mockData.ts`) — bạn sẽ
thấy 2 room mẫu và tin nhắn giả ngay cả khi chưa động vào SignalR gì cả.
Gõ tin nhắn vẫn "gửi" được (fallback local echo) — đây là chủ đích, để bạn
luôn có UI để nhìn trong lúc code phần thực hành.

## Việc cần làm (theo đúng thứ tự TODO trong file)

Mở `src/services/signalr.service.ts`, lần lượt cài đặt:

| # | Method | Tương ứng phía backend |
|---|--------|------------------------|
| 0 | (cấu hình `.env.local`) | `ValidIssuer` trong `appsettings.json` |
| 1 | `connect(accessToken)` | `HubConnectionBuilder`, JWT qua `accessTokenFactory` |
| 2 | `disconnect()` | `connection.stop()` |
| 3 | `joinRoom(roomId)` | hub method `JoinRoom` |
| 4 | `sendMessage(request)` | hub method `SendMessage` |
| 5 | `onReceiveMessage(handler)` | event `"ReceiveMessage"` |
| 6 | `onOnlineStatusChanged(handler)` | event `"OnUserOnline"` / `"OnUserOffline"` |
| 7 | `onConnectionError(handler)` | event `"OnConnectionError"` |
| 8 | `onConnectionStateChanged(handler)` | `onreconnecting`/`onreconnected`/`onclose` |

**Không cần sửa bất kỳ file nào khác** — `ChatContext.tsx` đã gọi đúng tất
cả các method trên, bọc sẵn `try/catch` để không crash app trong lúc bạn
code dở. Khi bạn implement xong 1 method, mở DevTools Console để thấy
warning tương ứng biến mất — đó là dấu hiệu bạn làm đúng.

## Gợi ý thứ tự làm để test dễ nhất

1. Implement `connect()` trước — mở DevTools Network tab (filter `WS`),
   xác nhận thấy request `wss://.../hubs?access_token=...` với status 101.
2. Set token thật để test: mở Console, gõ
   `localStorage.setItem("accessToken", "<token bạn copy từ response Login>")`
   rồi reload trang.
3. Implement `onConnectionStateChanged` — xem pill ở sidebar chuyển từ
   `hub://connecting…` sang `hub://connected`.
4. Implement `joinRoom` + `sendMessage` + `onReceiveMessage` cùng lúc —
   đây là luồng test end-to-end: mở 2 tab trình duyệt (2 user khác nhau,
   2 accessToken khác nhau, cùng room), gửi từ tab này, xem tab kia có
   nhận realtime không.
5. Implement `onOnlineStatusChanged` — tắt 1 tab, xem chấm online ở tab
   còn lại có chuyển màu không (nhớ: chỉ đổi khi đó là connection **cuối
   cùng** của user đó, đúng logic bạn đã build ở `OnDisconnectedAsync`).
6. Implement `onConnectionError` — thử test bằng token hết hạn/sai, xem
   message lỗi có hiện đúng không.

## Ghi chú thiết kế UI

- Font: `Space Grotesk` (heading/logo), `Inter` (nội dung), `JetBrains
  Mono` (timestamp, connection status) — chủ đích tạo cảm giác "network
  console" vì đây là project thực hành giao thức realtime.
- Màu sắc lấy từ `src/index.css` (`@theme` block) — đổi ở đó nếu muốn
  chỉnh theme, các component chỉ dùng Tailwind class trỏ tới token này.
- `mockData.ts` và phần fallback "local echo" trong `ChatContext` nên bị
  xoá/thay thế hoàn toàn sau khi bạn nối SignalR + REST API load room
  list thật.
