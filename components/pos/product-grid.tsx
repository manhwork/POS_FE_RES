"use client";
import { Card, CardContent } from "@/components/ui/card";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
}

interface ProductGridProps {
  products?: Product[];
  onProductSelect: (product: Product) => void;
}

const sampleProducts: Product[] = [
  // Món chính
  { id: "1", name: "Phở Bò", price: 65000, category: "Món chính" },
  { id: "2", name: "Bún Bò Huế", price: 60000, category: "Món chính" },
  { id: "3", name: "Cơm Tấm", price: 55000, category: "Món chính" },
  { id: "4", name: "Bánh Mì", price: 25000, category: "Món chính" },
  { id: "5", name: "Mì Quảng", price: 70000, category: "Món chính" },
  { id: "6", name: "Cơm Gà", price: 85000, category: "Món chính" },

  // Đồ uống
  { id: "7", name: "Cà Phê Đen", price: 20000, category: "Đồ uống" },
  { id: "8", name: "Cà Phê Sữa", price: 25000, category: "Đồ uống" },
  { id: "9", name: "Trà Đá", price: 10000, category: "Đồ uống" },
  { id: "10", name: "Nước Dừa", price: 30000, category: "Đồ uống" },
  { id: "11", name: "Sinh Tố Bơ", price: 35000, category: "Đồ uống" },
  { id: "12", name: "Bia Saigon", price: 25000, category: "Đồ uống" },

  // Món phụ
  { id: "13", name: "Nem Rán", price: 40000, category: "Món phụ" },
  { id: "14", name: "Gỏi Cuốn", price: 35000, category: "Món phụ" },
  { id: "15", name: "Chả Cá", price: 80000, category: "Món phụ" },
  { id: "16", name: "Bánh Xèo", price: 50000, category: "Món phụ" },

  // Tráng miệng
  { id: "17", name: "Chè Ba Màu", price: 20000, category: "Tráng miệng" },
  { id: "18", name: "Bánh Flan", price: 25000, category: "Tráng miệng" },
  { id: "19", name: "Kem Dừa", price: 30000, category: "Tráng miệng" },
  { id: "20", name: "Trái Cây", price: 35000, category: "Tráng miệng" },
];

export function ProductGrid({
  products = sampleProducts,
  onProductSelect,
}: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {products.map((product) => (
        <Card
          key={product.id}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onProductSelect(product)}
        >
          <CardContent className="p-4">
            <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center">
              <span className="text-2xl">
                {product.category === "Đồ uống"
                  ? "🥤"
                  : product.category === "Món chính"
                    ? "🍜"
                    : product.category === "Món phụ"
                      ? "🥗"
                      : product.category === "Tráng miệng"
                        ? "🍰"
                        : "🍽️"}
              </span>
            </div>
            <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
            <p className="text-lg font-bold text-primary">
              {product.price.toLocaleString("vi-VN")}đ
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
