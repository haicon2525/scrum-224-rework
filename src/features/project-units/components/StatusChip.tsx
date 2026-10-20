import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { colors } from '@/theme';

interface StatusChipProps {
  statusCode: string;
  label?: string;
  size?: ChipProps['size'];
}

export const StatusChip: React.FC<StatusChipProps> = ({ statusCode, label, size = 'small' }) => {
  const displayLabel = label || statusCode;
  const upper = statusCode.toUpperCase();

  const isAvailable =
    upper.includes('AVAILABLE') ||
    upper.includes('CON_HANG') ||
    displayLabel.toLowerCase().includes('còn hàng');

  const isSold =
    upper.includes('SOLD') ||
    upper.includes('DA_BAN') ||
    displayLabel.toLowerCase().includes('đã bán');

  const isHold =
    upper.includes('HOLD') ||
    upper.includes('GIU_CHO') ||
    displayLabel.toLowerCase().includes('giữ chỗ');

  let chipStyles = {
    fontWeight: 600,
    fontSize: '0.75rem',
    height: 26,
    borderRadius: '20px',
    px: 0.5,
  };

  if (isAvailable) {
    return (
      <Chip
        label={displayLabel}
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

  if (isSold) {
    return (
      <Chip
        label={displayLabel}
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

  if (isHold) {
    return (
      <Chip
        label={displayLabel}
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

  return (
    <Chip
      label={displayLabel}
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
