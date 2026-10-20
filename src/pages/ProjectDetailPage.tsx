import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Tabs,
  Tab,
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Button,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import DomainIcon from '@mui/icons-material/Domain';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import UnitsSection from '../features/project-units/components/UnitsSection';
import AuthGate from '../components/auth/AuthGate';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '@/theme';

export const ProjectDetailPage: React.FC = () => {
  const { id = '1' } = useParams<{ id: string }>();
  const projectId = Number(id) || 1;
  const [activeTab, setActiveTab] = useState(4); // Tab "Quỹ căn" index 4
  const { user, isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Header Navigation Bar */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: 64 }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DomainIcon sx={{ color: colors.primary, fontSize: 32 }} />
            </Box>

            {/* Nav Links */}
            <Box sx={{ display: 'flex', gap: 4 }}>
              <Link href="#" underline="none" sx={{ color: '#475569', fontWeight: 600, fontSize: '0.875rem' }}>
                GIỚI THIỆU
              </Link>
              <Link href="#" underline="none" sx={{ color: colors.primary, fontWeight: 700, fontSize: '0.875rem' }}>
                DỰ ÁN
              </Link>
            </Box>

            {/* Online Status & User Profile */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981' }} />
                <Typography sx={{ fontSize: '0.8125rem', color: '#64748b' }}>
                  100 người đang Online
                </Typography>
              </Box>

              {isAuthenticated ? (
                <>
                  <IconButton onClick={handleMenuOpen} size="small" sx={{ ml: 1 }}>
                    <Avatar sx={{ width: 34, height: 34, bgcolor: colors.primary, fontSize: '0.875rem' }}>
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                  </IconButton>
                  <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                    <MenuItem disabled>{user?.username}</MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        logout();
                      }}
                    >
                      Đăng xuất
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <IconButton size="small" sx={{ bgcolor: '#f1f5f9', color: colors.primary }}>
                  <PersonOutlineIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Body */}
      <Container maxWidth="xl" sx={{ pt: 2.5, flex: 1 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1, fontSize: '0.8125rem' }}>
          <Link underline="hover" color="inherit" href="#">
            Dự án
          </Link>
          <Typography color="text.primary" sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>
            Vinhomes Ocean Park 3
          </Typography>
        </Breadcrumbs>

        {/* Header title & share button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: colors.deepBlue, letterSpacing: 0.5 }}>
              VINHOMES OCEAN PARK 3
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Theo dõi thông tin chi tiết và bảng giá, mặt bằng, tiến độ và chính sách bán hàng dự án VINHOMES OCEAN PARK 3.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<ShareOutlinedIcon />}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              bgcolor: colors.primary,
              '&:hover': { bgcolor: colors.primaryHover },
              px: 2.5,
            }}
          >
            Chia sẻ
          </Button>
        </Box>

        {/* Banner Hero Image */}
        <Box
          sx={{
            width: '100%',
            height: { xs: 200, sm: 280, md: 340 },
            borderRadius: '16px',
            overflow: 'hidden',
            mb: 2.5,
            position: 'relative',
            background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 50%, #f59e0b 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}
        >
          <Box sx={{ textAlign: 'center', color: '#ffffff', px: 2, zIndex: 1 }}>
            <Typography
              variant="h6"
              sx={{ fontStyle: 'italic', fontWeight: 500, letterSpacing: 1, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
            >
              Siêu quần thể đô thị biển
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                letterSpacing: 1.5,
                textShadow: '0 3px 8px rgba(0,0,0,0.4)',
                mt: 0.5,
                fontSize: { xs: '1.5rem', sm: '2.2rem', md: '2.8rem' },
              }}
            >
              VINHOMES OCEAN PARK 2 & 3
            </Typography>
          </Box>
        </Box>

        {/* Tabs Bar matching Figma */}
        <Box
          sx={{
            mb: 3,
            bgcolor: colors.primary,
            borderRadius: '10px',
            px: 1,
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                color: 'rgba(255,255,255,0.85)',
                fontWeight: 600,
                fontSize: '0.875rem',
                textTransform: 'none',
                minHeight: 48,
                '&.Mui-selected': {
                  color: '#ffffff',
                  bgcolor: 'rgba(255,255,255,0.18)',
                  borderRadius: '6px',
                },
              },
              '& .MuiTabs-indicator': {
                display: 'none',
              },
            }}
          >
            <Tab label="Tổng quan" />
            <Tab label="Vị trí" />
            <Tab label="Phân khu" />
            <Tab label="Mặt bằng quỹ căn" />
            <Tab label="Quỹ căn" />
            <Tab label="Chính sách bán hàng" />
            <Tab label="Tin tức" />
          </Tabs>
        </Box>

        {/* Tab contents */}
        {activeTab === 4 && (
          <AuthGate>
            <UnitsSection projectId={projectId} />
          </AuthGate>
        )}

        {activeTab !== 4 && (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography color="text.secondary">Nội dung tab đang được cập nhật...</Typography>
          </Box>
        )}
      </Container>

      {/* Footer matching Figma */}
      <Box sx={{ bgcolor: '#0284c7', color: '#ffffff', mt: 8, py: 4 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
            <Box sx={{ maxWidth: 360 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <DomainIcon sx={{ fontSize: 32 }} />
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                Nền tảng công nghệ tiên phong & dẫn đầu lĩnh vực kinh doanh bất động sản tại Việt Nam
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 2, opacity: 0.8 }}>
                Hotline: 0972 72 9999
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                Danh mục
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85, mb: 0.5 }}>• Giới thiệu</Typography>
              <Typography variant="body2" sx={{ opacity: 0.85, mb: 0.5 }}>• Dự án</Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>• Liên hệ</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                Kết nối
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                Facebook • Youtube • Instagram • Tiktok
              </Typography>
            </Box>
          </Box>

          <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.15)', mt: 3, pt: 2, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ opacity: 0.75 }}>
              © 2026 - Realestate. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default ProjectDetailPage;
