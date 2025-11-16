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
import {
    Invoice,
    Order,
    InvoiceItem as LibInvoiceItem,
    Table,
    Promotion,
} from "@/lib/data"; // Renamed to avoid conflict

interface InvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (invoice: Omit<Invoice, "id" | "generatedAt">) => void;
    invoice?: Invoice;
    allOrders: Order[]; // All orders to choose from (to create invoice by table)
}

export function InvoiceModal({
    isOpen,
    onClose,
    onSave,
    invoice,
    allOrders,
}: InvoiceModalProps) {
    const [formData, setFormData] = useState<
        Omit<Invoice, "id" | "generatedAt">
    >({
        invoiceNumber: "",
        orderIds: [],
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
        paymentMethod: undefined,
    });

    const [items, setItems] = useState<LibInvoiceItem[]>([]);
    const [tables, setTables] = useState<Table[]>([]);
    const [selectedTableId, setSelectedTableId] = useState<string>("");
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [selectedPromotionId, setSelectedPromotionId] = useState<string>("");
    const [appliedPromotion, setAppliedPromotion] = useState<Promotion | null>(
        null
    );
    const { toast } = useToast();

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const res = await fetch("/api/tables");
                const data = await res.json();
                setTables(data.tables || []);
            } catch (error) {
                console.error("Error fetching tables:", error);
            }
        };
        const fetchPromotions = async () => {
            try {
                const res = await fetch("/api/promotions");
                const data = await res.json();
                setPromotions(data);
            } catch (error) {
                console.error("Error fetching promotions:", error);
            }
        };
        if (isOpen) {
            fetchTables();
            fetchPromotions();
        }
    }, [isOpen]);

    useEffect(() => {
        if (invoice) {
            setFormData(invoice);
            setItems(invoice.items);
            // Find table from orders if exists
            if (invoice.orderIds.length > 0) {
                const firstOrder = allOrders.find((o) =>
                    invoice.orderIds.includes(o.id)
                );
                if (firstOrder) {
                    setSelectedTableId(firstOrder.tableId);
                }
            }
        } else {
            const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
            const today = new Date().toISOString().split("T")[0];
            const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0];

            setFormData({
                invoiceNumber,
                orderIds: [],
                customerName: "",
                customerPhone: undefined,
                customerEmail: undefined,
                customerAddress: undefined,
                issueDate: today,
                dueDate,
                amount: 0,
                status: "draft",
                items: [],
                notes: undefined,
                paymentMethod: undefined,
            });
            setItems([]);
            setSelectedTableId("");
            setSelectedPromotionId("");
            setAppliedPromotion(null);
        }
    }, [invoice, isOpen, allOrders]);

    // Tính available promotions khi nhập SĐT
    const availablePromotions = useMemo(() => {
        if (formData.customerPhone && formData.customerPhone.trim()) {
            return promotions.filter((p) =>
                p.applicableCustomers.includes(formData.customerPhone!.trim())
            );
        }
        return [];
    }, [formData.customerPhone, promotions]);

    // Cập nhật applied promotion khi chọn promotion
    useEffect(() => {
        if (selectedPromotionId && selectedPromotionId !== "none") {
            const promo = promotions.find((p) => p.id === selectedPromotionId);
            setAppliedPromotion(promo || null);
        } else {
            setAppliedPromotion(null);
        }
    }, [selectedPromotionId, promotions]);

    const handleTableSelect = (tableId: string) => {
        if (tableId === "none") {
            return;
        }

        setSelectedTableId(tableId);

        if (!tableId || tableId === "none") {
            setFormData((prev) => ({
                ...prev,
                orderIds: [],
                customerName: "",
                customerPhone: undefined,
                customerEmail: undefined,
                amount: 0,
                items: [],
            }));
            setItems([]);
            return;
        }

        // Get all orders for this table that don't have an invoice yet
        const tableOrders = allOrders.filter(
            (order) => order.tableId === tableId && !order.invoiceId
        );

        if (tableOrders.length === 0) {
            toast({
                title: "Thông báo",
                description: "Bàn này không có đơn hàng nào chưa thanh toán.",
                variant: "default",
            });
            setFormData((prev) => ({
                ...prev,
                orderIds: [],
                customerName: "",
                customerPhone: undefined,
                customerEmail: undefined,
                amount: 0,
                items: [],
            }));
            setItems([]);
            return;
        }

        // Get table info
        const table = tables.find((t) => t.id === tableId);
        const tableName = table?.name || tableOrders[0]?.tableName || "";

        // Combine all items from all orders
        const allItemsMap = new Map<string, LibInvoiceItem>();

        tableOrders.forEach((order) => {
            order.items.forEach((item) => {
                const existing = allItemsMap.get(item.id);
                if (existing) {
                    // Combine quantities if same item
                    existing.quantity += item.quantity;
                    existing.total = existing.quantity * existing.unitPrice;
                } else {
                    allItemsMap.set(item.id, {
                        id: item.id,
                        name: item.name,
                        quantity: item.quantity,
                        unitPrice: item.price,
                        total: item.quantity * item.price,
                    });
                }
            });
        });

        const invoiceItems = Array.from(allItemsMap.values());
        const totalAmount = invoiceItems.reduce(
            (sum, item) => sum + item.total,
            0
        );

        setFormData((prev) => ({
            ...prev,
            orderIds: tableOrders.map((o) => o.id),
            customerName: tableName,
            customerPhone: undefined,
            customerEmail: undefined,
            amount: totalAmount,
            items: invoiceItems,
        }));
        setItems(invoiceItems);
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

    // Tính lại total khi có promotion
    const finalTotalAmount = useMemo(() => {
        if (!appliedPromotion) return totalAmount;

        if (appliedPromotion.discountType === "percentage") {
            return totalAmount * (1 - appliedPromotion.discountValue / 100);
        } else {
            return Math.max(0, totalAmount - appliedPromotion.discountValue);
        }
    }, [totalAmount, appliedPromotion]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // When creating new invoice, must select a table with orders
        if (!invoice && (!selectedTableId || formData.orderIds.length === 0)) {
            toast({
                title: "Lỗi",
                description: "Vui lòng chọn bàn có đơn hàng để tạo hóa đơn.",
                variant: "destructive",
            });
            return;
        }

        if (!formData.customerName) {
            toast({
                title: "Lỗi",
                description: "Vui lòng nhập tên khách hàng.",
                variant: "destructive",
            });
            return;
        }

        if (items.length === 0 || items.some((item) => !item.name)) {
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
            amount: finalTotalAmount,
            // Lưu promotion ID nếu có (có thể thêm field này vào Invoice interface nếu cần)
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
                            <Label htmlFor="tableId">
                                Chọn Bàn (Thanh toán theo bàn)
                            </Label>
                            <Select
                                value={selectedTableId}
                                onValueChange={handleTableSelect}
                                disabled={!!invoice}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn một bàn" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none" disabled>
                                        -- Chọn bàn --
                                    </SelectItem>
                                    {tables
                                        .filter(
                                            (table) =>
                                                table.status === "occupied" ||
                                                allOrders.some(
                                                    (o) =>
                                                        o.tableId ===
                                                            table.id &&
                                                        !o.invoiceId
                                                )
                                        )
                                        .map((table) => {
                                            const unpaidOrders =
                                                allOrders.filter(
                                                    (o) =>
                                                        o.tableId ===
                                                            table.id &&
                                                        !o.invoiceId
                                                );
                                            const unpaidTotal =
                                                unpaidOrders.reduce(
                                                    (sum, o) => sum + o.total,
                                                    0
                                                );
                                            return (
                                                <SelectItem
                                                    key={table.id}
                                                    value={table.id}
                                                >
                                                    {`${table.name} (${
                                                        unpaidOrders.length
                                                    } đơn - ${unpaidTotal.toLocaleString(
                                                        "vi-VN"
                                                    )}đ)`}
                                                </SelectItem>
                                            );
                                        })}
                                </SelectContent>
                            </Select>
                            {selectedTableId &&
                                formData.orderIds.length > 0 && (
                                    <p className="text-sm text-muted-foreground">
                                        Đã chọn {formData.orderIds.length} đơn
                                        hàng từ bàn này
                                    </p>
                                )}
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
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        customerPhone: e.target.value,
                                    });
                                    // Reset promotion nếu SĐT thay đổi và promotion không còn khả dụng
                                    if (
                                        selectedPromotionId &&
                                        selectedPromotionId !== "none"
                                    ) {
                                        const promo = promotions.find(
                                            (p) => p.id === selectedPromotionId
                                        );
                                        if (
                                            promo &&
                                            e.target.value.trim() &&
                                            !promo.applicableCustomers.includes(
                                                e.target.value.trim()
                                            )
                                        ) {
                                            setSelectedPromotionId("");
                                        }
                                    }
                                }}
                            />
                            {formData.customerPhone &&
                                formData.customerPhone.trim() &&
                                availablePromotions.length > 0 && (
                                    <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-xs">
                                        Có {availablePromotions.length} mã
                                        khuyến mãi áp dụng cho số điện thoại
                                        này.
                                    </div>
                                )}
                            {formData.customerPhone &&
                                formData.customerPhone.trim() &&
                                availablePromotions.length === 0 &&
                                selectedPromotionId && (
                                    <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-xs">
                                        Số điện thoại này không có mã khuyến mãi
                                        khả dụng cho mã đã chọn.
                                    </div>
                                )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="promotion-select">
                            Mã khuyến mãi (tùy chọn)
                        </Label>
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
                                        formData.customerPhone &&
                                        formData.customerPhone.trim() &&
                                        promo.applicableCustomers.includes(
                                            formData.customerPhone.trim()
                                        );
                                    const shouldDisable = Boolean(
                                        formData.customerPhone &&
                                            formData.customerPhone.trim() &&
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
                        {appliedPromotion && (
                            <div className="p-2 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs">
                                <p className="font-bold">
                                    Đã áp dụng: {appliedPromotion.name}
                                </p>
                                <p>
                                    Giảm:{" "}
                                    {appliedPromotion.discountType ===
                                    "percentage"
                                        ? `${appliedPromotion.discountValue}%`
                                        : `${appliedPromotion.discountValue.toLocaleString(
                                              "vi-VN"
                                          )}đ`}
                                </p>
                            </div>
                        )}
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

                        <div className="flex flex-col items-end gap-1">
                            <div className="text-sm text-muted-foreground">
                                Tạm tính: ${totalAmount.toFixed(2)}
                            </div>
                            {appliedPromotion && (
                                <div className="text-sm text-destructive">
                                    Khuyến mãi: -$
                                    {(totalAmount - finalTotalAmount).toFixed(
                                        2
                                    )}
                                </div>
                            )}
                            <div className="text-lg font-semibold">
                                Tổng cộng: ${finalTotalAmount.toFixed(2)}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                                    <SelectItem value="draft">
                                        Bản nháp
                                    </SelectItem>
                                    <SelectItem value="sent">Đã gửi</SelectItem>
                                    <SelectItem value="paid">
                                        Đã thanh toán
                                    </SelectItem>
                                    <SelectItem value="overdue">
                                        Quá hạn
                                    </SelectItem>
                                    <SelectItem value="cancelled">
                                        Đã hủy
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="payment-method">
                                Phương thức thanh toán
                            </Label>
                            <Select
                                value={formData.paymentMethod || "none"}
                                onValueChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        paymentMethod:
                                            value === "none"
                                                ? undefined
                                                : value,
                                    })
                                }
                            >
                                <SelectTrigger id="payment-method">
                                    <SelectValue placeholder="Chọn phương thức thanh toán" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">
                                        -- Chưa chọn --
                                    </SelectItem>
                                    <SelectItem value="cash">
                                        Tiền mặt
                                    </SelectItem>
                                    <SelectItem value="card">Thẻ</SelectItem>
                                    <SelectItem value="mobile">
                                        Chuyển khoản
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
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
