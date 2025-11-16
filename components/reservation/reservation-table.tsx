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
import { MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table as TableType } from "@/lib/data"; // Renamed to avoid conflict

interface ReservationTableProps {
    reservations: TableType[];
    onCancel: (tableId: string) => void;
}

export function ReservationTable({
    reservations,
    onCancel,
}: ReservationTableProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Bàn</TableHead>
                        <TableHead>Tên khách hàng</TableHead>
                        <TableHead>Số điện thoại</TableHead>
                        <TableHead>Thời gian</TableHead>
                        <TableHead>Ghi chú</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reservations.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={6}
                                className="text-center py-8 text-muted-foreground"
                            >
                                Không có đơn đặt bàn nào.
                            </TableCell>
                        </TableRow>
                    ) : (
                        reservations.map((table) => (
                            <TableRow key={table.id}>
                                <TableCell className="font-medium">
                                    {table.name}
                                </TableCell>
                                <TableCell>
                                    {table.reservation?.customerName}
                                </TableCell>
                                <TableCell>
                                    {table.reservation?.phone}
                                </TableCell>
                                <TableCell>
                                    {table.reservation?.time
                                        ? new Date(
                                              table.reservation.time
                                          ).toLocaleString()
                                        : ""}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {table.reservation?.note}
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
                                                    onCancel(table.id)
                                                }
                                                className="text-destructive"
                                            >
                                                Hủy đặt bàn
                                            </DropdownMenuItem>
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
