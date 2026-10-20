/**
 * Format giá thành chuẩn xx,xx tỷ (dấu phẩy, luôn 2 chữ số thập phân, làm tròn xuống).
 * Ví dụ:
 * 20_200_000_000 -> "20,20 tỷ"
 * 20_256_000_000 -> "20,25 tỷ"
 */
export const formatPriceBillion = (price?: number | null): string => {
  if (price === null || price === undefined || isNaN(price)) {
    return 'Đang cập nhật';
  }

  // Nếu giá lưu theo đơn vị VND (>= 1_000_000), chia cho 1 tỷ
  const inBillion = price >= 1_000_000 ? price / 1_000_000_000 : price;

  if (inBillion <= 0) {
    return '0,00 tỷ';
  }

  // Làm tròn xuống (round down) đúng 2 chữ số thập phân
  const roundedDown = Math.floor(inBillion * 100) / 100;
  const fixedStr = roundedDown.toFixed(2);
  const [intPart, decPart] = fixedStr.split('.');

  const formattedInt = Number(intPart).toLocaleString('vi-VN');

  return `${formattedInt},${decPart} tỷ`;
};

export const formatPrice = formatPriceBillion;
export default formatPriceBillion;
