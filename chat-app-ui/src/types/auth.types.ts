// Khớp 1-1 với DTO backend (AuthController).
// Lưu ý: AuthUserResponseDto ở backend cần có field `Id` (Guid) — đây chính
// là phần bạn đã tự bổ sung ở bước trước để currentUserId hoạt động đúng.

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  loginName: string; // username hoặc email — khớp LoginRequestDto.LoginName
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string | null;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  accessTokenExp: string; // ISO datetime string
}

// Backend trả message dạng string thuần cho lỗi (BadRequest("...")/Conflict("..."))
// — không phải object, nên khi bắt lỗi ở React Query, .message chính là chuỗi đó.
export interface ApiErrorBody {
  message?: string;
}
