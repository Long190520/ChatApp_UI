import { useMutation } from "@tanstack/react-query";
import { authApi } from "../services/auth.api";
import { useAuth } from "../context/AuthContext";
import type { LoginRequest, RegisterRequest } from "../types/auth.types";

/**
 * useMutation (thay vì useQuery) vì đây là hành động "ghi" (POST, thay đổi
 * trạng thái server) — không phải "đọc" dữ liệu để cache/refetch tự động.
 * useQuery phù hợp cho GET (ví dụ sau này: load danh sách room, lịch sử tin
 * nhắn); useMutation phù hợp cho POST/PUT/DELETE (login, gửi form...).
 */

export function useLoginMutation() {
  const { setAuthContext } = useAuth();

  return useMutation({
    mutationFn: (payload: LoginRequest) => authApi.login(payload),
    onSuccess: (data) => {
      // Login thành công -> lưu vào AuthContext (kéo theo lưu localStorage,
      // kích hoạt useEffect trong ChatContext để connect SignalR).
      setAuthContext({
        user: data.user,
        accessToken: data.accessToken,
      });
    },
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (payload: RegisterRequest) => authApi.register(payload),
    // Register không tự động login — theo đúng luồng REST đã thiết kế ở
    // backend (Register chỉ trả message, không trả token). Sau khi đăng ký
    // xong, UI sẽ điều hướng người dùng sang màn hình Login.
  });
}
