import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';

// SVG 4-ring flower icon cho "Tổng quan"
const OverviewIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <circle cx="12" cy="6" r="3" />
    <circle cx="12" cy="18" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="12" r="3" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

// SVG Tòa nhà cho "Quỹ căn"
const UnitsBuildingIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 21V5C4 3.89543 4.89543 3 6 3H12C13.1046 3 14 3.89543 14 5V21" />
    <path d="M14 10H18C19.1046 10 20 10.8954 20 12V21" />
    <line x1="2" y1="21" x2="22" y2="21" />
    <line x1="8" y1="7" x2="8" y2="7.01" strokeWidth="3" />
    <line x1="8" y1="11" x2="8" y2="11.01" strokeWidth="3" />
    <line x1="8" y1="15" x2="8" y2="15.01" strokeWidth="3" />
    <line x1="17" y1="14" x2="17" y2="14.01" strokeWidth="3" />
    <line x1="17" y1="17" x2="17" y2="17.01" strokeWidth="3" />
  </svg>
);

// SVG Văn bản có tích kiểm cho "Chính sách bán hàng"
const PolicyDocumentIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" />
    <polyline points="14 2 14 8 20 8" />
    <polyline points="9 15 11 17 15 13" strokeWidth="2.2" />
  </svg>
);

interface TabItem {
  id: number;
  label: string;
  icon: React.ReactNode;
}

const TABS: TabItem[] = [
  { id: 0, label: 'Tổng quan', icon: <OverviewIcon /> },
  { id: 1, label: 'Vị trí', icon: <LocationOnOutlinedIcon sx={{ fontSize: 18 }} /> },
  { id: 2, label: 'Phân khu', icon: <ExploreOutlinedIcon sx={{ fontSize: 18 }} /> },
  { id: 3, label: 'Mặt bằng quỹ căn', icon: <MapOutlinedIcon sx={{ fontSize: 18 }} /> },
  { id: 4, label: 'Quỹ căn', icon: <UnitsBuildingIcon /> },
  { id: 5, label: 'Chính sách bán hàng', icon: <PolicyDocumentIcon /> },
  { id: 6, label: 'Tin tức', icon: <PublicOutlinedIcon sx={{ fontSize: 18 }} /> },
];

interface ProjectTabsBarProps {
  activeTab: number;
  onTabChange: (tabId: number) => void;
}

export const ProjectTabsBar: React.FC<ProjectTabsBarProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        mb: 3,
        borderRadius: '16px',
        p: '6px 12px',
        background: 'linear-gradient(90deg, #1d4ed8 0%, #0284c7 46%, #009ee0 72%, #00b4d8 100%)',
        boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)',
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      }}
    >
      <Stack
        direction="row"
        spacing={{ xs: 1, sm: 1.5, md: 2 }}
        alignItems="center"
        justifyContent="space-between"
        sx={{
          minWidth: 'max-content',
          height: 48,
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <Box
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: isActive ? 2.5 : 1.75,
                py: isActive ? 0.85 : 0.75,
                borderRadius: '30px',
                cursor: 'pointer',
                userSelect: 'none',
                color: '#ffffff',
                transition: 'all 0.2s ease-in-out',
                bgcolor: isActive ? 'rgba(255, 255, 255, 0.18)' : 'transparent',
                border: isActive
                  ? '1px solid rgba(255, 255, 255, 0.45)'
                  : '1px solid transparent',
                backdropFilter: isActive ? 'blur(6px)' : 'none',
                '&:hover': {
                  bgcolor: isActive
                    ? 'rgba(255, 255, 255, 0.22)'
                    : 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              {/* Icon của Tab */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  opacity: isActive ? 1 : 0.9,
                }}
              >
                {tab.icon}
              </Box>

              {/* Tên Tab */}
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  color: '#ffffff',
                  letterSpacing: 0.1,
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </Typography>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export default ProjectTabsBar;
