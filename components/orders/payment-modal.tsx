"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Order } from "@/lib/data";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
    onConfirmPayment: (orderId: string, paymentMethod: string) => void;
}

export function PaymentModal({
    isOpen,
    onClose,
    order,
    onConfirmPayment,
}: PaymentModalProps) {
    const [paymentMethod, setPaymentMethod] = useState("cash");

    useEffect(() => {
        if (!isOpen) {
            setPaymentMethod("cash");
        }
    }, [isOpen]);

    if (!order) return null;

    const handleConfirm = () => {
        onConfirmPayment(order.id, paymentMethod);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Thanh toán cho Đơn hàng #{order.id.substring(0, 7)}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="text-lg font-bold">
                        Tổng cộng: ${order.total.toFixed(2)}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="payment-method">
                            Phương thức thanh toán
                        </Label>
                        <Select
                            value={paymentMethod}
                            onValueChange={setPaymentMethod}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cash">Tiền mặt</SelectItem>
                                <SelectItem value="card">Thẻ</SelectItem>
                                <SelectItem value="mobile">
                                    Chuyển khoản
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button onClick={handleConfirm}>Xác nhận Thanh toán</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
