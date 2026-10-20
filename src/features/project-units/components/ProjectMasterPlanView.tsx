import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
  Chip,
  Stack,
  Tooltip,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { colors } from '@/theme';
import { unitApi } from '../api/unitApi';
import { UnitItem } from '../types';
import { formatPriceBillion } from '../utils/formatPrice';
import StatusChip from './StatusChip';

interface ProjectMasterPlanViewProps {
  projectId: number;
  highlightedUnitId?: number;
  highlightedUnitCode?: string;
  onBackToUnitsTab?: () => void;
}

// Danh sách các phân khu mô phỏng của Vinhomes Ocean Park 3
interface ZoneItem {
  id: number;
  code: string;
  name: string;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  labelX: number;
  labelY: number;
}

const ZONES: ZoneItem[] = [
  { id: 1, code: 'THOI_DAI', name: 'Phân khu Thời Đại', color: '#e0f2fe', x: 80, y: 120, width: 220, height: 160, labelX: 190, labelY: 190 },
  { id: 2, code: 'VINH_THIEN_DUONG', name: 'Vịnh Thiên Đường', color: '#fef3c7', x: 330, y: 100, width: 260, height: 200, labelX: 460, labelY: 180 },
  { id: 3, code: 'PHO_BIEN', name: 'Phân khu Phố Biển', color: '#dcfce7', x: 620, y: 140, width: 250, height: 170, labelX: 745, labelY: 215 },
  { id: 4, code: 'ANH_DUONG', name: 'Phân khu Ánh Dương', color: '#fce7f3', x: 120, y: 320, width: 230, height: 190, labelX: 235, labelY: 410 },
  { id: 5, code: 'VINH_TAY', name: 'Phân khu Vịnh Tây', color: '#ede9fe', x: 380, y: 340, width: 240, height: 180, labelX: 500, labelY: 420 },
  { id: 6, code: 'DAO_NGOC', name: 'Phân khu Đảo Ngọc', color: '#ffedd5', x: 650, y: 350, width: 230, height: 180, labelX: 765, labelY: 435 },
];

