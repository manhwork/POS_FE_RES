"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { ReservationTable } from "@/components/reservation/reservation-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Table } from "@/lib/data";
import { Loader2 } from "lucide-react";

export default function ReservationsPage() {
    const [reservations, setReservations] = useState<Table[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchReservations = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/tables");
            const data = await res.json();
            const reservedTables = data.tables.filter(
                (table: Table) => table.status === "reserved"
            );
            setReservations(reservedTables);
        } catch (error) {
            toast({
                title: "Error",
                description: "Could not fetch reservations.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchReservations();
    }, [fetchReservations]);

    const handleCancelReservation = async (tableId: string) => {
        if (!confirm("Are you sure you want to cancel this reservation?"))
            return;

        try {
            const tablesRes = await fetch("/api/tables");
            const tablesData = await tablesRes.json();
            const tables = tablesData.tables;

            const tableIndex = tables.findIndex((t: Table) => t.id === tableId);
            if (tableIndex > -1) {
                tables[tableIndex].status = "available";
                delete tables[tableIndex].reservation;
            }

            await fetch("/api/tables", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tables }),
            });

            toast({ title: "Success", description: "Reservation cancelled." });
            fetchReservations();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to cancel reservation.",
                variant: "destructive",
            });
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="h-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold">Quản lý Đặt bàn Online</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Danh sách Bàn đã đặt ({reservations.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ReservationTable
                            reservations={reservations}
                            onCancel={handleCancelReservation}
                        />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
