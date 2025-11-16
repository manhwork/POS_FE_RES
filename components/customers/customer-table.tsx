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
import { Edit, MoreHorizontal, Eye, Mail, Phone } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate?: string;
    status: "active" | "inactive";
    createdAt: string;
    notes?: string;
}

interface CustomerTableProps {
    customers: Customer[];
    onEdit: (customer: Customer) => void;
    onView: (customer: Customer) => void;
    onDelete: (id: string) => void;
}

export function CustomerTable({
    customers,
    onEdit,
    onView,
    onDelete,
}: CustomerTableProps) {
    const { t } = useTranslation();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    const getStatusBadge = (status: Customer["status"]) => {
        return (
            <Badge
                variant={status === "active" ? "default" : "secondary"}
                className={
                    status === "active" ? "bg-green-100 text-green-800" : ""
                }
            >
                {t(`customers.${status}`)}
            </Badge>
        );
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t("customers.customer")}</TableHead>
                        <TableHead>{t("customers.contact")}</TableHead>
                        <TableHead>{t("customers.location")}</TableHead>
                        <TableHead>{t("customers.orders")}</TableHead>
                        <TableHead>{t("customers.totalSpent")}</TableHead>
                        <TableHead>{t("customers.lastOrder")}</TableHead>
                        <TableHead>{t("customers.status")}</TableHead>
                        <TableHead className="w-[70px]">
                            {t("customers.actions")}
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {customers.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={8}
                                className="text-center py-8 text-muted-foreground"
                            >
                                {t("customers.noCustomersFound")}
                            </TableCell>
                        </TableRow>
                    ) : (
                        customers.map((customer) => (
                            <TableRow key={customer.id}>
                                <TableCell>
                                    <div className="font-medium">
                                        {customer.name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        ID: {customer.id}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1 text-sm">
                                            <Mail className="h-3 w-3" />
                                            {customer.email}
                                        </div>
                                        {customer.phone && (
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <Phone className="h-3 w-3" />
                                                {customer.phone}
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {customer.city && customer.state ? (
                                        <div className="text-sm">
                                            <div>
                                                {customer.city}, {customer.state}
                                            </div>
                                            {customer.zipCode && (
                                                <div className="text-muted-foreground">
                                                    {customer.zipCode}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground text-sm">
                                            {t("customers.notProvided")}
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {customer.totalOrders}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {formatCurrency(customer.totalSpent)}
                                </TableCell>
                                <TableCell className="text-sm">
                                    {customer.lastOrderDate ? (
                                        <div>
                                            <div>
                                                {new Date(
                                                    customer.lastOrderDate
                                                ).toLocaleDateString()}
                                            </div>
                                            <div className="text-muted-foreground text-xs">
                                                {new Date(
                                                    customer.lastOrderDate
                                                ).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground">
                                            {t("customers.never")}
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {getStatusBadge(customer.status)}
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
                                                onClick={() => onView(customer)}
                                            >
                                                <Eye className="h-4 w-4 mr-2" />
                                                {t("customers.viewDetails")}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => onEdit(customer)}
                                            >
                                                <Edit className="h-4 w-4 mr-2" />
                                                {t("customers.edit")}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    onDelete(customer.id)
                                                }
                                                className="text-destructive"
                                            >
                                                {t("customers.delete")}
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
