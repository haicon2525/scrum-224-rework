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
      <Typography variant="h6" sx={{ fontWeight: 800, color: '#1d4ed8', letterSpacing: 0.5 }}>
        BẢNG HÀNG
      </Typography>

      <Stack direction="row" spacing={1.5} alignItems="center">
        {/* Dropdown Sắp xếp */}
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <Select
            value={filters.sort || ''}
            onChange={(e) => onFilterChange('sort', e.target.value)}
            displayEmpty
            sx={{
              borderRadius: '8px',
              bgcolor: '#fff',
              fontSize: '0.875rem',
              height: '40px',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#e2e8f0',
              },
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
              height: '40px',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#e2e8f0',
              },
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

        {/* Nút Bộ lọc chuẩn Figma */}
        <Button
          variant="contained"
          startIcon={<FilterAltIcon sx={{ fontSize: '18px !important' }} />}
          onClick={onToggleAdvanced}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.875rem',
            height: '40px',
            background: 'linear-gradient(90deg, #1d4ed8 0%, #0284c7 100%)',
            boxShadow: '0 2px 6px rgba(2, 132, 199, 0.25)',
            '&:hover': {
              background: 'linear-gradient(90deg, #1e40af 0%, #0369a1 100%)',
            },
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
