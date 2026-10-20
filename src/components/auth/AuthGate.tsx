import React, { ReactNode } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import LoginForm from './LoginForm';

interface AuthGateProps {
  children: ReactNode;
  fallbackMessage?: string;
}

export const AuthGate: React.FC<AuthGateProps> = ({
  children,
  fallbackMessage = 'Vui lòng đăng nhập để truy cập thông tin chi tiết bảng hàng.',
}) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Paper sx={{ p: 4, my: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {fallbackMessage}
        </Typography>
        <LoginForm />
      </Paper>
    );
  }

  return <>{children}</>;
};

export default AuthGate;
