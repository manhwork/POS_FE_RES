"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { OrderTable, type Order } from "@/components/orders/order-table";
import { OrderStats } from "@/components/orders/order-stats";
import { OrderFilters } from "@/components/orders/order-filters";
import { OrderDetailsModal } from "@/components/orders/order-details-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample order data
const sampleOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-001",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    items: [
      { id: "1", name: "Premium Coffee", quantity: 2, price: 3.5 },
      { id: "2", name: "Blueberry Muffin", quantity: 1, price: 4.25 },
    ],
    subtotal: 11.25,
    tax: 0.9,
    total: 12.15,
    status: "completed",
    paymentMethod: "credit card",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:35:00Z",
  },
  {
    id: "2",
    orderNumber: "ORD-002",
    items: [
      { id: "3", name: "Club Sandwich", quantity: 1, price: 8.99 },
      { id: "4", name: "Green Tea", quantity: 1, price: 2.75 },
    ],
    subtotal: 11.74,
    tax: 0.94,
    total: 12.68,
    status: "processing",
    paymentMethod: "cash",
    createdAt: "2024-01-15T11:15:00Z",
    updatedAt: "2024-01-15T11:20:00Z",
  },
  {
    id: "3",
    orderNumber: "ORD-003",
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    items: [{ id: "5", name: "Caesar Salad", quantity: 1, price: 12.5 }],
    subtotal: 12.5,
    tax: 1.0,
    total: 13.5,
    status: "pending",
    paymentMethod: "credit card",
    createdAt: "2024-01-15T12:00:00Z",
    updatedAt: "2024-01-15T12:00:00Z",
  },
  {
    id: "4",
    orderNumber: "ORD-004",
    items: [
      { id: "1", name: "Premium Coffee", quantity: 1, price: 3.5 },
      { id: "2", name: "Blueberry Muffin", quantity: 2, price: 4.25 },
    ],
    subtotal: 12.0,
    tax: 0.96,
    total: 12.96,
    status: "cancelled",
    paymentMethod: "cash",
    createdAt: "2024-01-14T15:45:00Z",
    updatedAt: "2024-01-14T16:00:00Z",
  },
  {
    id: "5",
    orderNumber: "ORD-005",
    customerName: "Bob Wilson",
    items: [{ id: "6", name: "Smoothie", quantity: 2, price: 6.25 }],
    subtotal: 12.5,
    tax: 1.0,
    total: 13.5,
    status: "completed",
    paymentMethod: "credit card",
    createdAt: "2024-01-14T09:30:00Z",
    updatedAt: "2024-01-14T09:35:00Z",
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const { toast } = useToast();

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All Status" || order.status === statusFilter;

      // Simple date filtering - in a real app, you'd implement proper date range logic
      let matchesDate = true;
      if (dateFilter === "Today") {
        const today = new Date().toDateString();
        matchesDate = new Date(order.createdAt).toDateString() === today;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const handleUpdateStatus = (orderId: string, status: Order["status"]) => {
    setOrders((orders) =>
      orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status,
              updatedAt: new Date().toISOString(),
            }
          : order,
      ),
    );

    toast({
      title: "Order updated",
      description: `Order status changed to ${status}`,
    });
  };

  const handlePrintReceipt = (order: Order) => {
    toast({
      title: "Printing receipt",
      description: `Receipt for order ${order.orderNumber} sent to printer`,
    });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All Status");
    setDateFilter("All Time");
  };

  const handleExport = () => {
    toast({
      title: "Exporting orders",
      description: "Order data exported to CSV",
    });
  };

  const handleRefresh = () => {
    toast({
      title: "Refreshing orders",
      description: "Order data refreshed",
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/*<div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Order Management</h1>
            <p className="text-muted-foreground">Track and manage customer orders</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>*/}

        {/*<OrderStats orders={orders} />*/}

        {/*<Card>
          <CardHeader>
            <CardTitle>Order Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              dateFilter={dateFilter}
              onDateChange={setDateFilter}
              onClearFilters={handleClearFilters}
            />
          </CardContent>
        </Card>*/}

        <Card>
          <CardHeader>
            <CardTitle>Orders ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderTable
              orders={filteredOrders}
              onViewOrder={handleViewOrder}
              onUpdateStatus={handleUpdateStatus}
              onPrintReceipt={handlePrintReceipt}
            />
          </CardContent>
        </Card>

        <OrderDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          order={selectedOrder}
          onPrintReceipt={handlePrintReceipt}
        />
      </div>
    </DashboardLayout>
  );
}
