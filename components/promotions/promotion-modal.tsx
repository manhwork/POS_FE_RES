"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { Promotion } from "@/lib/data";
import { Switch } from "@/components/ui/switch";

interface PromotionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (promotion: Promotion) => void;
    promotion: Promotion | null; // Null for new promotion
}

export function PromotionModal({
    isOpen,
    onClose,
    onSave,
    promotion,
}: PromotionModalProps) {
    const [formData, setFormData] = useState<Promotion>({
        id: "",
        name: "",
        description: "",
        discountType: "percentage",
        discountValue: 0,
        applicableCustomers: [],
        isActive: true, // Default to active
    });

    useEffect(() => {
        if (promotion) {
            setFormData(promotion);
        } else {
            setFormData({
                id: `PROMO-${Date.now()}`,
                name: "",
                description: "",
                discountType: "percentage",
                discountValue: 0,
                applicableCustomers: [],
                isActive: true, // Default to active
            });
        }
    }, [promotion, isOpen]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { id, value } = e.target;
        if (id === "discountValue") {
            setFormData((prev) => ({ ...prev, [id]: Number(value) }));
        } else if (id === "applicableCustomers") {
            setFormData((prev) => ({
                ...prev,
                [id]: value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
            }));
        } else {
            setFormData((prev) => ({ ...prev, [id]: value }));
        }
    };

    const handleSelectChange = (id: string, value: string) => {
        if (id === "discountType") {
            setFormData((prev) => ({
                ...prev,
                [id]: value as "percentage" | "fixed",
            }));
        }
    };

    const handleToggleActive = (checked: boolean) => {
        setFormData((prev) => ({ ...prev, isActive: checked }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {promotion
                            ? "Chỉnh sửa Khuyến mãi"
                            : "Thêm Khuyến mãi mới"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Tên khuyến mãi</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="discountType">Loại giảm giá</Label>
                            <Select
                                value={formData.discountType}
                                onValueChange={(value) =>
                                    handleSelectChange("discountType", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn loại giảm giá" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="percentage">
                                        Phần trăm (%)
                                    </SelectItem>
                                    <SelectItem value="fixed">
                                        Số tiền cố định (đ)
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="discountValue">
                                Giá trị giảm giá
                            </Label>
                            <Input
                                id="discountValue"
                                type="number"
                                value={formData.discountValue}
                                onChange={handleChange}
                                required
                                min="0"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="applicableCustomers">
                            Số điện thoại khách hàng áp dụng (phân cách bằng dấu
                            phẩy)
                        </Label>
                        <Input
                            id="applicableCustomers"
                            value={formData.applicableCustomers.join(", ")}
                            onChange={handleChange}
                            placeholder="VD: 0901234567, 0987654321"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="isActive"
                            checked={formData.isActive}
                            onCheckedChange={handleToggleActive}
                        />
                        <Label htmlFor="isActive">Kích hoạt</Label>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Hủy
                        </Button>
                        <Button type="submit">Lưu Khuyến mãi</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
