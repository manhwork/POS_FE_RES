"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Clock, MapPin, Utensils } from "lucide-react";
import {
    Table,
    Zone,
    TableStatus,
    formatCurrency,
    formatTime,
    Order,
} from "@/lib/data";

export { type Table } from "@/lib/data";

interface TableGridProps {
    tables: Table[];
    zones: Zone[];
    tableStatuses: TableStatus[];
    selectedTableId?: string | null;
    onTableSelect: (table: Table) => void;
    selectedZone?: string;
}

const formatDuration = (startTime: Date) => {
    const now = new Date();
    const duration = Math.floor(
        (now.getTime() - startTime.getTime()) / 1000 / 60
    );

    if (duration < 60) {
        return `${duration}p`;
    }

    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h${minutes > 0 ? ` ${minutes}p` : ""}`;
};

const getStatusInfo = (
    status: Table["status"],
    tableStatuses: TableStatus[]
) => {
    const statusInfo = tableStatuses.find((s) => s.value === status);
    return {
        label: statusInfo?.label || "Không xác định",
        color: statusInfo?.color || "gray",
        className: getStatusClassName(statusInfo?.color || "gray"),
    };
};

const getStatusClassName = (color: string) => {
    switch (color) {
        case "green":
            return "bg-green-100 text-green-800 border-green-200";
        case "red":
            return "bg-red-100 text-red-800 border-red-200";
        case "yellow":
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "orange":
            return "bg-orange-100 text-orange-800 border-orange-200";
        case "gray":
        default:
            return "bg-gray-100 text-gray-800 border-gray-200";
    }
};

export function TableGrid({
    tables,
    zones,
    tableStatuses,
    selectedTableId,
    onTableSelect,
    selectedZone,
}: TableGridProps) {
    const [filteredTables, setFilteredTables] = useState<Table[]>(tables);
    const [activeZone, setActiveZone] = useState<string | null>(
        selectedZone || null
    );
    const [orders, setOrders] = useState<Order[]>([]);

    // Fetch orders from API
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch("/api/orders");
                if (response.ok) {
                    const ordersData = await response.json();
                    setOrders(ordersData);
                }
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            }
        };
        fetchOrders();

        // Refresh orders every 5 seconds to keep data up to date
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (activeZone) {
            setFilteredTables(
                tables.filter((table) => table.zone === activeZone)
            );
        } else {
            setFilteredTables(tables);
        }
    }, [activeZone, tables]);

    const handleZoneSelect = (zoneId: string) => {
        setActiveZone(activeZone === zoneId ? null : zoneId);
    };

    // Calculate table statistics from orders
    const getTableStats = (tableId: string) => {
        // Get all active orders for this table (pending/processing, not yet invoiced)
        const tableOrders = orders.filter(
            (order) =>
                order.tableId === tableId &&
                !order.invoiceId &&
                (order.status === "pending" || order.status === "processing")
        );

        // Calculate total guest count (use the latest order's guest count)
        const latestOrder = tableOrders.sort(
            (a, b) =>
                new Date(b.startTime).getTime() -
                new Date(a.startTime).getTime()
        )[0];
        const guestCount = latestOrder?.guestCount || 0;

        // Calculate total items ordered
        const totalItems = tableOrders.reduce((sum, order) => {
            return (
                sum +
                order.items.reduce(
                    (itemSum, item) => itemSum + item.quantity,
                    0
                )
            );
        }, 0);

        return { guestCount, totalItems, orderCount: tableOrders.length };
    };

    return (
        <div className="flex flex-col h-full">
            {/* Zone Filter */}
            {zones.length > 0 && (
                <div className="p-4 border-b bg-muted/50">
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={
                                activeZone === null ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setActiveZone(null)}
                            className="text-xs"
                        >
                            <MapPin className="w-3 h-3 mr-1" />
                            Tất cả khu vực
                        </Button>
                        {zones.map((zone) => (
                            <Button
                                key={zone.id}
                                variant={
                                    activeZone === zone.id
                                        ? "default"
                                        : "outline"
                                }
                                size="sm"
                                onClick={() => handleZoneSelect(zone.id)}
                                className="text-xs"
                                style={{
                                    backgroundColor:
                                        activeZone === zone.id
                                            ? zone.color
                                            : undefined,
                                    borderColor: zone.color,
                                }}
                            >
                                {zone.name}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {/* Tables Grid */}
            <div className="flex-1 overflow-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
                    {filteredTables.map((table) => {
                        const statusInfo = getStatusInfo(
                            table.status,
                            tableStatuses
                        );

                        return (
                            <Card
                                key={table.id}
                                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                                    selectedTableId === table.id
                                        ? "ring-2 ring-primary shadow-lg"
                                        : "hover:shadow-md hover:scale-[1.02]"
                                }`}
                                onClick={() => onTableSelect(table)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-bold text-lg">
                                            {table.name}
                                        </h3>
                                        <Badge className={statusInfo.className}>
                                            {statusInfo.label}
                                        </Badge>
                                    </div>

                                    <div className="space-y-2 mb-3">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Users className="h-4 w-4" />
                                            <span>
                                                {table.capacity} chỗ ngồi
                                            </span>
                                        </div>

                                        {(() => {
                                            const stats = getTableStats(
                                                table.id
                                            );
                                            const hasActiveOrders =
                                                stats.guestCount > 0 ||
                                                stats.totalItems > 0;
                                            return (
                                                <>
                                                    <div
                                                        className={`flex items-center gap-2 text-sm ${
                                                            stats.guestCount > 0
                                                                ? ""
                                                                : "text-muted-foreground"
                                                        }`}
                                                    >
                                                        <Users
                                                            className={`h-4 w-4 ${
                                                                stats.guestCount >
                                                                0
                                                                    ? "text-primary"
                                                                    : "text-muted-foreground"
                                                            }`}
                                                        />
                                                        <span
                                                            className={
                                                                stats.guestCount >
                                                                0
                                                                    ? "font-medium text-primary"
                                                                    : ""
                                                            }
                                                        >
                                                            {stats.guestCount >
                                                            0
                                                                ? `${stats.guestCount} người đang ngồi`
                                                                : "Chưa có người"}
                                                        </span>
                                                    </div>
                                                    {hasActiveOrders && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Utensils className="h-4 w-4 text-primary" />
                                                            <span className="font-medium text-primary">
                                                                {stats.totalItems >
                                                                0
                                                                    ? `${stats.totalItems} món đã order`
                                                                    : "Chưa có món"}{" "}
                                                                {stats.orderCount >
                                                                    1 && (
                                                                    <span className="text-xs text-muted-foreground ml-1">
                                                                        (
                                                                        {
                                                                            stats.orderCount
                                                                        }{" "}
                                                                        đơn)
                                                                    </span>
                                                                )}
                                                            </span>
                                                        </div>
                                                    )}
                                                </>
                                            );
                                        })()}

                                        <p className="text-xs text-muted-foreground">
                                            {table.description}
                                        </p>
                                    </div>

                                    {table.currentOrder && (
                                        <div className="space-y-2 pt-2 border-t">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Clock className="h-4 w-4" />
                                                <span>
                                                    {formatDuration(
                                                        table.currentOrder
                                                            .startTime
                                                    )}
                                                </span>
                                                <span className="ml-auto text-xs">
                                                    {formatTime(
                                                        table.currentOrder
                                                            .startTime
                                                    )}
                                                </span>
                                            </div>

                                            <div className="text-sm">
                                                <div className="flex justify-between">
                                                    <span>Món:</span>
                                                    <span className="font-medium">
                                                        {
                                                            table.currentOrder
                                                                .itemCount
                                                        }
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Tổng:</span>
                                                    <span className="font-medium text-primary">
                                                        {formatCurrency(
                                                            table.currentOrder
                                                                .totalAmount
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {table.reservation &&
                                        table.status === "reserved" && (
                                            <div className="space-y-2 pt-2 border-t">
                                                <div className="text-sm">
                                                    <div className="flex justify-between">
                                                        <span>Khách:</span>
                                                        <span className="font-medium">
                                                            {
                                                                table
                                                                    .reservation
                                                                    .customerName
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Giờ:</span>
                                                        <span className="font-medium">
                                                            {formatTime(
                                                                new Date(
                                                                    table.reservation.time
                                                                )
                                                            )}
                                                        </span>
                                                    </div>
                                                    {table.reservation.note && (
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {
                                                                table
                                                                    .reservation
                                                                    .note
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    {table.status === "available" && (
                                        <div className="text-center py-4 text-muted-foreground">
                                            <span className="text-2xl">🍽️</span>
                                            <p className="text-xs mt-1">
                                                Nhấn để bắt đầu
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* No Tables Message */}
                {filteredTables.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <span className="text-4xl mb-2">🪑</span>
                        <p className="text-lg font-medium">Không có bàn nào</p>
                        <p className="text-sm">
                            {activeZone
                                ? "Khu vực này hiện tại không có bàn nào"
                                : "Hiện tại không có bàn nào"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
