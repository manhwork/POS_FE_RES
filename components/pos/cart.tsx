"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { Minus, Plus, Trash2 } from "lucide-react"
import { CheckoutModal } from "./checkout-modal"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface CartProps {
  items: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
  onCheckout: () => void
}

export function Cart({ items, onUpdateQuantity, onRemoveItem, onCheckout }: CartProps) {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const { t } = useLanguage()

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + tax

  const handleCheckout = () => {
    setShowCheckoutModal(true)
  }

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>{t("pos.cart")}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 space-y-3 mb-4">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">{t("pos.emptyCart")}</p>
                <p className="text-sm text-muted-foreground mt-1">{t("pos.startAdding")}</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button variant="outline" size="sm" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => onRemoveItem(item.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between">
                <span>{t("common.subtotal")}:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("common.tax")} (8%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>{t("common.total")}:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Button className="w-full mt-4" size="lg" onClick={handleCheckout}>
                {t("pos.checkout")} - ${total.toFixed(2)}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        items={items}
        total={total}
      />
    </>
  )
}
