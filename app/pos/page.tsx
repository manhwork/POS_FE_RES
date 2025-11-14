"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProductGrid } from "@/components/pos/product-grid"
import { Cart, type CartItem } from "@/components/pos/cart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string
  name: string
  price: number
  category: string
}

export default function POSPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const { t } = useLanguage()
  const { toast } = useToast()

  const handleProductSelect = (product: Product) => {
    const existingItem = cartItems.find((item) => item.id === product.id)

    if (existingItem) {
      setCartItems((items) =>
        items.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)),
      )
    } else {
      setCartItems((items) => [
        ...items,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ])
    }

    toast({
      title: t("pos.addToCart"),
      description: `${product.name} x1`,
    })
  }

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      handleRemoveItem(id)
      return
    }
    setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const handleRemoveItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) return

    toast({
      title: t("pos.paymentSuccess"),
      description: "Transaction processed successfully",
    })
    setCartItems([])
  }

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold mb-2">{t("pos.title")}</h1>
        </div>

        <div className="flex-1 flex gap-6 p-6 font-normal">
          <div className="flex-1 min-w-0">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{t("pos.products")}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ProductGrid onProductSelect={handleProductSelect} />
              </CardContent>
            </Card>
          </div>

          <div className="w-80 flex-shrink-0">
            <Cart
              items={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
