"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, MoreHorizontal, Receipt } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  orderNumber: string
  customerName?: string
  customerEmail?: string
  items: OrderItem[]
  subtotal: number
  tax: number
  total: number
  status: "pending" | "processing" | "completed" | "cancelled" | "refunded"
  paymentMethod: string
  createdAt: string
  updatedAt: string
}

interface OrderTableProps {
  orders: Order[]
  onViewOrder: (order: Order) => void
  onUpdateStatus: (orderId: string, status: Order["status"]) => void
  onPrintReceipt: (order: Order) => void
}

export function OrderTable({ orders, onViewOrder, onUpdateStatus, onPrintReceipt }: OrderTableProps) {
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono font-medium">{order.orderNumber}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{order.customerName || "Walk-in Customer"}</div>
                    {order.customerEmail && <div className="text-sm text-muted-foreground">{order.customerEmail}</div>}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {order.items
                      .slice(0, 2)
                      .map((item) => item.name)
                      .join(", ")}
                    {order.items.length > 2 && "..."}
                  </div>
                </TableCell>
                <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
                <TableCell className="capitalize">{order.paymentMethod}</TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                  <div className="text-xs">{new Date(order.createdAt).toLocaleTimeString()}</div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewOrder(order)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onPrintReceipt(order)}>
                        <Receipt className="h-4 w-4 mr-2" />
                        Print Receipt
                      </DropdownMenuItem>
                      {order.status === "pending" && (
                        <DropdownMenuItem onClick={() => onUpdateStatus(order.id, "processing")}>
                          Mark Processing
                        </DropdownMenuItem>
                      )}
                      {order.status === "processing" && (
                        <DropdownMenuItem onClick={() => onUpdateStatus(order.id, "completed")}>
                          Mark Completed
                        </DropdownMenuItem>
                      )}
                      {(order.status === "pending" || order.status === "processing") && (
                        <DropdownMenuItem
                          onClick={() => onUpdateStatus(order.id, "cancelled")}
                          className="text-destructive"
                        >
                          Cancel Order
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
