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
} from '@mui/material';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import UnitsSection from '../features/project-units/components/UnitsSection';
import AuthGate from '../components/auth/AuthGate';

export const ProjectDetailPage: React.FC = () => {
  const { id = '1' } = useParams<{ id: string }>();
  const projectId = Number(id) || 1;
  const [activeTab, setActiveTab] = useState(4); // Tab "Quỹ căn" index 4

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh', pb: 8 }}>
      <Container maxWidth="xl" sx={{ pt: 3 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1.5, fontSize: '0.875rem' }}>
          <Link underline="hover" color="inherit" href="#">
            Dự án
          </Link>
          <Typography color="text.primary" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
            Vinhomes Ocean Park 3
          </Typography>
        </Breadcrumbs>

        {/* Header title & share button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0369a1', letterSpacing: 0.5 }}>
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
              bgcolor: '#0284c7',
              '&:hover': { bgcolor: '#0369a1' },
            }}
          >
            Chia sẻ
          </Button>
        </Box>

        {/* Tabs Bar matching Figma */}
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            mb: 3,
            bgcolor: '#0284c7',
            borderRadius: '8px',
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
                  color: '#fff',
                  bgcolor: 'rgba(255,255,255,0.15)',
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
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography color="text.secondary">Nội dung đang được cập nhật...</Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ProjectDetailPage;
