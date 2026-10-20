import httpClient from '@/lib/httpClient';
import {
  MasterDataListResponse,
  MasterDataFilterParams,
  PhaseListResponse,
  BaseResponse,
} from '../types';

export const masterDataApi = {
  getMasterData: async (params?: MasterDataFilterParams): Promise<MasterDataListResponse> => {
    const response = await httpClient.get<MasterDataListResponse>('/master-data/list', {
      params,
    });
    return response.data;
  },

  getMasterDataGroups: async (): Promise<BaseResponse<string[]>> => {
    const response = await httpClient.get<BaseResponse<string[]>>('/master-data/groups');
    return response.data;
  },

  getPhases: async (projectId: number): Promise<PhaseListResponse> => {
    const response = await httpClient.get<PhaseListResponse>('/portal/phases/list', {
      params: { projectId },
    });
    return response.data;
  },
};

export default masterDataApi;
