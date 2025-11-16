"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { ReportStats } from "@/components/reports/report-stats";
import { SalesChart } from "@/components/reports/sales-chart";
import { TopProducts } from "@/components/reports/top-products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Download, Calendar, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface SalesData {
    date: string;
    sales: number;
    orders: number;
}

interface ProductData {
    name: string;
    sales: number;
    revenue: number;
}

export default function ReportsPage() {
    const { t } = useTranslation();
    const [dateRange, setDateRange] = useState("7days");
    const [chartType, setChartType] = useState<"line" | "bar">("line");
    const [salesData, setSalesData] = useState<SalesData[]>([]);
    const [topProducts, setTopProducts] = useState<ProductData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [salesRes, topProductsRes] = await Promise.all([
                    fetch("/api/reports/sales"),
                    fetch("/api/reports/top-products"),
                ]);
                const sales = await salesRes.json();
                const products = await topProductsRes.json();
                setSalesData(sales);
                setTopProducts(products);
            } catch (error) {
                toast({
                    title: t("messages.error"),
                    description: t("messages.noData"),
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [t, toast]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    const handleExport = (type: string) => {
        toast({
            title: t("reports.exportReport"),
            description: `${type} ${t("messages.success")}`,
        });
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

    const totalSales = salesData.reduce((acc, item) => acc + item.sales, 0);
    const totalOrders = salesData.reduce((acc, item) => acc + item.orders, 0);

    return (
        <DashboardLayout>
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">{t("reports.title")}</h1>
                        <p className="text-muted-foreground">
                            {t("reports.description")}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Select value={dateRange} onValueChange={setDateRange}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7days">
                                    {t("reports.last7Days")}
                                </SelectItem>
                                <SelectItem value="30days">
                                    {t("reports.last30Days")}
                                </SelectItem>
                                <SelectItem value="90days">
                                    {t("reports.last90Days")}
                                </SelectItem>
                                <SelectItem value="1year">
                                    {t("reports.lastYear")}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            variant="outline"
                            onClick={() => handleExport(t("reports.salesReport"))}
                        >
                            <Download className="h-4 w-4 mr-2" />
                            {t("reports.export")}
                        </Button>
                    </div>
                </div>

                <ReportStats
                    totalSales={totalSales}
                    totalOrders={totalOrders}
                    totalCustomers={89} // Sample data
                    totalProducts={25} // Sample data
                    salesGrowth={12.5} // Sample data
                    orderGrowth={8.3} // Sample data
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">
                                {t("reports.salesOverview")}
                            </h3>
                            <Select
                                value={chartType}
                                onValueChange={(value: "line" | "bar") =>
                                    setChartType(value)
                                }
                            >
                                <SelectTrigger className="w-[100px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="line">{t("reports.line")}</SelectItem>
                                    <SelectItem value="bar">{t("reports.bar")}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <SalesChart
                            data={salesData}
                            type={chartType}
                            title={t("reports.dailySales")}
                        />
                    </div>

                    <TopProducts products={topProducts} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                {t("reports.quickReports")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button
                                variant="outline"
                                className="w-full justify-start bg-transparent"
                                onClick={() =>
                                    handleExport(t("reports.dailySalesReport"))
                                }
                            >
                                {t("reports.dailySalesReport")}
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start bg-transparent"
                                onClick={() =>
                                    handleExport(t("reports.productPerformance"))
                                }
                            >
                                {t("reports.productPerformance")}
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start bg-transparent"
                                onClick={() =>
                                    handleExport(t("reports.customerAnalysis"))
                                }
                            >
                                {t("reports.customerAnalysis")}
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start bg-transparent"
                                onClick={() =>
                                    handleExport(t("reports.inventoryStatus"))
                                }
                            >
                                {t("reports.inventoryStatus")}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t("reports.revenueBreakdown")}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm">
                                        {t("reports.cashSales")}
                                    </span>
                                    <span className="font-medium">
                                        {formatCurrency(8400000)} (64%)
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">
                                        {t("reports.cardSales")}
                                    </span>
                                    <span className="font-medium">
                                        {formatCurrency(4800000)} (36%)
                                    </span>
                                </div>
                                <div className="flex justify-between font-medium border-t pt-2">
                                    <span>{t("reports.totalRevenue")}</span>
                                    <span>{formatCurrency(totalSales)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t("reports.performanceMetrics")}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm">
                                        {t("reports.avgOrderValue")}
                                    </span>
                                    <span className="font-medium">
                                        {formatCurrency(totalSales / totalOrders)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">
                                        {t("reports.ordersPerDay")}
                                    </span>
                                    <span className="font-medium">
                                        {(totalOrders / 7).toFixed(1)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">
                                        {t("reports.customerRetention")}
                                    </span>
                                    <span className="font-medium">68%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