export const ProjectMasterPlanView: React.FC<ProjectMasterPlanViewProps> = ({
  projectId,
  highlightedUnitId,
  highlightedUnitCode,
  onBackToUnitsTab,
}) => {
  const navigate = useNavigate();
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [unitDetail, setUnitDetail] = useState<UnitItem | null>(null);
  const [loadingUnit, setLoadingUnit] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  // Tính toán tọa độ căn hộ dựa trên unitCode hoặc unitId
  const getUnitCoordinates = () => {
    if (!highlightedUnitCode && !highlightedUnitId) return null;

    // Băm mã căn hoặc ID để xác định phân khu và tọa độ tương đối
    const code = highlightedUnitCode || '';
    let zone = ZONES[0];

    if (code.includes('HG') || code.includes('PB')) zone = ZONES[2]; // Phố biển
    else if (code.includes('VTD') || code.includes('TD')) zone = ZONES[1]; // Vịnh Thiên Đường
    else if (code.includes('AD')) zone = ZONES[3]; // Ánh Dương
    else if (code.includes('VT')) zone = ZONES[4]; // Vịnh Tây
    else if (code.includes('DN')) zone = ZONES[5]; // Đảo Ngọc
    else {
      // Phân bổ đều theo id
      const zoneIdx = ((highlightedUnitId || 1) % ZONES.length);
      zone = ZONES[zoneIdx];
    }

    // Tọa độ chi tiết căn hộ nằm trong phân khu
    const hash = (code.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + (highlightedUnitId || 0)) % 100;
    const offsetX = 40 + (hash % (zone.width - 80));
    const offsetY = 50 + ((hash * 7) % (zone.height - 90));

    return {
      x: zone.x + offsetX,
      y: zone.y + offsetY,
      zoneName: zone.name,
    };
  };

  const targetCoords = getUnitCoordinates();

  // Gọi API tải chi tiết căn hộ khi có highlightedUnitId hoặc unitCode
  useEffect(() => {
    if (!highlightedUnitId && !highlightedUnitCode) return;

    let isMounted = true;
    const fetchDetail = async () => {
      try {
        setLoadingUnit(true);
        const res = await unitApi.getUnitDetail({
          id: highlightedUnitId,
          unitCode: highlightedUnitCode,
        });
        if (isMounted && res.data) {
          setUnitDetail(res.data);
        }
      } catch (err) {
        console.error('Lỗi khi tải chi tiết căn trên bản đồ:', err);
      } finally {
        if (isMounted) setLoadingUnit(false);
      }
    };

    fetchDetail();

    return () => {
      isMounted = false;
    };
  }, [highlightedUnitId, highlightedUnitCode]);

  // Tự động Pan và Zoom mượt mà vào đúng tọa độ căn hộ
  useEffect(() => {
    if (!targetCoords || !containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth || 900;
    const containerHeight = containerRef.current.clientHeight || 580;

    const targetZoom = 2.4;
    // Căn giữa tọa độ căn hộ vào màn hình
    const targetPanX = containerWidth / 2 - targetCoords.x * targetZoom;
    const targetPanY = containerHeight / 2 - targetCoords.y * targetZoom;

    // Delay 300ms để hiệu ứng zoom vào tạo cảm giác điện ảnh, mượt mà
    const timer = setTimeout(() => {
      setScale(targetZoom);
      setPan({ x: targetPanX, y: targetPanY });
      setShowTooltip(true);
    }, 350);

    return () => clearTimeout(timer);
  }, [targetCoords?.x, targetCoords?.y]);

  // Kéo rê bản đồ chuột
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Nút điều khiển Zoom
  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.5, 0.7));
  const handleResetZoom = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <Box sx={{ width: '100%', position: 'relative', my: 2 }}>
      {/* Header thanh điều khiển sơ đồ */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: '12px',
          border: `1px solid ${colors.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1.5,
          bgcolor: '#ffffff',
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          {onBackToUnitsTab && (
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={onBackToUnitsTab}
              variant="outlined"
              size="small"
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '8px',
                borderColor: colors.border,
                color: colors.textPrimary,
              }}
            >
              Về Quỹ căn
            </Button>
          )}

          <Typography variant="h6" sx={{ fontWeight: 800, color: colors.deepBlue }}>
            MẶT BẰNG QUỸ CĂN
          </Typography>

          {highlightedUnitCode && (
            <Chip
              icon={<LocationOnIcon sx={{ color: '#ffffff !important', fontSize: '16px !important' }} />}
              label={`Đang định vị: ${highlightedUnitCode}`}
              size="small"
              sx={{
                bgcolor: colors.primary,
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.8125rem',
              }}
            />
          )}
        </Stack>

        {/* Cụm nút điều khiển Zoom */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title="Phóng to">
            <IconButton onClick={handleZoomIn} size="small" sx={{ border: `1px solid ${colors.border}`, bgcolor: '#fff' }}>
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Thu nhỏ">
            <IconButton onClick={handleZoomOut} size="small" sx={{ border: `1px solid ${colors.border}`, bgcolor: '#fff' }}>
              <RemoveIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Về toàn cảnh">
            <IconButton onClick={handleResetZoom} size="small" sx={{ border: `1px solid ${colors.border}`, bgcolor: '#fff' }}>
              <RestartAltIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Paper>

      {/* Khung bản đồ Canvas / SVG tương tác */}
      <Box
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        sx={{
          width: '100%',
          height: { xs: 450, sm: 550, md: 620 },
          borderRadius: '16px',
          border: `1px solid ${colors.border}`,
          bgcolor: '#f1f5f9',
          overflow: 'hidden',
          position: 'relative',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)',
        }}
      >
        {/* Lớp SVG Bản đồ có thể Pan & Zoom */}
        <Box
          sx={{
            width: 1000,
            height: 600,
            position: 'absolute',
            left: 0,
            top: 0,
            transformOrigin: '0 0',
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
        >
          <svg width="1000" height="600" viewBox="0 0 1000 600" style={{ display: 'block' }}>
            <defs>
              {/* Pattern nền cỏ / công viên */}
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
              </pattern>

              {/* Gradient mặt nước công viên biển Paradise Bay */}
              <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>

              {/* Gradient bóng đổ marker */}
              <filter id="markerShadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#ef4444" floodOpacity="0.45" />
              </filter>
            </defs>

            {/* Nền tổng thể */}
            <rect width="1000" height="600" fill="#f8fafc" />
            <rect width="1000" height="600" fill="url(#grid)" />

            {/* Hồ nước trung tâm Paradise Bay */}
            <path
              d="M 380,240 Q 520,180 620,250 T 560,330 T 400,320 Z"
              fill="url(#waterGrad)"
              opacity="0.85"
            />
            <text x="490" y="275" fill="#ffffff" fontSize="12" fontWeight="700" textAnchor="middle">
              PARADISE BAY 12.3 HA
            </text>

            {/* Các trục đường chính */}
            {/* Đường vành đai 3.5 */}
            <line x1="50" y1="560" x2="950" y2="560" stroke="#cbd5e1" strokeWidth="18" strokeLinecap="round" />
            <text x="500" y="565" fill="#475569" fontSize="11" fontWeight="700" textAnchor="middle">
              ĐẠI LỘ BỐN MÙA (51M)
            </text>

            {/* Đường trục giữa */}
            <line x1="340" y1="50" x2="340" y2="550" stroke="#cbd5e1" strokeWidth="12" />
            <line x1="620" y1="50" x2="620" y2="550" stroke="#cbd5e1" strokeWidth="12" />

            {/* Các phân khu (ZONES) */}
            {ZONES.map((zone) => (
              <g key={zone.id}>
                <rect
                  x={zone.x}
                  y={zone.y}
                  width={zone.width}
                  height={zone.height}
                  rx="14"
                  fill={zone.color}
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                  strokeDasharray="4,3"
                  opacity="0.85"
                />

                {/* Các block / lô nhà tượng trưng bên trong */}
                {Array.from({ length: 4 }).map((_, rIdx) => (
                  <line
                    key={rIdx}
                    x1={zone.x + 20}
                    y1={zone.y + 40 + rIdx * 30}
                    x2={zone.x + zone.width - 20}
                    y2={zone.y + 40 + rIdx * 30}
                    stroke="#cbd5e1"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                ))}

                <text
                  x={zone.labelX}
                  y={zone.labelY}
                  fill="#1e293b"
                  fontSize="13"
                  fontWeight="800"
                  textAnchor="middle"
                  style={{ pointerEvents: 'none' }}
                >
                  {zone.name.toUpperCase()}
                </text>
              </g>
            ))}

            {/* Pin Marker của căn hộ được định vị */}
            {targetCoords && (
              <g
                transform={`translate(${targetCoords.x}, ${targetCoords.y})`}
                filter="url(#markerShadow)"
              >
                {/* Vòng tròn nhấp nháy Pulse Animation */}
                <circle r="22" fill="#ef4444" opacity="0.35">
                  <animate attributeName="r" values="10;32;10" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                </circle>

                <circle r="12" fill="#ef4444" stroke="#ffffff" strokeWidth="2.5" />
                <circle r="5" fill="#ffffff" />

                {/* Nhãn mã căn gắn liền với Pin */}
                <rect
                  x="-45"
                  y="-34"
                  width="90"
                  height="22"
                  rx="6"
                  fill="#1e293b"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                <text
                  x="0"
                  y="-19"
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="800"
                  textAnchor="middle"
                >
                  {highlightedUnitCode || 'VỊ TRÍ CĂN'}
                </text>
              </g>
            )}
          </svg>
        </Box>

        {/* Card Popup nổi hiển thị thông tin căn hộ khi được định vị */}
        {targetCoords && showTooltip && (
          <Card
            elevation={4}
            sx={{
              position: 'absolute',
              bottom: 24,
              left: 24,
              maxWidth: 320,
              width: '100%',
              borderRadius: '14px',
              border: `1px solid ${colors.border}`,
              bgcolor: '#ffffff',
              boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
              zIndex: 10,
              animation: 'fadeIn 0.3s ease-out',
            }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: colors.deepBlue }}>
                    CĂN HỘ {highlightedUnitCode || unitDetail?.unitCode}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {targetCoords.zoneName}
                  </Typography>
                </Box>

                <IconButton size="small" onClick={() => setShowTooltip(false)} sx={{ p: 0.5 }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>

              {loadingUnit ? (
                <Box sx={{ py: 2, display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress size={24} sx={{ color: colors.primary }} />
                </Box>
              ) : (
                <Stack spacing={0.75} sx={{ mt: 1 }}>
                  {unitDetail?.basePrice != null && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary">Giá bán:</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#1d4ed8' }}>
                        {formatPriceBillion(unitDetail.basePrice)}
                      </Typography>
                    </Box>
                  )}

                  {unitDetail?.areaLand != null && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary">Diện tích đất:</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {unitDetail.areaLand} m²
                      </Typography>
                    </Box>
                  )}

                  {unitDetail?.statusCode && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">Tình trạng:</Typography>
                      <StatusChip statusCode={unitDetail.statusCode} label={unitDetail.statusName} />
                    </Box>
                  )}
                </Stack>
              )}
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default ProjectMasterPlanView;
