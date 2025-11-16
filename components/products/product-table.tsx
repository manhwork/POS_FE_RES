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
import { Edit, Trash2, MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Product } from "@/lib/data";
import { useTranslation } from "react-i18next";

interface ProductTableProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
}

export function ProductTable({
    products,
    onEdit,
    onDelete,
}: ProductTableProps) {
    const { t } = useTranslation();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t("products.product")}</TableHead>
                        <TableHead>{t("products.category")}</TableHead>
                        <TableHead>{t("products.price")}</TableHead>
                        <TableHead>{t("products.stock")}</TableHead>
                        <TableHead>{t("products.status")}</TableHead>
                        <TableHead>{t("products.actions")}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={6}
                                className="text-center py-8 text-muted-foreground"
                            >
                                {t("products.noProductsFound")}
                            </TableCell>
                        </TableRow>
                    ) : (
                        products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className="font-medium">
                                    {product.name}
                                </TableCell>
                                <TableCell>{product.categoryId}</TableCell>
                                <TableCell>
                                    {formatCurrency(product.price)}
                                </TableCell>
                                <TableCell>
                                    {product.isAvailable
                                        ? t("products.inStock")
                                        : t("products.outOfStock")}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            product.isAvailable
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {product.isAvailable
                                            ? t("products.available")
                                            : t("products.outOfStock")}
                                    </Badge>
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
                                                onClick={() => onEdit(product)}
                                            >
                                                <Edit className="h-4 w-4 mr-2" />
                                                {t("products.edit")}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    onDelete(product.id)
                                                }
                                                className="text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                {t("products.delete")}
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
