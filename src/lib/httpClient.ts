import axios from "axios";

export const httpClient = axios.create({
  baseURL: import.meta.env?.VITE_API_BASE_URL || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

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

    // Không gắn Authorization nếu là endpoint đăng nhập hoặc đăng ký
    const isAuthEndpoint = config.url?.includes('/auth/login') || config.url?.includes('/auth/register');
    if (!isAuthEndpoint) {
      // Đọc accessToken từ storage
      // TODO: Fallback đọc key 'token' cũ, sẽ dọn sạch sau khi chuyển đổi hoàn tất
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

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Khi gặp lỗi 401 Unauthorized: xóa token và đưa về form đăng nhập
    if (error.response?.status === 401) {
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
    }
    return Promise.reject(error);
  },
);

export default httpClient;
