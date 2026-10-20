import { useQuery } from '@tanstack/react-query';
import { unitApi } from '../api/unitApi';
import { UnitQueryParams } from '../types';

export const useUnits = (params: UnitQueryParams) => {
  return useQuery({
    queryKey: ['units', params],
    queryFn: () => unitApi.getUnits(params),
    enabled: Boolean(params.projectId),
  });
};

export default useUnits;
