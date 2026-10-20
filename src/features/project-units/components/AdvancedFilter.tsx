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
import { AREA_RANGE_OPTIONS, PRICE_RANGE_OPTIONS } from '../constants';
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
  const [areaRangeIndex, setAreaRangeIndex] = useState<number>(0);
  const [priceRangeIndex, setPriceRangeIndex] = useState<number>(0);

  useEffect(() => {
    setLocalUnitCode(filters.unitCode || '');
    setLocalPhaseId(filters.phaseId || '');
    setLocalUnitTypeCode(filters.unitTypeCode || '');
    setLocalDirectionCode(filters.directionCode || '');

    // Tìm index khoảng diện tích
    const aIdx = AREA_RANGE_OPTIONS.findIndex(
      (opt) => opt.min === filters.minAreaLand && opt.max === filters.maxAreaLand
    );
    setAreaRangeIndex(aIdx >= 0 ? aIdx : 0);

    // Tìm index khoảng giá
    const pIdx = PRICE_RANGE_OPTIONS.findIndex(
      (opt) => opt.min === filters.minBasePrice && opt.max === filters.maxBasePrice
    );
    setPriceRangeIndex(pIdx >= 0 ? pIdx : 0);
  }, [filters]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedArea = AREA_RANGE_OPTIONS[areaRangeIndex];
    const selectedPrice = PRICE_RANGE_OPTIONS[priceRangeIndex];

    onApply({
      unitCode: localUnitCode.trim() || undefined,
      phaseId: typeof localPhaseId === 'number' ? localPhaseId : undefined,
      unitTypeCode: localUnitTypeCode || undefined,
      directionCode: localDirectionCode || undefined,
      minAreaLand: selectedArea?.min,
      maxAreaLand: selectedArea?.max,
      minBasePrice: selectedPrice?.min,
      maxBasePrice: selectedPrice?.max,
      pageNumber: 1,
    });
  };

  const handleReset = () => {
    setLocalUnitCode('');
    setLocalPhaseId('');
    setLocalUnitTypeCode('');
    setLocalDirectionCode('');
    setAreaRangeIndex(0);
    setPriceRangeIndex(0);

    if (onReset) {
      onReset();
    } else {
      onApply({
        unitCode: undefined,
        phaseId: undefined,
        unitTypeCode: undefined,
        directionCode: undefined,
        minAreaLand: undefined,
        maxAreaLand: undefined,
        minBasePrice: undefined,
        maxBasePrice: undefined,
        pageNumber: 1,
      });
    }
  };

  const labelStyle = {
    fontWeight: 600,
    fontSize: '0.8125rem',
    color: colors.textPrimary,
    mb: 0.75,
    display: 'block',
  };

  const inputControlStyle = {
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
      component="form"
      onSubmit={handleSubmit}
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: '12px',
        bgcolor: '#ffffff',
        border: `1px solid ${colors.border}`,
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Tiêu đề BỘ LỌC NÂNG CAO */}
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 700,
          color: colors.deepBlue,
          fontSize: '0.9375rem',
          letterSpacing: 0.3,
          mb: 2.5,
        }}
      >
        BỘ LỌC NÂNG CAO
      </Typography>

      {/* 2 hàng ô lọc (Mỗi hàng 3 ô trên màn hình desktop md) */}
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

        {/* HÀNG 2: Ô 5 - Diện tích */}
        <Grid item xs={12} sm={6} md={4}>
          <Typography sx={labelStyle}>Diện tích</Typography>
          <FormControl fullWidth size="small">
            <Select
              value={areaRangeIndex}
              onChange={(e) => setAreaRangeIndex(Number(e.target.value))}
              sx={inputControlStyle}
            >
              {AREA_RANGE_OPTIONS.map((opt, idx) => (
                <MenuItem key={idx} value={idx}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* HÀNG 2: Ô 6 - Khoảng giá */}
        <Grid item xs={12} sm={6} md={4}>
          <Typography sx={labelStyle}>Khoảng giá</Typography>
          <FormControl fullWidth size="small">
            <Select
              value={priceRangeIndex}
              onChange={(e) => setPriceRangeIndex(Number(e.target.value))}
              sx={inputControlStyle}
            >
              {PRICE_RANGE_OPTIONS.map((opt, idx) => (
                <MenuItem key={idx} value={idx}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Nút "Bỏ lọc" và "Tìm kiếm" CĂN GIỮA */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          mt: 3.5,
        }}
      >
        <Button
          variant="outlined"
          type="button"
          onClick={handleReset}
          sx={{
            minWidth: 120,
            height: 38,
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.875rem',
            color: colors.textSecondary,
            borderColor: '#cbd5e1',
            '&:hover': {
              borderColor: '#94a3b8',
              bgcolor: '#f8fafc',
            },
          }}
        >
          Bỏ lọc
        </Button>

        <Button
          variant="contained"
          type="submit"
          sx={{
            minWidth: 130,
            height: 38,
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.875rem',
            bgcolor: colors.primary,
            '&:hover': {
              bgcolor: colors.primaryHover,
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
