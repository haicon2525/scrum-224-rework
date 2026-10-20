import React, { useState } from 'react';
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
        units={unitsResponse?.data || []}
        isLoading={isLoadingUnits}
        pageNumber={filters.pageNumber || 1}
        pageSize={unitsResponse?.pageSize || filters.pageSize || DEFAULT_PAGE_SIZE}
        totalPages={unitsResponse?.totalPages || 1}
        totalElements={unitsResponse?.totalElements || 0}
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
