import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import {
  User,
  CheckCircle,
  Clock,
  FileText,
  Store,
  Star,
  TrendingUp,
  Settings,
  ArrowRight,
  Shield,
  Award,
  Briefcase,
} from "lucide-react"

export default async function BuilderDashboardPage() {
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
    .eq("application_type", "builder")
    .order("created_at", { ascending: false })

  const { data: listings } = await supabase.from("listings").select("*").eq("user_id", user.id)

  const latestApplication = applications?.[0]
  const isVerified = profile?.is_verified
  const activeListings = listings?.filter((l) => l.is_verified).length || 0

  const builderStats = [
    {
      title: "Profile Status",
      value: isVerified ? "Verified" : "Pending",
      icon: Shield,
      color: isVerified ? "text-green-600" : "text-yellow-600",
      bgColor: isVerified ? "bg-green-100" : "bg-yellow-100",
    },
    {
      title: "Active Listings",
      value: activeListings,
      icon: Store,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Reputation Score",
      value: profile?.reputation_score || 0,
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Completed Projects",
      value: 0,
      icon: Briefcase,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Builder Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your builder profile, listings, and track your progress</p>
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
              Create Listing
            </Button>
          </Link>
        </div>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url || "/placeholder.svg"}
                  alt={profile.full_name || "Profile"}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-primary" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{profile?.full_name || "Builder"}</h2>
                {isVerified && (
                  <Badge className="bg-green-100 text-green-700 gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Verified Builder
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mb-4">{profile?.bio || "No bio added yet"}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  {profile?.reputation_score || 0} reputation
                </span>
                <span className="flex items-center gap-1">
                  <Store className="h-4 w-4 text-blue-500" />
                  {activeListings} active listings
                </span>
                <span className="flex items-center gap-1">
                  <Award className="h-4 w-4 text-purple-500" />
                  Member since {new Date(profile?.created_at || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>
            <Link href="/dashboard/settings">
              <Button variant="outline">Edit Profile</Button>
            </Link>
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
            <CardDescription>Track your builder verification application</CardDescription>
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
                  <Link href="/check-status">
                    <Button variant="outline" size="sm">
                      View Details
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Verification Progress</span>
                    <span className="font-medium">
                      {latestApplication.status === "approved"
                        ? "100%"
                        : latestApplication.status === "under_review"
                          ? "75%"
                          : "50%"}
                    </span>
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
              </div>
            ) : (
              <div className="text-center py-6">
                <Shield className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-muted-foreground mb-4">You haven't applied for verification yet</p>
                <Link href="/apply/builder">
                  <Button>
                    Apply for Verification
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
        {builderStats.map((stat) => (
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

      {/* Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Listings</CardTitle>
            <CardDescription>Manage your products and services</CardDescription>
          </CardHeader>
          <CardContent>
            {listings && listings.length > 0 ? (
              <div className="space-y-3">
                {listings.slice(0, 3).map((listing) => (
                  <div key={listing.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        <Store className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{listing.title}</p>
                        <p className="text-sm text-muted-foreground">${listing.price}</p>
                      </div>
                    </div>
                    <Badge variant={listing.is_verified ? "default" : "secondary"}>
                      {listing.is_verified ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                ))}
                <Link href="/dashboard/listings">
                  <Button variant="outline" className="w-full mt-2 bg-transparent">
                    View All Listings
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <Store className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-muted-foreground mb-4">No listings yet</p>
                <Link href="/dashboard/listings/new">
                  <Button>Create Your First Listing</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Growth Tips</CardTitle>
            <CardDescription>Improve your builder profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="p-2 rounded-full bg-green-100">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Complete your profile</p>
                  <p className="text-sm text-muted-foreground">Add a bio, skills, and portfolio items</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="p-2 rounded-full bg-blue-100">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Create quality listings</p>
                  <p className="text-sm text-muted-foreground">Add clear descriptions and images</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="p-2 rounded-full bg-yellow-100">
                  <Star className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium">Build your reputation</p>
                  <p className="text-sm text-muted-foreground">Complete transactions and get reviews</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
