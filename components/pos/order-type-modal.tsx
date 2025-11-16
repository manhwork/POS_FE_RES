"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { ShoppingCart, Calendar } from "lucide-react";

interface OrderTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDirectOrder: () => void;
    onOnlineReservation: () => void;
}

export function OrderTypeModal({
    isOpen,
    onClose,
    onDirectOrder,
    onOnlineReservation,
}: OrderTypeModalProps) {
    const router = useRouter();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Chọn loại đặt bàn</DialogTitle>
                    <DialogDescription>
                        Bạn muốn tạo một đơn hàng trực tiếp hay một đơn đặt bàn
                        online?
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 pt-4">
                    <Button
                        variant="outline"
                        className="h-24 flex flex-col"
                        onClick={onOnlineReservation}
                    >
                        <Calendar className="h-8 w-8 mb-2" />
                        <span>Đặt bàn Online</span>
                    </Button>
                    <Button
                        className="h-24 flex flex-col"
                        onClick={onDirectOrder}
                    >
                        <ShoppingCart className="h-8 w-8 mb-2" />
                        <span>Đặt trực tiếp</span>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
