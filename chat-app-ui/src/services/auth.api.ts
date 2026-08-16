import { apiClient } from "./api.client";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types/auth.types";

export const authApi = {
  // Lưu ý: action Register trả `Ok("chuỗi")` — ASP.NET Core serialize 1 string
  // trực tiếp thành JSON string literal (có dấu ngoặc kép), KHÔNG phải object
  // {message}. Vì vậy type trả về ở đây là `string`, không phải object.
  register: (payload: RegisterRequest) =>
    apiClient.post<string, RegisterRequest>("/auth/register", payload),

  login: (payload: LoginRequest) =>
    apiClient.post<AuthResponse, LoginRequest>("/auth/login", payload),
};
