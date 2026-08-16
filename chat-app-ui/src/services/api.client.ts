// Wrapper mỏng quanh fetch — chuẩn hoá cách gọi REST API và cách đọc lỗi.
// Dùng VITE_API_BASE_URL riêng (thường là "https://localhost:7039/api") —
// khác với VITE_HUB_BASE_URL (không có "/api", vì SignalR hub map ở "/hubs").

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<TResponse>(
  path: string,
  options: RequestInit = {},
): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    // Backend trả lỗi dạng string thuần (BadRequest("...")/Conflict("..."))
    // qua các action Register/Login — không phải JSON object có field .message.
    const rawText = await response.text().catch(() => "");
    throw new ApiError(rawText || `Yêu cầu thất bại (${response.status})`, response.status);
  }

  // 204 No Content hoặc body rỗng — không cố parse JSON.
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as TResponse;
}

export const apiClient = {
  post: <TResponse, TBody = unknown>(path: string, body: TBody) =>
    request<TResponse>(path, { method: "POST", body: JSON.stringify(body) }),
  get: <TResponse>(path: string) => request<TResponse>(path, { method: "GET" }),
};
