"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Receipt, User, Calendar, CreditCard } from "lucide-react"
import type { Order } from "./order-table"

interface OrderDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  order?: Order | null
  onPrintReceipt: (order: Order) => void
}

export function OrderDetailsModal({ isOpen, onClose, order, onPrintReceipt }: OrderDetailsModalProps) {
  if (!order) return null

  const getStatusBadge = (status: Order["status"]) => {
    const variants = {
      pending: "secondary",
      processing: "default",
      completed: "default",
      cancelled: "destructive",
      refunded: "secondary",
    } as const

    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "",
      refunded: "bg-gray-100 text-gray-800",
    }

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order Details - {order.orderNumber}</span>
            <Button variant="outline" size="sm" onClick={() => onPrintReceipt(order)}>
              <Receipt className="h-4 w-4 mr-2" />
              Print Receipt
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Status and Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Order Date</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status</span>
              </div>
              <div>{getStatusBadge(order.status)}</div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Customer Information</span>
            </div>
            <div className="text-sm">
              <div>{order.customerName || "Walk-in Customer"}</div>
              {order.customerEmail && <div className="text-muted-foreground">{order.customerEmail}</div>}
            </div>
          </div>

          {/* Payment Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Payment Method</span>
            </div>
            <div className="text-sm capitalize">{order.paymentMethod}</div>
          </div>

          <Separator />

          {/* Order Items */}
          <div className="space-y-4">
            <h3 className="font-medium">Order Items</h3>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </div>
                  </div>
                  <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Order Summary */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
