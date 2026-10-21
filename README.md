# Dự án Bất Động Sản - Quản Lý Bảng Hàng & Mặt Bằng Dự Án (Scrum-224 Rework)

Hệ thống giao diện Web Portal quản lý thông tin dự án, tra cứu bảng hàng quỹ căn hộ, bộ lọc đa tiêu chí và sơ đồ mặt bằng tương tác phân khu cho các dự án bất động sản cao cấp (mặc định: Vinhomes Ocean Park 3).

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

* **Core**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Build Tool**: [Vite 5](https://vitejs.dev/) (Tối ưu tốc độ HMR và bundle build)
* **UI Component & Styling**: [Material UI v5 (MUI)](https://mui.com/), `@emotion/react`, `@emotion/styled`, `@mui/icons-material`
* **Data Fetching & Server State**: [TanStack React Query v5](https://tanstack.com/query/latest)
* **HTTP Client**: [Axios v1.7.4](https://axios-http.com/)
* **Routing**: [React Router DOM v6](https://reactrouter.com/)

---

## ✨ Tính Năng Nổi Bật

### 1. Chi Tiết Dự Án & Hero Banner
* Hiển thị tên dự án, mô tả chi tiết, ảnh banner full chiều rộng chuẩn thiết kế Desktop & Mobile.
* Hiển thị trạng thái số người đang truy cập trực tuyến (*"100 người đang Online"*).
* Nút chia sẻ nhanh dự án.

### 2. Bảng Hàng Căn Hộ (Units Table)
* Danh sách căn hộ với đầy đủ thông số: Mã căn, Giá bán (tỷ), Loại hình, Diện tích đất, Diện tích xây dựng, Hướng, Phân khu, Tình trạng.
* **Quy tắc phân loại & sắp xếp**:
  * Các căn **Hot (🔥)** luôn được ưu tiên hiển thị lên đầu.
  * Phân biệt màu sắc Badge mã căn: **Xanh** (còn hàng/giữ chỗ), **Cam** (đã bán).
  * Phân trang linh hoạt kết hợp chọn nhanh trang (`Trang [x] Của y`).
* **Modal Chi Tiết Căn Hộ**: Xem gallery hình ảnh bản vẽ kiến trúc, thông số chi tiết và nút định vị trực tiếp trên sơ đồ.

### 3. Bộ Lọc Nâng Cao Đa Tiêu Chí (Advanced Filter)
* Lọc theo Phân khu, Loại hình căn hộ, Hướng ban công/cửa, Trạng thái căn.
* Thanh trượt (Slider) lọc khoảng giá bán (tỷ VNĐ) và khoảng diện tích đất (m²).

### 4. Sơ Đồ Mặt Bằng Quỹ Căn Tương Tác (Master Plan View)
* Bản đồ Vector SVG tương tác mô phỏng toàn bộ các phân khu: *Thời Đại, Vịnh Thiên Đường, Phố Biển, Ánh Dương, Vịnh Tây, Đảo Ngọc*.
* Hỗ trợ **Pan (kéo rê)** và **Zoom (phóng to/thu nhỏ)** mượt mà.
* **Định vị căn hộ**: Tự động pan và zoom vào đúng tọa độ căn hộ khi chọn từ bảng hàng, đi kèm hiệu ứng nhấp nháy (Pulse Marker) và Card thông tin nổi.
* **Hỗ trợ thao tác cảm ứng (Touch Gesture)** mượt mà trên thiết bị di động.

### 5. Cơ Chế Xác Thực & Silent Refresh Token
* **AuthGate**: Khi chưa đăng nhập, bảng hàng được làm mờ (blurred preview) và hiển thị form đăng nhập trang trọng ở giữa.
* **Silent Refresh Token (Tự động làm mới phiên đăng nhập)**:
  * Sử dụng cơ chế **Promise Sharing** (`refreshPromise`): Khi nhiều API cùng gặp lỗi `401 Unauthorized`, hệ thống chỉ bắn duy nhất **1 request `POST /auth/refresh-token`**.
  * Các request khác được xếp hàng chờ token mới rồi tự động retry.
  * Tự động nhận diện lưu trữ (`localStorage` hoặc `sessionStorage`).
  * Nếu backend không trả refreshToken mới, hệ thống tự động giữ lại refreshToken cũ.
  * Đồng bộ tức thì trạng thái đăng nhập trong React qua Custom Event `auth:token-refreshed`.

### 6. Tối Ưu Giao Diện Di Động (Full Responsive Mobile)
* **Header**: Tự động chuyển đổi menu Desktop thành Hamburger Menu dạng Dropdown.
* **Bảng Hàng Mobile**: Tinh gọn chỉ giữ 3 thành phần trọng tâm (**Icon Hot/Vị trí**, **Badge Mã căn**, **Giá bán**), loại bỏ thanh cuộn ngang gây khó dùng.
* **Bộ lọc Mobile**: Tự động chuyển xếp dọc 100% full-width.

---

## 📁 Cấu Trúc Thư Mục (Folder Structure)

```text
src/
├── api/                        # API chung (authApi.ts)
├── components/
│   ├── auth/                   # Form đăng nhập, AuthGate
│   ├── common/                 # Logo SVG, icon dùng chung
│   └── layout/                 # Thanh điều hướng Tab, Footer
├── contexts/                   # React Contexts (AuthContext.tsx)
├── features/
│   └── project-units/          # Feature chính: Bảng hàng & Mặt bằng
│       ├── api/                # API căn hộ (unitApi.ts)
│       ├── components/         # Table, Toolbar, Modal, Filter, Master Plan
│       ├── constants.ts        # Hằng số sắp xếp, phân trang, master data
│       ├── hooks/              # Custom hooks (useUnits, useMasterData, useUnitFilters)
│       ├── types.ts            # Khai báo TypeScript types / interfaces
│       └── utils/              # Helper format giá (formatPrice), hướng, diện tích
├── lib/
│   └── httpClient.ts           # Axios instance, Request/Response Interceptor, Refresh Token
├── pages/
│   └── ProjectDetailPage.tsx  # Trang chi tiết dự án tổng hợp
├── theme.ts                    # Bảng màu chuẩn Figma & cấu hình MUI Theme
├── App.tsx                     # Routing & Providers
└── main.tsx                    # Điểm khởi chạy React
```

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### Yêu Cầu Môi Trường
* **Node.js**: Phiên bản 18.x trở lên
* **npm**: Phiên bản 9.x trở lên

### Cài Đặt
```bash
# 1. Cài đặt các gói dependencies
npm install

# 2. Khởi chạy môi trường phát triển (Dev Server)
npm run dev
```
Trình duyệt sẽ mở tại: `http://localhost:5173/` (mặc định chuyển hướng đến `/projects/65`).

### Kiểm Tra & Build Production
```bash
# Kiểm tra lỗi kiểu dữ liệu TypeScript
npx tsc --noEmit

# Đóng gói sản phẩm (Production Bundle)
npm run build
```

---

## 🌐 Các Biến Môi Trường (Environment Variables)

Tạo file `.env` tại thư mục gốc nếu cần tùy biến:
```env
VITE_API_BASE_URL=https://api-dev.yourdomain.com
```
*(Nếu không khai báo, mặc định `httpClient` sẽ trỏ về `/api`)*.
