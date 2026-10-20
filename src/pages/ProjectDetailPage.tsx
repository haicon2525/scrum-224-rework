import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
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
  CircularProgress,
} from '@mui/material';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import UnitsSection from '../features/project-units/components/UnitsSection';
import AuthGate from '../components/auth/AuthGate';
import { useAuth } from '../contexts/AuthContext';
import Footer from '../components/layout/Footer';
import ProjectTabsBar from '../components/layout/ProjectTabsBar';
import HeroBanner from '../features/project-units/components/HeroBanner';
import RealEstateLogo from '../components/common/RealEstateLogo';
import { colors } from '@/theme';
import httpClient from '@/lib/httpClient';

export interface ProjectItem {
  id: number;
  code: string;
  name: string;
  address?: string;
  shortDescription?: string;
  fileInfo?: {
    id: number;
    fullLink?: string;
    originalName?: string;
  } | null;
}

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const rawId = Number(id);

  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [currentProject, setCurrentProject] = useState<ProjectItem | null>(null);
  const [loadingProject, setLoadingProject] = useState<boolean>(true);

  const [activeTab, setActiveTab] = useState(4); // Tab "Quỹ căn" index 4
  const { user, isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // 1. Tải danh sách dự án để chọn và lấy thông tin chi tiết
  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      try {
        setLoadingProject(true);
        const res = await httpClient.get('/portal/projects/search', {
          params: { pageNumber: 0, pageSize: 50 },
        });

        const list: ProjectItem[] = res.data?.data || res.data || [];
        if (!isMounted) return;
        setProjects(list);

        if (list.length > 0) {
          // Tìm dự án theo ID trên URL, nếu không thấy thì ưu tiên Ocean Park 2 & 3 hoặc lấy dự án đầu tiên
          let found = list.find((p) => p.id === rawId);
          if (!found) {
            found =
              list.find(
                (p) =>
                  p.name.toLowerCase().includes('ocean park 2 & 3') ||
                  p.name.toLowerCase().includes('ocean park 3')
              ) || list[0];
          }

          setCurrentProject(found);

          // Nếu URL ID khác ID thực tế tìm được, cập nhật lại URL
          if (found && found.id !== rawId) {
            navigate(`/projects/${found.id}`, { replace: true });
          }
        }
      } catch (err) {
        console.error('Lỗi khi tải dự án:', err);
      } finally {
        if (isMounted) setLoadingProject(false);
      }
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, [rawId, navigate]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const projectName = currentProject?.name || 'VINHOMES OCEAN PARK 3';
  const projectDesc =
    currentProject?.shortDescription ||
    `Theo dõi thông tin chi tiết và bảng giá, mặt bằng, tiến độ và chính sách bán hàng dự án ${projectName}.`;
  const bannerImgUrl = currentProject?.fileInfo?.fullLink;
  const currentProjectId = currentProject?.id || rawId || 65;

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
      <Container maxWidth="xl" sx={{ pt: 2.5, flex: 1 }}>
        {/* Hero Banner Component */}
        <HeroBanner
          projectName={projectName}
          projectDescription={projectDesc}
          bannerUrl={bannerImgUrl}
          loading={loadingProject}
        />

        {/* Tabs Bar chuẩn Figma */}
        <ProjectTabsBar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab contents */}
        {activeTab === 4 && (
          <AuthGate>
            <UnitsSection projectId={currentProjectId} />
          </AuthGate>
        )}

        {activeTab !== 4 && (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography color="text.secondary">Nội dung tab đang được cập nhật...</Typography>
          </Box>
        )}
      </Container>

      {/* Footer chuẩn Figma */}
      <Footer />
    </Box>
  );
};

export default ProjectDetailPage;
