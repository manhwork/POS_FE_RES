"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { InvoiceTable } from "@/components/invoices/invoice-table"
import { InvoiceModal } from "@/components/invoices/invoice-modal"
import { InvoiceDetailsModal } from "@/components/invoices/invoice-details-modal"
import { InvoiceFilters } from "@/components/invoices/invoice-filters"
import { InvoiceStats } from "@/components/invoices/invoice-stats"

interface Invoice {
  id: string
  invoiceNumber: string
  customerName: string
  customerEmail: string
  customerAddress?: string
  issueDate: string
  dueDate: string
  amount: number
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  items: Array<{
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
  notes?: string
}

// Sample data
const sampleInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-001",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    customerAddress: "123 Main St\nNew York, NY 10001",
    issueDate: "2024-01-15",
    dueDate: "2024-02-15",
    amount: 1250.0,
    status: "paid",
    items: [
      { description: "Web Development Services", quantity: 1, unitPrice: 1000.0, total: 1000.0 },
      { description: "Domain Registration", quantity: 1, unitPrice: 250.0, total: 250.0 },
    ],
    notes: "Thank you for your business!",
  },
  {
    id: "2",
    invoiceNumber: "INV-002",
    customerName: "Jane Smith",
    customerEmail: "jane@company.com",
    customerAddress: "456 Business Ave\nLos Angeles, CA 90210",
    issueDate: "2024-01-20",
    dueDate: "2024-02-20",
    amount: 750.0,
    status: "sent",
    items: [
      { description: "Logo Design", quantity: 1, unitPrice: 500.0, total: 500.0 },
      { description: "Business Cards", quantity: 1, unitPrice: 250.0, total: 250.0 },
    ],
  },
  {
    id: "3",
    invoiceNumber: "INV-003",
    customerName: "Bob Johnson",
    customerEmail: "bob@startup.com",
    issueDate: "2024-01-25",
    dueDate: "2024-01-25",
    amount: 2000.0,
    status: "overdue",
    items: [{ description: "Mobile App Development", quantity: 1, unitPrice: 2000.0, total: 2000.0 }],
  },
]

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(sampleInvoices)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | undefined>()
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { toast } = useToast()

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleSave = (invoiceData: Omit<Invoice, "id">) => {
    if (editingInvoice) {
      setInvoices(
        invoices.map((invoice) =>
          invoice.id === editingInvoice.id ? { ...invoiceData, id: editingInvoice.id } : invoice,
        ),
      )
      toast({
        title: "Invoice updated",
        description: `Invoice ${invoiceData.invoiceNumber} has been updated successfully.`,
      })
    } else {
      const newInvoice: Invoice = {
        ...invoiceData,
        id: Date.now().toString(),
      }
      setInvoices([newInvoice, ...invoices])
      toast({
        title: "Invoice created",
        description: `Invoice ${invoiceData.invoiceNumber} has been created successfully.`,
      })
    }
    setIsModalOpen(false)
    setEditingInvoice(undefined)
  }

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice)
    setIsModalOpen(true)
  }

  const handleView = (invoice: Invoice) => {
    setViewingInvoice(invoice)
    setIsDetailsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    const invoice = invoices.find((inv) => inv.id === id)
    setInvoices(invoices.filter((invoice) => invoice.id !== id))
    toast({
      title: "Invoice deleted",
      description: `Invoice ${invoice?.invoiceNumber} has been deleted.`,
      variant: "destructive",
    })
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
  }

  // Calculate stats
  const totalInvoices = invoices.length
  const totalRevenue = invoices.filter((inv) => inv.status === "paid").reduce((sum, inv) => sum + inv.amount, 0)
  const pendingInvoices = invoices.filter((inv) => ["sent", "overdue"].includes(inv.status)).length
  const paidInvoices = invoices.filter((inv) => inv.status === "paid").length

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Invoices</h1>
            <p className="text-muted-foreground">Manage your invoices and billing</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>

        <InvoiceStats
          totalInvoices={totalInvoices}
          totalRevenue={totalRevenue}
          pendingInvoices={pendingInvoices}
          paidInvoices={paidInvoices}
        />

        <InvoiceFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onClearFilters={handleClearFilters}
        />

        <InvoiceTable invoices={filteredInvoices} onEdit={handleEdit} onView={handleView} onDelete={handleDelete} />

        <InvoiceModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingInvoice(undefined)
          }}
          onSave={handleSave}
          invoice={editingInvoice}
        />

        <InvoiceDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false)
            setViewingInvoice(null)
          }}
          invoice={viewingInvoice}
          onEdit={(invoice) => {
            setIsDetailsModalOpen(false)
            handleEdit(invoice)
          }}
        />
      </div>
    </DashboardLayout>
  )
}
