import React from 'react';
import { Box, Typography, FormControl, Select, MenuItem, Stack, Button } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { UNIT_SORT_OPTIONS } from '../constants';
import { UnitQueryParams, MasterDataItem } from '../types';

interface UnitsToolbarProps {
  filters: UnitQueryParams;
  statuses?: MasterDataItem[];
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
  onFilterChange: <K extends keyof UnitQueryParams>(key: K, value: UnitQueryParams[K]) => void;
}

export const UnitsToolbar: React.FC<UnitsToolbarProps> = ({
  filters,
  statuses = [],
  showAdvanced,
  onToggleAdvanced,
  onFilterChange,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2,
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: 0.5 }}>
        BẢNG HÀNG
      </Typography>

      <Stack direction="row" spacing={1.5} alignItems="center">
        {/* Dropdown Sắp xếp */}
        <FormControl size="small" sx={{ minWidth: 190 }}>
          <Select
            value={filters.sort || ''}
            onChange={(e) => onFilterChange('sort', e.target.value)}
            displayEmpty
            sx={{
              borderRadius: '8px',
              bgcolor: '#fff',
              fontSize: '0.875rem',
            }}
          >
            {UNIT_SORT_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Dropdown Trạng thái */}
        <FormControl size="small" sx={{ minWidth: 170 }}>
          <Select
            value={filters.statusCode || ''}
            onChange={(e) => onFilterChange('statusCode', e.target.value)}
            displayEmpty
            sx={{
              borderRadius: '8px',
              bgcolor: '#fff',
              fontSize: '0.875rem',
            }}
          >
            <MenuItem value="">Tất cả trạng thái</MenuItem>
            {statuses.map((item) => (
              <MenuItem key={item.code} value={item.code}>
                {item.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Nút Bộ lọc */}
        <Button
          variant="contained"
          startIcon={<FilterAltIcon />}
          onClick={onToggleAdvanced}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            bgcolor: '#0284c7',
            '&:hover': { bgcolor: '#0369a1' },
            px: 2.5,
          }}
        >
          Bộ lọc
        </Button>
      </Stack>
    </Box>
  );
};

export default UnitsToolbar;
