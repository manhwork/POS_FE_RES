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
import { Invoice, Promotion } from "@/lib/data";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    invoice: Invoice | null;
    onConfirmPayment: (
        invoiceId: string,
        paymentMethod: string,
        finalTotal: number,
        appliedPromotionId?: string
    ) => void;
}

export function PaymentModal({
    isOpen,
    onClose,
    invoice,
    onConfirmPayment,
}: PaymentModalProps) {
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [customerPhone, setCustomerPhone] = useState("");
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [availablePromotions, setAvailablePromotions] = useState<Promotion[]>(
        []
    );
    const [selectedPromotionId, setSelectedPromotionId] = useState<string>("");
    const [appliedPromotion, setAppliedPromotion] = useState<Promotion | null>(
        null
    );

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const res = await fetch("/api/promotions");
                const data = await res.json();
                setPromotions(data);
            } catch (error) {
                console.error("Error fetching promotions:", error);
            }
        };
        fetchPromotions();
    }, []);

    // Tìm các promotions khả dụng khi nhập SĐT
    useEffect(() => {
        if (customerPhone && customerPhone.trim()) {
            const applicablePromos = promotions.filter((p) =>
                p.applicableCustomers.includes(customerPhone.trim())
            );
            setAvailablePromotions(applicablePromos);

            // Nếu promotion đã chọn không còn trong danh sách khả dụng, bỏ chọn
            if (
                selectedPromotionId &&
                !applicablePromos.find((p) => p.id === selectedPromotionId)
            ) {
                setSelectedPromotionId("");
                setAppliedPromotion(null);
            }
        } else {
            setAvailablePromotions([]);
            setSelectedPromotionId("");
            setAppliedPromotion(null);
        }
    }, [customerPhone, promotions, selectedPromotionId]);

    // Cập nhật applied promotion khi chọn promotion
    useEffect(() => {
        if (selectedPromotionId && selectedPromotionId !== "none") {
            // Tìm promotion từ tất cả promotions (không chỉ availablePromotions)
            const promo = promotions.find((p) => p.id === selectedPromotionId);
            setAppliedPromotion(promo || null);
        } else {
            setAppliedPromotion(null);
        }
    }, [selectedPromotionId, promotions]);

    const finalTotal = useMemo(() => {
        if (!invoice) return 0;
        if (!appliedPromotion) return invoice.amount;

        if (appliedPromotion.discountType === "percentage") {
            return invoice.amount * (1 - appliedPromotion.discountValue / 100);
        } else {
            return Math.max(0, invoice.amount - appliedPromotion.discountValue);
        }
    }, [invoice, appliedPromotion]);

    useEffect(() => {
        if (!isOpen) {
            setPaymentMethod("cash");
            setCustomerPhone("");
            setAppliedPromotion(null);
            setSelectedPromotionId("");
            setAvailablePromotions([]);
        } else if (invoice?.customerPhone) {
            setCustomerPhone(invoice.customerPhone);
        }
    }, [isOpen, invoice]);

    if (!invoice) return null;

    const handleConfirm = () => {
        onConfirmPayment(
            invoice.id,
            paymentMethod,
            finalTotal,
            selectedPromotionId && selectedPromotionId !== "none"
                ? selectedPromotionId
                : undefined
        );
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Thanh toán cho Hóa đơn {invoice.invoiceNumber}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="promotion-select">Mã khuyến mãi</Label>
                        <Select
                            value={selectedPromotionId || "none"}
                            onValueChange={(value) => {
                                if (value === "none") {
                                    setSelectedPromotionId("");
                                } else {
                                    setSelectedPromotionId(value);
                                }
                            }}
                        >
                            <SelectTrigger id="promotion-select">
                                <SelectValue placeholder="Chọn mã khuyến mãi (tùy chọn)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">
                                    -- Không áp dụng --
                                </SelectItem>
                                {promotions.map((promo) => {
                                    const isAvailableForPhone =
                                        customerPhone &&
                                        customerPhone.trim() &&
                                        promo.applicableCustomers.includes(
                                            customerPhone.trim()
                                        );
                                    const shouldDisable = Boolean(
                                        customerPhone &&
                                            customerPhone.trim() &&
                                            !isAvailableForPhone
                                    );
                                    return (
                                        <SelectItem
                                            key={promo.id}
                                            value={promo.id}
                                            disabled={shouldDisable}
                                        >
                                            {`${promo.name} - ${
                                                promo.discountType ===
                                                "percentage"
                                                    ? `Giảm ${promo.discountValue}%`
                                                    : `Giảm ${promo.discountValue.toLocaleString(
                                                          "vi-VN"
                                                      )}đ`
                                            }`}
                                            {isAvailableForPhone && (
                                                <span className="ml-2 text-green-600 text-xs">
                                                    (Áp dụng cho SĐT này)
                                                </span>
                                            )}
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="customer-phone">
                            Số điện thoại khách hàng (nếu có)
                        </Label>
                        <Input
                            id="customer-phone"
                            placeholder="Nhập SĐT để xem khuyến mãi áp dụng"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                        />
                        {customerPhone &&
                            customerPhone.trim() &&
                            availablePromotions.length > 0 && (
                                <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
                                    Có {availablePromotions.length} mã khuyến
                                    mãi áp dụng cho số điện thoại này.
                                </div>
                            )}
                        {customerPhone &&
                            customerPhone.trim() &&
                            availablePromotions.length === 0 && (
                                <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
                                    Số điện thoại này không có mã khuyến mãi khả
                                    dụng.
                                </div>
                            )}
                    </div>

                    {appliedPromotion && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
                            <p className="font-bold">Đã áp dụng khuyến mãi!</p>
                            <p>{appliedPromotion.name}</p>
                            <p>
                                Giảm giá:{" "}
                                {appliedPromotion.discountType === "percentage"
                                    ? `${appliedPromotion.discountValue}%`
                                    : `${appliedPromotion.discountValue.toLocaleString(
                                          "vi-VN"
                                      )}đ`}
                            </p>
                        </div>
                    )}

                    <div className="space-y-2 border-t pt-4">
                        <div className="flex justify-between">
                            <span>Tạm tính:</span>{" "}
                            <span>
                                {invoice.amount.toLocaleString("vi-VN")}đ
                            </span>
                        </div>
                        {appliedPromotion && (
                            <div className="flex justify-between text-destructive">
                                <span>Khuyến mãi:</span>{" "}
                                <span>
                                    -
                                    {(
                                        invoice.amount - finalTotal
                                    ).toLocaleString("vi-VN")}
                                    đ
                                </span>
                            </div>
                        )}
                        <div className="text-lg font-bold flex justify-between">
                            <span>Tổng cộng:</span>{" "}
                            <span>{finalTotal.toLocaleString("vi-VN")}đ</span>
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
