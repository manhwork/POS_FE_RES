"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Phone, Mail, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Supplier {
  id: string
  name: string
  contactPerson: string
  email: string
  phone: string
  address: string
  status: "active" | "inactive"
  productsSupplied: number
  totalOrders: number
  lastOrderDate: string
}

interface SupplierTableProps {
  suppliers: Supplier[]
  onEdit: (supplier: Supplier) => void
  onDelete: (id: string) => void
}

export function SupplierTable({ suppliers, onEdit, onDelete }: SupplierTableProps) {
  const { toast } = useToast()

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete supplier "${name}"?`)) {
      onDelete(id)
      toast({
        title: "Supplier deleted",
        description: `${name} has been removed from the system.`,
      })
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Supplier</TableHead>
            <TableHead>Contact Person</TableHead>
            <TableHead>Contact Info</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead>Last Order</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.map((supplier) => (
            <TableRow key={supplier.id}>
              <TableCell className="font-medium">{supplier.name}</TableCell>
              <TableCell>{supplier.contactPerson}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm">
                    <Phone className="h-3 w-3" />
                    {supplier.phone}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Mail className="h-3 w-3" />
                    {supplier.email}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm">
                  <MapPin className="h-3 w-3" />
                  {supplier.address}
                </div>
              </TableCell>
              <TableCell>{supplier.productsSupplied}</TableCell>
              <TableCell>{supplier.totalOrders}</TableCell>
              <TableCell>{supplier.lastOrderDate}</TableCell>
              <TableCell>
                <Badge variant={supplier.status === "active" ? "default" : "secondary"}>{supplier.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(supplier)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(supplier.id, supplier.name)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
