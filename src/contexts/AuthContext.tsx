import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TokenResponse } from '@/api/authApi';

export interface User {
  username: string;
  name?: string;
}

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
    const savedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
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
  }, []);

  const login = (tokens: TokenResponse, username: string = '', remember: boolean = true) => {
    const storage = remember ? localStorage : sessionStorage;

    storage.setItem('token', tokens.accessToken);
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
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    sessionStorage.removeItem('token');
    sessionStorage.removeItem('accessToken');
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
