export const MASTER_DATA_GROUPS = {
  UNIT_STATUS: 'UNIT_STATUS',
  UNIT_TYPE: 'UNIT_TYPE',
  DIRECTION: 'DIRECTION',
} as const;

export const UNIT_SORT_OPTIONS = [
  { value: '', label: 'Sắp xếp theo mặc định' },
  { value: 'basePrice,asc', label: 'Giá tăng dần' },
  { value: 'basePrice,desc', label: 'Giá giảm dần' },
  { value: 'areaLand,asc', label: 'Diện tích đất tăng dần' },
  { value: 'areaLand,desc', label: 'Diện tích đất giảm dần' },
  { value: 'unitCode,asc', label: 'Mã căn (A-Z)' },
  { value: 'unitCode,desc', label: 'Mã căn (Z-A)' },
];

export const AREA_RANGE_OPTIONS = [
  { label: 'Chọn diện tích', min: undefined, max: undefined },
  { label: 'Dưới 50m²', min: 0, max: 50 },
  { label: '50m² đến 70m²', min: 50, max: 70 },
  { label: '70m² đến 90m²', min: 70, max: 90 },
  { label: '90m² đến 120m²', min: 90, max: 120 },
  { label: 'Trên 120m2', min: 120, max: undefined },
];

export const PRICE_RANGE_OPTIONS = [
  { label: 'Chọn khoảng giá', min: undefined, max: undefined },
  { label: 'Dưới 5 tỷ', min: 0, max: 5_000_000_000 },
  { label: '5 tới 10 tỷ', min: 5_000_000_000, max: 10_000_000_000 },
  { label: '10 tới 15 tỷ', min: 10_000_000_000, max: 15_000_000_000 },
  { label: '15 tới 20 tỷ', min: 15_000_000_000, max: 20_000_000_000 },
  { label: 'Trên 20 tỷ', min: 20_000_000_000, max: undefined },
];

export const DEFAULT_PAGE_SIZE = 10;
