"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import type { CartItem } from "./cart"

interface ReceiptPreviewProps {
  items: CartItem[]
  onPrint?: () => void
}

export function ReceiptPreview({ items, onPrint }: ReceiptPreviewProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.08
  const total = subtotal + tax
  const currentDate = new Date().toLocaleString()

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            Receipt Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">Add items to see receipt preview</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            Receipt Preview
          </span>
          <Button variant="outline" size="sm" onClick={onPrint}>
            Print
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="font-mono text-sm space-y-1 bg-muted p-4 rounded-lg">
          <div className="text-center font-bold border-b pb-2 mb-2">POS SYSTEM</div>
          <div className="text-center text-xs mb-4">{currentDate}</div>

          {items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>
                {item.name} x{item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}

          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-1">
              <span>TOTAL:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="text-center text-xs mt-4 pt-2 border-t">Thank you for your business!</div>
        </div>
      </CardContent>
    </Card>
  )
}
