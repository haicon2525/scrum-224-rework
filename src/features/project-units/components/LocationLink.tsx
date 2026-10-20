import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { colors } from '@/theme';

interface UnitActionIconsProps {
  isHot?: boolean | null;
  onLocationClick?: () => void;
}

export const UnitActionIcons: React.FC<UnitActionIconsProps> = ({ isHot, onLocationClick }) => {
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 0.75 }}>
      {isHot ? (
        <Tooltip title="Căn nổi bật (Hot)">
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 22,
              height: 22,
              borderRadius: '50%',
              bgcolor: '#fee2e2',
            }}
          >
            <LocalFireDepartmentIcon sx={{ color: colors.hotIcon, fontSize: 16 }} />
          </Box>
        </Tooltip>
      ) : (
        <Box sx={{ width: 22, height: 22 }} />
      )}

      <Tooltip title="Xem vị trí mặt bằng">
        <IconButton
          size="small"
          onClick={onLocationClick}
          sx={{
            color: colors.locationPin,
            p: 0.25,
            '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.08)' },
          }}
        >
          <LocationOnOutlinedIcon sx={{ fontSize: 19 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default UnitActionIcons;
