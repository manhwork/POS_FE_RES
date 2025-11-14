"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ReportStats } from "@/components/reports/report-stats"
import { SalesChart } from "@/components/reports/sales-chart"
import { TopProducts } from "@/components/reports/top-products"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Sample data
const salesData = [
  { date: "Jan 1", sales: 1200, orders: 15 },
  { date: "Jan 2", sales: 1800, orders: 22 },
  { date: "Jan 3", sales: 1600, orders: 18 },
  { date: "Jan 4", sales: 2200, orders: 28 },
  { date: "Jan 5", sales: 1900, orders: 24 },
  { date: "Jan 6", sales: 2400, orders: 31 },
  { date: "Jan 7", sales: 2100, orders: 26 },
]

const topProducts = [
  { name: "Premium Coffee", sales: 145, revenue: 507.5 },
  { name: "Club Sandwich", sales: 89, revenue: 800.11 },
  { name: "Caesar Salad", sales: 67, revenue: 837.5 },
  { name: "Blueberry Muffin", sales: 56, revenue: 238.0 },
  { name: "Green Tea", sales: 43, revenue: 118.25 },
]

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("7days")
  const [chartType, setChartType] = useState<"line" | "bar">("line")
  const { toast } = useToast()

  const handleExport = (type: string) => {
    toast({
      title: "Exporting report",
      description: `${type} report exported successfully`,
    })
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Reports & Analytics</h1>
            <p className="text-muted-foreground">Track your business performance</p>
          </div>
          <div className="flex gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => handleExport("Sales")}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <ReportStats
          totalSales={13200}
          totalOrders={164}
          totalCustomers={89}
          totalProducts={25}
          salesGrowth={12.5}
          orderGrowth={8.3}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Sales Overview</h3>
              <Select value={chartType} onValueChange={(value: "line" | "bar") => setChartType(value)}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line</SelectItem>
                  <SelectItem value="bar">Bar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <SalesChart data={salesData} type={chartType} title="Daily Sales" />
          </div>

          <TopProducts products={topProducts} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Quick Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => handleExport("Daily Sales")}
              >
                Daily Sales Report
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => handleExport("Product Performance")}
              >
                Product Performance
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => handleExport("Customer Analysis")}
              >
                Customer Analysis
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => handleExport("Inventory Status")}
              >
                Inventory Status
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Cash Sales</span>
                  <span className="font-medium">$8,400 (64%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Card Sales</span>
                  <span className="font-medium">$4,800 (36%)</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-2">
                  <span>Total Revenue</span>
                  <span>$13,200</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Avg. Order Value</span>
                  <span className="font-medium">$80.49</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Orders per Day</span>
                  <span className="font-medium">23.4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Customer Retention</span>
                  <span className="font-medium">68%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
