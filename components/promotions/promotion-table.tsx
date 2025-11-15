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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Promotion } from "@/lib/data";

interface PromotionTableProps {
    promotions: Promotion[];
    onEdit: (promotion: Promotion) => void;
    onDelete: (id: string) => void;
}

export function PromotionTable({
    promotions,
    onEdit,
    onDelete,
}: PromotionTableProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Tên khuyến mãi</TableHead>
                        <TableHead>Mô tả</TableHead>
                        <TableHead>Loại giảm giá</TableHead>
                        <TableHead>Giá trị giảm giá</TableHead>
                        <TableHead>Khách hàng áp dụng</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {promotions.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={7}
                                className="text-center py-8 text-muted-foreground"
                            >
                                Không có khuyến mãi nào.
                            </TableCell>
                        </TableRow>
                    ) : (
                        promotions.map((promotion) => (
                            <TableRow key={promotion.id}>
                                <TableCell className="font-mono text-xs">
                                    {promotion.id}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {promotion.name}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {promotion.description}
                                </TableCell>
                                <TableCell className="capitalize">
                                    {promotion.discountType}
                                </TableCell>
                                <TableCell>
                                    {promotion.discountValue}
                                    {promotion.discountType === "percentage"
                                        ? "%"
                                        : "đ"}
                                </TableCell>
                                <TableCell>
                                    {promotion.applicableCustomers &&
                                    promotion.applicableCustomers.length > 0
                                        ? promotion.applicableCustomers.join(
                                              ", "
                                          )
                                        : "Tất cả"}
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
                                                    onEdit(promotion)
                                                }
                                            >
                                                <Edit className="h-4 w-4 mr-2" />{" "}
                                                Chỉnh sửa
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    onDelete(promotion.id)
                                                }
                                                className="text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />{" "}
                                                Xóa
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
