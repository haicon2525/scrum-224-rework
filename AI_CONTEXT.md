# PROJECT AI CONTEXT: SCRUM-224-REWORK (Real Estate Portal)
> **Mục đích**: File tóm tắt kiến trúc và nghiệp vụ dự án với mật độ thông tin tối đa (High Information Density), tối ưu số lượng token để đính kèm trực tiếp vào prompt cho các AI coding assistants (ChatGPT, Claude, Gemini, Cursor, Copilot).

---

## 1. TECH STACK & SYSTEM SPECS
- **Core**: React 18 (SPA), TypeScript, Vite 5.
- **Styling**: Material UI v5 (`@mui/material`, `@mui/icons-material`, Emotion). **KHÔNG dùng TailwindCSS**.
- **State & Server Cache**: `@tanstack/react-query` v5, React Context (`AuthContext`).
- **HTTP Client**: Axios 1.7.4 (custom instance tại `src/lib/httpClient.ts`).
- **Routing**: `react-router-dom` v6. Root route redirect về `/projects/65`.

---

## 2. KEY FILES & ARCHITECTURE
```text
src/
├── lib/httpClient.ts           # Axios instance, Interceptors, Silent Refresh Token (Promise sharing), handleLogout
├── contexts/AuthContext.tsx     # user, token state; login/logout; listen 'auth:unauthorized' & 'auth:token-refreshed'
├── api/authApi.ts               # POST /auth/login, TokenResponse types
├── pages/ProjectDetailPage.tsx  # Trang chi tiết dự án; AppBar + Drawer mobile; Quản lý activeTab qua URL search params
├── theme.ts                     # Palette màu Figma (primary: #0284c7, deepBlue: #0066b2, badge colors...)
└── features/project-units/      # Feature Quỹ căn & Mặt bằng
    ├── api/unitApi.ts           # GET /portal/units/search, /portal/units/detail, /portal/units/images
    ├── types.ts                 # UnitItem, UnitQueryParams, MasterDataItem, PhaseItem
    ├── constants.ts             # DEFAULT_PAGE_SIZE = 10, UNIT_SORT_OPTIONS
    ├── hooks/                   # useUnits, useMasterData, useUnitFilters, useProjectDetail
    └── components/
        ├── UnitsSection.tsx         # Container tab Quỹ căn (Toolbar + AdvancedFilter + UnitsTable + Modal)
        ├── UnitsToolbar.tsx         # Heading "BẢNG HÀNG", 2 Selects (Sort, Status), nút "Bộ lọc"
        ├── AdvancedFilter.tsx       # Bộ lọc 6 ô: Phân khu, Loại hình, Hướng, Slider Giá/Diện tích
        ├── UnitsTable.tsx           # Bảng căn hộ: Desktop 9 cột, Mobile 3 cột, Client pagination
        ├── UnitDetailModal.tsx      # Modal chi tiết căn: Gallery ảnh, thông số, nút "Xem vị trí trên sơ đồ"
        ├── HeroBanner.tsx           # Banner ảnh dự án (full 100% width), nút "Chia sẻ"
        └── ProjectMasterPlanView.tsx# Tab 3: Bản đồ SVG tương tác, Pan/Zoom, Touch gesture, Pin căn hộ
```

---

