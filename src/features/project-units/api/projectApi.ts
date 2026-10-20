import httpClient from '@/lib/httpClient';
import { BaseResponse } from '../types';

export interface ProjectDetail {
  id: number;
  code: string;
  name: string;
  address?: string;
  shortDescription?: string;
  investorId?: number;
  regionCode?: string;
  typeCode?: string;
  typeName?: string;
  statusCode?: string;
  statusName?: string;
  adminId?: number;
  isHot?: boolean;
  fileInfo?: {
    id: number;
    code?: string;
    fileName?: string;
    originalName?: string;
    filePath?: string;
    fileSize?: number;
    contentType?: string;
    isPublic?: boolean;
    fileExtension?: string;
    isTemp?: boolean;
    refId?: number;
    refType?: string;
    refCode?: string;
    fullLink?: string;
  } | null;
}

export const projectApi = {
  getProjectDetail: async (id: number): Promise<BaseResponse<ProjectDetail>> => {
    const response = await httpClient.get<BaseResponse<ProjectDetail>>('/portal/projects/detail', {
      params: { id },
    });
    return response.data;
  },
};

export default projectApi;
