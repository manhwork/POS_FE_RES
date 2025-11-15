"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import { useToast } from "@/hooks/use-toast";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CheckoutModal } from "./checkout-modal";
import {
    formatCurrency,
    calculateTax,
    calculateServiceCharge,
    calculateTotal,
} from "@/lib/data";

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

import { useTables } from "@/hooks/use-tables";

interface CartProps {
    items: CartItem[];
    onUpdateQuantity: (id: string, quantity: number) => void;
    onRemoveItem: (id: string) => void;
    sendOrderToKitchen: ReturnType<typeof useTables>["sendOrderToKitchen"];
    clearSelection: () => void;
    selectedTableId: string | null;
}

export function Cart({
    items,
    onUpdateQuantity,
    onRemoveItem,
    sendOrderToKitchen,
    clearSelection,
    selectedTableId,
}: CartProps) {
    const { t } = useLanguage();
    const { toast } = useToast();
    const router = useRouter();

    const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const tax = calculateTax(subtotal);
    const serviceCharge = calculateServiceCharge(subtotal);
    const total = calculateTotal(subtotal);

    const handleSendToKitchen = async () => {
        if (!selectedTableId) return;

        const success = await sendOrderToKitchen(selectedTableId);
        if (success) {
            toast({
                title: "Thành công",
                description: "Đơn hàng đã được gửi đến bếp.",
            });
            console.log("Order sent successfully. Redirecting to /orders...");
            router.push(`/orders`);
        } else {
            toast({
                title: "Lỗi",
                description: "Không thể gửi đơn hàng. Vui lòng thử lại.",
                variant: "destructive",
            });
        }
    };

    return (
        <>
            <Card className="h-full flex flex-col">
                <CardHeader>
                    <CardTitle>Đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                    <div className="flex-1 space-y-3 mb-4">
                        {items.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">
                                    Chưa có món nào
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Chọn món từ menu để bắt đầu
                                </p>
                            </div>
                        ) : (
                            items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between p-3 border rounded-lg"
                                >
                                    <div className="flex-1">
                                        <h4 className="font-medium">
                                            {item.name}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            {formatCurrency(item.price)} mỗi món
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                onUpdateQuantity(
                                                    item.id,
                                                    Math.max(
                                                        0,
                                                        item.quantity - 1
                                                    )
                                                )
                                            }
                                        >
                                            <Minus className="h-3 w-3" />
                                        </Button>
                                        <span className="w-8 text-center font-medium">
                                            {item.quantity}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                onUpdateQuantity(
                                                    item.id,
                                                    item.quantity + 1
                                                )
                                            }
                                        >
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() =>
                                                onRemoveItem(item.id)
                                            }
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {items.length > 0 && (
                        <div className="space-y-2 pt-4 border-t">
                            <div className="flex justify-between">
                                <span>Tạm tính:</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Thuế:</span>
                                <span>{formatCurrency(tax)}</span>
                            </div>
                            {serviceCharge > 0 && (
                                <div className="flex justify-between">
                                    <span>Phí phục vụ:</span>
                                    <span>{formatCurrency(serviceCharge)}</span>
                                </div>
                            )}
                            <div className="flex justify-between font-bold text-lg">
                                <span>Tổng cộng:</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                            <Button
                                className="w-full mt-4"
                                size="lg"
                                onClick={handleSendToKitchen}
                            >
                                Gửi đến bếp
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
