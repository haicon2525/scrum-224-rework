import { useQuery } from '@tanstack/react-query';
import { unitApi } from '../api/unitApi';
import { UnitQueryParams } from '../types';

export const useUnits = (params: UnitQueryParams) => {
  // Lấy toàn bộ căn của dự án để Frontend tự do sắp xếp, gom căn HOT và phân trang chuẩn xác
  const { sort, pageNumber, ...filterParams } = params;
  const apiParams: UnitQueryParams = {
    ...filterParams,
    pageNumber: 0,
    pageSize: 1000,
  };

  return useQuery({
    queryKey: ['units', apiParams],
    queryFn: () => unitApi.getUnits(apiParams),
    enabled: Boolean(params.projectId),
    // Giữ dữ liệu cũ khi đổi bộ lọc trong cùng dự án; xóa dữ liệu cũ khi đổi projectId
    placeholderData: (prev, prevQuery) => {
      const prevParams = prevQuery?.queryKey?.[1] as UnitQueryParams | undefined;
      return prevParams?.projectId === params.projectId ? prev : undefined;
    },
  });
};

export default useUnits;
