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

interface AdvancedFilterProps {
  filters: UnitQueryParams;
  phases?: PhaseItem[];
  unitTypes?: MasterDataItem[];
  directions?: MasterDataItem[];
  onApply: (appliedFilters: Partial<UnitQueryParams>) => void;
  onClose: () => void;
}

export const AdvancedFilter: React.FC<AdvancedFilterProps> = ({
  filters,
  phases = [],
  unitTypes = [],
  directions = [],
  onApply,
  onClose,
}) => {
  // Local state để người dùng chọn xong bấm [Tìm kiếm] mới apply
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

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={0}
      sx={{
        p: 2.5,
        mb: 2.5,
        borderRadius: '12px',
        bgcolor: '#f8fafc',
        border: '1px solid #e2e8f0',
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0284c7', mb: 2 }}>
        BỘ LỌC NÂNG CAO
      </Typography>

      <Grid container spacing={2}>
        {/* 1. Mã căn hộ */}
        <Grid item xs={12} sm={6} md={2}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#475569', mb: 0.5, display: 'block' }}>
            Mã căn hộ
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Nhập mã căn hộ"
            value={localUnitCode}
            onChange={(e) => setLocalUnitCode(e.target.value)}
            sx={{ bgcolor: '#fff', borderRadius: '6px' }}
          />
        </Grid>

        {/* 2. Phân khu */}
        <Grid item xs={12} sm={6} md={2}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#475569', mb: 0.5, display: 'block' }}>
            Phân khu
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              displayEmpty
              value={localPhaseId}
              onChange={(e) => setLocalPhaseId(e.target.value as number | '')}
              sx={{ bgcolor: '#fff', borderRadius: '6px' }}
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

        {/* 3. Loại căn */}
        <Grid item xs={12} sm={6} md={2}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#475569', mb: 0.5, display: 'block' }}>
            Loại căn
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              displayEmpty
              value={localUnitTypeCode}
              onChange={(e) => setLocalUnitTypeCode(e.target.value)}
              sx={{ bgcolor: '#fff', borderRadius: '6px' }}
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

        {/* 4. Hướng đất */}
        <Grid item xs={12} sm={6} md={2}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#475569', mb: 0.5, display: 'block' }}>
            Hướng đất
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              displayEmpty
              value={localDirectionCode}
              onChange={(e) => setLocalDirectionCode(e.target.value)}
              sx={{ bgcolor: '#fff', borderRadius: '6px' }}
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

        {/* 5. Diện tích */}
        <Grid item xs={12} sm={6} md={2}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#475569', mb: 0.5, display: 'block' }}>
            Diện tích
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={areaRangeIndex}
              onChange={(e) => setAreaRangeIndex(Number(e.target.value))}
              sx={{ bgcolor: '#fff', borderRadius: '6px' }}
            >
              {AREA_RANGE_OPTIONS.map((opt, idx) => (
                <MenuItem key={idx} value={idx}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* 6. Khoảng giá */}
        <Grid item xs={12} sm={6} md={2}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#475569', mb: 0.5, display: 'block' }}>
            Khoảng giá
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={priceRangeIndex}
              onChange={(e) => setPriceRangeIndex(Number(e.target.value))}
              sx={{ bgcolor: '#fff', borderRadius: '6px' }}
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

      {/* Nút Đóng & Tìm kiếm */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            minWidth: 100,
            textTransform: 'none',
            color: '#64748b',
            borderColor: '#cbd5e1',
            borderRadius: '6px',
            '&:hover': { borderColor: '#94a3b8', bgcolor: '#f1f5f9' },
          }}
        >
          Đóng
        </Button>
        <Button
          variant="contained"
          type="submit"
          sx={{
            minWidth: 110,
            textTransform: 'none',
            fontWeight: 600,
            bgcolor: '#0284c7',
            borderRadius: '6px',
            '&:hover': { bgcolor: '#0369a1' },
          }}
        >
          Tìm kiếm
        </Button>
      </Box>
    </Paper>
  );
};

export default AdvancedFilter;
