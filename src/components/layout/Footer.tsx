import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Stack,
  IconButton,
} from '@mui/material';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import RealEstateLogo from '../common/RealEstateLogo';

// SVG icon cho TikTok
const TikTokIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47V10.89a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.32z" />
  </svg>
);

// SVG icon cho X (Twitter)
const XTwitterIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        mt: 8,
        pt: 5,
        pb: 3,
        background: 'linear-gradient(105deg, #026bb4 0%, #0284c7 48%, #0ea5e9 100%)',
        color: '#ffffff',
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2.5, sm: 3 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: { xs: 3.5, md: 5 },
          }}
        >
          {/* CỘT 1: Logo & Thông tin liên hệ */}
          <Box sx={{ width: { xs: '100%', md: 'auto' }, maxWidth: { xs: '100%', md: 380 }, flex: { xs: 'none', md: '1 1 320px' } }}>
            {/* Logo trắng */}
            <Box sx={{ display: 'inline-flex', alignItems: 'center', mb: 2 }}>
              <RealEstateLogo color="#ffffff" size={38} />
            </Box>

            {/* Slogan */}
            <Typography
              variant="body2"
              sx={{
                fontSize: '0.875rem',
                fontWeight: 400,
                lineHeight: 1.6,
                mb: 2.5,
                color: 'rgba(255, 255, 255, 0.95)',
              }}
            >
              Nền tảng công nghệ tiên phong &amp; dẫn đầu
              <br />
              lĩnh vực kinh doanhbất động sản tại Việt Nam
            </Typography>

            {/* Danh sách liên hệ có icon */}
            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <PhoneIphoneOutlinedIcon sx={{ fontSize: 18, color: '#ffffff' }} />
                <Typography sx={{ fontSize: '0.8125rem', color: '#ffffff', fontWeight: 500 }}>
                  0972 72 9999
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <MailOutlineIcon sx={{ fontSize: 18, color: '#ffffff' }} />
                <Typography sx={{ fontSize: '0.8125rem', color: '#ffffff' }}>
                  Contact@gmail.com
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <LocationOnOutlinedIcon sx={{ fontSize: 18, color: '#ffffff', mt: 0.25, flexShrink: 0 }} />
                <Typography sx={{ fontSize: '0.8125rem', color: '#ffffff', lineHeight: 1.45 }}>
                  SB24-38, Sao Biển 24, KĐT Vinhomes Ocean Park,
                  <br />
                  Xã Gia Lâm, TP Hà Nội, Việt Nam
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* CỘT 2: Danh mục & Kết nối mạng xã hội */}
          <Box sx={{ minWidth: 200, flex: '1 1 200px' }}>
            {/* Danh mục */}
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                fontSize: '0.9375rem',
                color: '#ffffff',
                mb: 1.5,
              }}
            >
              Danh mục
            </Typography>

            <Stack spacing={0.75} sx={{ mb: 3 }}>
              <Link
                href="#"
                underline="none"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '0.8125rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  '&:hover': { color: '#ffffff', textDecoration: 'underline' },
                }}
              >
                <span>•</span> Giới thiệu
              </Link>
              <Link
                href="#"
                underline="none"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '0.8125rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  '&:hover': { color: '#ffffff', textDecoration: 'underline' },
                }}
              >
                <span>•</span> Dự án
              </Link>
              <Link
                href="#"
                underline="none"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '0.8125rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  '&:hover': { color: '#ffffff', textDecoration: 'underline' },
                }}
              >
                <span>•</span> Liên hệ
              </Link>
            </Stack>

            {/* Kết nối */}
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                fontSize: '0.9375rem',
                color: '#ffffff',
                mb: 1.5,
              }}
            >
              Kết nối
            </Typography>

            <Stack direction="row" spacing={1.25} alignItems="center">
              {/* Facebook */}
              <IconButton
                size="small"
                sx={{
                  width: 30,
                  height: 30,
                  bgcolor: '#ffffff',
                  color: '#0284c7',
                  '&:hover': { bgcolor: '#f1f5f9' },
                }}
              >
                <FacebookIcon sx={{ fontSize: 18 }} />
              </IconButton>

              {/* YouTube */}
              <IconButton
                size="small"
                sx={{
                  width: 30,
                  height: 30,
                  bgcolor: '#ffffff',
                  color: '#0284c7',
                  '&:hover': { bgcolor: '#f1f5f9' },
                }}
              >
                <YouTubeIcon sx={{ fontSize: 18 }} />
              </IconButton>

              {/* Instagram */}
              <IconButton
                size="small"
                sx={{
                  width: 30,
                  height: 30,
                  bgcolor: '#ffffff',
                  color: '#0284c7',
                  '&:hover': { bgcolor: '#f1f5f9' },
                }}
              >
                <InstagramIcon sx={{ fontSize: 17 }} />
              </IconButton>

              {/* TikTok */}
              <IconButton
                size="small"
                sx={{
                  width: 30,
                  height: 30,
                  bgcolor: '#ffffff',
                  color: '#0284c7',
                  '&:hover': { bgcolor: '#f1f5f9' },
                }}
              >
                <TikTokIcon />
              </IconButton>

              {/* X / Twitter */}
              <IconButton
                size="small"
                sx={{
                  width: 30,
                  height: 30,
                  bgcolor: '#ffffff',
                  color: '#0284c7',
                  '&:hover': { bgcolor: '#f1f5f9' },
                }}
              >
                <XTwitterIcon />
              </IconButton>
            </Stack>
          </Box>

          {/* CỘT 3: Bản đồ thu nhỏ thật có thể tương tác */}
          <Box
            sx={{
              width: { xs: '100%', sm: 340, md: 360 },
              height: 190,
              borderRadius: '16px',
              overflow: 'hidden',
              bgcolor: '#f5f7f9',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
              position: 'relative',
              flexShrink: 0,
              border: '2px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            {/* Nhúng bản đồ Google Maps tương tác thật */}
            <iframe
              title="Bản đồ Vinhomes Ocean Park"
              src="https://maps.google.com/maps?q=Vinhomes%20Ocean%20Park,%20Gia%20L%C3%A2m,%20H%C3%A0%20N%E1%BB%99i&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{
                border: 0,
                display: 'block',
                filter: 'contrast(1.05) saturate(1.1)',
              }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Marker cam nổi bật "Chè Chang Hi - Vinhomes Ocean Park" */}
            <Box
              component="a"
              href="https://www.google.com/maps/search/?api=1&query=Ch%C3%A8+Chang+Hi+Vinhomes+Ocean+Park"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                bgcolor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(4px)',
                px: 1.25,
                py: 0.5,
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                textDecoration: 'none',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                },
                zIndex: 2,
              }}
            >
              {/* Vòng tròn màu cam */}
              <Box
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  bgcolor: '#ea580c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: 11,
                  boxShadow: '0 1px 3px rgba(234, 88, 12, 0.4)',
                }}
              >
                ☕
              </Box>

              {/* Nhãn địa điểm */}
              <Box>
                <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, color: '#ea580c', lineHeight: 1.2 }}>
                  Chè Chang Hi
                </Typography>
                <Typography sx={{ fontSize: '0.625rem', color: '#64748b', lineHeight: 1.1 }}>
                  Vinhomes Ocean Park
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* ĐƯỜNG KẺ NGĂN CÁCH MỎNG */}
        <Box
          sx={{
            borderTop: '1px solid rgba(255, 255, 255, 0.35)',
            mt: 4,
            pt: 2.5,
          }}
        >
          {/* Dòng bản quyền copyright */}
          <Typography
            sx={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#ffffff',
              letterSpacing: 0.2,
            }}
          >
            © 2026 - Realestate. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
