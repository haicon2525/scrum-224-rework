import React from 'react';
import { Box } from '@mui/material';

interface RealEstateLogoProps {
  color?: string;
  size?: number;
}

export const RealEstateLogo: React.FC<RealEstateLogoProps> = ({
  color = '#0284c7',
  size = 32,
}) => {
  return (
    <Box
      component="svg"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      sx={{
        width: size,
        height: size,
        display: 'inline-block',
        verticalAlign: 'middle',
      }}
    >
      {/* Cột 1 (trái, vát đỉnh) */}
      <path
        d="M3 13.5L10 9V29C10 30.6569 8.65685 32 7 32H6C4.34315 32 3 30.6569 3 29V13.5Z"
        fill={color}
      />
      {/* Cột 2 (giữa, cao nhất) */}
      <rect
        x="13"
        y="4"
        width="8"
        height="28"
        rx="4"
        fill={color}
      />
      {/* Cột 3 (phải, thấp nhất) */}
      <rect
        x="24"
        y="16"
        width="8"
        height="16"
        rx="4"
        fill={color}
      />
    </Box>
  );
};

export default RealEstateLogo;
