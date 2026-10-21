import axios, { InternalAxiosRequestConfig } from "axios";

export const httpClient = axios.create({
  baseURL: import.meta.env?.VITE_API_BASE_URL || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Xóa sạch token & thông tin người dùng ở cả 2 storage và phát sự kiện auth:unauthorized
 */
export const handleLogout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');

  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('refreshToken');
  sessionStorage.removeItem('user');

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('auth:unauthorized'));
  }
};

httpClient.interceptors.request.use(
  (config) => {
    config.headers = config.headers || {};

    // Thêm X-Request-Id ngẫu nhiên cho mỗi request
    const requestId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : 'req-' + Math.random().toString(36).substring(2, 15);
    if (typeof config.headers.set === 'function') {
      config.headers.set('X-Request-Id', requestId);
    } else {
      config.headers['X-Request-Id'] = requestId;
    }

    // Không gắn Authorization nếu là endpoint đăng nhập, đăng ký hoặc refresh-token
    const isAuthEndpoint =
      config.url?.includes('/auth/login') ||
      config.url?.includes('/auth/register') ||
      config.url?.includes('/auth/refresh-token');

    if (!isAuthEndpoint) {
      // Đọc accessToken từ storage
      const token =
        localStorage.getItem('accessToken') ||
        sessionStorage.getItem('accessToken') ||
        localStorage.getItem('token') ||
        sessionStorage.getItem('token');

      if (token) {
        if (typeof config.headers.set === 'function') {
          config.headers.set('Authorization', `Bearer ${token}`);
        } else {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// 1. Biến promise sharing dùng chung cho nhiều request 401 cùng lúc
let refreshPromise: Promise<string> | null = null;

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    // Bỏ qua nếu không có config hoặc không phải lỗi 401
    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // 6. Bỏ qua refresh cho URL chứa /auth/login hoặc /auth/refresh-token
    const url = originalRequest.url || '';
    if (url.includes('/auth/login') || url.includes('/auth/refresh-token')) {
      handleLogout();
      return Promise.reject(error);
    }

    // 5. Cờ _retry ngăn lặp vô hạn
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    // 1. Nếu chưa có tiến trình refresh, khởi tạo duy nhất 1 promise chia sẻ
    if (!refreshPromise) {
      refreshPromise = (async () => {
        const isLocal = Boolean(localStorage.getItem('refreshToken'));
        const currentRefreshToken =
          localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');

        if (!currentRefreshToken) {
          handleLogout();
          throw new Error('No refresh token available');
        }

        try {
          const baseURL = import.meta.env?.VITE_API_BASE_URL || '/api';
          // 3. Dùng axios trần, không gắn Authorization, không import authApi để tránh vòng phụ thuộc
          const res = await axios.post(
            `${baseURL}/auth/refresh-token`,
            { refreshToken: currentRefreshToken },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          // 2. Token trong response nằm ở res.data.data
          const tokenData = res.data?.data || res.data;
          const newAccessToken = tokenData?.accessToken;
          const newRefreshToken = tokenData?.refreshToken;

          if (!newAccessToken) {
            throw new Error('Response does not contain accessToken');
          }

          // 3. Lưu token mới vào storage TRƯỚC khi retry để request interceptor không ghi đè bằng token cũ
          // 5. Lưu vào đúng nơi đang giữ refreshToken (localStorage hoặc sessionStorage)
          const targetStorage = isLocal ? localStorage : sessionStorage;
          targetStorage.setItem('accessToken', newAccessToken);

          // 2. Nếu backend KHÔNG trả refreshToken mới thì giữ refreshToken cũ
          if (newRefreshToken) {
            targetStorage.setItem('refreshToken', newRefreshToken);
          }

          // 5. Dispatch 'auth:token-refreshed' để AuthContext đồng bộ
          if (typeof window !== 'undefined') {
            window.dispatchEvent(
              new CustomEvent('auth:token-refreshed', {
                detail: {
                  accessToken: newAccessToken,
                  refreshToken: newRefreshToken || currentRefreshToken,
                },
              })
            );
          }

          return newAccessToken;
        } catch (refreshErr) {
          // 2. Refresh thất bại: handleLogout chạy đúng 1 lần tại đây
          handleLogout();
          throw refreshErr;
        }
      })().finally(() => {
        // 1. Reset refreshPromise trong finally
        refreshPromise = null;
      });
    }

    // Tất cả request 401 đang chờ đều dùng chung refreshPromise
    return refreshPromise
      .then((newAccessToken) => {
        // 4. Gắn header khi retry theo version axios v1.x (headers.set)
        if (originalRequest.headers && typeof originalRequest.headers.set === 'function') {
          originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`);
        } else {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        }

        // 5. Retry bằng httpClient(originalRequest)
        return httpClient(originalRequest);
      })
      .catch((err) => Promise.reject(err));
  },
);

export default httpClient;
