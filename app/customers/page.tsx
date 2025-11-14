"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  CustomerTable,
  type Customer,
} from "@/components/customers/customer-table";
import { CustomerStats } from "@/components/customers/customer-stats";
import { CustomerFilters } from "@/components/customers/customer-filters";
import { CustomerModal } from "@/components/customers/customer-modal";
import { CustomerDetailsModal } from "@/components/customers/customer-details-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample customer data
const sampleCustomers: Customer[] = [
  {
    id: "CUST-001",
    name: "John Doe",
    email: "john@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    totalOrders: 15,
    totalSpent: 245.75,
    lastOrderDate: "2024-01-15T10:30:00Z",
    status: "active",
    createdAt: "2023-06-15T09:00:00Z",
    notes: "Regular customer, prefers coffee orders in the morning.",
  },
  {
    id: "CUST-002",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "(555) 987-6543",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90210",
    totalOrders: 8,
    totalSpent: 156.4,
    lastOrderDate: "2024-01-12T14:20:00Z",
    status: "active",
    createdAt: "2023-08-22T11:30:00Z",
  },
  {
    id: "CUST-003",
    name: "Bob Wilson",
    email: "bob@example.com",
    totalOrders: 3,
    totalSpent: 45.25,
    lastOrderDate: "2023-12-20T16:45:00Z",
    status: "inactive",
    createdAt: "2023-11-10T13:15:00Z",
    notes: "Moved to different city, may return.",
  },
  {
    id: "CUST-004",
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "(555) 456-7890",
    address: "456 Oak Ave",
    city: "Chicago",
    state: "IL",
    zipCode: "60601",
    totalOrders: 22,
    totalSpent: 387.9,
    lastOrderDate: "2024-01-14T12:10:00Z",
    status: "active",
    createdAt: "2023-05-03T08:45:00Z",
    notes: "VIP customer, always orders large quantities for office meetings.",
  },
  {
    id: "CUST-005",
    name: "Mike Brown",
    email: "mike@example.com",
    phone: "(555) 321-0987",
    totalOrders: 1,
    totalSpent: 12.5,
    lastOrderDate: "2024-01-10T15:30:00Z",
    status: "active",
    createdAt: "2024-01-10T15:25:00Z",
  },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(sampleCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const { toast } = useToast();

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All Status" || customer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customers, searchTerm, statusFilter]);

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailsModalOpen(true);
  };

  const handleSaveCustomer = (
    customerData: Omit<
      Customer,
      "id" | "createdAt" | "totalOrders" | "totalSpent" | "lastOrderDate"
    >,
  ) => {
    if (editingCustomer) {
      // Update existing customer
      setCustomers(
        customers.map((c) =>
          c.id === editingCustomer.id
            ? { ...editingCustomer, ...customerData }
            : c,
        ),
      );
      toast({
        title: "Customer updated",
        description: `${customerData.name} has been updated successfully.`,
      });
    } else {
      // Add new customer
      const newCustomer: Customer = {
        ...customerData,
        id: `CUST-${String(customers.length + 1).padStart(3, "0")}`,
        totalOrders: 0,
        totalSpent: 0,
        createdAt: new Date().toISOString(),
      };
      setCustomers([newCustomer, ...customers]);
      toast({
        title: "Customer added",
        description: `${customerData.name} has been added successfully.`,
      });
    }
  };

  const handleDeleteCustomer = (id: string) => {
    const customer = customers.find((c) => c.id === id);
    setCustomers(customers.filter((c) => c.id !== id));
    toast({
      title: "Customer deleted",
      description: `${customer?.name} has been deleted.`,
      variant: "destructive",
    });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All Status");
  };

  const handleExport = () => {
    toast({
      title: "Exporting customers",
      description: "Customer data exported to CSV",
    });
  };

  const handleImport = () => {
    toast({
      title: "Import customers",
      description: "Bulk import feature coming soon",
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Customer Management</h1>
            <p className="text-muted-foreground">
              Manage your customer relationships
            </p>
          </div>
          <div className="flex gap-2">
            {/*<Button variant="outline" onClick={handleImport}>
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>*/}
            <Button onClick={handleAddCustomer}>
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </div>
        </div>

        {/*<CustomerStats customers={customers} />*/}

        {/*<Card>
          <CardHeader>
            <CardTitle>Customer Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomerFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              onClearFilters={handleClearFilters}
            />
          </CardContent>
        </Card>*/}

        <Card>
          <CardHeader>
            <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomerTable
              customers={filteredCustomers}
              onEdit={handleEditCustomer}
              onView={handleViewCustomer}
              onDelete={handleDeleteCustomer}
            />
          </CardContent>
        </Card>

        <CustomerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveCustomer}
          customer={editingCustomer}
        />

        <CustomerDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          customer={selectedCustomer}
          onEdit={handleEditCustomer}
        />
      </div>
    </DashboardLayout>
  );
}
