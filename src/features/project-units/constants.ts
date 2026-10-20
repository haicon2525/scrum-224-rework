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
  { label: 'Dưới 80m²', min: 0, max: 80 },
  { label: '80m² - 100m²', min: 80, max: 100 },
  { label: '100m² - 150m²', min: 100, max: 150 },
  { label: '150m² - 200m²', min: 150, max: 200 },
  { label: 'Trên 200m²', min: 200, max: undefined },
];

export const PRICE_RANGE_OPTIONS = [
  { label: 'Chọn khoảng giá', min: undefined, max: undefined },
  { label: 'Dưới 10 tỷ', min: 0, max: 10_000_000_000 },
  { label: '10 tỷ - 15 tỷ', min: 10_000_000_000, max: 15_000_000_000 },
  { label: '15 tỷ - 20 tỷ', min: 15_000_000_000, max: 20_000_000_000 },
  { label: '20 tỷ - 30 tỷ', min: 20_000_000_000, max: 30_000_000_000 },
  { label: 'Trên 30 tỷ', min: 30_000_000_000, max: undefined },
];

export const DEFAULT_PAGE_SIZE = 10;
