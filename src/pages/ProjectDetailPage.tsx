import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Link,
  Button,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Paper,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import UnitsSection from '../features/project-units/components/UnitsSection';
import AuthGate from '../components/auth/AuthGate';
import { useAuth } from '../contexts/AuthContext';
import Footer from '../components/layout/Footer';
import ProjectTabsBar from '../components/layout/ProjectTabsBar';
import HeroBanner from '../features/project-units/components/HeroBanner';
import RealEstateLogo from '../components/common/RealEstateLogo';
import { colors } from '@/theme';
import { useProjectDetail } from '../features/project-units/hooks/useProjectDetail';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const projectId = Number(id);

  const [activeTab, setActiveTab] = useState(4); // Tab "Quỹ căn" index 4
  const { user, isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Gọi hook useProjectDetail(projectId) từ API GET /portal/projects/detail?id=
  const {
    data: projectResponse,
    isLoading: loadingProject,
    isError,
    error,
  } = useProjectDetail(projectId);

  const project = projectResponse?.data;
  const isNotFound = isError && (error as any)?.response?.status === 404;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const projectName = project?.name || '';
  const projectDesc = project?.shortDescription || '';
  const bannerImgUrl = project?.fileInfo?.fullLink;

  return (
    <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Header Navigation Bar */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: 64 }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <RealEstateLogo color={colors.primary} size={34} />
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
      {isNotFound ? (
        <Container maxWidth="sm" sx={{ py: 12, textAlign: 'center', flex: 1 }}>
          <Paper elevation={0} sx={{ p: 5, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
            <ErrorOutlineIcon sx={{ fontSize: 60, color: '#94a3b8', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 1.5 }}>
              Không tìm thấy dự án
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
              Dự án với mã ID {id} không tồn tại hoặc đã bị gỡ bỏ.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/projects/65')}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 600,
                background: 'linear-gradient(90deg, #1d4ed8 0%, #0284c7 100%)',
              }}
            >
              Về dự án 65
            </Button>
          </Paper>
        </Container>
      ) : (
        <Container maxWidth="xl" sx={{ pt: 2.5, flex: 1 }}>
          {/* Hero Banner Component: hiển thị Skeleton khi loading */}
          <HeroBanner
            projectName={projectName}
            projectDescription={projectDesc}
            bannerUrl={bannerImgUrl}
            loading={loadingProject}
          />

          {/* Tabs Bar chuẩn Figma */}
          <ProjectTabsBar activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Tab contents - Thêm key={projectId} để reset toàn bộ state khi đổi dự án */}
          {activeTab === 4 && (
            <AuthGate>
              <UnitsSection key={projectId} projectId={projectId} />
            </AuthGate>
          )}

          {activeTab !== 4 && (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <Typography color="text.secondary">Nội dung tab đang được cập nhật...</Typography>
            </Box>
          )}
        </Container>
      )}

      {/* Footer chuẩn Figma */}
      <Footer />
    </Box>
  );
};

export default ProjectDetailPage;
