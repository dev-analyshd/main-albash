import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import {
  GraduationCap,
  CheckCircle,
  Clock,
  FileText,
  Users,
  Star,
  Settings,
  ArrowRight,
  Shield,
  Globe,
  Calendar,
} from "lucide-react"

export default async function InstitutionDashboardPage() {
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
    .eq("application_type", "institution")
    .order("created_at", { ascending: false })

  const latestApplication = applications?.[0]
  const isVerified = profile?.is_verified

  const institutionStats = [
    {
      title: "Verification Status",
      value: isVerified ? "Verified" : "Pending",
      icon: Shield,
      color: isVerified ? "text-green-600" : "text-yellow-600",
      bgColor: isVerified ? "bg-green-100" : "bg-yellow-100",
    },
    { title: "Students Enrolled", value: "0", icon: Users, color: "text-blue-600", bgColor: "bg-blue-100" },
    { title: "Programs Listed", value: "0", icon: GraduationCap, color: "text-purple-600", bgColor: "bg-purple-100" },
    {
      title: "Platform Rating",
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
          <h1 className="text-3xl font-bold">Institution Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your institution profile, programs, and students</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/settings">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-10 w-10 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{profile?.full_name || "Institution Name"}</h2>
                {isVerified && (
                  <Badge className="bg-green-100 text-green-700 gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Verified Institution
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mb-4">{profile?.bio || "Educational institution profile"}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Globe className="h-4 w-4 text-blue-500" />
                  Website pending
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-purple-500" />
                  Member since {new Date(profile?.created_at || Date.now()).toLocaleDateString()}
                </span>
              </div>
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
            <CardDescription>Track your institution verification application</CardDescription>
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
                <Link href="/apply/institution">
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
        {institutionStats.map((stat) => (
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

      {/* Services Available */}
      <Card>
        <CardHeader>
          <CardTitle>Services Available for Institutions</CardTitle>
          <CardDescription>Request these services for your institution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: "Website Creation", desc: "Custom educational website with student portal", icon: Globe },
              { title: "Branding & Logo", desc: "Professional visual identity design", icon: Star },
              { title: "Digital Marketing", desc: "Student recruitment and awareness campaigns", icon: Users },
              { title: "Document Systems", desc: "Certificate and transcript management", icon: FileText },
            ].map((service) => (
              <div key={service.title} className="flex items-start gap-3 p-4 rounded-lg border">
                <div className="p-2 rounded-lg bg-primary/10">
                  <service.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{service.title}</p>
                  <p className="text-sm text-muted-foreground">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/contact" className="block mt-4">
            <Button variant="outline" className="w-full bg-transparent">
              Request a Service
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
