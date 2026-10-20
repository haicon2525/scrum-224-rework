const DEFAULT_DIRECTION_MAP: Record<string, string> = {
  EAST: 'Đông',
  WEST: 'Tây',
  SOUTH: 'Nam',
  NORTH: 'Bắc',
  SOUTHEAST: 'Đông Nam',
  NORTHEAST: 'Đông Bắc',
  SOUTHWEST: 'Tây Nam',
  NORTHWEST: 'Tây Bắc',
  E: 'Đông',
  W: 'Tây',
  S: 'Nam',
  N: 'Bắc',
  SE: 'Đông Nam',
  NE: 'Đông Bắc',
  SW: 'Tây Nam',
  NW: 'Tây Bắc',
};

import { DirectionItem } from '../types';

export const formatDirections = (
  directions?: DirectionItem[] | string[] | string | null,
  masterDataMap?: Record<string, string>
): string => {
  if (!directions) return '-';

  const list = Array.isArray(directions) ? directions : [directions];
  if (list.length === 0) return '-';

  const formatted = list
    .map((item) => {
      if (!item) return '';

      // Trường hợp item là object { code, value } từ backend
      if (typeof item === 'object') {
        if ('value' in item && item.value) {
          return item.value;
        }
        if ('code' in item && item.code) {
          const upper = item.code.trim().toUpperCase();
          return masterDataMap?.[item.code] || DEFAULT_DIRECTION_MAP[upper] || item.code;
        }
        return '';
      }

      // Trường hợp item là chuỗi mã hướng
      const codeStr = String(item).trim();
      const upper = codeStr.toUpperCase();
      if (masterDataMap && masterDataMap[codeStr]) {
        return masterDataMap[codeStr];
      }
      return DEFAULT_DIRECTION_MAP[upper] || codeStr;
    })
    .filter(Boolean);

  return formatted.length > 0 ? formatted.join(', ') : '-';
};

export default formatDirections;
