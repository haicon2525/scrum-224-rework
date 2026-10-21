import httpClient from '@/lib/httpClient';
import { BaseResponse, ProjectDetail } from '../types';

export type { ProjectDetail };


export const projectApi = {
  getProjectDetail: async (id: number): Promise<BaseResponse<ProjectDetail>> => {
    const response = await httpClient.get<BaseResponse<ProjectDetail>>('/portal/projects/detail', {
      params: { id },
    });
    return response.data;
  },
};

export default projectApi;
