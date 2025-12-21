import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { StatusPoller } from "@/components/dashboard/status-poller"
import {
  Store,
  FileText,
  Wallet,
  Star,
  TrendingUp,
  Eye,
  ShoppingCart,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.id).single()

  // Get verification status and pending requests
  const { data: verificationRequest } = await supabase
    .from("verification_requests")
    .select("*")
    .eq("user_id", user?.id)
    .eq("status", "pending")
    .maybeSingle()

  const verificationStatus = profile?.verification_status || "AUTHENTICATED_UNVERIFIED"
  const isVerified = profile?.is_verified || verificationStatus === "VERIFIED"
  const isPending = verificationStatus === "VERIFICATION_PENDING" || !!verificationRequest

  const { data: listings } = await supabase.from("listings").select("*").eq("seller_id", user?.id)

  const { data: applications } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .or(`buyer_id.eq.${user?.id},seller_id.eq.${user?.id}`)
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: reputationLogs } = await supabase
    .from("reputation_logs")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(5)

  const activeListings = listings?.filter((l) => l.status === "active").length || 0
  const totalViews = listings?.reduce((sum, l) => sum + (l.views || 0), 0) || 0
  const totalSales = transactions?.filter((t) => t.seller_id === user?.id && t.status === "completed").length || 0

  const stats = [
    {
      title: "Active Listings",
      value: activeListings,
      icon: Store,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      href: "/dashboard/listings",
    },
    {
      title: "Total Views",
      value: totalViews,
      icon: Eye,
      color: "text-green-600",
      bgColor: "bg-green-100",
      href: "/dashboard/listings",
    },
    {
      title: "Sales",
      value: totalSales,
      icon: ShoppingCart,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      href: "/dashboard/transactions",
    },
    {
      title: "Reputation",
      value: profile?.reputation_score || 0,
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      href: "/dashboard/reputation",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
      case "under_review":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "rejected":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {profile?.full_name || "User"}</h1>
        <p className="text-muted-foreground mt-1">Here's an overview of your activity on AlbashSolutions</p>
      </div>

      {/* Verification Status Banner */}
      {profile && (
        <Card
          className={
            isVerified
              ? "border-green-500/20 bg-green-500/5"
              : isPending
                ? "border-yellow-500/20 bg-yellow-500/5"
                : "border-primary/20 bg-primary/5"
          }
        >
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold">
                  {isVerified
                    ? "Verified Account"
                    : isPending
                      ? "Verification Pending"
                      : "Verification Required"}
                </h3>
                <Badge
                  variant={
                    isVerified ? "default" : isPending ? "secondary" : "outline"
                  }
                  className={
                    isVerified
                      ? "bg-green-500 text-white"
                      : isPending
                        ? "bg-yellow-500 text-white"
                        : ""
                  }
                >
                  {verificationStatus.replace("_", " ")}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {isVerified
                  ? "You have full access to all platform features including marketplace listings, community posting, and tokenization."
                  : isPending
                    ? "Your verification request is being reviewed. You'll be notified once a decision is made."
                    : "Get verified to unlock all platform features including marketplace listings, community posting, and tokenization."}
              </p>
              <StatusPoller isPending={isPending} />
            </div>
            {!isVerified && !isPending && (
              <Link href="/verification">
                <Button className="ml-6">
                  Request Verification
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
            {isPending && (
              <Link href="/verification">
                <Button variant="outline" className="ml-6">
                  View Status
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Applications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Applications
              </CardTitle>
              <CardDescription>Your verification and listing applications</CardDescription>
            </div>
            <Link href="/dashboard/applications">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {applications && applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(app.status)}
                      <div>
                        <p className="font-medium capitalize">{app.type} Application</p>
                        <p className="text-sm text-muted-foreground">{new Date(app.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        app.status === "approved" ? "default" : app.status === "rejected" ? "destructive" : "secondary"
                      }
                      className="capitalize"
                    >
                      {app.status.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No applications yet</p>
                {!isVerified && !isPending && (
                  <Link href="/verification">
                    <Button variant="link" className="mt-2">
                      Request Verification
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Recent Transactions
              </CardTitle>
              <CardDescription>Your latest purchases and sales</CardDescription>
            </div>
            <Link href="/dashboard/transactions">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {transactions && transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          tx.seller_id === user?.id ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {tx.seller_id === user?.id ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <ShoppingCart className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{tx.seller_id === user?.id ? "Sale" : "Purchase"}</p>
                        <p className="text-sm text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="font-semibold">
                      {tx.seller_id === user?.id ? "+" : "-"}${tx.amount}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Wallet className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No transactions yet</p>
                <Link href="/marketplace">
                  <Button variant="link" className="mt-2">
                    Browse marketplace
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reputation Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Reputation Activity
              </CardTitle>
              <CardDescription>Recent changes to your reputation score</CardDescription>
            </div>
            <Link href="/dashboard/reputation">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {reputationLogs && reputationLogs.length > 0 ? (
              <div className="space-y-4">
                {reputationLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{log.reason}</p>
                      <p className="text-sm text-muted-foreground">{new Date(log.created_at).toLocaleDateString()}</p>
                    </div>
                    <Badge variant={log.change > 0 ? "default" : "destructive"} className="font-mono">
                      {log.change > 0 ? "+" : ""}
                      {log.change}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Star className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No reputation activity yet</p>
                <p className="text-sm mt-1">Complete transactions to build your reputation</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Link href={isVerified ? "/dashboard/listings/new" : "#"}>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 h-auto py-4 bg-transparent"
                disabled={!isVerified}
                title={!isVerified ? "Verification required to create listings" : ""}
              >
                <Store className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Create Listing</p>
                  <p className="text-xs text-muted-foreground">
                    {isVerified ? "Add a new product or service" : "Verification required"}
                  </p>
                </div>
              </Button>
            </Link>
            <Link href="/check-status">
              <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4 bg-transparent">
                <FileText className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Check Status</p>
                  <p className="text-xs text-muted-foreground">Track your applications</p>
                </div>
              </Button>
            </Link>
            <Link href="/studio">
              <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4 bg-transparent">
                <TrendingUp className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Open Studio</p>
                  <p className="text-xs text-muted-foreground">Access your creative tools</p>
                </div>
              </Button>
            </Link>
            <Link href="/dashboard/wallet">
              <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4 bg-transparent">
                <Wallet className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Manage Wallet</p>
                  <p className="text-xs text-muted-foreground">View balance and withdraw</p>
                </div>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
