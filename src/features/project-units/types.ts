export interface BaseResponse<T> {
  code: string;
  message: string;
  debug?: unknown;
  requestId?: string;
  serverTime?: string;
  pageNumber?: number;
  pageSize?: number;
  totalElements?: number;
  totalPages?: number;
  data: T;
}

export interface UnitItem {
  id: number;
  unitCode: string;
  projectId: number;
  phaseId?: number | null;
  phaseName?: string | null;
  buildingId?: number | null;
  buildingName?: string | null;
  floorId?: number | null;
  unitTypeCode?: string | null;
  unitTypeName?: string | null;
  basePrice?: number | null;
  areaLand?: number | null;
  areaBuilding?: number | null;
  directionCodes?: string[] | null;
  statusCode: string;
  statusName?: string | null;
  isHot?: boolean | null;
  buildingType?: 'LOW_RISE' | 'HIGH_RISE' | null;
  unitSource?: 'STANDARD' | 'TRANSFER' | null;
}

export type UnitListResponse = BaseResponse<UnitItem[]>;

export interface UnitQueryParams {
  projectId: number;
  pageNumber?: number;
  pageSize?: number;
  sort?: string;
  unitCode?: string;
  phaseId?: number;
  buildingId?: number;
  floorId?: number;
  unitTypeCode?: string;
  directionCode?: string;
  statusCode?: string;
  minAreaLand?: number;
  maxAreaLand?: number;
  minBasePrice?: number;
  maxBasePrice?: number;
  buildingType?: 'LOW_RISE' | 'HIGH_RISE';
}

export interface MasterDataItem {
  groupCode: string;
  code: string;
  value: string;
  description?: string | null;
  subGroupCode?: string | null;
  sortOrder?: number | null;
}

export type MasterDataListResponse = BaseResponse<MasterDataItem[]>;

export interface MasterDataFilterParams {
  groupCode?: string;
  code?: string;
  subGroupCode?: string;
}

export interface PhaseItem {
  id: number;
  name: string;
  code?: string | null;
  projectId?: number;
}

export type PhaseListResponse = BaseResponse<PhaseItem[]>;
