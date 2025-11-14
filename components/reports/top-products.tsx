"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ProductData {
  name: string
  sales: number
  revenue: number
}

interface TopProductsProps {
  products: ProductData[]
}

export function TopProducts({ products }: TopProductsProps) {
  const maxSales = Math.max(...products.map((p) => p.sales))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Selling Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product, index) => (
            <div key={product.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-muted-foreground">{product.sales} units sold</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${product.revenue.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">#{index + 1}</div>
                </div>
              </div>
              <Progress value={(product.sales / maxSales) * 100} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
