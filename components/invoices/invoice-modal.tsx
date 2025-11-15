"use client";

import type React from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Invoice, Order, InvoiceItem as LibInvoiceItem } from "@/lib/data"; // Renamed to avoid conflict

interface InvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (invoice: Omit<Invoice, "id" | "generatedAt">) => void;
    invoice?: Invoice;
    completedOrders: Order[]; // Completed orders to choose from
}

export function InvoiceModal({
    isOpen,
    onClose,
    onSave,
    invoice,
    completedOrders,
}: InvoiceModalProps) {
    const [formData, setFormData] = useState<
        Omit<Invoice, "id" | "generatedAt">
    >({
        invoiceNumber: "",
        orderId: "",
        customerName: "",
        customerPhone: undefined,
        customerEmail: undefined,
        customerAddress: undefined,
        issueDate: "",
        dueDate: "",
        amount: 0,
        status: "draft",
        items: [],
        notes: undefined,
    });

    const [items, setItems] = useState<LibInvoiceItem[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        if (invoice) {
            setFormData(invoice);
            setItems(invoice.items);
        } else {
            const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
            const today = new Date().toISOString().split("T")[0];
            const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0];

            setFormData({
                invoiceNumber,
                orderId: "",
                customerName: "",
                customerPhone: undefined,
                customerEmail: undefined,
                customerAddress: undefined,
                issueDate: today,
                dueDate,
                amount: 0,
                status: "draft",
                items: [
                    {
                        id: `item-${Date.now()}-1`,
                        name: "",
                        quantity: 1,
                        unitPrice: 0,
                        total: 0,
                    },
                ],
                notes: undefined,
            });
            setItems([
                {
                    id: `item-${Date.now()}-1`,
                    name: "",
                    quantity: 1,
                    unitPrice: 0,
                    total: 0,
                },
            ]);
        }
    }, [invoice, isOpen]);

    const handleOrderSelect = (selectedOrderId: string) => {
        const selectedOrder = completedOrders.find(
            (order) => order.id === selectedOrderId
        );
        if (selectedOrder) {
            const invoiceItems: LibInvoiceItem[] = selectedOrder.items.map(
                (item) => ({
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    unitPrice: item.price,
                    total: item.quantity * item.price,
                })
            );

            setFormData((prev) => ({
                ...prev,
                orderId: selectedOrder.id,
                customerName: selectedOrder.tableName, // Using table name as customer name for now
                customerPhone: undefined, // No customer phone in Order interface
                customerEmail: undefined, // No customer email in Order interface
                amount: selectedOrder.total,
                items: invoiceItems,
            }));
            setItems(invoiceItems);
        } else {
            setFormData((prev) => ({
                ...prev,
                orderId: "",
                customerName: "",
                customerPhone: undefined,
                customerEmail: undefined,
                amount: 0,
                items: [],
            }));
            setItems([]);
        }
    };

    const updateItem = (
        index: number,
        field: keyof LibInvoiceItem,
        value: string | number
    ) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };

        if (field === "quantity" || field === "unitPrice") {
            newItems[index].total =
                newItems[index].quantity * newItems[index].unitPrice;
        }
        setItems(newItems);
    };

    const addItem = () => {
        setItems([
            ...items,
            {
                id: `item-${Date.now()}-${items.length + 1}`,
                name: "",
                quantity: 1,
                unitPrice: 0,
                total: 0,
            },
        ]);
    };

    const removeItem = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const totalAmount = useMemo(
        () => items.reduce((sum, item) => sum + item.total, 0),
        [items]
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.customerName) {
            toast({
                title: "Lỗi",
                description: "Vui lòng nhập tên khách hàng.",
                variant: "destructive",
            });
            return;
        }

        if (items.some((item) => !item.name)) {
            toast({
                title: "Lỗi",
                description: "Vui lòng nhập mô tả cho tất cả các món hàng.",
                variant: "destructive",
            });
            return;
        }

        onSave({
            ...formData,
            items,
            amount: totalAmount,
        });

        toast({
            title: "Thành công",
            description: invoice
                ? "Hóa đơn đã được cập nhật thành công."
                : "Hóa đơn đã được tạo thành công.",
        });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {invoice ? "Chỉnh sửa Hóa đơn" : "Tạo Hóa đơn mới"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="orderId">
                                Chọn Đơn hàng (Đã hoàn thành)
                            </Label>
                            <Select
                                value={formData.orderId}
                                onValueChange={handleOrderSelect}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn một đơn hàng" />
                                </SelectTrigger>
                                <SelectContent>
                                    {completedOrders.map((order) => (
                                        <SelectItem
                                            key={order.id}
                                            value={order.id}
                                        >
                                            {order.tableName} -{" "}
                                            {order.id.substring(0, 7)} - $
                                            {order.total.toFixed(2)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="invoiceNumber">Số Hóa đơn</Label>
                            <Input
                                id="invoiceNumber"
                                value={formData.invoiceNumber}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        invoiceNumber: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="customerName">Tên Khách hàng</Label>
                            <Input
                                id="customerName"
                                value={formData.customerName}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        customerName: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="customerPhone">
                                Số điện thoại Khách hàng
                            </Label>
                            <Input
                                id="customerPhone"
                                value={formData.customerPhone || ""}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        customerPhone: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="customerAddress">
                            Địa chỉ Khách hàng
                        </Label>
                        <Textarea
                            id="customerAddress"
                            value={formData.customerAddress || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    customerAddress: e.target.value,
                                })
                            }
                            rows={2}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="issueDate">Ngày phát hành</Label>
                            <Input
                                id="issueDate"
                                type="date"
                                value={formData.issueDate}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        issueDate: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dueDate">Ngày đáo hạn</Label>
                            <Input
                                id="dueDate"
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        dueDate: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Các mục Hóa đơn</Label>
                            <Button type="button" onClick={addItem} size="sm">
                                <Plus className="h-4 w-4 mr-2" /> Thêm Mục
                            </Button>
                        </div>

                        {items.map((item, index) => (
                            <div
                                key={item.id}
                                className="grid grid-cols-12 gap-2 items-end"
                            >
                                <div className="col-span-5">
                                    <Label>Tên</Label>
                                    <Input
                                        value={item.name}
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                "name",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Mô tả mục"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Label>Số lượng</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                "quantity",
                                                Number(e.target.value) || 1
                                            )
                                        }
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Label>Đơn giá</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={item.unitPrice}
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                "unitPrice",
                                                Number(e.target.value) || 0
                                            )
                                        }
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Label>Tổng cộng</Label>
                                    <Input
                                        value={`$${item.total.toFixed(2)}`}
                                        disabled
                                    />
                                </div>
                                <div className="col-span-1">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeItem(index)}
                                        disabled={items.length === 1}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-end">
                            <div className="text-lg font-semibold">
                                Tổng cộng: ${totalAmount.toFixed(2)}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Trạng thái</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) =>
                                setFormData({
                                    ...formData,
                                    status: value as Invoice["status"],
                                })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Bản nháp</SelectItem>
                                <SelectItem value="sent">Đã gửi</SelectItem>
                                <SelectItem value="paid">
                                    Đã thanh toán
                                </SelectItem>
                                <SelectItem value="overdue">Quá hạn</SelectItem>
                                <SelectItem value="cancelled">
                                    Đã hủy
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Ghi chú</Label>
                        <Textarea
                            id="notes"
                            value={formData.notes || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    notes: e.target.value,
                                })
                            }
                            rows={3}
                            placeholder="Ghi chú hoặc điều khoản bổ sung..."
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Hủy
                        </Button>
                        <Button type="submit">
                            {invoice ? "Cập nhật Hóa đơn" : "Tạo Hóa đơn"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
