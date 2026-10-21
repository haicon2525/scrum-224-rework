import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Grid,
  Box,
  Button,
  CircularProgress,
  Stack,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { UnitItem } from '../types';
import StatusChip from './StatusChip';
import { unitApi } from '../api/unitApi';
import { formatPriceBillion } from '../utils/formatPrice';
import { formatDirections } from '../utils/formatDirections';
import { colors } from '@/theme';

interface UnitDetailModalProps {
  unit: UnitItem | null;
  open: boolean;
  onClose: () => void;
  unitTypeMap?: Record<string, string>;
  directionMap?: Record<string, string>;
  phaseMap?: Record<string, string>;
  statusMap?: Record<string, string>;
  onLocationClick?: (unit: UnitItem) => void;
}

// Hàm trích xuất link ảnh từ response API (hỗ trợ cả dạng string, object fileInfo, fullLink...)
const extractImageUrl = (item: unknown): string => {
  if (!item) return '';
  if (typeof item === 'string') {
    return item.trim();
  }
  if (typeof item === 'object') {
    const obj = item as Record<string, any>;
    return (
      obj.fullLink ||
      obj.fileInfo?.fullLink ||
      obj.url ||
      obj.link ||
      obj.filePath ||
      obj.originalLink ||
      ''
    );
  }
  return '';
};

