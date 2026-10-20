import React, { useState, useMemo } from 'react';
import { Box } from '@mui/material';
import UnitsToolbar from './UnitsToolbar';
import AdvancedFilter from './AdvancedFilter';
import UnitsTable from './UnitsTable';
import { useUnits } from '../hooks/useUnits';
import { useMasterData } from '../hooks/useMasterData';
import { useUnitFilters } from '../hooks/useUnitFilters';
import { DEFAULT_PAGE_SIZE } from '../constants';
import { UnitItem } from '../types';

interface UnitsSectionProps {
  projectId: number;
}

export const UnitsSection: React.FC<UnitsSectionProps> = ({ projectId }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { filters, updateFilter, updateMultipleFilters, resetFilters } = useUnitFilters({
    projectId,
    pageNumber: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sort: '',
  });

  const { data: unitsResponse, isLoading: isLoadingUnits } = useUnits(filters);

  const {
    statuses,
    unitTypes,
    directions,
    phases,
    statusMap,
    unitTypeMap,
    directionMap,
    phaseMap,
  } = useMasterData(projectId);

  // Xử lý sắp xếp và lọc dự phòng nếu Backend chưa hỗ trợ sort/filter
  const displayUnits = useMemo(() => {
    let list = [...(unitsResponse?.data || [])];

    // 1. Lọc theo trạng thái nếu có
    if (filters.statusCode) {
      list = list.filter((item) => item.statusCode === filters.statusCode);
    }

    // 2. Sắp xếp theo tiêu chí đã chọn
    if (filters.sort === 'basePrice,asc') {
      list.sort((a, b) => {
        const pA = a.basePrice ?? Infinity;
        const pB = b.basePrice ?? Infinity;
        return pA - pB;
      });
    } else if (filters.sort === 'basePrice,desc') {
      list.sort((a, b) => {
        const pA = a.basePrice ?? -Infinity;
        const pB = b.basePrice ?? -Infinity;
        return pB - pA;
      });
    } else if (filters.sort === 'createdAt,desc') {
      list.sort((a, b) => {
        const valA = (a as any).createdAt || (a as any).createdDate || a.id || 0;
        const valB = (b as any).createdAt || (b as any).createdDate || b.id || 0;
        return valB > valA ? 1 : valB < valA ? -1 : 0;
      });
    } else if (filters.sort === 'createdAt,asc') {
      list.sort((a, b) => {
        const valA = (a as any).createdAt || (a as any).createdDate || a.id || 0;
        const valB = (b as any).createdAt || (b as any).createdDate || b.id || 0;
        return valA > valB ? 1 : valA < valB ? -1 : 0;
      });
    } else {
      // Sắp xếp mặc định: Căn Hot lên đầu, sau đó theo mới nhất (id/ngày tạo giảm dần)
      list.sort((a, b) => {
        const hotA = Boolean(a.isHot);
        const hotB = Boolean(b.isHot);
        if (hotA && !hotB) return -1;
        if (!hotA && hotB) return 1;
        const valA = (a as any).createdAt || (a as any).createdDate || a.id || 0;
        const valB = (b as any).createdAt || (b as any).createdDate || b.id || 0;
        return valB > valA ? 1 : valB < valA ? -1 : 0;
      });
    }

    return list;
  }, [unitsResponse?.data, filters.sort, filters.statusCode]);

  // Phân trang Client-side sau khi đã sắp xếp toàn bộ danh sách căn hộ
  const pageSize = DEFAULT_PAGE_SIZE;
  const totalElements = displayUnits.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
  const currentPage = Math.min(Math.max(1, filters.pageNumber || 1), totalPages);

  const paginatedUnits = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return displayUnits.slice(start, start + pageSize);
  }, [displayUnits, currentPage, pageSize]);

  const handleLocationClick = (unit: UnitItem) => {
    console.log('Xem vị trí căn:', unit.unitCode);
    // Có thể mở drawer/modal bản đồ nếu có
  };

  return (
    <Box sx={{ py: 2 }}>
      {/* Thanh công cụ: Sắp xếp, Trạng thái, Nút mở bộ lọc */}
      <UnitsToolbar
        filters={filters}
        statuses={statuses}
        showAdvanced={showAdvanced}
        onToggleAdvanced={() => setShowAdvanced((prev) => !prev)}
        onFilterChange={updateFilter}
      />

      {/* Khối Bộ lọc nâng cao */}
      {showAdvanced && (
        <AdvancedFilter
          filters={filters}
          phases={phases}
          unitTypes={unitTypes}
          directions={directions}
          onApply={(newFilters) => {
            updateMultipleFilters(newFilters);
          }}
          onReset={resetFilters}
          onClose={() => setShowAdvanced(false)}
        />
      )}

      {/* Bảng danh sách căn hộ & phân trang */}
      <UnitsTable
        units={paginatedUnits}
        isLoading={isLoadingUnits}
        pageNumber={currentPage}
        pageSize={pageSize}
        totalPages={totalPages}
        totalElements={totalElements}
        unitTypeMap={unitTypeMap}
        directionMap={directionMap}
        phaseMap={phaseMap}
        statusMap={statusMap}
        onPageChange={(page) => updateFilter('pageNumber', page)}
        onLocationClick={handleLocationClick}
      />
    </Box>
  );
};

export default UnitsSection;
