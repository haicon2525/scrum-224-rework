import React, { ReactNode } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  FormControl,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from './LoginForm';
import { colors } from '@/theme';

interface AuthGateProps {
  children: ReactNode;
}

const MOCK_BLURRED_UNITS = [
  { id: 1, isHot: true, code: 'PB19-19', price: '20,20 tỷ', type: 'Shophouse', areaLand: '100m²', areaBuild: '500m²', dir: 'Đông nam', phase: 'Phân khu 1', status: 'Còn hàng' },
  { id: 2, isHot: true, code: 'PB19-19', price: '20,20 tỷ', type: 'Shophouse', areaLand: '100m²', areaBuild: '500m²', dir: 'Đông nam', phase: 'Phân khu 1', status: 'Còn hàng' },
  { id: 3, isHot: false, code: 'PB19-19', price: '20,20 tỷ', type: 'Shophouse', areaLand: '100m²', areaBuild: '500m²', dir: 'Đông nam', phase: 'Phân khu 1', status: 'Còn hàng' },
  { id: 4, isHot: false, code: 'PB19-19', price: '20,20 tỷ', type: 'Shophouse', areaLand: '100m²', areaBuild: '500m²', dir: 'Đông nam', phase: 'Phân khu 1', status: 'Còn hàng' },
  { id: 5, isHot: false, code: 'PB19-19', price: '20,20 tỷ', type: 'Shophouse', areaLand: '100m²', areaBuild: '500m²', dir: 'Đông nam', phase: 'Phân khu 1', status: 'Còn hàng' },
  { id: 6, isHot: false, code: 'PB19-19', price: '20,20 tỷ', type: 'Shophouse', areaLand: '100m²', areaBuild: '500m²', dir: 'Đông nam', phase: 'Phân khu 1', status: 'Còn hàng' },
  { id: 7, isHot: false, code: 'PB19-19', price: '20,20 tỷ', type: 'Shophouse', areaLand: '100m²', areaBuild: '500m²', dir: 'Đông nam', phase: 'Phân khu 1', status: 'Còn hàng' },
  { id: 8, isHot: false, code: 'PB19-19', price: '20,20 tỷ', type: 'Shophouse', areaLand: '100m²', areaBuild: '500m²', dir: 'Đông nam', phase: 'Phân khu 1', status: 'Đã bán' },
  { id: 9, isHot: false, code: 'PB19-19', price: '20,20 tỷ', type: 'Shophouse', areaLand: '100m²', areaBuild: '500m²', dir: 'Đông nam', phase: 'Phân khu 1', status: 'Đã bán' },
];

export const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Đã đăng nhập: Render dữ liệu thật
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Chưa đăng nhập: KHÔNG gọi API, render bảng giả bị blur và Form đăng nhập nằm đè lên giữa
  return (
    <Box sx={{ position: 'relative', width: '100%', py: 2 }}>
      {/* Vùng BẢNG HÀNG tĩnh bị blur */}
      <Box
        sx={{
          filter: 'blur(5px)',
          opacity: 0.65,
          userSelect: 'none',
          pointerEvents: 'none',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Toolbar giả */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
            mb: 2,
            gap: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: colors.deepBlue,
              fontSize: { xs: '1.25rem', sm: '1.25rem' },
            }}
          >
            BẢNG HÀNG
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            alignItems="stretch"
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            <FormControl size="small" sx={{ width: { xs: '100%', sm: 180 } }}>
              <Select value="" displayEmpty sx={{ borderRadius: '8px', bgcolor: '#fff' }}>
                <MenuItem value="">Sắp xếp theo mặc định</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ width: { xs: '100%', sm: 160 } }}>
              <Select value="" displayEmpty sx={{ borderRadius: '8px', bgcolor: '#fff' }}>
                <MenuItem value="">Tất cả trạng thái</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              startIcon={<FilterAltIcon />}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                bgcolor: colors.primary,
                width: { xs: '100%', sm: 'auto' },
                px: 2.5,
              }}
            >
              Bộ lọc
            </Button>
          </Stack>
        </Box>

        {/* Table giả */}
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: '10px',
            border: `1px solid ${colors.border}`,
            overflow: 'hidden',
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
              {MOCK_BLURRED_UNITS.map((row) => {
                const isSold = row.status === 'Đã bán';
                return (
                  <TableRow key={row.id}>
                    <TableCell align="center" sx={{ py: 1.5, px: { xs: 0.5, md: 1 }, width: { xs: 50, md: 75 } }}>
                      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
                        {row.isHot ? (
                          <LocalFireDepartmentIcon sx={{ color: colors.hotIcon, fontSize: 18 }} />
                        ) : (
                          <Box sx={{ width: 18 }} />
                        )}
                        <LocationOnOutlinedIcon sx={{ color: colors.locationPin, fontSize: 19 }} />
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 1.5, px: { xs: 1, md: 2 } }}>
                      <Chip
                        label={row.code}
                        size="small"
                        sx={{
                          bgcolor: isSold ? colors.badgeOrangeBg : colors.badgeBlueBg,
                          color: isSold ? colors.badgeOrangeText : colors.badgeBlueText,
                          fontWeight: 600,
                          fontSize: '0.8125rem',
                          borderRadius: '6px',
                        }}
                      />
                    </TableCell>
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
                      {row.price}
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, color: colors.textPrimary, fontSize: '0.875rem' }}>{row.type}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, color: colors.textPrimary, fontSize: '0.875rem' }}>{row.areaLand}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, color: colors.textPrimary, fontSize: '0.875rem' }}>{row.areaBuild}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, color: colors.textPrimary, fontSize: '0.875rem' }}>{row.dir}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, color: colors.textPrimary, fontSize: '0.875rem' }}>{row.phase}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }} align="center">
                      <Chip
                        label={row.status}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          height: 26,
                          borderRadius: '20px',
                          bgcolor: isSold ? colors.statusSoldBg : colors.statusAvailableBg,
                          color: isSold ? colors.statusSoldText : colors.statusAvailableText,
                          border: `1px solid ${isSold ? '#fecdd3' : '#a7f0e0'}`,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Form Đăng nhập nằm giữa đè lên */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 2,
          zIndex: 10,
        }}
      >
        <LoginForm />
      </Box>
    </Box>
  );
};

export default AuthGate;
