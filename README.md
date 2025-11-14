# 🍽️ Hệ Thống POS Nhà Hàng Việt Nam

Một hệ thống Point of Sale (POS) hoàn chỉnh được thiết kế đặc biệt cho nhà hàng Việt Nam, được xây dựng với Next.js 15, TypeScript và Tailwind CSS.

## ✨ Tính Năng Chính

### 🪑 Quản Lý Bàn Ăn
- **Hiển thị trực quan**: Grid layout với màu sắc phân biệt trạng thái
- **Phân khu vực**: Trong nhà, ngoài trời, phòng riêng VIP
- **Theo dõi real-time**: Thời gian phục vụ, số món, tổng tiền
- **Đặt bàn**: Hỗ trợ đặt bàn trước với thông tin khách hàng
- **12 bàn**: Đa dạng sức chứa từ 2-10 người

### 🍜 Menu Món Ăn Việt Nam
- **25+ món ăn**: Phở, bún, cơm, chè, lẩu và đồ uống
- **Phân danh mục**: Món chính, khai vị, đồ uống, tráng miệng, lẩu
- **Thông tin chi tiết**: 
  - Mô tả món ăn
  - Thành phần nguyên liệu
  - Thông tin dinh dưỡng
  - Thời gian chế biến
  - Cảnh báo dị ứng
- **Lọc thông minh**: Theo danh mục, độ cay, có cồn

### 💰 Thanh Toán & Hóa Đơn
- **Đa phương thức**: Tiền mặt, thẻ, chuyển khoản, MoMo, ZaloPay
- **Tính toán chính xác**: Thuế VAT 10%, phí phục vụ
- **Format Việt Nam**: Hiển thị VNĐ theo chuẩn địa phương
- **Hóa đơn điện tử**: Header/footer tùy chỉnh

### 🌐 Đa Ngôn Ngữ
- **Tiếng Việt & Tiếng Anh**: Chuyển đổi linh hoạt
- **Localization**: Định dạng tiền tệ, ngày tháng theo địa phương
- **UI/UX**: Thiết kế thân thiện với người dùng Việt Nam

## 🏗️ Kiến Trúc Dự Án

```
POS_FE/
├── 📁 app/                    # Next.js App Router
│   ├── pos/page.tsx          # Trang POS chính
│   ├── products/             # Quản lý sản phẩm
│   ├── customers/            # Quản lý khách hàng
│   └── reports/              # Báo cáo thống kê
├── 📁 components/            # React Components
│   ├── pos/                  # Components POS
│   │   ├── table-grid.tsx   # Grid hiển thị bàn ăn
│   │   ├── product-grid.tsx # Grid menu món ăn
│   │   ├── cart.tsx         # Giỏ hàng/đơn hàng
│   │   └── checkout-modal.tsx # Modal thanh toán
│   └── ui/                   # UI Components (Shadcn/UI)
├── 📁 data/                  # Dữ liệu JSON
│   ├── tables.json          # Dữ liệu bàn ăn
│   ├── menu.json            # Menu món ăn
│   └── settings.json        # Cấu hình hệ thống
├── 📁 hooks/                 # Custom React Hooks
│   └── use-tables.ts        # Hook quản lý bàn ăn
├── 📁 lib/                   # Utilities & Libraries
│   ├── data.ts              # Data access layer
│   └── i18n.ts              # Internationalization
├── 📁 contexts/              # React Context
│   ├── language-context.tsx # Context đa ngôn ngữ
│   └── theme-context.tsx    # Context theme
└── 📁 locales/               # Translation files
    ├── en.json              # Tiếng Anh
    └── vi.json              # Tiếng Việt
```

## 🚀 Bắt Đầu

### Yêu Cầu Hệ Thống
- **Node.js**: ≥ 18.0.0
- **npm/yarn/pnpm**: Package manager
- **Browser**: Chrome, Firefox, Safari (modern browsers)

### Cài Đặt

1. **Clone repository**
```bash
git clone <repository-url>
cd POS_FE
```

