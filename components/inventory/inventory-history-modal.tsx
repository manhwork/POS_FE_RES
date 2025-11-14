"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TrendingUp, TrendingDown, Package, User, Calendar } from "lucide-react"

export interface StockMovement {
  id: string
  date: string
  type: "add" | "remove" | "adjustment" | "sale" | "restock"
  quantity: number
  previousStock: number
  newStock: number
  reason: string
  user: string
  notes?: string
}

interface InventoryHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  itemName: string
  itemSku: string
  movements: StockMovement[]
}

export function InventoryHistoryModal({ isOpen, onClose, itemName, itemSku, movements }: InventoryHistoryModalProps) {
  const getMovementIcon = (type: string) => {
    switch (type) {
      case "add":
      case "restock":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "remove":
      case "sale":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      case "adjustment":
        return <Package className="h-4 w-4 text-blue-600" />
      default:
        return <Package className="h-4 w-4 text-gray-600" />
    }
  }

  const getMovementBadge = (type: string) => {
    const variants = {
      add: "bg-green-100 text-green-800",
      remove: "bg-red-100 text-red-800",
      adjustment: "bg-blue-100 text-blue-800",
      sale: "bg-orange-100 text-orange-800",
      restock: "bg-purple-100 text-purple-800",
    }

    return (
      <Badge variant="secondary" className={variants[type as keyof typeof variants] || "bg-gray-100 text-gray-800"}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Stock Movement History
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            <p className="font-medium">{itemName}</p>
            <p>SKU: {itemSku}</p>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[500px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Stock Change</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No stock movements found
                  </TableCell>
                </TableRow>
              ) : (
                movements.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{new Date(movement.date).toLocaleDateString()}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(movement.date).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getMovementIcon(movement.type)}
                        {getMovementBadge(movement.type)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-medium ${
                          movement.type === "add" || movement.type === "restock" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {movement.type === "add" || movement.type === "restock" ? "+" : "-"}
                        {movement.quantity}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="text-muted-foreground">{movement.previousStock}</span>
                        <span className="mx-2">→</span>
                        <span className="font-medium">{movement.newStock}</span>
                      </div>
                    </TableCell>
                    <TableCell>{movement.reason}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {movement.user}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{movement.notes || "-"}</span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
