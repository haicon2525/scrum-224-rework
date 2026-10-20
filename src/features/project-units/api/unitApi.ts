import httpClient from '@/lib/httpClient';
import { UnitListResponse, UnitQueryParams, UnitItem, BaseResponse } from '../types';

export const unitApi = {
  getUnits: async (params: UnitQueryParams): Promise<UnitListResponse> => {
    const response = await httpClient.get<UnitListResponse>('/portal/units/search', {
      params,
    });
    return response.data;
  },

  getUnitDetail: async (params: { id?: number; unitCode?: string }): Promise<BaseResponse<UnitItem>> => {
    const response = await httpClient.get<BaseResponse<UnitItem>>('/portal/units/detail', {
      params,
    });
    return response.data;
  },

  getUnitImages: async (unitId: number): Promise<BaseResponse<string[]>> => {
    const response = await httpClient.get<BaseResponse<string[]>>('/portal/units/images', {
      params: { unitId },
    });
    return response.data;
  },
};

export default unitApi;
