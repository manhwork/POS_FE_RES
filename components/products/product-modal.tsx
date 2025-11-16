"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
import { Switch } from "@/components/ui/switch";
import { Product, Category } from "@/lib/data";
import { useTranslation } from "react-i18next";

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: Omit<Product, "id">) => void;
    product?: Product | null;
    categories: Category[];
}

const initialFormData = {
    name: "",
    description: "",
    price: 0,
    categoryId: "",
    image: "",
    ingredients: [],
    allergens: [],
    isAvailable: true,
    preparationTime: 10,
    isSpicy: false,
    isAlcoholic: false,
    servingSize: "",
    nutrition: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
    },
};

export function ProductModal({
    isOpen,
    onClose,
    onSave,
    product,
    categories,
}: ProductModalProps) {
    const { t } = useTranslation();
    const [formData, setFormData] =
        useState<Omit<Product, "id">>(initialFormData);

    useEffect(() => {
        if (product) {
            setFormData(product);
        } else {
            setFormData(initialFormData);
        }
    }, [product, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    const handleValueChange = (field: keyof typeof formData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {product ? t("products.editProduct") : t("products.addNewProduct")}
                    </DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 max-h-[80vh] overflow-y-auto p-2"
                >
                    <div className="space-y-2">
                        <Label htmlFor="name">{t("products.productName")}</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                                handleValueChange("name", e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">{t("common.description")}</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) =>
                                handleValueChange("description", e.target.value)
                            }
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">{t("products.price")}</Label>
                            <Input
                                id="price"
                                type="number"
                                value={formData.price}
                                onChange={(e) =>
                                    handleValueChange(
                                        "price",
                                        parseFloat(e.target.value) || 0
                                    )
                                }
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">{t("products.category")}</Label>
                            <Select
                                value={formData.categoryId}
                                onValueChange={(value) =>
                                    handleValueChange("categoryId", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t("products.selectCategory")} />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image">{t("products.imageURL")}</Label>
                        <Input
                            id="image"
                            value={formData.image}
                            onChange={(e) =>
                                handleValueChange("image", e.target.value)
                            }
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="isAvailable"
                            checked={formData.isAvailable}
                            onCheckedChange={(checked) =>
                                handleValueChange("isAvailable", checked)
                            }
                        />
                        <Label htmlFor="isAvailable">{t("products.availableForSale")}</Label>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            {t("common.cancel")}
                        </Button>
                        <Button type="submit">
                            {product ? t("products.updateProduct") : t("products.addProduct")}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
