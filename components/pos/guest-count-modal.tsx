"use client";

import type React from "react";
import { useState } from "react";
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
import { Users } from "lucide-react";

interface GuestCountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (guestCount: number) => void;
    tableName: string;
}

export function GuestCountModal({
    isOpen,
    onClose,
    onSubmit,
    tableName,
}: GuestCountModalProps) {
    const [count, setCount] = useState(1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (count > 0) {
            onSubmit(count);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Số lượng khách cho {tableName}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="guest-count">Nhập số lượng khách</Label>
                        <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="guest-count"
                                type="number"
                                min="1"
                                value={count}
                                onChange={(e) =>
                                    setCount(Number(e.target.value))
                                }
                                className="pl-10"
                                required
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Hủy
                        </Button>
                        <Button type="submit">Xác nhận</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
