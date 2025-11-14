"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus, DollarSign, TrendingUp } from "lucide-react"
import type { Customer } from "./customer-table"

interface CustomerStatsProps {
  customers: Customer[]
}

export function CustomerStats({ customers }: CustomerStatsProps) {
  const totalCustomers = customers.length
  const activeCustomers = customers.filter((customer) => customer.status === "active").length
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0)
  const avgOrderValue =
    customers.length > 0
      ? customers.reduce(
          (sum, customer) => sum + (customer.totalOrders > 0 ? customer.totalSpent / customer.totalOrders : 0),
          0,
        ) / customers.length
      : 0

  const stats = [
    {
      title: "Total Customers",
      value: totalCustomers.toString(),
      icon: Users,
      description: "All registered customers",
    },
    {
      title: "Active Customers",
      value: activeCustomers.toString(),
      icon: UserPlus,
      description: "Currently active customers",
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      description: "From all customers",
    },
    {
      title: "Avg. Order Value",
      value: `$${avgOrderValue.toFixed(2)}`,
      icon: TrendingUp,
      description: "Average per order",
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
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
