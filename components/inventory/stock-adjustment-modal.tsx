"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { InventoryItem } from "./inventory-table"

interface StockAdjustmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (adjustment: {
    itemId: string
    type: "add" | "remove"
    quantity: number
    reason: string
    notes?: string
  }) => void
  item?: InventoryItem | null
}

const adjustmentReasons = [
  "Received shipment",
  "Sale/Usage",
  "Damaged goods",
  "Expired items",
  "Theft/Loss",
  "Inventory correction",
  "Return from customer",
  "Other",
]

export function StockAdjustmentModal({ isOpen, onClose, onSave, item }: StockAdjustmentModalProps) {
  const [formData, setFormData] = useState({
    type: "add" as "add" | "remove",
    quantity: "",
    reason: "",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!item) return

    onSave({
      itemId: item.id,
      type: formData.type,
      quantity: Number.parseInt(formData.quantity),
      reason: formData.reason,
      notes: formData.notes,
    })

    setFormData({
      type: "add",
      quantity: "",
      reason: "",
      notes: "",
    })
    onClose()
  }

  if (!item) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adjust Stock - {item.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Current Stock</Label>
              <div className="p-2 bg-muted rounded text-sm font-medium">{item.currentStock} units</div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Adjustment Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "add" | "remove") => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Add Stock</SelectItem>
                  <SelectItem value="remove">Remove Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Select value={formData.reason} onValueChange={(value) => setFormData({ ...formData, reason: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                {adjustmentReasons.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Additional notes about this adjustment..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Apply Adjustment</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
