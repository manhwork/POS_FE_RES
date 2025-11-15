"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { ProductGrid } from "@/components/pos/product-grid";
import { Cart, type CartItem } from "@/components/pos/cart";
import { TableGrid } from "@/components/pos/table-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import { useToast } from "@/hooks/use-toast";
import { useTables } from "@/hooks/use-tables";
import { ArrowLeft, Users, Clock, Loader2 } from "lucide-react";
import { Product, formatCurrency, formatTime } from "@/lib/data";

export default function POSPage() {
    const {
        tables,
        zones,
        tableStatuses,
        menu,
        selectedTable,
        selectedOrder,
        isLoading,
        selectTable,
        clearSelection,
        addItemToOrder,
        updateOrderItem,
        removeOrderItem,
        completeOrder,
    } = useTables();

    const { t } = useLanguage();
    const { toast } = useToast();

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

    const handleCheckout = () => {
        if (
            !selectedTable ||
            !selectedOrder ||
            selectedOrder.items.length === 0
        )
            return;

        completeOrder(selectedTable.id);
        toast({
            title: "Thanh toán thành công",
            description: `${selectedTable.name} - ${formatCurrency(
                selectedOrder.total
            )}`,
        });
        clearSelection();
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
                                Quay lại
                            </Button>
                        )}
                        <div>
                            <h1 className="text-2xl font-bold mb-2">
                                {selectedTable
                                    ? `${selectedTable.name}`
                                    : "Quản lý nhà hàng"}
                            </h1>
                            {selectedTable && (
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Users className="h-4 w-4" />
                                        <span>
                                            {selectedTable.capacity} chỗ ngồi
                                        </span>
                                    </div>
                                    {selectedOrder && (
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            <span>
                                                Bắt đầu:{" "}
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
                                            ? "Đang phục vụ"
                                            : "Trống"}
                                    </Badge>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex gap-6 p-6 font-normal">
                    <div className="flex-1 min-w-0">
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>
                                    {selectedTable
                                        ? "Menu món ăn"
                                        : "Chọn bàn để bắt đầu"}
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
                                        onTableSelect={selectTable}
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
                                onCheckout={handleCheckout}
                            />
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
