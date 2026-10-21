import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
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
import ProjectMasterPlanView from '../features/project-units/components/ProjectMasterPlanView';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const projectId = Number(id);

  const tabQuery = searchParams.get('tab');
  const unitIdQuery = searchParams.get('unitId');
  const unitCodeQuery = searchParams.get('unitCode');

  // Khởi tạo tab từ query param ?tab=3 hoặc mặc định là 4 (Quỹ căn)
  const initialTab = tabQuery != null ? Number(tabQuery) : 4;
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (tabQuery != null) {
      setActiveTab(Number(tabQuery));
    }
  }, [tabQuery]);

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

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Header Navigation Bar */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: { xs: 56, sm: 64 } }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <RealEstateLogo color={colors.primary} size={32} />
            </Box>

            {/* Nav Links (Desktop only) */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
              <Link href="#" underline="none" sx={{ color: '#475569', fontWeight: 600, fontSize: '0.875rem' }}>
                GIỚI THIỆU
              </Link>
              <Link href="#" underline="none" sx={{ color: colors.primary, fontWeight: 700, fontSize: '0.875rem' }}>
                DỰ ÁN
              </Link>
            </Box>

            {/* Online Status & User Profile / Mobile Hamburger */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981' }} />
                <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.8125rem' }, color: '#64748b', whiteSpace: 'nowrap' }}>
                  100 người đang Online
                </Typography>
              </Box>

              {/* User Profile on Desktop */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
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

              {/* Hamburger Menu on Mobile */}
              <IconButton
                onClick={() => setMobileDrawerOpen(true)}
                size="small"
                sx={{
                  display: { xs: 'inline-flex', md: 'none' },
                  color: colors.primary,
                  p: 0.75,
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer Menu */}
      <Menu
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiPaper-root': {
            width: 220,
            mt: 6,
            borderRadius: 2,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          },
        }}
      >
        <MenuItem onClick={() => setMobileDrawerOpen(false)} sx={{ fontWeight: 600, color: '#475569' }}>
          GIỚI THIỆU
        </MenuItem>
        <MenuItem onClick={() => setMobileDrawerOpen(false)} sx={{ fontWeight: 700, color: colors.primary }}>
          DỰ ÁN
        </MenuItem>
        {isAuthenticated ? (
          <>
            <MenuItem disabled sx={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Tài khoản: {user?.username}
            </MenuItem>
            <MenuItem
              onClick={() => {
                setMobileDrawerOpen(false);
                logout();
              }}
              sx={{ color: '#ef4444', fontWeight: 600 }}
            >
              Đăng xuất
            </MenuItem>
          </>
        ) : null}
      </Menu>

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
        <Container maxWidth="xl" sx={{ pt: { xs: 1.5, sm: 2.5 }, flex: 1 }}>
          {/* Hero Banner Component: hiển thị Skeleton khi loading */}
          <HeroBanner
            projectName={projectName}
            projectDescription={projectDesc}
            bannerUrl={bannerImgUrl}
            loading={loadingProject}
          />

          {/* Tabs Bar chuẩn Figma */}
          <ProjectTabsBar
            activeTab={activeTab}
            onTabChange={(tabId) => {
              setActiveTab(tabId);
              // Cập nhật URL param
              setSearchParams({ tab: String(tabId) });
            }}
          />

          {/* Tab 3: Mặt bằng quỹ căn */}
          {activeTab === 3 && (
            <ProjectMasterPlanView
              projectId={projectId}
              highlightedUnitId={unitIdQuery ? Number(unitIdQuery) : undefined}
              highlightedUnitCode={unitCodeQuery || undefined}
              onBackToUnitsTab={() => {
                setActiveTab(4);
                setSearchParams({ tab: '4' });
              }}
            />
          )}

          {/* Tab 4: Quỹ căn - Thêm key={projectId} để reset toàn bộ state khi đổi dự án */}
          {activeTab === 4 && (
            <AuthGate>
              <UnitsSection key={projectId} projectId={projectId} />
            </AuthGate>
          )}

          {activeTab !== 3 && activeTab !== 4 && (
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
