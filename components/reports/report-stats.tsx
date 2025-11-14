"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from "lucide-react"

interface ReportStatsProps {
  totalSales: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  salesGrowth: number
  orderGrowth: number
}

export function ReportStats({
  totalSales,
  totalOrders,
  totalCustomers,
  totalProducts,
  salesGrowth,
  orderGrowth,
}: ReportStatsProps) {
  const stats = [
    {
      title: "Total Sales",
      value: `$${totalSales.toLocaleString()}`,
      icon: DollarSign,
      growth: salesGrowth,
      description: "Revenue this period",
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      icon: ShoppingCart,
      growth: orderGrowth,
      description: "Orders completed",
    },
    {
      title: "Total Customers",
      value: totalCustomers.toString(),
      icon: Users,
      description: "Registered customers",
    },
    {
      title: "Total Products",
      value: totalProducts.toString(),
      icon: Package,
      description: "Products in catalog",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
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
                  <span className={stat.growth > 0 ? "text-green-500" : "text-red-500"}>{Math.abs(stat.growth)}%</span>
                </>
              )}
              <span>{stat.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
