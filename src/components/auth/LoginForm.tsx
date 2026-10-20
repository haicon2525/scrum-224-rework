import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin đăng nhập');
      return;
    }
    // Skeleton placeholder login
    login('mock-jwt-token', { id: 1, name: email.split('@')[0], email });
    onSuccess?.();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, mx: 'auto', p: 3 }}>
      <Typography variant="h6" textAlign="center">
        Đăng nhập để xem bảng hàng
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Email / Số điện thoại"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        required
      />
      <TextField
        label="Mật khẩu"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        required
      />
      <Button variant="contained" type="submit" fullWidth>
        Đăng nhập
      </Button>
    </Box>
  );
};

export default LoginForm;
