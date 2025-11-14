"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Clock, CheckCircle, DollarSign } from "lucide-react"
import type { Order } from "./order-table"

interface OrderStatsProps {
  orders: Order[]
}

export function OrderStats({ orders }: OrderStatsProps) {
  const totalOrders = orders.length
  const pendingOrders = orders.filter((order) => order.status === "pending").length
  const completedOrders = orders.filter((order) => order.status === "completed").length
  const cancelledOrders = orders.filter((order) => order.status === "cancelled").length
  const totalRevenue = orders
    .filter((order) => order.status === "completed")
    .reduce((sum, order) => sum + order.total, 0)

  const stats = [
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      icon: ShoppingCart,
      description: "All time orders",
    },
    {
      title: "Pending",
      value: pendingOrders.toString(),
      icon: Clock,
      description: "Awaiting processing",
      variant: pendingOrders > 0 ? "warning" : "default",
    },
    {
      title: "Completed",
      value: completedOrders.toString(),
      icon: CheckCircle,
      description: "Successfully completed",
      variant: "success",
    },
    {
      title: "Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      description: "From completed orders",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon
              className={`h-4 w-4 ${
                stat.variant === "warning"
                  ? "text-yellow-500"
                  : stat.variant === "success"
                    ? "text-green-500"
                    : "text-muted-foreground"
              }`}
            />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                stat.variant === "warning" ? "text-yellow-600" : stat.variant === "success" ? "text-green-600" : ""
              }`}
            >
              {stat.value}
            </div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
