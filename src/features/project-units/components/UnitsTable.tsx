import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Box,
  Typography,
  CircularProgress,
  Chip,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import { UnitItem } from '../types';
import StatusChip from './StatusChip';
import UnitActionIcons from './LocationLink';
import { formatPriceBillion } from '../utils/formatPrice';
import { formatDirections } from '../utils/formatDirections';
import { colors } from '@/theme';

interface UnitsTableProps {
  units?: UnitItem[];
  isLoading?: boolean;
  pageNumber?: number;
  pageSize?: number;
  totalPages?: number;
  totalElements?: number;
  unitTypeMap?: Record<string, string>;
  directionMap?: Record<string, string>;
  phaseMap?: Record<string, string>;
  statusMap?: Record<string, string>;
  onPageChange?: (page: number) => void;
  onLocationClick?: (unit: UnitItem) => void;
  onUnitClick?: (unit: UnitItem) => void;
}

export const UnitsTable: React.FC<UnitsTableProps> = ({
  units = [],
  isLoading,
  pageNumber = 1,
  totalPages = 1,
  totalElements = 0,
  unitTypeMap = {},
  directionMap = {},
  phaseMap = {},
  statusMap = {},
  onPageChange,
  onLocationClick,
  onUnitClick,
}) => {
  const safeUnits = Array.isArray(units) ? units : [];
  const safeTotalPages = Math.max(1, totalPages || 1);
  const safePageNumber = Math.min(Math.max(1, pageNumber || 1), safeTotalPages);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 }}>
        <CircularProgress size={36} sx={{ color: colors.primary }} />
      </Box>
    );
  }

  if (safeUnits.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 6,
          textAlign: 'center',
          borderRadius: '10px',
          border: `1px dashed ${colors.border || '#e2e8f0'}`,
          bgcolor: colors.bgSoft || '#f8fafc',
          my: 2,
        }}
      >
        <Typography color="text.secondary" fontWeight={500}>
          Không tìm thấy căn hộ phù hợp với tiêu chí lọc
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: '10px',
          border: `1px solid ${colors.border}`,
          overflow: 'hidden',
          bgcolor: '#ffffff',
        }}
      >
        <Table sx={{ minWidth: { xs: 0, md: 960 }, width: '100%' }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#ffffff', borderBottom: `1px solid ${colors.border}` }}>
              <TableCell sx={{ width: { xs: 50, md: 75 }, py: 1.75, px: { xs: 0.5, md: 1 } }} align="center"></TableCell>
              <TableCell sx={{ width: { xs: 120, md: 110 }, fontWeight: 600, color: colors.tableHeader, fontSize: '0.875rem' }}>
                Mã căn
              </TableCell>
              <TableCell
                sx={{
                  width: { xs: 'auto', md: 110 },
                  fontWeight: 600,
                  color: colors.tableHeader,
                  fontSize: '0.875rem',
                  textAlign: { xs: 'right', md: 'left' },
                  pr: { xs: 2, md: 2 },
                }}
              >
                Giá bán
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, width: 130, fontWeight: 600, color: colors.tableHeader, fontSize: '0.875rem' }}>
                Loại hình
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, width: 110, fontWeight: 600, color: colors.tableHeader, fontSize: '0.875rem' }}>
                DT đất
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, width: 130, fontWeight: 600, color: colors.tableHeader, fontSize: '0.875rem' }}>
                DT xây dựng
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, width: 120, fontWeight: 600, color: colors.tableHeader, fontSize: '0.875rem' }}>
                Hướng
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, width: 130, fontWeight: 600, color: colors.tableHeader, fontSize: '0.875rem' }}>
                Phân khu
              </TableCell>
              <TableCell
                sx={{ display: { xs: 'none', md: 'table-cell' }, width: 130, fontWeight: 600, color: colors.tableHeader, fontSize: '0.875rem' }}
                align="center"
              >
                Tình trạng
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {safeUnits.map((unit, index) => {
              const unitTypeLabel =
                unit.unitTypeName || (unit.unitTypeCode ? unitTypeMap[unit.unitTypeCode] || unit.unitTypeCode : '-');
              const directionLabel = formatDirections(unit.directions || unit.directionCodes, directionMap);
              const phaseLabel =
                unit.phaseName || (unit.phaseId ? phaseMap[unit.phaseId] || `Phân khu ${unit.phaseId}` : '-');
              const statusLabel =
                unit.statusName || (unit.statusCode ? statusMap[unit.statusCode] || unit.statusCode : '-');

              // Kiểm tra an toàn tình trạng đã bán để chuyển màu badge mã căn
              const upperCode = unit.statusCode?.toUpperCase() || '';
              const isSold =
                upperCode.includes('SOLD') ||
                upperCode.includes('DA_BAN') ||
                (typeof statusLabel === 'string' &&
                  (statusLabel.toLowerCase().includes('đã bán') || statusLabel.toLowerCase().includes('sold')));

              const unitCodeBg = isSold ? colors.badgeOrangeBg : colors.badgeBlueBg;
              const unitCodeText = isSold ? colors.badgeOrangeText : colors.badgeBlueText;

              return (
                <TableRow
                  key={unit.id || unit.unitCode || index}
                  hover
                  sx={{
                    '&:hover': { bgcolor: 'rgba(248, 250, 252, 0.8)' },
                    '&:last-child td': { borderBottom: 0 },
                  }}
                >
                  {/* Cột 1: Icon Hot + Vị trí */}
                  <TableCell align="center" sx={{ py: 1.5, px: { xs: 0.5, md: 1 }, width: { xs: 50, md: 75 } }}>
                    <UnitActionIcons
                      isHot={unit.isHot}
                      onLocationClick={() => onLocationClick?.(unit)}
                    />
                  </TableCell>

                  {/* Cột 2: Mã căn (Badge bấm để xem chi tiết) */}
                  <TableCell sx={{ py: 1.5, px: { xs: 1, md: 2 } }}>
                    <Chip
                      label={unit.unitCode}
                      size="small"
                      onClick={() => onUnitClick?.(unit)}
                      sx={{
                        bgcolor: unitCodeBg,
                        color: unitCodeText,
                        fontWeight: 600,
                        fontSize: '0.8125rem',
                        borderRadius: '6px',
                        height: 26,
                        px: 0.5,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          opacity: 0.85,
                          transform: 'translateY(-1px)',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                        },
                      }}
                    />
                  </TableCell>

                  {/* Cột 3: Giá bán (xx,xx tỷ) */}
                  <TableCell
                    sx={{
                      fontWeight: 500,
                      color: colors.textPrimary,
                      fontSize: '0.875rem',
                      textAlign: { xs: 'right', md: 'left' },
                      pr: { xs: 2, md: 2 },
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {formatPriceBillion(unit.basePrice)}
                  </TableCell>

                  {/* Cột 4: Loại hình */}
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, color: colors.textPrimary, fontSize: '0.875rem' }}>{unitTypeLabel}</TableCell>

                  {/* Cột 5: DT đất */}
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, color: colors.textPrimary, fontSize: '0.875rem' }}>
                    {unit.areaLand != null ? `${unit.areaLand}m²` : '-'}
                  </TableCell>

                  {/* Cột 6: DT xây dựng */}
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, color: colors.textPrimary, fontSize: '0.875rem' }}>
                    {unit.areaBuilding != null ? `${unit.areaBuilding}m²` : '-'}
                  </TableCell>

                  {/* Cột 7: Hướng */}
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, color: colors.textPrimary, fontSize: '0.875rem' }}>{directionLabel}</TableCell>

                  {/* Cột 8: Phân khu */}
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, color: colors.textPrimary, fontSize: '0.875rem' }}>{phaseLabel}</TableCell>

                  {/* Cột 9: Tình trạng */}
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }} align="center">
                    <StatusChip statusCode={unit.statusCode} label={statusLabel} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Phân trang */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 2.5,
          gap: 2,
        }}
      >
        {/* Nút phân trang (trên mobile đưa lên trước) */}
        <Box
          sx={{
            order: { xs: 1, sm: 2 },
            width: { xs: '100%', sm: 'auto' },
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Pagination
            count={safeTotalPages}
            page={safePageNumber}
            onChange={(_, val) => onPageChange?.(val)}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
            siblingCount={0}
            boundaryCount={1}
            sx={{
              '& .MuiPaginationItem-root': {
                minWidth: { xs: 28, sm: 32 },
                height: { xs: 28, sm: 32 },
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                padding: { xs: '0 4px', sm: '0 6px' },
              },
              '& .MuiPaginationItem-root.Mui-selected': {
                bgcolor: colors.primary,
                color: '#ffffff',
              },
            }}
          />
        </Box>

        {/* Trang [ 1 v ] Của {safeTotalPages} (trên mobile đưa xuống dưới) */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="center"
          sx={{
            order: { xs: 2, sm: 1 },
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Trang
          </Typography>
          <Select
            size="small"
            value={safePageNumber}
            onChange={(e) => onPageChange?.(Number(e.target.value))}
            sx={{
              height: 32,
              borderRadius: '6px',
              fontSize: '0.875rem',
              bgcolor: '#ffffff',
            }}
          >
            {Array.from({ length: safeTotalPages }, (_, i) => i + 1).map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </Select>
          <Typography variant="body2" color="text.secondary">
            Của {safeTotalPages}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default UnitsTable;
