import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { colors } from '@/theme';

interface StatusChipProps {
  statusCode?: string | null;
  label?: string | null;
  size?: ChipProps['size'];
}

export const StatusChip: React.FC<StatusChipProps> = ({ statusCode, label, size = 'small' }) => {
  const upper = String(statusCode || '').trim().toUpperCase();
  const rawLabel = String(label || '').trim().toLowerCase();

  // Kiểm tra trạng thái đã bán (gồm SOLD, SOLD_OUT, DA_BAN, 'đã bán', 'sold out'...)
  const isSold =
    upper.includes('SOLD') ||
    upper.includes('DA_BAN') ||
    rawLabel.includes('đã bán') ||
    rawLabel.includes('sold');

  // Kiểm tra trạng thái còn hàng (gồm AVAILABLE, CON_HANG, 'còn hàng'...)
  const isAvailable =
    upper.includes('AVAILABLE') ||
    upper.includes('CON_HANG') ||
    rawLabel.includes('còn hàng') ||
    rawLabel.includes('available');

  // Kiểm tra trạng thái giữ chỗ / đặt cọc
  const isHold =
    upper.includes('HOLD') ||
    upper.includes('GIU_CHO') ||
    upper.includes('DEPOSIT') ||
    rawLabel.includes('giữ chỗ') ||
    rawLabel.includes('đặt cọc');

  const chipStyles = {
    fontWeight: 600,
    fontSize: '0.75rem',
    height: 26,
    borderRadius: '20px',
    px: 0.5,
  };

  // Chuẩn hóa 1 chữ duy nhất "Đã bán"
  if (isSold) {
    return (
      <Chip
        label="Đã bán"
        size={size}
        sx={{
          ...chipStyles,
          bgcolor: colors.statusSoldBg,
          color: colors.statusSoldText,
          border: '1px solid #fecdd3',
        }}
      />
    );
  }

  // Chuẩn hóa 1 chữ duy nhất "Còn hàng"
  if (isAvailable) {
    return (
      <Chip
        label="Còn hàng"
        size={size}
        sx={{
          ...chipStyles,
          bgcolor: colors.statusAvailableBg,
          color: colors.statusAvailableText,
          border: '1px solid #a7f0e0',
        }}
      />
    );
  }

  // Chuẩn hóa 1 chữ duy nhất "Giữ chỗ"
  if (isHold) {
    return (
      <Chip
        label="Giữ chỗ"
        size={size}
        sx={{
          ...chipStyles,
          bgcolor: colors.statusHoldBg,
          color: colors.statusHoldText,
          border: '1px solid #fde68a',
        }}
      />
    );
  }

  const fallbackLabel = label || statusCode || '-';
  return (
    <Chip
      label={fallbackLabel}
      size={size}
      sx={{
        ...chipStyles,
        bgcolor: '#f1f5f9',
        color: '#64748b',
        border: '1px solid #e2e8f0',
      }}
    />
  );
};

export default StatusChip;
