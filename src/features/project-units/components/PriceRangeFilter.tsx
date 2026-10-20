import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Popover,
  Stack,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { colors } from '@/theme';

export interface PriceRangeFilterProps {
  minPrice?: number; // Đơn vị: VNĐ (ví dụ 5,000,000,000)
  maxPrice?: number; // Đơn vị: VNĐ
  onChange: (min?: number, max?: number) => void;
}

interface PricePreset {
  id: string;
  label: string;
  min?: number; // tỷ
  max?: number; // tỷ
}

const PRICE_PRESETS: PricePreset[] = [
  { id: 'under-5', label: 'Dưới 5 tỷ', min: 0, max: 5 },
  { id: '5-10', label: '5 tới 10 tỷ', min: 5, max: 10 },
  { id: '10-15', label: '10 tới 15 tỷ', min: 10, max: 15 },
  { id: '15-20', label: '15 tới 20 tỷ', min: 15, max: 20 },
  { id: 'over-20', label: 'Trên 20 tỷ', min: 20, max: undefined },
];

const ONE_BILLION = 1_000_000_000;

export const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  minPrice,
  maxPrice,
  onChange,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  // Lưu giá trị theo tỷ để hiển thị trong 2 ô input "Thấp nhất" & "Cao nhất"
  const [minInput, setMinInput] = useState<string>('');
  const [maxInput, setMaxInput] = useState<string>('');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');

  useEffect(() => {
    const minBillion = minPrice !== undefined ? minPrice / ONE_BILLION : '';
    const maxBillion = maxPrice !== undefined ? maxPrice / ONE_BILLION : '';

    setMinInput(minBillion !== '' ? String(minBillion) : '');
    setMaxInput(maxBillion !== '' ? String(maxBillion) : '');

    // Kiểm tra xem có trùng preset nào không
    const matched = PRICE_PRESETS.find((p) => {
      const matchMin = (p.min === 0 && !minPrice) || (minPrice !== undefined && p.min === minPrice / ONE_BILLION);
      const matchMax = (p.max === undefined && maxPrice === undefined) || (maxPrice !== undefined && p.max === maxPrice / ONE_BILLION);
      return matchMin && matchMax;
    });

    setSelectedPresetId(matched ? matched.id : '');
  }, [minPrice, maxPrice]);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePresetChange = (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = PRICE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    const newMinStr = preset.min !== undefined ? String(preset.min) : '';
    const newMaxStr = preset.max !== undefined ? String(preset.max) : '';
    setMinInput(newMinStr);
    setMaxInput(newMaxStr);

    const minVnd = preset.min !== undefined && preset.min > 0 ? preset.min * ONE_BILLION : (preset.min === 0 ? 0 : undefined);
    const maxVnd = preset.max !== undefined ? preset.max * ONE_BILLION : undefined;
    onChange(minVnd, maxVnd);
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMinInput(val);
    setSelectedPresetId('');

    const num = parseFloat(val);
    const minVnd = !isNaN(num) && num >= 0 ? num * ONE_BILLION : undefined;
    const maxNum = parseFloat(maxInput);
    const maxVnd = !isNaN(maxNum) && maxNum > 0 ? maxNum * ONE_BILLION : undefined;
    onChange(minVnd, maxVnd);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMaxInput(val);
    setSelectedPresetId('');

    const num = parseFloat(val);
    const maxVnd = !isNaN(num) && num > 0 ? num * ONE_BILLION : undefined;
    const minNum = parseFloat(minInput);
    const minVnd = !isNaN(minNum) && minNum >= 0 ? minNum * ONE_BILLION : undefined;
    onChange(minVnd, maxVnd);
  };

  // Xác định chữ hiển thị trên ô trigger
  const getDisplayText = () => {
    const matched = PRICE_PRESETS.find((p) => p.id === selectedPresetId);
    if (matched) return matched.label;

    const minVal = parseFloat(minInput);
    const maxVal = parseFloat(maxInput);

    if (!isNaN(minVal) && !isNaN(maxVal) && minVal > 0 && maxVal > 0) {
      return `${minVal} - ${maxVal} tỷ`;
    }
    if (!isNaN(minVal) && minVal > 0) {
      return `Từ ${minVal} tỷ`;
    }
    if (!isNaN(maxVal) && maxVal > 0) {
      return `Dưới ${maxVal} tỷ`;
    }

    return 'Chọn khoảng giá';
  };

  const isOpen = Boolean(anchorEl);
  const isSelected = Boolean(minInput || maxInput || selectedPresetId);

  return (
    <>
      {/* Box Trigger mô phỏng Select Dropdown */}
      <Box
        onClick={handleOpen}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '40px',
          px: 1.75,
          bgcolor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid',
          borderColor: isOpen ? colors.primary : colors.border || '#e2e8f0',
          cursor: 'pointer',
          transition: 'border-color 0.15s ease',
          '&:hover': {
            borderColor: '#94a3b8',
          },
        }}
      >
        <Typography
          sx={{
            fontSize: '0.875rem',
            color: isSelected && getDisplayText() !== 'Chọn khoảng giá' ? '#0f172a' : '#94a3b8',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {getDisplayText()}
        </Typography>
        <KeyboardArrowDownIcon
          sx={{
            fontSize: 20,
            color: '#94a3b8',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        />
      </Box>

      {/* Popover Dropdown chứa Thấp nhất - Cao nhất & Danh sách Radio chuẩn Figma */}
      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            mt: 0.75,
            p: 2.25,
            width: 310,
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.06)',
            bgcolor: '#ffffff',
          },
        }}
      >
        {/* Hàng 1: Thấp nhất -> Cao nhất */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
          {/* Ô Thấp nhất */}
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#334155', mb: 0.5 }}>
              Thấp nhất
            </Typography>
            <Box
              component="input"
              type="number"
              placeholder="0"
              value={minInput}
              onChange={handleMinChange}
              sx={{
                width: '100%',
                height: '36px',
                px: 1.25,
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.875rem',
                color: '#1e293b',
                outline: 'none',
                boxSizing: 'border-box',
                '&:focus': {
                  borderColor: colors.primary || '#0284c7',
                },
              }}
            />
          </Box>

          {/* Mũi tên ở giữa */}
          <Box sx={{ pt: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowForwardIcon sx={{ fontSize: 18, color: '#64748b' }} />
          </Box>

          {/* Ô Cao nhất */}
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#334155', mb: 0.5 }}>
              Cao nhất
            </Typography>
            <Box
              component="input"
              type="number"
              placeholder="0"
              value={maxInput}
              onChange={handleMaxChange}
              sx={{
                width: '100%',
                height: '36px',
                px: 1.25,
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.875rem',
                color: '#1e293b',
                outline: 'none',
                boxSizing: 'border-box',
                '&:focus': {
                  borderColor: colors.primary || '#0284c7',
                },
              }}
            />
          </Box>
        </Box>

        {/* Tiêu đề nhóm: Tất cả mức giá */}
        <Typography
          sx={{
            fontSize: '0.875rem',
            fontWeight: 700,
            color: '#1e293b',
            mt: 2,
            mb: 1,
          }}
        >
          Tất cả mức giá
        </Typography>

        {/* Danh sách Radio chuẩn hình 2 */}
        <RadioGroup value={selectedPresetId} onChange={(e) => handlePresetChange(e.target.value)}>
          <Stack spacing={0.5}>
            {PRICE_PRESETS.map((preset) => (
              <FormControlLabel
                key={preset.id}
                value={preset.id}
                control={
                  <Radio
                    size="small"
                    sx={{
                      p: 0.5,
                      color: '#94a3b8',
                      '&.Mui-checked': {
                        color: colors.primary || '#0284c7',
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: '0.84rem', color: '#334155', fontWeight: 500 }}>
                    {preset.label}
                  </Typography>
                }
                sx={{ m: 0, py: 0.2 }}
              />
            ))}
          </Stack>
        </RadioGroup>
      </Popover>
    </>
  );
};

export default PriceRangeFilter;
