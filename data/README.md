# 📊 Cấu Trúc Dữ Liệu POS System

Thư mục này chứa tất cả dữ liệu cấu hình và master data cho hệ thống POS nhà hàng. Tất cả dữ liệu được tổ chức trong các file JSON để dễ quản lý và bảo trì.

## 📁 Cấu Trúc File

```
data/
├── tables.json     # Dữ liệu bàn ăn và khu vực
├── menu.json       # Menu món ăn và danh mục
├── settings.json   # Cấu hình hệ thống
└── README.md       # Tài liệu này
```

## 🪑 tables.json

Chứa thông tin về bàn ăn, khu vực và trạng thái.

### Cấu trúc:

```json
{
  "tables": [
    {
      "id": "table-1",
      "name": "Bàn 1",
      "capacity": 2,
      "status": "available", // available, occupied, reserved, cleaning, maintenance
      "position": { "x": 1, "y": 1 },
      "zone": "indoor",
      "description": "Mô tả bàn",
      "currentOrder": {
        "id": "order-1",
        "startTime": "2024-11-15T09:30:00.000Z",
        "totalAmount": 250000,
        "itemCount": 3
      },
      "reservation": {
        "customerName": "Tên khách",
        "phone": "0901234567",
        "time": "2024-11-15T12:00:00.000Z",
        "note": "Ghi chú"
      }
    }
  ],
  "zones": [
    {
      "id": "indoor",
      "name": "Khu vực trong nhà",
      "description": "Mô tả khu vực",
      "color": "#e3f2fd"
    }
  ],
  "tableStatuses": [
    {
      "value": "available",
      "label": "Trống",
      "color": "green",
      "description": "Bàn sẵn sàng phục vụ"
    }
  ]
}
```

### Các trạng thái bàn:
- `available`: Bàn trống, sẵn sàng phục vụ
- `occupied`: Bàn có khách đang sử dụng
- `reserved`: Bàn đã được đặt trước
- `cleaning`: Bàn đang được dọn dẹp
- `maintenance`: Bàn đang bảo trì

## 🍽️ menu.json

Chứa thông tin menu, món ăn, danh mục và khuyến mãi.

### Cấu trúc:

```json
{
  "categories": [
    {
      "id": "main-dishes",
      "name": "Món chính",
      "description": "Các món ăn chính",
      "icon": "🍜",
      "order": 1
    }
  ],
  "products": [
    {
      "id": "pho-bo",
      "name": "Phở Bò",
      "description": "Phở bò truyền thống",
      "price": 65000,
      "categoryId": "main-dishes",
      "image": "/images/pho-bo.jpg",
      "ingredients": ["Bánh phở", "Thịt bò"],
      "allergens": ["Gluten"],
      "isAvailable": true,
      "preparationTime": 15,
      "isSpicy": false,
      "isAlcoholic": false,
      "servingSize": "1 người",
      "nutrition": {
        "calories": 450,
        "protein": 25,
        "carbs": 55,
        "fat": 12
      }
    }
  ],
  "allergens": [
    {
      "id": "gluten",
      "name": "Gluten",
      "description": "Chứa gluten từ lúa mì"
    }
  ],
  "promotions": [
    {
      "id": "happy-hour",
      "name": "Happy Hour",
      "description": "Giảm 20% đồ uống",
      "discountType": "percentage", // percentage, fixed
      "discountValue": 20,
      "applicableCategories": ["beverages"],
      "startTime": "14:00",
      "endTime": "16:00",
      "isActive": true
    }
  ]
}
```

### Thông tin món ăn:
- **Cơ bản**: ID, tên, mô tả, giá, danh mục
- **Hình ảnh**: Đường dẫn ảnh món ăn
- **Thành phần**: Nguyên liệu, chất gây dị ứng
- **Tình trạng**: Có sẵn, thời gian chế biến
- **Đặc tính**: Cay, có cồn, khẩu phần
- **Dinh dưỡng**: Calories, protein, carbs, fat

## ⚙️ settings.json

Chứa tất cả cấu hình hệ thống.

### Các phần chính:

#### 🏢 Thông tin nhà hàng:
```json
{
  "restaurant": {
    "name": "Nhà Hàng Việt Nam",
    "address": "123 Đường Lê Lợi, Quận 1, TP.HCM",
    "phone": "028.3829.1234",
    "email": "info@nhahangvietnam.com",
    "taxCode": "0123456789"
  }
}
```

