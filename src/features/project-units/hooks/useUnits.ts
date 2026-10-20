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
    // Giữ dữ liệu cũ khi đổi trang/lọc trong cùng dự án; xóa dữ liệu cũ khi đổi projectId
    placeholderData: (prev, prevQuery) => {
      const prevParams = prevQuery?.queryKey?.[1] as UnitQueryParams | undefined;
      return prevParams?.projectId === params.projectId ? prev : undefined;
    },
  });
};

export default useUnits;
