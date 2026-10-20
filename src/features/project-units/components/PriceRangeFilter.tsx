import React from 'react';
import { Box, Typography, Slider } from '@mui/material';

interface PriceRangeFilterProps {
  value?: [number, number];
  onChange?: (value: [number, number]) => void;
  min?: number;
  max?: number;
}

export const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  value = [0, 20_000_000_000],
  onChange,
  min = 0,
  max = 20_000_000_000,
}) => {
  return (
    <Box sx={{ minWidth: 200, px: 1 }}>
      <Typography variant="caption" color="text.secondary">
        Khoảng giá
      </Typography>
      <Slider
        value={value}
        onChange={(_, val) => onChange?.(val as [number, number])}
        valueLabelDisplay="auto"
        min={min}
        max={max}
      />
    </Box>
  );
};

export default PriceRangeFilter;
