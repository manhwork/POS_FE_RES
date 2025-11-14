"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, MapPin, Calendar, ShoppingCart } from "lucide-react"
import type { Customer } from "./customer-table"

interface CustomerDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  customer?: Customer | null
  onEdit: (customer: Customer) => void
}

export function CustomerDetailsModal({ isOpen, onClose, customer, onEdit }: CustomerDetailsModalProps) {
  if (!customer) return null

  const getStatusBadge = (status: Customer["status"]) => {
    return (
      <Badge
        variant={status === "active" ? "default" : "secondary"}
        className={status === "active" ? "bg-green-100 text-green-800" : ""}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Customer Details</span>
            <Button variant="outline" size="sm" onClick={() => onEdit(customer)}>
              Edit Customer
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Basic Information</span>
            </div>
            <div className="grid grid-cols-2 gap-4 pl-7">
              <div>
                <div className="text-sm text-muted-foreground">Name</div>
                <div className="font-medium">{customer.name}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <div>{getStatusBadge(customer.status)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Customer ID</div>
                <div className="font-mono text-sm">{customer.id}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Member Since</div>
                <div className="text-sm">{new Date(customer.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Contact Information</span>
            </div>
            <div className="grid grid-cols-1 gap-3 pl-7">
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div>{customer.email}</div>
              </div>
              {customer.phone && (
                <div>
                  <div className="text-sm text-muted-foreground">Phone</div>
                  <div>{customer.phone}</div>
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          {(customer.address || customer.city || customer.state) && (
            <>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Address</span>
                </div>
                <div className="pl-7">
                  {customer.address && <div>{customer.address}</div>}
                  {(customer.city || customer.state) && (
                    <div>
                      {customer.city}
                      {customer.city && customer.state && ", "}
                      {customer.state} {customer.zipCode}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Purchase History */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Purchase History</span>
            </div>
            <div className="grid grid-cols-3 gap-4 pl-7">
              <div>
                <div className="text-sm text-muted-foreground">Total Orders</div>
                <div className="text-2xl font-bold">{customer.totalOrders}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Spent</div>
                <div className="text-2xl font-bold">${customer.totalSpent.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Avg. Order Value</div>
                <div className="text-2xl font-bold">
                  ${customer.totalOrders > 0 ? (customer.totalSpent / customer.totalOrders).toFixed(2) : "0.00"}
                </div>
              </div>
            </div>
            {customer.lastOrderDate && (
              <div className="pl-7">
                <div className="text-sm text-muted-foreground">Last Order</div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(customer.lastOrderDate).toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          {customer.notes && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="font-medium">Notes</div>
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">{customer.notes}</div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