#### 💼 Cấu hình kinh doanh:
```json
{
  "business": {
    "openTime": "06:00",
    "closeTime": "23:00",
    "timezone": "Asia/Ho_Chi_Minh",
    "currency": "VND",
    "language": "vi"
  }
}
```

#### 💰 Cấu hình thuế:
```json
{
  "tax": {
    "defaultTaxRate": 10,
    "serviceCharge": 0,
    "includeTaxInPrice": false
  }
}
```

#### 🧾 Cấu hình hóa đơn:
```json
{
  "receipt": {
    "header": "NHÀ HÀNG VIỆT NAM\n...",
    "footer": "Cảm ơn quý khách!",
    "showTaxBreakdown": true,
    "printCopies": 2
  }
}
```

#### 💳 Phương thức thanh toán:
```json
{
  "payment": {
    "methods": [
      {
        "id": "cash",
        "name": "Tiền mặt",
        "icon": "💵",
        "isEnabled": true,
        "requiresChange": true
      }
    ],
    "defaultMethod": "cash"
  }
}
```

## 📝 Cách Sử Dụng

### Import dữ liệu:
```typescript
import { 
  getTablesData, 
  getMenuData, 
  getSettings 
} from '@/lib/data';

// Lấy dữ liệu bàn ăn
const { tables, zones, tableStatuses } = getTablesData();

// Lấy dữ liệu menu
const { categories, products, allergens } = getMenuData();

// Lấy cấu hình
const settings = getSettings();
```

### Các utility functions:
```typescript
import {
  getTableById,
  getProductsByCategory,
  formatCurrency,
  calculateTax,
  calculateTotal
} from '@/lib/data';

// Tìm bàn theo ID
const table = getTableById('table-1');

// Lấy món ăn theo danh mục
const mainDishes = getProductsByCategory('main-dishes');

// Format tiền tệ
const formattedPrice = formatCurrency(65000); // "65.000đ"

// Tính thuế và tổng tiền
const tax = calculateTax(100000); // 10.000 (10%)
const total = calculateTotal(100000); // 110.000
```

## 🛠️ Quản Lý Dữ Liệu

### Thêm bàn mới:
1. Mở `tables.json`
2. Thêm object vào mảng `tables`
3. Đảm bảo `id` là duy nhất
4. Chọn `zone` từ danh sách có sẵn

### Thêm món ăn mới:
1. Mở `menu.json`
2. Thêm object vào mảng `products`
3. Đảm bảo `categoryId` tồn tại
4. Cung cấp đầy đủ thông tin

### Cập nhật cấu hình:
1. Mở `settings.json`
2. Chỉnh sửa giá trị cần thiết
3. Restart ứng dụng để áp dụng

## ⚠️ Lưu Ý Quan Trọng

1. **Format Date**: Sử dụng ISO 8601 format (`YYYY-MM-DDTHH:mm:ss.sssZ`)
2. **Currency**: Giá cả tính bằng VNĐ (số nguyên)
3. **ID**: Sử dụng kebab-case (`pho-bo`, `table-1`)
4. **Images**: Đường dẫn tương đối từ `/public`
5. **Validation**: Kiểm tra JSON syntax trước khi deploy

## 🔧 Schema Validation

Để đảm bảo tính nhất quán của dữ liệu, nên sử dụng JSON Schema hoặc Zod để validate:

```typescript
// Ví dụ với Zod
import { z } from 'zod';

const TableSchema = z.object({
  id: z.string(),
  name: z.string(),
  capacity: z.number().min(1),
  status: z.enum(['available', 'occupied', 'reserved', 'cleaning', 'maintenance']),
  // ...
});
```

## 📈 Tối Ưu Performance

1. **Lazy Loading**: Chỉ load dữ liệu khi cần
2. **Caching**: Cache dữ liệu trong memory
3. **Compression**: Minify JSON files trong production
4. **CDN**: Host images trên CDN

## 🔄 Migration

Khi cần thay đổi cấu trúc dữ liệu:

1. Tạo script migration
2. Backup dữ liệu hiện tại
3. Update schema
4. Test thoroughly
5. Deploy với rollback plan

---

**Cập nhật lần cuối**: 15/11/2024
**Phiên bản**: 1.0.0