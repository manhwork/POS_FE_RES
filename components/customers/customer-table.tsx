"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, MoreHorizontal, Eye, Mail, Phone } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  totalOrders: number
  totalSpent: number
  lastOrderDate?: string
  status: "active" | "inactive"
  createdAt: string
  notes?: string
}

interface CustomerTableProps {
  customers: Customer[]
  onEdit: (customer: Customer) => void
  onView: (customer: Customer) => void
  onDelete: (id: string) => void
}

export function CustomerTable({ customers, onEdit, onView, onDelete }: CustomerTableProps) {
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead>Total Spent</TableHead>
            <TableHead>Last Order</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No customers found
              </TableCell>
            </TableRow>
          ) : (
            customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="font-medium">{customer.name}</div>
                  <div className="text-sm text-muted-foreground">ID: {customer.id}</div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                      <Mail className="h-3 w-3" />
                      {customer.email}
                    </div>
                    {customer.phone && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {customer.phone}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {customer.city && customer.state ? (
                    <div className="text-sm">
                      <div>
                        {customer.city}, {customer.state}
                      </div>
                      {customer.zipCode && <div className="text-muted-foreground">{customer.zipCode}</div>}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">Not provided</span>
                  )}
                </TableCell>
                <TableCell className="font-medium">{customer.totalOrders}</TableCell>
                <TableCell className="font-medium">${customer.totalSpent.toFixed(2)}</TableCell>
                <TableCell className="text-sm">
                  {customer.lastOrderDate ? (
                    <div>
                      <div>{new Date(customer.lastOrderDate).toLocaleDateString()}</div>
                      <div className="text-muted-foreground text-xs">
                        {new Date(customer.lastOrderDate).toLocaleTimeString()}
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Never</span>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(customer.status)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(customer)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(customer)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(customer.id)} className="text-destructive">
                        Delete
                      </DropdownMenuItem>
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
