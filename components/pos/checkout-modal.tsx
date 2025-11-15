"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
import { Textarea } from "@/components/ui/textarea";
import { CreditCard, DollarSign, Smartphone } from "lucide-react";
import type { CartItem } from "./cart";
import { useTables } from "@/hooks/use-tables";
import { useToast } from "@/hooks/use-toast";

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    total: number;
    completeOrder: ReturnType<typeof useTables>["completeOrder"];
    clearSelection: () => void;
    selectedTableId: string;
}

export function CheckoutModal({
    isOpen,
    onClose,
    items,
    total,
    completeOrder,
    clearSelection,
    selectedTableId,
}: CheckoutModalProps) {
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [notes, setNotes] = useState("");
    const [amountReceived, setAmountReceived] = useState("");
    const { toast } = useToast();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedTableId) {
            toast({
                title: "Lỗi",
                description: "Không có bàn nào được chọn.",
                variant: "destructive",
            });
            return;
        }

        const completedOrderId = await completeOrder(
            selectedTableId,
            paymentMethod
        );

        if (completedOrderId) {
            toast({
                title: "Thanh toán thành công",
                description: `Đơn hàng đã được lưu.`,
            });
            clearSelection();
            onClose();
            router.push(`/orders?highlight=${completedOrderId}`);
        } else {
            toast({
                title: "Lỗi",
                description: "Không thể lưu đơn hàng. Vui lòng thử lại.",
                variant: "destructive",
            });
        }
    };

    const change = amountReceived
        ? Number.parseFloat(amountReceived) - total
        : 0;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Complete Payment</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Order Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Order Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 mb-4">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between text-sm"
                                    >
                                        <span>
                                            {item.name} x {item.quantity}
                                        </span>
                                        <span>
                                            $
                                            {(
                                                item.price * item.quantity
                                            ).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t pt-2">
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total:</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Method */}
                    <div className="space-y-2">
                        <Label htmlFor="payment-method">Payment Method *</Label>
                        <Select
                            value={paymentMethod}
                            onValueChange={setPaymentMethod}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cash">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4" />
                                        Cash
                                    </div>
                                </SelectItem>
                                <SelectItem value="card">
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="h-4 w-4" />
                                        Credit/Debit Card
                                    </div>
                                </SelectItem>
                                <SelectItem value="mobile">
                                    <div className="flex items-center gap-2">
                                        <Smartphone className="h-4 w-4" />
                                        Mobile Payment
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Cash Payment Fields */}
                    {paymentMethod === "cash" && (
                        <div className="space-y-4 p-4 bg-muted rounded-lg">
                            <div className="space-y-2">
                                <Label htmlFor="amount-received">
                                    Amount Received *
                                </Label>
                                <Input
                                    id="amount-received"
                                    type="number"
                                    step="0.01"
                                    min={total}
                                    value={amountReceived}
                                    onChange={(e) =>
                                        setAmountReceived(e.target.value)
                                    }
                                    placeholder={`Minimum: $${total.toFixed(
                                        2
                                    )}`}
                                    required
                                />
                            </div>
                            {amountReceived && change >= 0 && (
                                <div className="flex justify-between text-lg font-semibold text-green-600">
                                    <span>Change:</span>
                                    <span>${change.toFixed(2)}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Customer Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">
                            Customer Information (Optional)
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="customer-name">
                                    Customer Name
                                </Label>
                                <Input
                                    id="customer-name"
                                    value={customerName}
                                    onChange={(e) =>
                                        setCustomerName(e.target.value)
                                    }
                                    placeholder="Enter customer name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="customer-phone">
                                    Phone Number
                                </Label>
                                <Input
                                    id="customer-phone"
                                    value={customerPhone}
                                    onChange={(e) =>
                                        setCustomerPhone(e.target.value)
                                    }
                                    placeholder="Enter phone number"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="customer-email">
                                Email Address
                            </Label>
                            <Input
                                id="customer-email"
                                type="email"
                                value={customerEmail}
                                onChange={(e) =>
                                    setCustomerEmail(e.target.value)
                                }
                                placeholder="Enter email address"
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add any special notes or instructions"
                            rows={3}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 bg-transparent"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={
                                !paymentMethod ||
                                (paymentMethod === "cash" &&
                                    (!amountReceived ||
                                        Number.parseFloat(amountReceived) <
                                            total))
                            }
                        >
                            Complete Payment - ${total.toFixed(2)}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