2. **Cài đặt dependencies**
```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

3. **Chạy development server**
```bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
```

4. **Mở trình duyệt**
```
http://localhost:3000
```

### Build Production

```bash
npm run build
npm run start
```

## 📊 Cấu Trúc Dữ Liệu

### Dữ Liệu JSON
Tất cả dữ liệu được tổ chức trong các file JSON để dễ quản lý:

- **`/data/tables.json`**: Thông tin bàn ăn, khu vực, trạng thái
- **`/data/menu.json`**: Menu món ăn, danh mục, khuyến mãi
- **`/data/settings.json`**: Cấu hình hệ thống, thuế, thanh toán

### Data Access Layer
```typescript
import { 
  getTablesData, 
  getMenuData, 
  formatCurrency,
  calculateTotal 
} from '@/lib/data';

// Lấy dữ liệu bàn ăn
const { tables, zones } = getTablesData();

// Format tiền tệ Việt Nam
const price = formatCurrency(65000); // "65.000đ"
```

Chi tiết xem: [`/data/README.md`](./data/README.md)

## 🎯 Workflow Sử Dụng

1. **Chọn Bàn**: Click vào bàn trống để bắt đầu đơn hàng
2. **Chọn Món**: Browse menu theo danh mục, thêm món vào đơn
3. **Quản Lý Đơn**: Điều chỉnh số lượng, xóa món không cần
4. **Thanh Toán**: Chọn phương thức thanh toán và hoàn tất
5. **Giải Phóng Bàn**: Bàn tự động chuyển về trạng thái trống

## 🛠️ Stack Công Nghệ

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI + Radix UI
- **Icons**: Lucide React
- **State Management**: React Hooks + Context
- **Data**: Static JSON files
- **I18n**: react-i18next
- **Build Tool**: Next.js built-in

## 🎨 Design System

### Màu Sắc Trạng Thái
- 🟢 **Xanh**: Bàn trống (available)
- 🔴 **Đỏ**: Đang phục vụ (occupied)  
- 🟡 **Vàng**: Đã đặt (reserved)
- ⚪ **Xám**: Dọn dẹp (cleaning)
- 🟠 **Cam**: Bảo trì (maintenance)

### Typography
- **Font**: Geist Sans (primary), Geist Mono (code)
- **Sizes**: Responsive với Tailwind scale

### Components
- **Consistent**: Sử dụng design system thống nhất
- **Accessible**: Tuân thủ WCAG guidelines
- **Responsive**: Mobile-first approach

## 📈 Tối Ưu & Performance

- **Static Generation**: Pre-render tại build time
- **Code Splitting**: Tự động với Next.js
- **Image Optimization**: Next.js Image component
- **Bundle Size**: Tree shaking với ES modules
- **Caching**: Static assets caching

## 🔧 Cấu Hình

### Environment Variables
Tạo file `.env.local`:
```env
NEXT_PUBLIC_APP_NAME="Nhà Hàng Việt Nam"
NEXT_PUBLIC_CURRENCY="VND"
NEXT_PUBLIC_TIMEZONE="Asia/Ho_Chi_Minh"
```

### Customization
- **Theme**: Chỉnh sửa `tailwind.config.js`
- **Languages**: Thêm/sửa files trong `/locales`
- **Data**: Cập nhật files JSON trong `/data`

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build test
npm run build
```

## 📝 Contributing

1. **Fork** repository
2. **Create** feature branch
3. **Commit** changes với conventional commits
4. **Push** và tạo Pull Request
5. **Review** và merge

### Commit Convention
```
feat: thêm tính năng đặt bàn trước
fix: sửa lỗi tính toán thuế
docs: cập nhật README
style: format code
refactor: tối ưu component table-grid
```

## 📄 License

MIT License - xem file [LICENSE](./LICENSE) để biết thêm chi tiết.

## 🤝 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Email**: support@nhahangvietnam.com

## 🙏 Acknowledgments

- **Next.js Team**: Framework tuyệt vời
- **Vercel**: Hosting platform
- **Shadcn**: UI component library
- **Tailwind CSS**: Utility-first CSS framework

---

**🇻🇳 Tự hào sản xuất tại Việt Nam**

*Phiên bản: 1.0.0 | Cập nhật: 15/11/2024*