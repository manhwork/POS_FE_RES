"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Table } from "@/lib/data";

interface ReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reservationData: {
        customerName: string;
        phone: string;
        time: string;
        note: string;
    }) => void;
    table: Table | null;
}

export function ReservationModal({
    isOpen,
    onClose,
    onConfirm,
    table,
}: ReservationModalProps) {
    const [customerName, setCustomerName] = useState("");
    const [phone, setPhone] = useState("");
    const [time, setTime] = useState("");
    const [note, setNote] = useState("");

    useEffect(() => {
        if (!isOpen) {
            setCustomerName("");
            setPhone("");
            setTime("");
            setNote("");
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm({ customerName, phone, time, note });
    };

    if (!table) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Đặt bàn Online cho {table.name}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="customerName">Tên khách hàng</Label>
                        <Input
                            id="customerName"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="time">Thời gian</Label>
                        <Input
                            id="time"
                            type="datetime-local"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="note">Ghi chú</Label>
                        <Textarea
                            id="note"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
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
                        <Button type="submit">Xác nhận Đặt bàn</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
