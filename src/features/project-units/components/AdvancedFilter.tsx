import React, { useState, useEffect } from 'react';
import {
  Paper,
  Grid,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
  Box,
} from '@mui/material';
import { UnitQueryParams, MasterDataItem, PhaseItem } from '../types';
import PriceRangeFilter from './PriceRangeFilter';
import AreaRangeFilter from './AreaRangeFilter';
import { colors } from '@/theme';

interface AdvancedFilterProps {
  filters: UnitQueryParams;
  phases?: PhaseItem[];
  unitTypes?: MasterDataItem[];
  directions?: MasterDataItem[];
  onApply: (appliedFilters: Partial<UnitQueryParams>) => void;
  onReset?: () => void;
  onClose?: () => void;
}

export const AdvancedFilter: React.FC<AdvancedFilterProps> = ({
  filters,
  phases = [],
  unitTypes = [],
  directions = [],
  onApply,
  onReset,
  onClose,
}) => {
  // Local state quản lý giá trị lọc
  const [localUnitCode, setLocalUnitCode] = useState(filters.unitCode || '');
  const [localPhaseId, setLocalPhaseId] = useState<number | ''>(filters.phaseId || '');
  const [localUnitTypeCode, setLocalUnitTypeCode] = useState(filters.unitTypeCode || '');
  const [localDirectionCode, setLocalDirectionCode] = useState(filters.directionCode || '');
  const [localMinArea, setLocalMinArea] = useState<number | undefined>(filters.minAreaLand);
  const [localMaxArea, setLocalMaxArea] = useState<number | undefined>(filters.maxAreaLand);
  const [localMinPrice, setLocalMinPrice] = useState<number | undefined>(filters.minBasePrice);
  const [localMaxPrice, setLocalMaxPrice] = useState<number | undefined>(filters.maxBasePrice);

  useEffect(() => {
    setLocalUnitCode(filters.unitCode || '');
    setLocalPhaseId(filters.phaseId || '');
    setLocalUnitTypeCode(filters.unitTypeCode || '');
    setLocalDirectionCode(filters.directionCode || '');
    setLocalMinArea(filters.minAreaLand);
    setLocalMaxArea(filters.maxAreaLand);
    setLocalMinPrice(filters.minBasePrice);
    setLocalMaxPrice(filters.maxBasePrice);
  }, [filters]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply({
      unitCode: localUnitCode.trim() || undefined,
      phaseId: typeof localPhaseId === 'number' ? localPhaseId : undefined,
      unitTypeCode: localUnitTypeCode || undefined,
      directionCode: localDirectionCode || undefined,
      minAreaLand: localMinArea,
      maxAreaLand: localMaxArea,
      minBasePrice: localMinPrice,
      maxBasePrice: localMaxPrice,
      pageNumber: 1,
    });
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const labelStyle = {
    fontWeight: 600,
    fontSize: '0.8125rem',
    color: '#1e293b',
    mb: 0.75,
    display: 'block',
  };

  const inputControlStyle = {
    bgcolor: '#ffffff',
    borderRadius: '8px',
    fontSize: '0.875rem',
    height: '40px',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.border || '#e2e8f0',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#94a3b8',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.primary || '#0284c7',
    },
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        mb: 3,
        borderRadius: '12px',
        bgcolor: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Tiêu đề BỘ LỌC NÂNG CAO chuẩn Figma */}
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 700,
          color: '#1d4ed8',
          fontSize: '0.9375rem',
          letterSpacing: 0.3,
          mb: 2.5,
        }}
      >
        BỘ LỌC NÂNG CAO
      </Typography>

      {/* 2 hàng ô lọc chuẩn Frame 197 (3 cột mỗi hàng trên desktop) */}
      <Grid container spacing={2.5}>
        {/* HÀNG 1: Ô 1 - Mã căn hộ */}
        <Grid item xs={12} sm={6} md={4}>
          <Typography sx={labelStyle}>Mã căn hộ</Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Nhập mã căn hộ"
            value={localUnitCode}
            onChange={(e) => setLocalUnitCode(e.target.value)}
            InputProps={{
              sx: inputControlStyle,
            }}
          />
        </Grid>

        {/* HÀNG 1: Ô 2 - Phân khu */}
        <Grid item xs={12} sm={6} md={4}>
          <Typography sx={labelStyle}>Phân khu</Typography>
          <FormControl fullWidth size="small">
            <Select
              displayEmpty
              value={localPhaseId}
              onChange={(e) => setLocalPhaseId(e.target.value as number | '')}
              sx={inputControlStyle}
              renderValue={(selected) => {
                if (!selected) {
                  return <span style={{ color: '#94a3b8' }}>Chọn phân khu</span>;
                }
                const found = phases.find((p) => p.id === selected);
                return found?.name || selected;
              }}
            >
              <MenuItem value="">Chọn phân khu</MenuItem>
              {phases.map((phase) => (
                <MenuItem key={phase.id} value={phase.id}>
                  {phase.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* HÀNG 1: Ô 3 - Loại căn */}
        <Grid item xs={12} sm={6} md={4}>
          <Typography sx={labelStyle}>Loại căn</Typography>
          <FormControl fullWidth size="small">
            <Select
              displayEmpty
              value={localUnitTypeCode}
              onChange={(e) => setLocalUnitTypeCode(e.target.value)}
              sx={inputControlStyle}
              renderValue={(selected) => {
                if (!selected) {
                  return <span style={{ color: '#94a3b8' }}>Chọn loại căn</span>;
                }
                const found = unitTypes.find((t) => t.code === selected);
                return found?.value || selected;
              }}
            >
              <MenuItem value="">Chọn loại căn</MenuItem>
              {unitTypes.map((type) => (
                <MenuItem key={type.code} value={type.code}>
                  {type.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* HÀNG 2: Ô 4 - Hướng đất */}
        <Grid item xs={12} sm={6} md={4}>
          <Typography sx={labelStyle}>Hướng đất</Typography>
          <FormControl fullWidth size="small">
            <Select
              displayEmpty
              value={localDirectionCode}
              onChange={(e) => setLocalDirectionCode(e.target.value)}
              sx={inputControlStyle}
              renderValue={(selected) => {
                if (!selected) {
                  return <span style={{ color: '#94a3b8' }}>Chọn hướng đất</span>;
                }
                const found = directions.find((d) => d.code === selected);
                return found?.value || selected;
              }}
            >
              <MenuItem value="">Chọn hướng đất</MenuItem>
              {directions.map((dir) => (
                <MenuItem key={dir.code} value={dir.code}>
                  {dir.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* HÀNG 2: Ô 5 - Diện tích (Popover chuẩn hình 3) */}
        <Grid item xs={12} sm={6} md={4}>
          <Typography sx={labelStyle}>Diện tích</Typography>
          <AreaRangeFilter
            minArea={localMinArea}
            maxArea={localMaxArea}
            onChange={(min, max) => {
              setLocalMinArea(min);
              setLocalMaxArea(max);
            }}
          />
        </Grid>

        {/* HÀNG 2: Ô 6 - Khoảng giá (Popover chuẩn hình 2) */}
        <Grid item xs={12} sm={6} md={4}>
          <Typography sx={labelStyle}>Khoảng giá</Typography>
          <PriceRangeFilter
            minPrice={localMinPrice}
            maxPrice={localMaxPrice}
            onChange={(min, max) => {
              setLocalMinPrice(min);
              setLocalMaxPrice(max);
            }}
          />
        </Grid>
      </Grid>

      {/* Nút "Đóng" và "Tìm kiếm" CĂN GIỮA chuẩn Figma hình 1, 2, 3 */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          mt: 3,
        }}
      >
        <Button
          variant="contained"
          type="button"
          onClick={handleClose}
          sx={{
            minWidth: 100,
            height: 38,
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.875rem',
            bgcolor: '#e2e8f0',
            color: '#334155',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#cbd5e1',
              boxShadow: 'none',
            },
          }}
        >
          Đóng
        </Button>

        <Button
          variant="contained"
          type="submit"
          sx={{
            minWidth: 110,
            height: 38,
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.875rem',
            background: 'linear-gradient(90deg, #1d4ed8 0%, #0284c7 100%)',
            boxShadow: '0 2px 6px rgba(2, 132, 199, 0.25)',
            '&:hover': {
              background: 'linear-gradient(90deg, #1e40af 0%, #0369a1 100%)',
            },
          }}
        >
          Tìm kiếm
        </Button>
      </Box>
    </Paper>
  );
};

export default AdvancedFilter;
