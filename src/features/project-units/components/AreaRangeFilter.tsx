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

export interface AreaRangeFilterProps {
  minArea?: number; // Đơn vị: m²
  maxArea?: number; // Đơn vị: m²
  onChange: (min?: number, max?: number) => void;
}

interface AreaPreset {
  id: string;
  label: string;
  min?: number;
  max?: number;
}

const AREA_PRESETS: AreaPreset[] = [
  { id: 'under-50', label: 'Dưới 50m²', min: 0, max: 50 },
  { id: '50-70', label: '50m² đến 70m²', min: 50, max: 70 },
  { id: '70-90', label: '70m² đến 90m²', min: 70, max: 90 },
  { id: '90-120', label: '90m² đến 120m²', min: 90, max: 120 },
  { id: 'over-120', label: 'Trên 120m2', min: 120, max: undefined },
];

export const AreaRangeFilter: React.FC<AreaRangeFilterProps> = ({
  minArea,
  maxArea,
  onChange,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const [minInput, setMinInput] = useState<string>('');
  const [maxInput, setMaxInput] = useState<string>('');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');

  useEffect(() => {
    setMinInput(minArea !== undefined ? String(minArea) : '');
    setMaxInput(maxArea !== undefined ? String(maxArea) : '');

    // Kiểm tra xem có khớp preset nào không
    const matched = AREA_PRESETS.find((p) => {
      const matchMin = (p.min === 0 && !minArea) || (minArea !== undefined && p.min === minArea);
      const matchMax = (p.max === undefined && maxArea === undefined) || (maxArea !== undefined && p.max === maxArea);
      return matchMin && matchMax;
    });

    setSelectedPresetId(matched ? matched.id : '');
  }, [minArea, maxArea]);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePresetChange = (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = AREA_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    const newMinStr = preset.min !== undefined ? String(preset.min) : '';
    const newMaxStr = preset.max !== undefined ? String(preset.max) : '';
    setMinInput(newMinStr);
    setMaxInput(newMaxStr);

    const min = preset.min !== undefined && preset.min > 0 ? preset.min : (preset.min === 0 ? 0 : undefined);
    const max = preset.max !== undefined ? preset.max : undefined;
    onChange(min, max);
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMinInput(val);
    setSelectedPresetId('');

    const num = parseFloat(val);
    const min = !isNaN(num) && num >= 0 ? num : undefined;
    const maxNum = parseFloat(maxInput);
    const max = !isNaN(maxNum) && maxNum > 0 ? maxNum : undefined;
    onChange(min, max);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMaxInput(val);
    setSelectedPresetId('');

    const num = parseFloat(val);
    const max = !isNaN(num) && num > 0 ? num : undefined;
    const minNum = parseFloat(minInput);
    const min = !isNaN(minNum) && minNum >= 0 ? minNum : undefined;
    onChange(min, max);
  };

  const getDisplayText = () => {
    const matched = AREA_PRESETS.find((p) => p.id === selectedPresetId);
    if (matched) return matched.label;

    const minVal = parseFloat(minInput);
    const maxVal = parseFloat(maxInput);

    if (!isNaN(minVal) && !isNaN(maxVal) && minVal > 0 && maxVal > 0) {
      return `${minVal} - ${maxVal} m²`;
    }
    if (!isNaN(minVal) && minVal > 0) {
      return `Từ ${minVal} m²`;
    }
    if (!isNaN(maxVal) && maxVal > 0) {
      return `Dưới ${maxVal} m²`;
    }

    return 'Chọn diện tích';
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
            color: isSelected && getDisplayText() !== 'Chọn diện tích' ? '#0f172a' : '#94a3b8',
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

      {/* Popover Dropdown chứa Thấp nhất - Cao nhất & Danh sách Radio chuẩn Figma hình 3 */}
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

        {/* Tiêu đề nhóm: Tất cả mức giá (theo đúng text trong Figma hình 3) */}
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

        {/* Danh sách Radio chuẩn hình 3 */}
        <RadioGroup value={selectedPresetId} onChange={(e) => handlePresetChange(e.target.value)}>
          <Stack spacing={0.5}>
            {AREA_PRESETS.map((preset) => (
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

export default AreaRangeFilter;
