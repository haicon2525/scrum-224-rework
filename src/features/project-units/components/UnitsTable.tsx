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
}) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 }}>
        <CircularProgress size={36} sx={{ color: colors.primary }} />
      </Box>
    );
  }

  if (units.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 6,
          textAlign: 'center',
          borderRadius: '10px',
          border: `1px dashed ${colors.border}`,
          bgcolor: colors.bgSoft,
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
        <Table sx={{ minWidth: 960 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#ffffff', borderBottom: `1px solid ${colors.border}` }}>
              <TableCell sx={{ width: 75, py: 1.75 }} align="center"></TableCell>
              <TableCell sx={{ width: 110, fontWeight: 600, color: colors.tableHeader, fontSize: '0.875rem' }}>
                Mã căn
              </TableCell>
              <TableCell sx={{ width: 110, fontWeight: 600, color: colors.tableHeader, fontSize: '0.875rem' }}>
                Giá bán
              </TableCell>
              <TableCell sx={{ width: 130, fontWeight: 600, color: colors.tableHeader, fontSize: '0.875rem' }}>
                Loại hình
              </TableCell>
              <TableCell sx={{ width: 110, fontWeight: 600, color: colors.tableHeader, fontSize: '0.875rem' }}>
                DT đất
              </TableCell>
              <TableCell sx={{ width: 130, fontWeight: 600, color: colors.tableHeader, fontSize: '0.875rem' }}>
                DT xây dựng
              </TableCell>
              <TableCell sx={{ width: 120, fontWeight: 600, color: colors.tableHeader, fontSize: '0.875rem' }}>
                Hướng
              </TableCell>
              <TableCell sx={{ width: 130, fontWeight: 600, color: colors.tableHeader, fontSize: '0.875rem' }}>
                Phân khu
              </TableCell>
              <TableCell
                sx={{ width: 130, fontWeight: 600, color: colors.tableHeader, fontSize: '0.875rem' }}
                align="center"
              >
                Tình trạng
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {units.map((unit) => {
              const unitTypeLabel =
                unit.unitTypeName || (unit.unitTypeCode ? unitTypeMap[unit.unitTypeCode] || unit.unitTypeCode : '-');
              const directionLabel = formatDirections(unit.directionCodes, directionMap);
              const phaseLabel =
                unit.phaseName || (unit.phaseId ? phaseMap[unit.phaseId] || `Phân khu ${unit.phaseId}` : '-');
              const statusLabel =
                unit.statusName || (unit.statusCode ? statusMap[unit.statusCode] || unit.statusCode : '-');

              // Kiểm tra tình trạng đã bán để chuyển màu badge mã căn sang cam nhạt như trong Figma
              const isSold =
                unit.statusCode?.toUpperCase().includes('SOLD') ||
                unit.statusCode?.toUpperCase().includes('DA_BAN') ||
                statusLabel.toLowerCase().includes('đã bán');

              const unitCodeBg = isSold ? colors.badgeOrangeBg : colors.badgeBlueBg;
              const unitCodeText = isSold ? colors.badgeOrangeText : colors.badgeBlueText;

              return (
                <TableRow
                  key={unit.id}
                  hover
                  sx={{
                    '&:hover': { bgcolor: 'rgba(248, 250, 252, 0.8)' },
                    '&:last-child td': { borderBottom: 0 },
                  }}
                >
                  {/* Cột 1: Icon Hot + Vị trí */}
                  <TableCell align="center" sx={{ py: 1.5, px: 1 }}>
                    <UnitActionIcons
                      isHot={unit.isHot}
                      onLocationClick={() => onLocationClick?.(unit)}
                    />
                  </TableCell>

                  {/* Cột 2: Mã căn (Badge) */}
                  <TableCell sx={{ py: 1.5 }}>
                    <Chip
                      label={unit.unitCode}
                      size="small"
                      sx={{
                        bgcolor: unitCodeBg,
                        color: unitCodeText,
                        fontWeight: 600,
                        fontSize: '0.8125rem',
                        borderRadius: '6px',
                        height: 26,
                        px: 0.5,
                      }}
                    />
                  </TableCell>

                  {/* Cột 3: Giá bán (xx,xx tỷ) */}
                  <TableCell sx={{ fontWeight: 500, color: colors.textPrimary, fontSize: '0.875rem' }}>
                    {formatPriceBillion(unit.basePrice)}
                  </TableCell>

                  {/* Cột 4: Loại hình */}
                  <TableCell sx={{ color: colors.textPrimary, fontSize: '0.875rem' }}>{unitTypeLabel}</TableCell>

                  {/* Cột 5: DT đất */}
                  <TableCell sx={{ color: colors.textPrimary, fontSize: '0.875rem' }}>
                    {unit.areaLand != null ? `${unit.areaLand}m²` : '-'}
                  </TableCell>

                  {/* Cột 6: DT xây dựng */}
                  <TableCell sx={{ color: colors.textPrimary, fontSize: '0.875rem' }}>
                    {unit.areaBuilding != null ? `${unit.areaBuilding}m²` : '-'}
                  </TableCell>

                  {/* Cột 7: Hướng */}
                  <TableCell sx={{ color: colors.textPrimary, fontSize: '0.875rem' }}>{directionLabel}</TableCell>

                  {/* Cột 8: Phân khu */}
                  <TableCell sx={{ color: colors.textPrimary, fontSize: '0.875rem' }}>{phaseLabel}</TableCell>

                  {/* Cột 9: Tình trạng */}
                  <TableCell align="center">
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
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 2.5,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {/* Bên trái: Trang [ 1 v ] Của {totalPages} */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Trang
          </Typography>
          <Select
            size="small"
            value={pageNumber}
            onChange={(e) => onPageChange?.(Number(e.target.value))}
            sx={{
              height: 32,
              borderRadius: '6px',
              fontSize: '0.875rem',
              bgcolor: '#ffffff',
            }}
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </Select>
          <Typography variant="body2" color="text.secondary">
            Của {totalPages}
          </Typography>
        </Stack>

        {/* Bên phải: Phân trang các nút */}
        <Pagination
          count={totalPages}
          page={pageNumber}
          onChange={(_, val) => onPageChange?.(val)}
          color="primary"
          shape="rounded"
          showFirstButton
          showLastButton
          sx={{
            '& .MuiPaginationItem-root.Mui-selected': {
              bgcolor: colors.primary,
              color: '#ffffff',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default UnitsTable;
