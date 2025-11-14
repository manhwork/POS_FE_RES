"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { SupplierTable } from "@/components/suppliers/supplier-table"
import { SupplierModal } from "@/components/suppliers/supplier-modal"
import { SupplierFilters } from "@/components/suppliers/supplier-filters"
import { SupplierStats } from "@/components/suppliers/supplier-stats"

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

// Sample data
const initialSuppliers: Supplier[] = [
  {
    id: "1",
    name: "ABC Electronics Co.",
    contactPerson: "John Smith",
    email: "john@abcelectronics.com",
    phone: "+1 (555) 123-4567",
    address: "123 Industrial Ave, Tech City, TC 12345",
    status: "active",
    productsSupplied: 45,
    totalOrders: 128,
    lastOrderDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Global Food Distributors",
    contactPerson: "Sarah Johnson",
    email: "sarah@globalfood.com",
    phone: "+1 (555) 987-6543",
    address: "456 Commerce St, Business District, BD 67890",
    status: "active",
    productsSupplied: 78,
    totalOrders: 256,
    lastOrderDate: "2024-01-20",
  },
  {
    id: "3",
    name: "Premium Textiles Ltd.",
    contactPerson: "Michael Brown",
    email: "michael@premiumtextiles.com",
    phone: "+1 (555) 456-7890",
    address: "789 Fabric Row, Textile Town, TT 13579",
    status: "inactive",
    productsSupplied: 23,
    totalOrders: 67,
    lastOrderDate: "2023-12-10",
  },
  {
    id: "4",
    name: "Tech Solutions Inc.",
    contactPerson: "Emily Davis",
    email: "emily@techsolutions.com",
    phone: "+1 (555) 321-0987",
    address: "321 Innovation Blvd, Silicon Valley, SV 24680",
    status: "active",
    productsSupplied: 92,
    totalOrders: 189,
    lastOrderDate: "2024-01-18",
  },
]

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filter suppliers
  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || supplier.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Calculate stats
  const totalSuppliers = suppliers.length
  const activeSuppliers = suppliers.filter((s) => s.status === "active").length
  const totalProducts = suppliers.reduce((sum, s) => sum + s.productsSupplied, 0)
  const totalOrders = suppliers.reduce((sum, s) => sum + s.totalOrders, 0)

  const handleAddSupplier = () => {
    setEditingSupplier(null)
    setIsModalOpen(true)
  }

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setIsModalOpen(true)
  }

  const handleDeleteSupplier = (id: string) => {
    setSuppliers(suppliers.filter((s) => s.id !== id))
  }

  const handleSaveSupplier = (
    supplierData: Omit<Supplier, "id" | "productsSupplied" | "totalOrders" | "lastOrderDate">,
  ) => {
    if (editingSupplier) {
      // Update existing supplier
      setSuppliers(suppliers.map((s) => (s.id === editingSupplier.id ? { ...s, ...supplierData } : s)))
    } else {
      // Add new supplier
      const newSupplier: Supplier = {
        ...supplierData,
        id: Date.now().toString(),
        productsSupplied: 0,
        totalOrders: 0,
        lastOrderDate: "Never",
      }
      setSuppliers([...suppliers, newSupplier])
    }
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
  }

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Suppliers</h2>
          <Button onClick={handleAddSupplier}>
            <Plus className="mr-2 h-4 w-4" />
            Add Supplier
          </Button>
        </div>

        <SupplierStats
          totalSuppliers={totalSuppliers}
          activeSuppliers={activeSuppliers}
          totalProducts={totalProducts}
          totalOrders={totalOrders}
        />

        <div className="space-y-4">
          <SupplierFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onClearFilters={handleClearFilters}
          />

          <SupplierTable suppliers={filteredSuppliers} onEdit={handleEditSupplier} onDelete={handleDeleteSupplier} />
        </div>

        <SupplierModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveSupplier}
          supplier={editingSupplier}
        />
      </div>
    </DashboardLayout>
  )
}
