"use client"

import { motion } from "framer-motion"
import {
  Users,
  Shield,
  Store,
  FileText,
  DollarSign,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  Clock,
  CheckCircle,
  AlertTriangle,
  Settings,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

interface AdminDashboardProps {
  stats: {
    totalUsers: number
    verifiedUsers: number
    totalListings: number
    activeListings: number
    pendingApplications: number
    totalTransactions: number
    totalRevenue: number
  }
  recentUsers: any[]
  recentApplications: any[]
  departmentStats: any[]
}

const statCards = [
  { key: "totalUsers", label: "Total Users", icon: Users, color: "bg-blue-500", trend: "+12%" },
  { key: "verifiedUsers", label: "Verified Users", icon: Shield, color: "bg-green-500", trend: "+8%" },
  { key: "totalListings", label: "Total Listings", icon: Store, color: "bg-purple-500", trend: "+15%" },
  { key: "activeListings", label: "Active Listings", icon: Activity, color: "bg-orange-500", trend: "+5%" },
  { key: "pendingApplications", label: "Pending Apps", icon: FileText, color: "bg-yellow-500", trend: "-3%" },
  { key: "totalTransactions", label: "Transactions", icon: TrendingUp, color: "bg-cyan-500", trend: "+20%" },
]

export function AdminDashboard({ stats, recentUsers, recentApplications, departmentStats }: AdminDashboardProps) {
  const verificationRate = stats.totalUsers > 0 ? Math.round((stats.verifiedUsers / stats.totalUsers) * 100) : 0
  const listingActiveRate = stats.totalListings > 0 ? Math.round((stats.activeListings / stats.totalListings) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Platform overview and management</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/admin/verification">
            <Button variant="outline" className="gap-2 bg-transparent">
              <FileText className="h-4 w-4" />
              Review Queue ({stats.pendingApplications})
            </Button>
          </Link>
          <Link href="/dashboard/admin/users">
            <Button className="gap-2">
              <Users className="h-4 w-4" />
              Manage Users
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((stat, index) => {
          const value = stats[stat.key as keyof typeof stats]
          const isPositive = stat.trend.startsWith("+")
          return (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="relative overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg ${stat.color}/10`}>
                      <stat.icon className={`h-4 w-4 ${stat.color.replace("bg-", "text-")}`} />
                    </div>
                    <span
                      className={`text-xs flex items-center gap-0.5 ${isPositive ? "text-green-600" : "text-red-600"}`}
                    >
                      {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {stat.trend}
                    </span>
                  </div>
                  <p className="text-2xl font-bold">{typeof value === "number" ? value.toLocaleString() : value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Revenue Card */}
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Platform Revenue</p>
              <p className="text-4xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-4 w-4" />
                +23.5% from last month
              </p>
            </div>
            <div className="p-4 rounded-full bg-primary/10">
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Platform Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Platform Health
            </CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>User Verification Rate</span>
                <span className="font-medium">{verificationRate}%</span>
              </div>
              <Progress value={verificationRate} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Listing Activity Rate</span>
                <span className="font-medium">{listingActiveRate}%</span>
              </div>
              <Progress value={listingActiveRate} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Application Processing</span>
                <span className="font-medium">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>System Uptime</span>
                <span className="font-medium">99.9%</span>
              </div>
              <Progress value={99.9} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Department Distribution
            </CardTitle>
            <CardDescription>Applications by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentStats.slice(0, 5).map((dept, index) => {
                const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-cyan-500"]
                const count = dept.applications?.[0]?.count || 0
                const total = departmentStats.reduce((sum, d) => sum + (d.applications?.[0]?.count || 0), 0)
                const percentage = total > 0 ? Math.round((count / total) * 100) : 0
                return (
                  <div key={dept.id} className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{dept.name}</span>
                        <span className="text-sm text-muted-foreground">{count} apps</span>
                      </div>
                      <Progress value={percentage} className="h-1.5" />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">{percentage}%</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Recent Users
              </CardTitle>
              <CardDescription>Newly registered users</CardDescription>
            </div>
            <Link href="/dashboard/admin/users">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>{user.full_name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{user.full_name || "Unknown"}</p>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {user.is_verified ? (
                      <Badge className="bg-green-500/10 text-green-600">Verified</Badge>
                    ) : (
                      <Badge variant="secondary">Pending</Badge>
                    )}
                  </div>
                </div>
              ))}
              {recentUsers.length === 0 && <p className="text-center text-muted-foreground py-4">No recent users</p>}
            </div>
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Applications
              </CardTitle>
              <CardDescription>Latest verification requests</CardDescription>
            </div>
            <Link href="/dashboard/admin/verification">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div key={app.id} className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-lg ${
                      app.status === "pending"
                        ? "bg-yellow-100"
                        : app.status === "approved"
                          ? "bg-green-100"
                          : app.status === "rejected"
                            ? "bg-red-100"
                            : "bg-blue-100"
                    }`}
                  >
                    {app.status === "pending" ? (
                      <Clock className="h-4 w-4 text-yellow-600" />
                    ) : app.status === "approved" ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : app.status === "rejected" ? (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    ) : (
                      <FileText className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{app.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {app.profiles?.full_name || "Unknown"} - {app.application_type}
                    </p>
                  </div>
                  <Badge
                    variant={
                      app.status === "pending" ? "secondary" : app.status === "approved" ? "default" : "destructive"
                    }
                    className="capitalize"
                  >
                    {app.status}
                  </Badge>
                </div>
              ))}
              {recentApplications.length === 0 && (
                <p className="text-center text-muted-foreground py-4">No recent applications</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/dashboard/admin/verification">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 bg-transparent">
                <FileText className="h-6 w-6 text-primary" />
                <span>Review Applications</span>
                <Badge variant="secondary">{stats.pendingApplications} pending</Badge>
              </Button>
            </Link>
            <Link href="/dashboard/admin/users">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 bg-transparent">
                <Users className="h-6 w-6 text-primary" />
                <span>Manage Users</span>
                <Badge variant="secondary">{stats.totalUsers} total</Badge>
              </Button>
            </Link>
            <Link href="/dashboard/admin/listings">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 bg-transparent">
                <Store className="h-6 w-6 text-primary" />
                <span>Manage Listings</span>
                <Badge variant="secondary">{stats.activeListings} active</Badge>
              </Button>
            </Link>
            <Link href="/dashboard/admin/settings">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 bg-transparent">
                <Activity className="h-6 w-6 text-primary" />
                <span>Platform Settings</span>
                <Badge variant="secondary">Configure</Badge>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
