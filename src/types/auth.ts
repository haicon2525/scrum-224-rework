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

export interface User {
  username: string;
  name?: string;
}
