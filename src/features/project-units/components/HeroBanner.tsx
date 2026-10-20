import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Button,
  Stack,
  Skeleton,
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { colors } from '@/theme';

export interface HeroBannerProps {
  projectName?: string;
  projectDescription?: string;
  bannerUrl?: string;
  loading?: boolean;
  breadcrumbSlot?: React.ReactNode;
  projectSelectSlot?: React.ReactNode;
  onShare?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  projectName = '',
  projectDescription,
  bannerUrl,
  loading = false,
  breadcrumbSlot,
  projectSelectSlot,
  onShare,
}) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [bannerUrl]);

  const displayDesc =
    projectDescription ||
    (projectName
      ? `Theo dõi thông tin chi tiết và bảng giá, mặt bằng, tiến độ và chính sách bán hàng dự án ${projectName}.`
      : '');

  const effectiveBanner = bannerUrl || '/figma-banner.png';

  return (
    <Box sx={{ width: '100%', mb: 2.5 }}>
      {/* Top Bar: Breadcrumb */}
      {projectSelectSlot ? (
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 1.5,
            mb: 1.5,
          }}
        >
          {breadcrumbSlot || (
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" sx={{ color: '#94a3b8' }} />}
              aria-label="breadcrumb"
              sx={{ fontSize: '0.8125rem' }}
            >
              <Link underline="hover" color="primary" href="#projects">
                Dự án
              </Link>
              {loading ? (
                <Skeleton variant="text" width={140} height={20} sx={{ borderRadius: 1 }} />
              ) : (
                <Typography sx={{ color: 'text.secondary', fontSize: '0.8125rem', fontWeight: 600 }}>
                  {projectName}
                </Typography>
              )}
            </Breadcrumbs>
          )}
          <Box>{projectSelectSlot}</Box>
        </Stack>
      ) : breadcrumbSlot ? (
        <Box sx={{ mb: 1.5 }}>{breadcrumbSlot}</Box>
      ) : (
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" sx={{ color: '#94a3b8' }} />}
          aria-label="breadcrumb"
          sx={{ mb: 1.5, fontSize: '0.8125rem' }}
        >
          <Link underline="hover" color="primary" href="#projects">
            Dự án
          </Link>
          {loading ? (
            <Skeleton variant="text" width={140} height={20} sx={{ borderRadius: 1 }} />
          ) : (
            <Typography sx={{ color: 'text.secondary', fontSize: '0.8125rem', fontWeight: 600 }}>
              {projectName}
            </Typography>
          )}
        </Breadcrumbs>
      )}

      {/* Title & Share Button */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', md: 'center' },
          gap: 1.5,
          mb: 2,
        }}
      >
        <Box sx={{ maxWidth: { xs: '100%', md: '80%' } }}>
          {loading ? (
            <>
              <Skeleton variant="text" width="60%" height={38} sx={{ mb: 0.5, borderRadius: 1 }} />
              <Skeleton variant="text" width="90%" height={20} sx={{ borderRadius: 1 }} />
              <Skeleton variant="text" width="50%" height={20} sx={{ borderRadius: 1 }} />
            </>
          ) : (
            <>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: colors.deepBlue || 'primary.main',
                  fontSize: { xs: '1.35rem', md: '1.6rem' },
                  letterSpacing: '-0.3px',
                }}
              >
                {projectName?.toUpperCase()}
              </Typography>
              {displayDesc && (
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', fontSize: '0.82rem', mt: 0.5, lineHeight: 1.5 }}
                >
                  {displayDesc}
                </Typography>
              )}
            </>
          )}
        </Box>

        {/* Share Button */}
        <Button
          variant="contained"
          size="small"
          onClick={onShare}
          startIcon={<ShareIcon sx={{ fontSize: '16px !important' }} />}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            px: 2.5,
            py: 0.8,
            width: { xs: '100%', md: 'auto' },
            background: 'linear-gradient(90deg, #1d4ed8 0%, #0284c7 100%)',
            boxShadow: '0 3px 10px rgba(2, 132, 199, 0.3)',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            alignSelf: { xs: 'stretch', md: 'center' },
            '&:hover': {
              background: 'linear-gradient(90deg, #1e40af 0%, #0369a1 100%)',
            },
          }}
        >
          Chia sẻ
        </Button>
      </Stack>

      {/* Banner Image Container */}
      <Box
        sx={{
          borderRadius: { xs: 3, md: 4 },
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          width: '100%',
          bgcolor: '#f1f5f9',
        }}
      >
        {loading ? (
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{
              width: '100%',
              height: { xs: 200, sm: 260, md: 320 },
              borderRadius: { xs: 3, md: 4 },
            }}
          />
        ) : !imageError ? (
          <Box
            component="img"
            src={effectiveBanner}
            alt={projectName}
            onError={() => setImageError(true)}
            sx={{
              width: '100%',
              height: 'auto',
              display: 'block',
              borderRadius: { xs: 3, md: 4 },
            }}
          />
        ) : (
          /* Fallback banner gradient nếu ảnh lỗi hoặc không tìm thấy */
          <Box
            sx={{
              width: '100%',
              minHeight: { xs: 220, sm: 280, md: 340 },
              background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 50%, #f59e0b 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: '#ffffff',
              px: 2,
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontStyle: 'italic',
                  fontWeight: 500,
                  letterSpacing: 1,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                Dự án bất động sản cao cấp
              </Typography>
              {projectName && (
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
                  {projectName.toUpperCase()}
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HeroBanner;
