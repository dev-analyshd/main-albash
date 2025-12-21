import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, Eye, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function ApplicationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: applications } = await supabase
    .from("applications")
    .select("*, departments(name)")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "approved":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-100",
          badge: "default" as const,
        }
      case "rejected":
        return {
          icon: XCircle,
          color: "text-red-600",
          bgColor: "bg-red-100",
          badge: "destructive" as const,
        }
      case "update_required":
        return {
          icon: AlertCircle,
          color: "text-orange-600",
          bgColor: "bg-orange-100",
          badge: "secondary" as const,
        }
      default:
        return {
          icon: Clock,
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
          badge: "secondary" as const,
        }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Applications</h1>
          <p className="text-muted-foreground mt-1">Track the status of your verification and access applications</p>
        </div>
        <Link href="/apply/builder">
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            New Application
          </Button>
        </Link>
      </div>

      {applications && applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((app) => {
            const statusConfig = getStatusConfig(app.status)
            const StatusIcon = statusConfig.icon

            return (
              <Card key={app.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${statusConfig.bgColor}`}>
                        <StatusIcon className={`h-6 w-6 ${statusConfig.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg capitalize">{app.type} Application</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Department: {app.departments?.name || "General"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Submitted: {new Date(app.created_at).toLocaleDateString()}
                        </p>
                        {app.verifier_notes && (
                          <div className="mt-3 p-3 bg-muted rounded-lg">
                            <p className="text-sm font-medium">Verifier Notes:</p>
                            <p className="text-sm text-muted-foreground">{app.verifier_notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={statusConfig.badge} className="capitalize">
                        {app.status.replace("_", " ")}
                      </Badge>
                      <Link href={`/dashboard/applications/${app.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="mr-1 h-4 w-4" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Progress Steps */}
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex items-center justify-between">
                      {["submitted", "under_review", "verification", "decision"].map((step, index) => {
                        const stepStatuses = {
                          submitted: ["pending", "under_review", "approved", "rejected", "update_required"],
                          under_review: ["under_review", "approved", "rejected", "update_required"],
                          verification: ["approved", "rejected"],
                          decision: ["approved", "rejected"],
                        }
                        const isComplete = stepStatuses[step as keyof typeof stepStatuses].includes(app.status)
                        const isCurrent =
                          (step === "submitted" && app.status === "pending") ||
                          (step === "under_review" && app.status === "under_review") ||
                          (step === "verification" && app.status === "update_required") ||
                          (step === "decision" && (app.status === "approved" || app.status === "rejected"))

                        return (
                          <div key={step} className="flex items-center">
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                  isComplete
                                    ? "bg-primary text-primary-foreground"
                                    : isCurrent
                                      ? "bg-primary/20 text-primary border-2 border-primary"
                                      : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {isComplete ? "✓" : index + 1}
                              </div>
                              <span className="text-xs mt-1 capitalize">{step.replace("_", " ")}</span>
                            </div>
                            {index < 3 && (
                              <div className={`w-16 h-0.5 mx-2 ${isComplete ? "bg-primary" : "bg-muted"}`} />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="font-semibold text-lg">No applications yet</h3>
            <p className="text-muted-foreground text-center mt-2 max-w-md">
              Start your journey by applying for verification. This unlocks full platform features and increases your
              credibility.
            </p>
            <div className="flex gap-4 mt-6">
              <Link href="/apply/builder">
                <Button>
                  Apply as Builder
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/departments">
                <Button variant="outline">View Departments</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
