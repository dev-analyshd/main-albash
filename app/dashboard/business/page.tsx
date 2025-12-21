import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import {
  Briefcase,
  CheckCircle,
  Clock,
  FileText,
  Store,
  Star,
  Settings,
  ArrowRight,
  Shield,
  TrendingUp,
  ShoppingBag,
} from "lucide-react"

export default async function BusinessDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
  const { data: applications } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", user.id)
    .eq("application_type", "business")
    .order("created_at", { ascending: false })
  const { data: listings } = await supabase.from("listings").select("*").eq("user_id", user.id)

  const latestApplication = applications?.[0]
  const isVerified = profile?.is_verified
  const activeListings = listings?.filter((l) => l.is_verified).length || 0

  const businessStats = [
    {
      title: "Verification Status",
      value: isVerified ? "Verified" : "Pending",
      icon: Shield,
      color: isVerified ? "text-green-600" : "text-yellow-600",
      bgColor: isVerified ? "bg-green-100" : "bg-yellow-100",
    },
    {
      title: "Products Listed",
      value: activeListings,
      icon: ShoppingBag,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    { title: "Total Sales", value: "₦0", icon: TrendingUp, color: "text-green-600", bgColor: "bg-green-100" },
    {
      title: "Rating",
      value: profile?.reputation_score || 0,
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
  ]

  const getApplicationStatus = () => {
    if (!latestApplication) return null
    const status = latestApplication.status
    const statusConfig: Record<string, { color: string; icon: typeof CheckCircle; text: string }> = {
      approved: { color: "bg-green-100 text-green-700", icon: CheckCircle, text: "Approved" },
      pending: { color: "bg-yellow-100 text-yellow-700", icon: Clock, text: "Pending Review" },
      under_review: { color: "bg-blue-100 text-blue-700", icon: FileText, text: "Under Review" },
      rejected: { color: "bg-red-100 text-red-700", icon: Clock, text: "Rejected" },
      needs_update: { color: "bg-orange-100 text-orange-700", icon: FileText, text: "Needs Update" },
    }
    return statusConfig[status] || statusConfig.pending
  }

  const applicationStatus = getApplicationStatus()

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Business Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your business profile, products, and sales</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/settings">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </Link>
          <Link href="/dashboard/listings/new">
            <Button className="gap-2">
              <Store className="h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center">
              <Briefcase className="h-10 w-10 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{profile?.full_name || "Business Name"}</h2>
                {isVerified && (
                  <Badge className="bg-green-100 text-green-700 gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Verified Business
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mb-4">{profile?.bio || "Small business profile"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Status */}
      {!isVerified && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Verification Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {latestApplication ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {applicationStatus && (
                      <>
                        <div className={`p-2 rounded-full ${applicationStatus.color}`}>
                          <applicationStatus.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{applicationStatus.text}</p>
                          <p className="text-sm text-muted-foreground">
                            Applied on {new Date(latestApplication.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <Progress
                  value={
                    latestApplication.status === "approved"
                      ? 100
                      : latestApplication.status === "under_review"
                        ? 75
                        : 50
                  }
                  className="h-2"
                />
              </div>
            ) : (
              <div className="text-center py-6">
                <Shield className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-muted-foreground mb-4">Apply for business verification</p>
                <Link href="/apply/business">
                  <Button>
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {businessStats.map((stat) => (
          <Card key={stat.title}>
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
        ))}
      </div>

      {/* Products */}
      <Card>
        <CardHeader>
          <CardTitle>Your Products</CardTitle>
          <CardDescription>Manage your product listings</CardDescription>
        </CardHeader>
        <CardContent>
          {listings && listings.length > 0 ? (
            <div className="space-y-3">
              {listings.slice(0, 3).map((listing) => (
                <div key={listing.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{listing.title}</p>
                      <p className="text-sm text-muted-foreground">₦{listing.price}</p>
                    </div>
                  </div>
                  <Badge variant={listing.is_verified ? "default" : "secondary"}>
                    {listing.is_verified ? "Active" : "Pending"}
                  </Badge>
                </div>
              ))}
              <Link href="/dashboard/listings">
                <Button variant="outline" className="w-full mt-2 bg-transparent">
                  View All Products
                </Button>
              </Link>
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingBag className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-muted-foreground mb-4">No products listed yet</p>
              <Link href="/dashboard/listings/new">
                <Button>Add Your First Product</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
