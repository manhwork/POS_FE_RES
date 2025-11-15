"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, MoreHorizontal, Receipt } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Order } from "@/lib/data";

interface OrderTableProps {
    orders: Order[];
    onViewOrder: (order: Order) => void;
    onUpdateStatus: (orderId: string, status: Order["status"]) => void;
    onPay: (order: Order) => void;
    highlightId?: string | null;
}

export function OrderTable({
    orders,
    onViewOrder,
    onUpdateStatus,
    onPay,
    highlightId,
}: OrderTableProps) {
    const getStatusBadge = (status: Order["status"]) => {
        const variants = {
            pending: "secondary",
            processing: "default",
            completed: "default",
            cancelled: "destructive",
            refunded: "secondary",
        } as const;

        const colors = {
            pending: "bg-yellow-100 text-yellow-800",
            processing: "bg-blue-100 text-blue-800",
            completed: "bg-green-100 text-green-800",
            cancelled: "",
            refunded: "bg-gray-100 text-gray-800",
        };

        return (
            <Badge variant={variants[status]} className={colors[status]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order #</TableHead>
                        <TableHead>Bàn/Khách</TableHead>
                        <TableHead>Món ăn</TableHead>
                        <TableHead>Tổng cộng</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={8}
                                className="text-center py-8 text-muted-foreground"
                            >
                                No orders found
                            </TableCell>
                        </TableRow>
                    ) : (
                        orders.map((order) => (
                            <TableRow
                                key={order.id}
                                className={
                                    order.id === highlightId ? "bg-blue-50" : ""
                                }
                            >
                                <TableCell className="font-mono font-medium">
                                    {order.id}
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <div className="font-medium">
                                            {order.tableName} (
                                            {order.guestCount} khách)
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Order ID: {order.id.substring(0, 7)}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                                        {order.items.map((item) => (
                                            <li key={item.id}>
                                                {item.name} x {item.quantity}
                                            </li>
                                        ))}
                                    </ul>
                                </TableCell>
                                <TableCell className="font-medium">
                                    ${order.total.toFixed(2)}
                                </TableCell>
                                <TableCell className="capitalize">
                                    {order.paymentMethod || "N/A"}
                                </TableCell>
                                <TableCell>
                                    {getStatusBadge(order.status)}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {new Date(
                                        order.startTime
                                    ).toLocaleDateString()}
                                    <div className="text-xs">
                                        {new Date(
                                            order.startTime
                                        ).toLocaleTimeString()}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    onViewOrder(order)
                                                }
                                            >
                                                <Eye className="h-4 w-4 mr-2" />{" "}
                                                View Details
                                            </DropdownMenuItem>
                                            {order.status === "pending" && (
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        onUpdateStatus(
                                                            order.id,
                                                            "processing"
                                                        )
                                                    }
                                                >
                                                    Mark as Processing
                                                </DropdownMenuItem>
                                            )}
                                            {order.status === "processing" && (
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        onUpdateStatus(
                                                            order.id,
                                                            "completed"
                                                        )
                                                    }
                                                >
                                                    Mark as Completed
                                                </DropdownMenuItem>
                                            )}
                                            {(order.status === "pending" ||
                                                order.status ===
                                                    "processing") && (
                                                <DropdownMenuItem
                                                    onClick={() => onPay(order)}
                                                >
                                                    Pay
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
