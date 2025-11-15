"use client";

import type React from "react";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DisplayInventoryItem } from "@/app/inventory/page";
import { useEffect } from "react";

interface StockAdjustmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (adjustment: {
        itemId: string;
        quantity: number;
        reason: string;
    }) => void;
    item?: DisplayInventoryItem | null;
}

const adjustmentReasons = [
    "Received shipment",
    "Damaged goods",
    "Expired items",
    "Theft/Loss",
    "Inventory correction",
    "Return from customer",
    "Other",
];

export function StockAdjustmentModal({
    isOpen,
    onClose,
    onSave,
    item,
}: StockAdjustmentModalProps) {
    const [quantity, setQuantity] = useState(item?.currentStock || 0);
    const [reason, setReason] = useState("");

    useEffect(() => {
        if (item) {
            setQuantity(item.currentStock);
            setReason("");
        }
    }, [item]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!item) return;

        onSave({
            itemId: item.id,
            quantity: quantity,
            reason: reason,
        });
        onClose();
    };

    if (!item) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Adjust Stock - {item.name}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="quantity">New Stock Quantity</Label>
                        <Input
                            id="quantity"
                            type="number"
                            min="0"
                            value={quantity}
                            onChange={(e) =>
                                setQuantity(Number(e.target.value))
                            }
                            required
                            autoFocus
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="reason">Reason</Label>
                        <Select
                            value={reason}
                            onValueChange={setReason}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                            <SelectContent>
                                {adjustmentReasons.map((r) => (
                                    <SelectItem key={r} value={r}>
                                        {r}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">Save Adjustment</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
