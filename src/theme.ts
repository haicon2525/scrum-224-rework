import { createTheme } from '@mui/material/styles';

/**
 * Bảng mã màu trích xuất từ thiết kế Figma:
 * - Primary Brand Blue: #0284c7 (Nút Bấm, Tab Quỹ căn, Điểm nhấn)
 * - Deep Title Blue: #0066b2 (Tiêu đề "BẢNG HÀNG", tên dự án)
 * - Table Column Header Blue: #0284c7 (Tiêu đề các cột trong bảng)
 * - Badge Mã căn (Thường): Nền #dbeafe, chữ #1d4ed8
 * - Badge Mã căn (Căn cam): Nền #ffedd5, chữ #ea580c
 * - Status "Còn hàng": Nền #cbf5ed, chữ #08977f
 * - Status "Đã bán": Nền #ffe4e6, chữ #e11d48
 * - Icon Hot (Lửa): #ef4444
 * - Icon Vị trí (Pin): #6366f1
 * - Filter & Card Background: #f8fafc, viền #e2e8f0
 */

export const colors = {
  primary: '#0284c7',
  primaryHover: '#0369a1',
  deepBlue: '#0066b2',
  tableHeader: '#0284c7',
  badgeBlueBg: '#dbeafe',
  badgeBlueText: '#1d4ed8',
  badgeOrangeBg: '#ffedd5',
  badgeOrangeText: '#ea580c',
  statusAvailableBg: '#cbf5ed',
  statusAvailableText: '#08977f',
  statusSoldBg: '#ffe4e6',
  statusSoldText: '#e11d48',
  statusHoldBg: '#fef3c7',
  statusHoldText: '#d97706',
  hotIcon: '#ef4444',
  locationPin: '#6366f1',
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  bgSoft: '#f8fafc',
  textPrimary: '#1e293b',
  textSecondary: '#64748b',
};

export const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
      dark: colors.primaryHover,
      contrastText: '#ffffff',
    },
    text: {
      primary: colors.textPrimary,
      secondary: colors.textSecondary,
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    divider: colors.border,
  },
  typography: {
    fontFamily: ['Roboto', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'].join(','),
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${colors.borderLight}`,
          padding: '12px 16px',
        },
      },
    },
  },
});

export default theme;
