import { useQuery } from '@tanstack/react-query';
import { unitApi } from '../api/unitApi';
import { UnitQueryParams } from '../types';

export const useUnits = (params: UnitQueryParams) => {
  // Trừ pageNumber = Math.max(0, page - 1) ở ĐÚNG MỘT chỗ duy nhất khi gọi API
  const apiParams: UnitQueryParams = {
    ...params,
    pageNumber: Math.max(0, (params.pageNumber || 1) - 1),
  };

  return useQuery({
    queryKey: ['units', apiParams],
    queryFn: () => unitApi.getUnits(apiParams),
    enabled: Boolean(params.projectId),
  });
};

export default useUnits;
