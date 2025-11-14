"use client"

import type React from "react"
import { useState } from "react"
import { Bell, X, AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNotifications } from "@/contexts/notification-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "success":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "error":
      return <XCircle className="h-4 w-4 text-red-500" />
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    case "info":
      return <Info className="h-4 w-4 text-blue-500" />
    default:
      return <Bell className="h-4 w-4" />
  }
}

const formatTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

export const NotificationCenter: React.FC = () => {
  const { t } = useTranslation()
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)

  const handleNotificationClick = (id: string) => {
    markAsRead(id)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4">
          <DropdownMenuLabel className="p-0 font-semibold">{t("notifications.title")}</DropdownMenuLabel>
          {notifications.length > 0 && (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-6">
                {t("notifications.markAllRead")}
              </Button>
              <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs h-6">
                {t("notifications.clearAll")}
              </Button>
            </div>
          )}
        </div>
        <DropdownMenuSeparator />
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>{t("notifications.noNotifications")}</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="p-0"
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <Card className={`w-full border-0 shadow-none ${!notification.read ? "bg-muted/50" : ""}`}>
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-muted-foreground">
                                {formatTime(notification.timestamp)}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeNotification(notification.id)
                                }}
                                className="h-4 w-4 p-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">{notification.message}</p>
                          {notification.action && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                notification.action?.onClick()
                              }}
                              className="mt-2 h-6 text-xs"
                            >
                              {notification.action.label}
                            </Button>
                          )}
                        </div>
                        {!notification.read && <div className="h-2 w-2 rounded-full bg-blue-500" />}
                      </div>
                    </CardContent>
                  </Card>
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
