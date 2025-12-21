"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  Star,
  Wallet,
  FileText,
  Users,
  Check,
  Trash2,
  Settings,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  created_at: string
  reference_id?: string
}

interface NotificationsPageProps {
  notifications: Notification[]
}

const typeIcons: Record<string, any> = {
  verification: CheckCircle,
  alert: AlertCircle,
  info: Info,
  reputation: Star,
  wallet: Wallet,
  application: FileText,
  community: Users,
}

const typeColors: Record<string, string> = {
  verification: "text-green-600 bg-green-100",
  alert: "text-red-600 bg-red-100",
  info: "text-blue-600 bg-blue-100",
  reputation: "text-yellow-600 bg-yellow-100",
  wallet: "text-purple-600 bg-purple-100",
  application: "text-orange-600 bg-orange-100",
  community: "text-cyan-600 bg-cyan-100",
}

export function NotificationsPage({ notifications: initialNotifications }: NotificationsPageProps) {
  const router = useRouter()
  const supabase = createClient()
  const [notifications, setNotifications] = useState(initialNotifications)
  const [filter, setFilter] = useState("all")

  const unreadCount = notifications.filter((n) => !n.read).length

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true
    if (filter === "unread") return !n.read
    return n.type === filter
  })

  const markAsRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id)
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = async () => {
    await supabase.from("notifications").update({ read: true }).eq("read", false)
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = async (id: string) => {
    await supabase.from("notifications").delete().eq("id", id)
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const clearAll = async () => {
    await supabase.from("notifications").delete().neq("id", "")
    setNotifications([])
  }

  const formatTime = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return d.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="h-8 w-8" />
            Notifications
          </h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : "You're all caught up!"}
          </p>
        </div>
        <div className="flex gap-3">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead} className="gap-2 bg-transparent">
              <Check className="h-4 w-4" />
              Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="outline" onClick={clearAll} className="gap-2 bg-transparent text-destructive">
              <Trash2 className="h-4 w-4" />
              Clear all
            </Button>
          )}
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter("all")}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">All</p>
            <p className="text-2xl font-bold">{notifications.length}</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter("unread")}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Unread</p>
            <p className="text-2xl font-bold text-primary">{unreadCount}</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter("verification")}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Verification</p>
            <p className="text-2xl font-bold text-green-600">
              {notifications.filter((n) => n.type === "verification").length}
            </p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter("wallet")}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Wallet</p>
            <p className="text-2xl font-bold text-purple-600">
              {notifications.filter((n) => n.type === "wallet").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No notifications</p>
              <p className="text-sm text-muted-foreground">
                {filter === "all" ? "You don't have any notifications yet" : "No notifications in this category"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredNotifications.map((notification, index) => {
                const Icon = typeIcons[notification.type] || Bell
                const colorClass = typeColors[notification.type] || "text-gray-600 bg-gray-100"

                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-lg transition-colors group",
                      notification.read ? "bg-transparent" : "bg-primary/5",
                    )}
                  >
                    <div className={cn("p-2 rounded-lg shrink-0", colorClass)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={cn("font-medium", !notification.read && "text-foreground")}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatTime(notification.created_at)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="h-7 text-xs"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Mark as read
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="h-7 text-xs text-destructive opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                    {!notification.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />}
                  </motion.div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
