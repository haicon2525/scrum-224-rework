import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Link,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/api/authApi';
import { colors } from '@/theme';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [autoLogin, setAutoLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const sanitizedUsername = username.trim().toLowerCase();
    const sanitizedPassword = password.trim();

    if (!sanitizedUsername || !sanitizedPassword) {
      setErrorMessage('Vui lòng nhập email/số điện thoại và mật khẩu');
      return;
    }

    try {
      setIsLoading(true);
      const res = await authApi.login({
        username: sanitizedUsername,
        password: sanitizedPassword,
      });

      if (res.data?.accessToken) {
        login(res.data, sanitizedUsername, autoLogin);
        onSuccess?.();
      } else {
        setErrorMessage(res.message || 'Đăng nhập không thành công');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin tài khoản.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyles = {
    bgcolor: '#ffffff',
    borderRadius: '8px',
    fontSize: '0.875rem',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.border,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#94a3b8',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.primary,
    },
  };

  return (
    <Paper
      elevation={6}
      sx={{
        width: '100%',
        maxWidth: 440,
        p: { xs: 3, sm: 4 },
        borderRadius: '16px',
        bgcolor: '#ffffff',
        border: '1px solid #f1f5f9',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
      }}
    >
      {/* Tiêu đề ĐĂNG NHẬP */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 800,
          color: colors.deepBlue,
          letterSpacing: 0.5,
          fontSize: '1.25rem',
        }}
      >
        ĐĂNG NHẬP
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: colors.textSecondary,
          mt: 0.75,
          mb: 3,
          fontSize: '0.875rem',
        }}
      >
        Vui lòng đăng nhập để xem nội dung
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: '8px', textAlign: 'left', fontSize: '0.8125rem' }}>
          {errorMessage}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Ô Email / Số điện thoại */}
        <TextField
          fullWidth
          size="small"
          placeholder="Email/Số điện thoại"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
          InputProps={{
            sx: inputStyles,
          }}
        />

        {/* Ô Mật khẩu */}
        <TextField
          fullWidth
          size="small"
          type={showPassword ? 'text' : 'password'}
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          InputProps={{
            sx: inputStyles,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  tabIndex={-1}
                  sx={{ color: '#94a3b8' }}
                >
                  {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Dòng Checkbox Đăng nhập tự động & Quên mật khẩu */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 0.5,
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={autoLogin}
                onChange={(e) => setAutoLogin(e.target.checked)}
                sx={{
                  color: '#cbd5e1',
                  p: 0.5,
                  '&.Mui-checked': {
                    color: colors.primary,
                  },
                }}
              />
            }
            label={
              <Typography sx={{ fontSize: '0.8125rem', color: '#475569', userSelect: 'none' }}>
                Đăng nhập tự động
              </Typography>
            }
          />

          <Link
            component="button"
            type="button"
            underline="none"
            onClick={() => console.log('Quên mật khẩu')}
            sx={{
              fontSize: '0.8125rem',
              color: colors.primary,
              fontWeight: 500,
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Quên mật khẩu?
          </Link>
        </Box>

        {/* Nút Đăng nhập Gradient Xanh */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isLoading}
          sx={{
            mt: 1,
            height: 42,
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: '0.9375rem',
            fontWeight: 700,
            color: '#ffffff',
            background: 'linear-gradient(90deg, #0284c7 0%, #00a4e4 100%)',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
            '&:hover': {
              background: 'linear-gradient(90deg, #0369a1 0%, #0284c7 100%)',
            },
          }}
        >
          {isLoading ? <CircularProgress size={22} sx={{ color: '#ffffff' }} /> : 'Đăng nhập'}
        </Button>

        {/* Dòng Đăng ký */}
        <Typography variant="body2" sx={{ fontSize: '0.8125rem', color: '#64748b', mt: 1.5 }}>
          Bạn chưa có tài khoản?{' '}
          <Link
            component="button"
            type="button"
            underline="none"
            onClick={() => console.log('Đăng ký ngay')}
            sx={{
              fontWeight: 600,
              color: colors.primary,
              fontSize: '0.8125rem',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Đăng ký ngay
          </Link>
        </Typography>
      </Box>
    </Paper>
  );
};

export default LoginForm;
