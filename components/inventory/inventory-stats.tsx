"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Package, TrendingDown, DollarSign } from "lucide-react"
import type { InventoryItem } from "./inventory-table"

interface InventoryStatsProps {
  items: InventoryItem[]
}

export function InventoryStats({ items }: InventoryStatsProps) {
  const totalItems = items.length
  const totalValue = items.reduce((sum, item) => sum + item.totalValue, 0)
  const lowStockItems = items.filter((item) => item.currentStock <= item.reorderPoint && item.currentStock > 0).length
  const outOfStockItems = items.filter((item) => item.currentStock === 0).length

  const stats = [
    {
      title: "Total Items",
      value: totalItems.toString(),
      icon: Package,
      description: "Products in inventory",
    },
    {
      title: "Total Value",
      value: `$${totalValue.toLocaleString()}`,
      icon: DollarSign,
      description: "Current inventory value",
    },
    {
      title: "Low Stock",
      value: lowStockItems.toString(),
      icon: AlertTriangle,
      description: "Items below reorder point",
      variant: lowStockItems > 0 ? "warning" : "default",
    },
    {
      title: "Out of Stock",
      value: outOfStockItems.toString(),
      icon: TrendingDown,
      description: "Items with zero stock",
      variant: outOfStockItems > 0 ? "destructive" : "default",
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
                  : stat.variant === "destructive"
                    ? "text-red-500"
                    : "text-muted-foreground"
              }`}
            />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                stat.variant === "warning" ? "text-yellow-600" : stat.variant === "destructive" ? "text-red-600" : ""
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
