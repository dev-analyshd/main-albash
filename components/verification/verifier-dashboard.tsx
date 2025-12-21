"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  ExternalLink,
  MessageSquare,
  TrendingUp,
  ListChecks,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { ApplicationStatus, VerificationRequest } from "@/lib/types"

interface VerifierDashboardProps {
  applications: (VerificationRequest & {
    profiles?: { full_name: string | null; email: string; avatar_url: string | null }
  })[]
  stats: {
    pending: number
    approvedToday: number
    totalProcessed: number
  }
  verifierId: string
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  in_review: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  needs_update: "bg-orange-100 text-orange-700",
}

export function VerifierDashboard({ applications, stats, verifierId }: VerifierDashboardProps) {
  const router = useRouter()
  const supabase = createClient()
  const [selectedApp, setSelectedApp] = useState<(typeof applications)[0] | null>(null)
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      (app.form_data?.title || "")
        .toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      app.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.profiles?.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || app.verification_type === filterType
    return matchesSearch && matchesType
  })

  const handleAction = async (status: ApplicationStatus) => {
    if (!selectedApp) return
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/admin/verification", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedApp.id,
          status,
          feedback: feedback || undefined,
          rejection_reason: feedback || undefined,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update verification request")
      }

      router.refresh()
      setSelectedApp(null)
      setFeedback("")
    } catch (error) {
      console.error("Error updating application:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Verification Dashboard</h1>
        <p className="text-muted-foreground mt-1">Review and process pending verification applications</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 rounded-lg bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Review</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 rounded-lg bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Approved Today</p>
              <p className="text-2xl font-bold">{stats.approvedToday}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 rounded-lg bg-blue-100">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Processed</p>
              <p className="text-2xl font-bold">{stats.totalProcessed}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="builder">Builder</SelectItem>
            <SelectItem value="institution">Institution</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="organization">Organization</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Applications Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="h-5 w-5" />
            Verification Queue
          </CardTitle>
            <CardDescription>{filteredApplications.length} applications pending review</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-medium">All caught up!</p>
              <p className="text-muted-foreground">No applications pending review</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((app, index) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start justify-between gap-4 p-4 border rounded-lg hover:border-primary transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={app.profiles?.avatar_url || undefined} />
                      <AvatarFallback>{app.profiles?.full_name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">
                          {(app.form_data as any)?.title || "Verification Request"}
                        </h3>
                        <Badge className={statusColors[app.status]}>{app.status.replace("_", " ")}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{app.profiles?.full_name || "Unknown User"}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {(app.form_data as any)?.description || "No description provided"}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(app.submitted_at).toLocaleDateString()}
                        </span>
                        <span className="capitalize">{app.verification_type}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedApp(app)} className="bg-transparent">
                    Review
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Application</DialogTitle>
            <DialogDescription>Review the application details and take action</DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-6">
              {/* Applicant Info */}
              <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-xl">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedApp.profiles?.avatar_url || undefined} />
                  <AvatarFallback>{selectedApp.profiles?.full_name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{selectedApp.profiles?.full_name || "Unknown User"}</p>
                  <p className="text-sm text-muted-foreground">{selectedApp.profiles?.email}</p>
                </div>
              </div>

              {/* Application Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">
                    {(selectedApp.form_data as any)?.title || "Verification Request"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {(selectedApp.form_data as any)?.description || "No description provided"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Type:</span>{" "}
                    <span className="capitalize">{selectedApp.verification_type}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Submitted:</span>{" "}
                    {new Date(selectedApp.submitted_at).toLocaleDateString()}
                  </div>
                </div>

                {/* Documents */}
                {selectedApp.documents && selectedApp.documents.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Attached Documents:</p>
                    <div className="space-y-2">
                      {selectedApp.documents.map((doc: any, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-sm bg-secondary/30 rounded-lg px-3 py-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <span className="flex-1 truncate">{doc.name || `Document ${i + 1}`}</span>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Feedback */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Feedback / Notes
                </label>
                <Textarea
                  placeholder="Add feedback for the applicant..."
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => handleAction("needs_update")}
                  disabled={isSubmitting}
                  className="gap-2 bg-transparent"
                >
                  <AlertCircle className="h-4 w-4" />
                  Request Update
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleAction("rejected")}
                  disabled={isSubmitting}
                  className="gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
                <Button onClick={() => handleAction("approved")} disabled={isSubmitting} className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
