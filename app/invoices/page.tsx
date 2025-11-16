"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { InvoiceTable } from "@/components/invoices/invoice-table";
import { InvoiceModal } from "@/components/invoices/invoice-modal";
import { InvoiceDetailsModal } from "@/components/invoices/invoice-details-modal";
import { InvoiceFilters } from "@/components/invoices/invoice-filters";
import { InvoiceStats } from "@/components/invoices/invoice-stats";
import { PaymentModal } from "@/components/invoices/payment-modal";
import { Invoice, Order } from "@/lib/data";

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [allOrders, setAllOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState<Invoice | undefined>();
    const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
    const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const { toast } = useToast();

    const fetchInvoicesAndOrders = useCallback(async () => {
        setIsLoading(true);
        try {
            const [invoicesRes, ordersRes] = await Promise.all([
                fetch("/api/invoices"),
                fetch("/api/orders"),
            ]);
            const invoicesData: Invoice[] = await invoicesRes.json();
            const ordersData: Order[] = await ordersRes.json();

            setInvoices(invoicesData);
            setAllOrders(ordersData);
        } catch (error) {
            toast({
                title: "Error",
                description: "Could not fetch data.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchInvoicesAndOrders();
    }, [fetchInvoicesAndOrders]);

    const filteredInvoices = useMemo(() => {
        return invoices.filter((invoice) => {
            const matchesSearch =
                invoice.invoiceNumber
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                (invoice.customerName &&
                    invoice.customerName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())) ||
                (invoice.customerPhone &&
                    invoice.customerPhone
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()));

            const matchesStatus =
                statusFilter === "all" || invoice.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [invoices, searchTerm, statusFilter]);

    const handleSave = async (
        invoiceData: Omit<Invoice, "id" | "generatedAt">
    ) => {
        try {
            const method = editingInvoice?.id ? "PUT" : "POST";
            const url = "/api/invoices";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...invoiceData,
                    ...(editingInvoice?.id && { id: editingInvoice.id }),
                }),
            });
            if (!res.ok) throw new Error("Failed to save invoice.");
            toast({
                title: "Success",
                description: `Invoice ${invoiceData.invoiceNumber} saved successfully.`,
            });
            fetchInvoicesAndOrders();
            setIsModalOpen(false);
            setEditingInvoice(undefined);
        } catch (error) {
            toast({
                title: "Error",
                description: "Could not save invoice.",
                variant: "destructive",
            });
        }
    };

    const handleEdit = (invoice: Invoice) => {
        setEditingInvoice(invoice);
        setIsModalOpen(true);
    };

    const handleView = (invoice: Invoice) => {
        setViewingInvoice(invoice);
        setIsDetailsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this invoice?")) return;
        try {
            const res = await fetch("/api/invoices", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            if (!res.ok) throw new Error("Failed to delete invoice.");
            toast({
                title: "Success",
                description: "Invoice deleted successfully.",
            });
            fetchInvoicesAndOrders();
        } catch (error) {
            toast({
                title: "Error",
                description: "Could not delete invoice.",
                variant: "destructive",
            });
        }
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        setStatusFilter("all");
    };

    const handleOpenPaymentModal = (invoice: Invoice) => {
        setPayingInvoice(invoice);
        setIsPaymentModalOpen(true);
    };

    const handleConfirmPayment = async (
        invoiceId: string,
        paymentMethod: string,
        finalTotal: number,
        appliedPromotionId?: string
    ) => {
        try {
            // Update invoice status to paid
            const response = await fetch("/api/invoices", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: invoiceId,
                    status: "paid",
                    paymentMethod,
                    finalTotal,
                    appliedPromotionId,
                }),
            });

            if (!response.ok) throw new Error("Failed to complete payment");

            // Get invoice to find linked orders
            const invoice = invoices.find((inv) => inv.id === invoiceId);
            if (invoice && invoice.orderIds.length > 0) {
                // Deduct inventory for all orders in the invoice
                const ordersToUpdate = allOrders.filter((order) =>
                    invoice.orderIds.includes(order.id)
                );

                const inventoryUpdates: { id: string; change: number }[] = [];
                ordersToUpdate.forEach((order) => {
                    order.items.forEach((item) => {
                        inventoryUpdates.push({
                            id: item.id,
                            change: -item.quantity,
                        });
                    });
                });

                if (inventoryUpdates.length > 0) {
                    await fetch("/api/inventory", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(inventoryUpdates),
                    });
                }

                // Update all linked orders to completed and link to invoice
                await Promise.all(
                    invoice.orderIds.map((orderId) =>
                        fetch("/api/orders", {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                id: orderId,
                                status: "completed",
                                invoiceId: invoiceId,
                                paymentMethod,
                            }),
                        })
                    )
                );

                // Update table status to available
                if (ordersToUpdate.length > 0) {
                    const tableId = ordersToUpdate[0].tableId;
                    // Fetch tables to update status
                    const tablesRes = await fetch("/api/tables");
                    const tablesData = await tablesRes.json();
                    const updatedTables = {
                        ...tablesData,
                        tables: tablesData.tables.map((table: any) => {
                            if (table.id === tableId) {
                                return {
                                    ...table,
                                    status: "available",
                                    currentOrder: undefined,
                                };
                            }
                            return table;
                        }),
                    };
                    await fetch("/api/tables", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(updatedTables),
                    });
                }
            }

            toast({
                title: "Success",
                description: `Thanh toán cho hóa đơn ${invoiceId.substring(
                    0,
                    7
                )} đã hoàn tất.`,
            });
            fetchInvoicesAndOrders();
        } catch (error) {
            toast({
                title: "Error",
                description: "Không thể hoàn tất thanh toán.",
                variant: "destructive",
            });
        }
    };

    // Calculate stats
    const totalInvoices = invoices.length;
    const totalRevenue = invoices
        .filter((inv) => inv.status === "paid")
        .reduce((sum, inv) => sum + inv.amount, 0);
    const pendingInvoices = invoices.filter((inv) =>
        ["sent", "overdue"].includes(inv.status)
    ).length;
    const paidInvoices = invoices.filter((inv) => inv.status === "paid").length;

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
                        <h1 className="text-3xl font-bold">Invoices</h1>
                        <p className="text-muted-foreground">
                            Manage your invoices and billing
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            setEditingInvoice(undefined);
                            setIsModalOpen(true);
                        }}
                    >
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

                <InvoiceTable
                    invoices={filteredInvoices}
                    onEdit={handleEdit}
                    onView={handleView}
                    onDelete={handleDelete}
                    onPay={handleOpenPaymentModal}
                />

                <InvoiceModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingInvoice(undefined);
                    }}
                    onSave={handleSave}
                    invoice={editingInvoice}
                    allOrders={allOrders}
                />

                <InvoiceDetailsModal
                    isOpen={isDetailsModalOpen}
                    onClose={() => {
                        setIsDetailsModalOpen(false);
                        setViewingInvoice(null);
                    }}
                    invoice={viewingInvoice}
                    onEdit={(invoice) => {
                        setIsDetailsModalOpen(false);
                        handleEdit(invoice);
                    }}
                    onPay={(invoice) => {
                        setIsDetailsModalOpen(false);
                        handleOpenPaymentModal(invoice);
                    }}
                />

                <PaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => {
                        setIsPaymentModalOpen(false);
                        setPayingInvoice(null);
                    }}
                    invoice={payingInvoice}
                    onConfirmPayment={handleConfirmPayment}
                />
            </div>
        </DashboardLayout>
    );
}
