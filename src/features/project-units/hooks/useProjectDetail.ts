import { useQuery } from '@tanstack/react-query';
import { projectApi } from '../api/projectApi';

export const useProjectDetail = (projectId?: number) => {
  return useQuery({
    queryKey: ['project-detail', projectId],
    queryFn: () => projectApi.getProjectDetail(projectId!),
    enabled: Boolean(projectId && !isNaN(projectId)),
    retry: (failureCount, error: any) => {
      // Không retry nếu lỗi 404 Not Found
      if (error?.response?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export default useProjectDetail;
