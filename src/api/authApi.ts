import httpClient from '@/lib/httpClient';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  accessExpiredAt?: string;
  refreshExpiredAt?: string;
  accessExpiresIn?: number;
  refreshExpiresIn?: number;
}

export interface LoginResponse {
  code: string;
  message: string;
  data: TokenResponse;
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await httpClient.post<LoginResponse>('/auth/login', payload);
    return response.data;
  },
};

export default authApi;
