"use client";

import { useState, useEffect, Suspense, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { OrderTable } from "@/components/orders/order-table";
import { OrderDetailsModal } from "@/components/orders/order-details-modal";
import { PaymentModal } from "@/components/orders/payment-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Order } from "@/lib/data";
import { Loader2 } from "lucide-react";

function OrdersContent() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const highlightId = searchParams.get("highlight");

    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/orders");
            const data: Order[] = await res.json();
            data.sort(
                (a, b) =>
                    new Date(b.startTime).getTime() -
                    new Date(a.startTime).getTime()
            );
            setOrders(data);
        } catch (error) {
            toast({
                title: "Error",
                description: "Could not fetch orders.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleUpdateStatus = async (
        orderId: string,
        status: Order["status"]
    ) => {
        try {
            await fetch("/api/orders", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: orderId, status }),
            });
            toast({
                title: "Success",
                description: `Order ${orderId.substring(
                    0,
                    7
                )} marked as ${status}.`,
            });
            fetchOrders();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update order status.",
                variant: "destructive",
            });
        }
    };

    const handleOpenPaymentModal = (order: Order) => {
        setSelectedOrder(order);
        setIsPaymentModalOpen(true);
    };

    const handleConfirmPayment = async (
        orderId: string,
        paymentMethod: string,
        finalTotal: number,
        appliedPromotionId?: string
    ) => {
        try {
            const response = await fetch("/api/orders", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: orderId,
                    status: "completed",
                    paymentMethod,
                    total: finalTotal,
                    appliedPromotionId,
                }),
            });

            if (!response.ok) throw new Error("Failed to complete payment");

            // Deduct inventory
            const order = orders.find((o) => o.id === orderId);
            if (order) {
                const inventoryUpdates = order.items.map((item) => ({
                    id: item.id,
                    change: -item.quantity,
                }));
                await fetch("/api/inventory", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(inventoryUpdates),
                });
            }

            toast({
                title: "Success",
                description: `Payment for order ${orderId.substring(
                    0,
                    7
                )} confirmed.`,
            });
            fetchOrders();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to confirm payment.",
                variant: "destructive",
            });
        }
    };

    const handleViewOrder = (order: Order) => {
        setSelectedOrder(order);
        setIsDetailsModalOpen(true);
    };

    const filteredOrders = useMemo(() => {
        const pending = orders.filter((o) => o.status === "pending");
        const processing = orders.filter((o) => o.status === "processing");
        const completed = orders.filter((o) => o.status === "completed");
        return { pending, processing, completed };
    }, [orders]);

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <Tabs defaultValue="pending">
                <TabsList>
                    <TabsTrigger value="pending">
                        Bếp ({filteredOrders.pending.length})
                    </TabsTrigger>
                    <TabsTrigger value="processing">
                        Đang xử lý ({filteredOrders.processing.length})
                    </TabsTrigger>
                    <TabsTrigger value="completed">
                        Đã hoàn thành ({filteredOrders.completed.length})
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="pending">
                    <OrderTable
                        orders={filteredOrders.pending}
                        onUpdateStatus={handleUpdateStatus}
                        onViewOrder={handleViewOrder}
                        onPay={handleOpenPaymentModal}
                        highlightId={highlightId}
                    />
                </TabsContent>
                <TabsContent value="processing">
                    <OrderTable
                        orders={filteredOrders.processing}
                        onUpdateStatus={handleUpdateStatus}
                        onViewOrder={handleViewOrder}
                        onPay={handleOpenPaymentModal}
                        highlightId={highlightId}
                    />
                </TabsContent>
                <TabsContent value="completed">
                    <OrderTable
                        orders={filteredOrders.completed}
                        onUpdateStatus={handleUpdateStatus}
                        onViewOrder={handleViewOrder}
                        onPay={handleOpenPaymentModal}
                        highlightId={highlightId}
                    />
                </TabsContent>
            </Tabs>

            <OrderDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                order={selectedOrder}
                onPrintReceipt={() => {}}
            />
            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                order={selectedOrder}
                onConfirmPayment={handleConfirmPayment}
            />
        </div>
    );
}

export default function OrdersPage() {
    return (
        <DashboardLayout>
            <Suspense
                fallback={
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                }
            >
                <OrdersContent />
            </Suspense>
        </DashboardLayout>
    );
}
