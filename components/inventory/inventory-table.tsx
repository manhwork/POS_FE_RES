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
import {
    AlertTriangle,
    Package,
    Plus,
    Minus,
    MoreHorizontal,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { DisplayInventoryItem } from "@/app/inventory/page";

interface InventoryTableProps {
    items: DisplayInventoryItem[];
    onAdjustStock: (id: string) => void;
    onViewHistory: (id: string) => void;
}

export function InventoryTable({
    items,
    onAdjustStock,
    onViewHistory,
}: InventoryTableProps) {
    const { t } = useTranslation();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    const getStatusBadge = (item: DisplayInventoryItem) => {
        if (item.currentStock === 0) {
            return (
                <Badge variant="destructive">
                    {t("inventory.outOfStock")}
                </Badge>
            );
        }
        if (item.currentStock <= item.reorderPoint) {
            return (
                <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800"
                >
                    {t("inventory.lowStock")}
                </Badge>
            );
        }
        return (
            <Badge variant="default" className="bg-green-100 text-green-800">
                {t("inventory.inStock")}
            </Badge>
        );
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t("inventory.product")}</TableHead>
                        <TableHead>{t("inventory.sku")}</TableHead>
                        <TableHead>{t("inventory.category")}</TableHead>
                        <TableHead>{t("inventory.currentStock")}</TableHead>
                        <TableHead>{t("inventory.reorderPoint")}</TableHead>
                        <TableHead>{t("inventory.unitCost")}</TableHead>
                        <TableHead>{t("inventory.totalValue")}</TableHead>
                        <TableHead>{t("inventory.status")}</TableHead>
                        <TableHead>{t("inventory.lastUpdated")}</TableHead>
                        <TableHead className="w-[100px]">
                            {t("inventory.actions")}
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={10}
                                className="text-center py-8 text-muted-foreground"
                            >
                                {t("inventory.noInventoryItems")}
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        {item.currentStock <=
                                            item.reorderPoint &&
                                            item.currentStock > 0 && (
                                                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                            )}
                                        {item.currentStock === 0 && (
                                            <AlertTriangle className="h-4 w-4 text-red-500" />
                                        )}
                                        {item.name}
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono text-sm">
                                    {item.sku}
                                </TableCell>
                                <TableCell>{item.categoryId}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">
                                            {item.currentStock}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>{item.reorderPoint}</TableCell>
                                <TableCell>
                                    {formatCurrency(item.unitCost)}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {formatCurrency(item.totalValue)}
                                </TableCell>
                                <TableCell>{getStatusBadge(item)}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {new Date(
                                        item.lastUpdated
                                    ).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                onAdjustStock(item.id)
                                            }
                                        >
                                            {t("inventory.adjustStock")}
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        onViewHistory(item.id)
                                                    }
                                                >
                                                    <Package className="h-4 w-4 mr-2" />
                                                    {t("inventory.viewHistory")}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
_
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
