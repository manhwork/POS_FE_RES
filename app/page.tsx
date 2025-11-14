"use client"

import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Users,
  Package,
  DollarSign,
  AlertTriangle,
  Clock,
  Plus,
  ArrowRight,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Sample dashboard data
const dashboardStats = {
  todaySales: { value: 2450.75, change: 12.5, trend: "up" },
  todayOrders: { value: 28, change: -5.2, trend: "down" },
  totalCustomers: { value: 1247, change: 8.3, trend: "up" },
  lowStockItems: { value: 5, change: 0, trend: "neutral" },
}

const salesData = [
  { day: "Mon", sales: 1200, orders: 15 },
  { day: "Tue", sales: 1800, orders: 22 },
  { day: "Wed", sales: 1600, orders: 18 },
  { day: "Thu", sales: 2200, orders: 28 },
  { day: "Fri", sales: 1900, orders: 24 },
  { day: "Sat", sales: 2400, orders: 31 },
  { day: "Sun", sales: 2100, orders: 26 },
]

const recentActivities = [
  { id: 1, type: "sale", description: "New order #ORD-156 - $45.50", time: "2 minutes ago", icon: ShoppingCart },
  { id: 2, type: "customer", description: "New customer registered: John Smith", time: "15 minutes ago", icon: Users },
  {
    id: 3,
    type: "inventory",
    description: "Low stock alert: Premium Coffee (5 units left)",
    time: "1 hour ago",
    icon: AlertTriangle,
  },
  { id: 4, type: "sale", description: "Order #ORD-155 completed - $78.25", time: "2 hours ago", icon: ShoppingCart },
  { id: 5, type: "product", description: "New product added: Chocolate Croissant", time: "3 hours ago", icon: Package },
]

const alerts = [
  { id: 1, type: "warning", message: "5 products are running low on stock", action: "View Inventory" },
  { id: 2, type: "info", message: "3 invoices are overdue", action: "View Invoices" },
  { id: 3, type: "success", message: "Daily sales target achieved!", action: "View Reports" },
]

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  const quickActions = [
    {
      title: t("dashboard.newSale"),
      description: t("dashboard.startTransaction"),
      href: "/pos",
      icon: Plus,
      color: "bg-blue-500",
    },
    {
      title: t("dashboard.addProduct"),
      description: t("dashboard.addNewProduct"),
      href: "/products",
      icon: Package,
      color: "bg-green-500",
    },
    {
      title: t("dashboard.viewOrders"),
      description: t("dashboard.checkRecentOrders"),
      href: "/orders",
      icon: ShoppingCart,
      color: "bg-purple-500",
    },
    {
      title: t("dashboard.customerManagement"),
      description: t("dashboard.manageCustomerData"),
      href: "/customers",
      icon: Users,
      color: "bg-orange-500",
    },
  ]

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{t("dashboard.title")}</h1>
            <p className="text-muted-foreground">{t("dashboard.welcome", { name: user.name })}</p>
          </div>
          <div className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("dashboard.todaySales")}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${dashboardStats.todaySales.value.toLocaleString()}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {dashboardStats.todaySales.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                {Math.abs(dashboardStats.todaySales.change)}% {t("dashboard.fromYesterday")}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("dashboard.todayOrders")}</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.todayOrders.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {dashboardStats.todayOrders.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                {Math.abs(dashboardStats.todayOrders.change)}% {t("dashboard.fromYesterday")}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("dashboard.totalCustomers")}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalCustomers.value.toLocaleString()}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                {dashboardStats.totalCustomers.change}% {t("dashboard.growthThisMonth")}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("dashboard.lowStockItems")}</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{dashboardStats.lowStockItems.value}</div>
              <div className="text-xs text-muted-foreground">{t("dashboard.requiresAttention")}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.weeklySalesOverview")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {t("dashboard.recentActivity")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-muted">
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.quickActions")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start gap-2 bg-transparent hover:bg-muted/50"
                    onClick={() => router.push(action.href)}
                  >
                    <div className={`p-2 rounded-lg ${action.color} text-white`}>
                      <action.icon className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-xs text-muted-foreground">{action.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alerts & Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.alertsNotifications")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          alert.type === "warning" ? "destructive" : alert.type === "info" ? "default" : "secondary"
                        }
                      >
                        {alert.type}
                      </Badge>
                      <span className="text-sm">{alert.message}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      {alert.action}
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
