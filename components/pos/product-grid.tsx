"use client"
import { Card, CardContent } from "@/components/ui/card"

interface Product {
  id: string
  name: string
  price: number
  category: string
  image?: string
}

interface ProductGridProps {
  products: Product[]
  onProductSelect: (product: Product) => void
}

const sampleProducts: Product[] = [
  { id: "1", name: "Coffee", price: 3.5, category: "Beverages" },
  { id: "2", name: "Sandwich", price: 8.99, category: "Food" },
  { id: "3", name: "Muffin", price: 4.25, category: "Food" },
  { id: "4", name: "Tea", price: 2.75, category: "Beverages" },
  { id: "5", name: "Salad", price: 12.5, category: "Food" },
  { id: "6", name: "Juice", price: 4.99, category: "Beverages" },
  { id: "7", name: "Bagel", price: 3.75, category: "Food" },
  { id: "8", name: "Smoothie", price: 6.25, category: "Beverages" },
]

export function ProductGrid({ products = sampleProducts, onProductSelect }: ProductGridProps) {
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
              <span className="text-2xl">{product.category === "Beverages" ? "☕" : "🍽️"}</span>
            </div>
            <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
            <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
