import React from 'react';
import { Box, Typography, Slider } from '@mui/material';

interface AreaRangeFilterProps {
  value?: [number, number];
  onChange?: (value: [number, number]) => void;
  min?: number;
  max?: number;
}

export const AreaRangeFilter: React.FC<AreaRangeFilterProps> = ({
  value = [30, 200],
  onChange,
  min = 30,
  max = 200,
}) => {
  return (
    <Box sx={{ minWidth: 200, px: 1 }}>
      <Typography variant="caption" color="text.secondary">
        Diện tích (m²)
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

export default AreaRangeFilter;
