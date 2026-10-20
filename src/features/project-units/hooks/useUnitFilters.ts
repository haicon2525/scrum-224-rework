import { useState, useCallback, useEffect } from 'react';
import { UnitQueryParams } from '../types';

export const useUnitFilters = (initialFilters: UnitQueryParams) => {
  const [filters, setFilters] = useState<UnitQueryParams>(initialFilters);

  // Khi projectId thay đổi, reset filters về initialFilters (page 1, xóa filter cũ)
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters.projectId]);

  const updateFilter = useCallback(
    <K extends keyof UnitQueryParams>(key: K, value: UnitQueryParams[K]) => {
      setFilters((prev) => {
        const next = { ...prev, [key]: value };
        // Reset về page 1 nếu thay đổi bất kỳ filter nào khác pageNumber
        if (key !== 'pageNumber') {
          next.pageNumber = 1;
        }
        return next;
      });
    },
    []
  );

  const updateMultipleFilters = useCallback((updates: Partial<UnitQueryParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...updates,
      pageNumber: 1,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      projectId: initialFilters.projectId,
      pageNumber: 1,
      pageSize: initialFilters.pageSize || 10,
      sort: '',
    });
  }, [initialFilters.projectId, initialFilters.pageSize]);

  return {
    filters,
    setFilters,
    updateFilter,
    updateMultipleFilters,
    resetFilters,
  };
};

export default useUnitFilters;
