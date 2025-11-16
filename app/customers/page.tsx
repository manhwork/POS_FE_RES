"use client";

import { useState, useMemo, useEffect } from "react";
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
import { Plus, Download, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const { toast } = useToast();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("/api/customers");
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Could not load customer data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomers();
  }, [toast]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.email &&
          customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        customer.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All Status" ||
        (customer.status && customer.status === statusFilter);

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

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="h-full flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

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
