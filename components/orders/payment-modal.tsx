"use client";

import { useState, useEffect, useMemo } from "react";
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
import { Order, Promotion } from "@/lib/data";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
    onConfirmPayment: (
        orderId: string,
        paymentMethod: string,
        finalTotal: number,
        appliedPromotionId?: string
    ) => void;
}

export function PaymentModal({
    isOpen,
    onClose,
    order,
    onConfirmPayment,
}: PaymentModalProps) {
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [customerPhone, setCustomerPhone] = useState("");
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [appliedPromotion, setAppliedPromotion] = useState<Promotion | null>(
        null
    );

    useEffect(() => {
        const fetchPromotions = async () => {
            const res = await fetch("/api/promotions");
            const data = await res.json();
            setPromotions(data);
        };
        fetchPromotions();
    }, []);

    useEffect(() => {
        if (customerPhone) {
            const applicablePromo = promotions.find((p) =>
                p.applicableCustomers.includes(customerPhone)
            );
            setAppliedPromotion(applicablePromo || null);
        } else {
            setAppliedPromotion(null);
        }
    }, [customerPhone, promotions]);

    const finalTotal = useMemo(() => {
        if (!order) return 0;
        if (!appliedPromotion) return order.total;

        if (appliedPromotion.discountType === "percentage") {
            return order.total * (1 - appliedPromotion.discountValue / 100);
        } else {
            return Math.max(0, order.total - appliedPromotion.discountValue);
        }
    }, [order, appliedPromotion]);

    useEffect(() => {
        if (!isOpen) {
            setPaymentMethod("cash");
            setCustomerPhone("");
            setAppliedPromotion(null);
        }
    }, [isOpen]);

    if (!order) return null;

    const handleConfirm = () => {
        onConfirmPayment(
            order.id,
            paymentMethod,
            finalTotal,
            appliedPromotion?.id
        );
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
                    <div className="space-y-2">
                        <Label htmlFor="customer-phone">
                            Số điện thoại khách hàng (nếu có)
                        </Label>
                        <Input
                            id="customer-phone"
                            placeholder="Nhập SĐT để áp dụng khuyến mãi"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                        />
                    </div>

                    {appliedPromotion && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
                            <p className="font-bold">Đã áp dụng khuyến mãi!</p>
                            <p>{appliedPromotion.name}</p>
                            <p>
                                Giảm giá:{" "}
                                {appliedPromotion.discountType === "percentage"
                                    ? `${appliedPromotion.discountValue}%`
                                    : `${appliedPromotion.discountValue.toLocaleString()}đ`}
                            </p>
                        </div>
                    )}

                    <div className="space-y-2 border-t pt-4">
                        <div className="flex justify-between">
                            <span>Tạm tính:</span>{" "}
                            <span>${order.total.toFixed(2)}</span>
                        </div>
                        {appliedPromotion && (
                            <div className="flex justify-between text-destructive">
                                <span>Khuyến mãi:</span>{" "}
                                <span>
                                    -${(order.total - finalTotal).toFixed(2)}
                                </span>
                            </div>
                        )}
                        <div className="text-lg font-bold flex justify-between">
                            <span>Tổng cộng:</span>{" "}
                            <span>${finalTotal.toFixed(2)}</span>
                        </div>
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
