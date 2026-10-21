import httpClient from '@/lib/httpClient';
import { LoginPayload, LoginResponse, TokenResponse } from '@/types';

export type { LoginPayload, LoginResponse, TokenResponse };

export const authApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await httpClient.post<LoginResponse>('/auth/login', payload);
    return response.data;
  },
};

export default authApi;
