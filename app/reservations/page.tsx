"use client";

import { DashboardLayout } from "@/components/dashboard-layout";

export default function ReservationsPage() {
    return (
        <DashboardLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold">Quản lý Đặt bàn Online</h1>
                <p className="text-muted-foreground">
                    Xem và quản lý tất cả các đơn đặt bàn online.
                </p>
                {/* Reservation management UI will go here */}
            </div>
        </DashboardLayout>
    );
}
