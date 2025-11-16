"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { ProductGrid } from "@/components/pos/product-grid";
import { Cart, type CartItem } from "@/components/pos/cart";
import { TableGrid } from "@/components/pos/table-grid";
import { GuestCountModal } from "@/components/pos/guest-count-modal";
import { OrderTypeModal } from "@/components/pos/order-type-modal";
import { ReservationModal } from "@/components/reservation/reservation-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import { useToast } from "@/hooks/use-toast";
import { useTables } from "@/hooks/use-tables";
import { ArrowLeft, Users, Clock, Loader2 } from "lucide-react";
import { Product, Table, formatCurrency, formatTime } from "@/lib/data";

export default function POSPage() {
    const {
        tables,
        zones,
        tableStatuses,
        menu,
        selectedTable,
        selectedOrder,
        selectedTableId,
        isLoading,
        selectTable,
        clearSelection,
        addItemToOrder,
        updateOrderItem,
        removeOrderItem,
        startOrder,
        sendOrderToKitchen,
        clearTable,
        makeReservation,
    } = useTables();

    const [isGuestModalOpen, setGuestModalOpen] = useState(false);
    const [isOrderTypeModalOpen, setOrderTypeModalOpen] = useState(false);
    const [isReservationModalOpen, setReservationModalOpen] = useState(false);
    const [tableForModal, setTableForModal] = useState<Table | null>(null);
    const { t } = useLanguage();
    const { toast } = useToast();
    const router = useRouter();

    const handleTableSelect = (table: Table) => {
        if (table.status === "available") {
            setTableForModal(table);
            setOrderTypeModalOpen(true);
        } else {
            selectTable(table);
        }
    };

    const handleDirectOrder = () => {
        setOrderTypeModalOpen(false);
        setGuestModalOpen(true);
    };

    const handleOnlineReservation = () => {
        setOrderTypeModalOpen(false);
        setReservationModalOpen(true);
    };

    const handleReservationConfirm = async (reservationData: {
        customerName: string;
        phone: string;
        time: string;
        note: string;
    }) => {
        if (!tableForModal) return;

        const success = await makeReservation(
            tableForModal.id,
            reservationData
        );

        if (success) {
            setReservationModalOpen(false);
            setTableForModal(null);
            toast({
                title: t("messages.success"),
                description: t("messages.reservationSuccess"),
            });
        } else {
            toast({
                title: t("messages.error"),
                description: t("messages.reservationFailed"),
                variant: "destructive",
            });
        }
    };

    const handleGuestSubmit = (guestCount: number) => {
        if (tableForModal) {
            startOrder(tableForModal.id, guestCount);
            setGuestModalOpen(false);
            setTableForModal(null);
        }
    };

    const handleProductSelect = (product: Product) => {
        if (!selectedTable) return;

        addItemToOrder(selectedTable.id, {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
        });

        toast({
            title: "Đã thêm món",
            description: `${product.name} x1 vào ${selectedTable.name}`,
        });
    };

    const handleUpdateQuantity = (id: string, quantity: number) => {
        if (!selectedTable) return;
        updateOrderItem(selectedTable.id, id, quantity);
    };

    const handleRemoveItem = (id: string) => {
        if (!selectedTable) return;
        removeOrderItem(selectedTable.id, id);
    };

    const cartItems: CartItem[] = selectedOrder
        ? selectedOrder.items.map((item) => ({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
          }))
        : [];

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
            <div className="h-full flex flex-col">
                <div className="p-6 border-b">
                    <div className="flex items-center gap-4">
                        {selectedTable && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearSelection}
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                {t('common.back')}
                            </Button>
                        )}
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold mb-2">
                                {selectedTable
                                    ? `${selectedTable.name}`
                                    : t('pos.title')}
                            </h1>
                            {selectedTable && (
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Users className="h-4 w-4" />
                                        <span>
                                            {selectedOrder?.guestCount ||
                                                selectedTable.capacity}{" "}
                                            {t('common.guests')}
                                        </span>
                                    </div>
                                    {selectedOrder && (
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            <span>
                                                {t('common.startTime')}:{" "}
                                                {formatTime(
                                                    selectedOrder.startTime
                                                )}
                                            </span>
                                        </div>
                                    )}
                                    <Badge
                                        variant={
                                            selectedTable.status === "occupied"
                                                ? "destructive"
                                                : "secondary"
                                        }
                                    >
                                        {selectedTable.status === "occupied"
                                            ? t('tables.status.occupied')
                                            : t('tables.status.available')}
                                    </Badge>
                                </div>
                            )}
                        </div>
                        {selectedTable &&
                            selectedTable.status === "occupied" && (
                                <Button
                                    onClick={() => clearTable(selectedTable.id)}
                                >
                                    {t('tables.clear')}
                                </Button>
                            )}
                    </div>
                </div>

                <div className="flex-1 flex gap-6 p-6 font-normal">
                    <div className="flex-1 min-w-0">
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>
                                    {selectedTable
                                        ? t('pos.menuTitle')
                                        : t('pos.selectTablePrompt')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {selectedTable ? (
                                    <ProductGrid
                                        products={menu.products}
                                        categories={menu.categories}
                                        onProductSelect={handleProductSelect}
                                    />
                                ) : (
                                    <TableGrid
                                        tables={tables}
                                        zones={zones}
                                        tableStatuses={tableStatuses}
                                        selectedTableId={null}
                                        onTableSelect={handleTableSelect}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {selectedTable && (
                        <div className="w-80 shrink-0">
                            <Cart
                                items={cartItems}
                                onUpdateQuantity={handleUpdateQuantity}
                                onRemoveItem={handleRemoveItem}
                                sendOrderToKitchen={sendOrderToKitchen}
                                clearSelection={clearSelection}
                                selectedTableId={selectedTableId}
                            />
                        </div>
                    )}
                </div>
            </div>
            {tableForModal && (
                <>
                    <OrderTypeModal
                        isOpen={isOrderTypeModalOpen}
                        onClose={() => setOrderTypeModalOpen(false)}
                        onDirectOrder={handleDirectOrder}
                        onOnlineReservation={handleOnlineReservation}
                    />
                    <GuestCountModal
                        isOpen={isGuestModalOpen}
                        onClose={() => setGuestModalOpen(false)}
                        onSubmit={handleGuestSubmit}
                        tableName={tableForModal.name}
                    />
                    <ReservationModal
                        isOpen={isReservationModalOpen}
                        onClose={() => setReservationModalOpen(false)}
                        onConfirm={handleReservationConfirm}
                        table={tableForModal}
                    />
                </>
            )}
        </DashboardLayout>
    );
}