export const UnitDetailModal: React.FC<UnitDetailModalProps> = ({
  unit,
  open,
  onClose,
  unitTypeMap = {},
  directionMap = {},
  phaseMap = {},
  statusMap = {},
  onLocationClick,
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Khi chọn căn hộ mới, gọi API lấy hình ảnh của căn hộ đó
  useEffect(() => {
    if (!unit?.id || !open) {
      setImages([]);
      setCurrentImageIndex(0);
      setImageError(false);
      return;
    }

    let isMounted = true;
    const fetchImages = async () => {
      try {
        setLoadingImages(true);
        setImageError(false);
        const res = await unitApi.getUnitImages(unit.id);
        if (isMounted) {
          const rawList = Array.isArray(res.data) ? res.data : [];
          // Trích xuất fullLink từ mảng object hoặc chuỗi
          const urlList = rawList.map(extractImageUrl).filter(Boolean);
          setImages(urlList);
          setCurrentImageIndex(0);
        }
      } catch (err) {
        console.error('Lỗi khi tải hình ảnh căn:', err);
        if (isMounted) {
          setImages([]);
        }
      } finally {
        if (isMounted) {
          setLoadingImages(false);
        }
      }
    };

    fetchImages();

    return () => {
      isMounted = false;
    };
  }, [unit?.id, open]);

  if (!unit) return null;

  const statusLabel =
    unit.statusName || (unit.statusCode ? statusMap[unit.statusCode] || unit.statusCode : '-');
  const unitTypeLabel =
    unit.unitTypeName || (unit.unitTypeCode ? unitTypeMap[unit.unitTypeCode] || unit.unitTypeCode : '-');
  const phaseLabel =
    unit.phaseName || (unit.phaseId ? phaseMap[unit.phaseId] || `Phân khu ${unit.phaseId}` : '-');
  const directionLabel = formatDirections(unit.directions || unit.directionCodes, directionMap);

  // Danh sách các thông số kỹ thuật căn hộ
  const specs = [
    { label: 'Dự án', value: unit.projectName || 'Vinhomes Ocean Park 3' },
    { label: 'Phân khu', value: phaseLabel },
    { label: 'Loại hình', value: unitTypeLabel },
    { label: 'Hướng căn', value: directionLabel },
    { label: 'Diện tích đất', value: unit.areaLand != null ? `${unit.areaLand} m²` : '-' },
    { label: 'Diện tích xây dựng', value: unit.areaBuilding != null ? `${unit.areaBuilding} m²` : '-' },
    ...(unit.buildingName ? [{ label: 'Tòa / Dãy', value: unit.buildingName }] : []),
    ...(unit.floorNumber != null ? [{ label: 'Tầng', value: unit.floorName || `Tầng ${unit.floorNumber}` }] : []),
    { label: 'Nguồn hàng', value: unit.source === 'TRANSFER' ? 'Chuyển nhượng' : 'Tiêu chuẩn' },
  ];

  const handlePrevImage = () => {
    setImageError(false);
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = () => {
    setImageError(false);
    setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
          overflow: 'hidden',
        },
      }}
    >
      {/* 1. Header Modal */}
      <DialogTitle
        sx={{
          m: 0,
          p: 2.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${colors.borderLight}`,
          bgcolor: '#fafafa',
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
          <Typography variant="h6" sx={{ fontWeight: 800, color: colors.deepBlue, letterSpacing: 0.5 }}>
            CĂN HỘ {unit.unitCode}
          </Typography>

          <StatusChip statusCode={unit.statusCode} label={statusLabel} />

          {unit.isHot && (
            <Chip
              icon={<WhatshotIcon sx={{ color: '#ffffff !important', fontSize: '16px !important' }} />}
              label="CĂN HOT"
              size="small"
              sx={{
                bgcolor: colors.hotIcon,
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.75rem',
                height: 24,
              }}
            />
          )}
        </Stack>

        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: '#64748b',
            '&:hover': { bgcolor: '#f1f5f9', color: '#1e293b' },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* 2. Nội dung chi tiết (Body) */}
      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Grid container spacing={3}>
          {/* Cột trái: Khung hiển thị Hình ảnh / Bản vẽ căn hộ */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                width: '100%',
                height: 280,
                bgcolor: '#f8fafc',
                borderRadius: '12px',
                border: `1px solid ${colors.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {loadingImages ? (
                <CircularProgress size={36} sx={{ color: colors.primary }} />
              ) : images.length > 0 && !imageError ? (
                <>
                  <Box
                    component="img"
                    src={images[currentImageIndex]}
                    alt={`Bản vẽ căn ${unit.unitCode}`}
                    onError={() => setImageError(true)}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      bgcolor: '#ffffff',
                    }}
                  />

                  {images.length > 1 && (
                    <>
                      <IconButton
                        size="small"
                        onClick={handlePrevImage}
                        sx={{
                          position: 'absolute',
                          left: 8,
                          bgcolor: 'rgba(255,255,255,0.85)',
                          '&:hover': { bgcolor: '#ffffff' },
                          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                        }}
                      >
                        <ChevronLeftIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={handleNextImage}
                        sx={{
                          position: 'absolute',
                          right: 8,
                          bgcolor: 'rgba(255,255,255,0.85)',
                          '&:hover': { bgcolor: '#ffffff' },
                          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                        }}
                      >
                        <ChevronRightIcon />
                      </IconButton>

                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          bgcolor: 'rgba(0,0,0,0.6)',
                          color: '#ffffff',
                          px: 1.5,
                          py: 0.25,
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        {currentImageIndex + 1} / {images.length}
                      </Box>
                    </>
                  )}
                </>
              ) : (
                <Stack alignItems="center" spacing={1} sx={{ color: '#94a3b8' }}>
                  <HomeWorkOutlinedIcon sx={{ fontSize: 56, opacity: 0.6 }} />
                  <Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>
                    {imageError ? 'Không thể tải hình ảnh của căn này' : 'Chưa có hình ảnh bản vẽ cho căn này'}
                  </Typography>
                </Stack>
              )}
            </Box>

            {/* Thumbnail danh sách ảnh nếu có nhiều ảnh */}
            {images.length > 1 && !imageError && (
              <Stack direction="row" spacing={1} sx={{ mt: 1.5, overflowX: 'auto', pb: 0.5 }}>
                {images.map((imgUrl, idx) => (
                  <Box
                    key={idx}
                    component="img"
                    src={imgUrl}
                    onClick={() => {
                      setImageError(false);
                      setCurrentImageIndex(idx);
                    }}
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: '6px',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      border: idx === currentImageIndex ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`,
                      opacity: idx === currentImageIndex ? 1 : 0.65,
                      '&:hover': { opacity: 1 },
                    }}
                  />
                ))}
              </Stack>
            )}
          </Grid>

          {/* Cột phải: Thông số chi tiết căn hộ */}
          <Grid item xs={12} md={6}>
            {/* Giá bán niêm yết */}
            <Box
              sx={{
                p: 2,
                mb: 2.5,
                borderRadius: '10px',
                bgcolor: '#eff6ff',
                border: '1px solid #bfdbfe',
              }}
            >
              <Typography variant="caption" sx={{ color: '#1e40af', fontWeight: 600, textTransform: 'uppercase' }}>
                Giá bán niêm yết
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#1d4ed8', mt: 0.25 }}>
                {formatPriceBillion(unit.basePrice)}
              </Typography>
            </Box>

            {/* Lưới thông số dạng hàng */}
            <Stack spacing={1.5}>
              {specs.map((item, idx) => (
                <Box
                  key={item.label}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderBottom: idx < specs.length - 1 ? `1px dashed ${colors.borderLight}` : 'none',
                    pb: idx < specs.length - 1 ? 1 : 0,
                    pt: idx === specs.length - 1 ? 0.5 : 0,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: colors.textPrimary }}>
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>

      {/* 3. Footer Modal */}
      <DialogActions
        sx={{
          px: { xs: 2, sm: 3 },
          py: 2,
          borderTop: `1px solid ${colors.borderLight}`,
          bgcolor: '#fafafa',
          justifyContent: 'space-between',
          flexDirection: { xs: 'column-reverse', sm: 'row' },
          gap: { xs: 1.5, sm: 0 },
          alignItems: { xs: 'stretch', sm: 'center' },
        }}
      >
        <Button
          startIcon={<LocationOnIcon sx={{ color: `${colors.locationPin} !important` }} />}
          onClick={() => {
            onLocationClick?.(unit);
            onClose();
          }}
          sx={{
            color: colors.locationPin,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '0.875rem',
            '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.08)' },
          }}
        >
          Xem vị trí trên sơ đồ
        </Button>

        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            minWidth: 90,
            height: 38,
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.875rem',
            background: 'linear-gradient(90deg, #1d4ed8 0%, #0284c7 100%)',
            boxShadow: '0 2px 6px rgba(2, 132, 199, 0.25)',
            '&:hover': {
              background: 'linear-gradient(90deg, #1e40af 0%, #0369a1 100%)',
            },
          }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UnitDetailModal;
