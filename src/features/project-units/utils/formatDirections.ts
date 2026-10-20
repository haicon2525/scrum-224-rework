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

export const formatDirections = (
  directionCodes?: string[] | string | null,
  masterDataMap?: Record<string, string>
): string => {
  if (!directionCodes) return '-';

  const codes = Array.isArray(directionCodes) ? directionCodes : [directionCodes];
  if (codes.length === 0) return '-';

  return codes
    .map((code) => {
      const upper = code.trim().toUpperCase();
      if (masterDataMap && masterDataMap[code]) {
        return masterDataMap[code];
      }
      return DEFAULT_DIRECTION_MAP[upper] || code;
    })
    .join(', ');
};

export default formatDirections;