## 3. AUTHENTICATION & SILENT REFRESH TOKEN
- **Storage**: Nhớ theo lựa chọn đăng nhập: `localStorage` (Remember Me) hoặc `sessionStorage`. Các key: `accessToken`, `refreshToken`, `user`.
- **AuthGate (`src/components/auth/AuthGate.tsx`)**: Chưa đăng nhập -> Render bảng hàng giả bị blur + hiển thị `LoginForm` đè ở giữa (Không gọi API units).
- **Cơ chế Refresh Token (`src/lib/httpClient.ts`)**:
  - Khi gặp **401 Unauthorized**: Bỏ qua nếu URL là `/auth/login` hoặc `/auth/refresh-token`.
  - Dùng cờ `originalRequest._retry = true` chống lặp vô hạn.
  - **Promise Sharing**: Dùng duy nhất một biến `refreshPromise` chia sẻ chung. Khi nhiều API cùng bị 401 đồng thời, chỉ gửi **DUY NHẤT 1 POST `/auth/refresh-token`** (body: `{ refreshToken }`) bằng `axios` trần.
  - Lưu `accessToken` mới vào storage **TRƯỚC** khi retry. Nếu backend không trả `refreshToken` mới, **giữ nguyên `refreshToken` cũ**.
  - Gắn token mới qua `originalRequest.headers.set('Authorization', Bearer ...)` rồi gọi `httpClient(originalRequest)`.
  - Dispatch event `'auth:token-refreshed'` -> `AuthContext` cập nhật state `token` mà không cần F5 trang.
  - Nếu refresh thất bại: `handleLogout()` chạy đúng 1 lần (xóa sạch storage, dispatch `'auth:unauthorized'`), tất cả request đang chờ bị reject.

---

## 4. ROUTING & TAB NAVIGATION
- Path chính: `/projects/:id` (ví dụ: `/projects/65`).
- Query params:
  - `?tab=4`: Tab "Quỹ căn" (Mặc định).
  - `?tab=3`: Tab "Mặt bằng quỹ căn" (Sơ đồ SVG).
  - `unitId` & `unitCode`: Tọa độ & mã căn hộ cần highlight khi định vị.
- **Hành vi nút "Vị trí"**: Bấm icon Location (Pin) trong bảng hoặc trong modal -> Mở tab mới của trình duyệt (`window.open('/projects/:id?tab=3&unitId=...&unitCode=...', '_blank')`). Tab mới tự động pan & zoom căn giữa vào căn hộ.

---

## 5. RESPONSIVE DESIGN RULES (THEO FIGMA MOBILE)
- **Breakpoints**: MUI chuẩn (`xs: < 600px`, `sm: 600-900px`, `md: > 900px`).
- **Header**: Trên mobile hiển thị Logo + *"100 người đang Online"* + **Icon Hamburger 3 gạch** (mở Menu Drawer).
- **HeroBanner**: Ảnh banner luôn `width: '100%'`, `height: 'auto'`, không giới hạn `maxHeight` trên Desktop. Nút "Chia sẻ" full-width trên mobile.
- **UnitsToolbar**: Trên mobile xếp dọc (`column`), các ô Select và nút "Bộ lọc" chiếm `width: 100%`.
- **UnitsTable**:
  - Desktop: 9 cột (Icon, Mã căn, Giá, Loại hình, DT đất, DTXD, Hướng, Phân khu, Tình trạng).
  - Mobile: Chỉ hiển thị **3 thành phần** (`table sx={{ minWidth: { xs: 0, md: 960 } }}`):
    1. Cột icon: **Hot (🔥)** + **Vị trí (📍)**.
    2. Cột **Mã căn**: Badge bo tròn (bấm mở modal chi tiết).
    3. Cột **Giá bán**: Căn lề phải (`align="right"`).
- **Master Plan**: Thao tác chuột trên PC + Thao tác cảm ứng vuốt chạm ngón tay (`onTouchStart`, `onTouchMove`, `onTouchEnd`, `touchAction: 'none'`) trên Mobile. Card popup nổi căn góc dưới responsive `{ xs: 'calc(100% - 24px)', sm: 320 }`.

---

## 6. CODE CONVENTIONS & IMPORTANT PATTERNS
1. **Styling**: Luôn dùng prop `sx={{ ... }}` của MUI và các mã màu từ `src/theme.ts` (`colors.primary`, `colors.deepBlue`, `colors.border`...).
2. **Format giá**: Dùng helper `formatPriceBillion(val)` trong `src/features/project-units/utils/formatPrice.ts` (ví dụ: `20.20 tỷ`).
3. **Căn Hot**: Căn hộ có `isHot === true` luôn được sắp xếp lên đầu danh sách bảng hàng.
4. **Tránh Circular Dependency**: Không import `authApi` vào `httpClient`.
5. **Clean API params**: Hàm `unitApi.getUnits` luôn xóa bỏ các param rỗng (`undefined`, `null`, `""`) trước khi gửi request.
