import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TokenResponse, User } from '@/types';

export type { User };

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (tokens: TokenResponse, username?: string, remember?: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Đọc accessToken (hoặc fallback token cũ nếu có)
    const savedToken =
      localStorage.getItem('accessToken') ||
      sessionStorage.getItem('accessToken') ||
      localStorage.getItem('token') ||
      sessionStorage.getItem('token');
    const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');

    if (savedToken) {
      setToken(savedToken);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser({ username: 'User' });
        }
      } else {
        setUser({ username: 'User' });
      }
    }

    const handleUnauthorized = () => {
      logout();
    };

    const handleTokenRefreshed = (event: Event) => {
      const customEvent = event as CustomEvent<{ accessToken: string }>;
      if (customEvent.detail?.accessToken) {
        setToken(customEvent.detail.accessToken);
      }
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    window.addEventListener('auth:token-refreshed', handleTokenRefreshed);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
      window.removeEventListener('auth:token-refreshed', handleTokenRefreshed);
    };
  }, []);

  const login = (tokens: TokenResponse, username: string = '', remember: boolean = true) => {
    const storage = remember ? localStorage : sessionStorage;

    // Chỉ ghi key 'accessToken' khi đăng nhập thành công
    storage.setItem('accessToken', tokens.accessToken);
    if (tokens.refreshToken) {
      storage.setItem('refreshToken', tokens.refreshToken);
    }

    const userData = { username, name: username.split('@')[0] };
    storage.setItem('user', JSON.stringify(userData));

    setToken(tokens.accessToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('user');

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(token),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
