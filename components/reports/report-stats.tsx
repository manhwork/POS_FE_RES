"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    Users,
    Package,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface ReportStatsProps {
    totalSales: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    salesGrowth: number;
    orderGrowth: number;
}

export function ReportStats({
    totalSales,
    totalOrders,
    totalCustomers,
    totalProducts,
    salesGrowth,
    orderGrowth,
}: ReportStatsProps) {
    const { t } = useTranslation();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    const stats = [
        {
            title: t("reports.totalSales"),
            value: formatCurrency(totalSales),
            icon: DollarSign,
            growth: salesGrowth,
            description: t("reports.revenueThisPeriod"),
        },
        {
            title: t("reports.totalOrders"),
            value: totalOrders.toString(),
            icon: ShoppingCart,
            growth: orderGrowth,
            description: t("reports.ordersCompleted"),
        },
        {
            title: t("reports.totalCustomers"),
            value: totalCustomers.toString(),
            icon: Users,
            description: t("reports.registeredCustomers"),
        },
        {
            title: t("reports.totalProducts"),
            value: totalProducts.toString(),
            icon: Package,
            description: t("reports.productsInCatalog"),
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
                <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {stat.title}
                        </CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            {stat.growth !== undefined && (
                                <>
                                    {stat.growth > 0 ? (
                                        <TrendingUp className="h-3 w-3 text-green-500" />
                                    ) : (
                                        <TrendingDown className="h-3 w-3 text-red-500" />
                                    )}
                                    <span
                                        className={
                                            stat.growth > 0
                                                ? "text-green-500"
                                                : "text-red-500"
                                        }
                                    >
                                        {Math.abs(stat.growth)}%
                                    </span>
                                </>
                            )}
                            <span>{stat.description}</span>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
