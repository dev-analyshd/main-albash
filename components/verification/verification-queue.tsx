"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Clock, CheckCircle, XCircle, AlertCircle, User, FileText, ExternalLink, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Application, ApplicationStatus } from "@/lib/types"

interface VerificationQueueProps {
  applications: Application[]
  onStatusChange: (id: string, status: ApplicationStatus, feedback: string) => void
}

const statusColors = {
  pending: "bg-chart-4/10 text-chart-4",
  in_review: "bg-chart-1/10 text-chart-1",
  approved: "bg-chart-2/10 text-chart-2",
  rejected: "bg-destructive/10 text-destructive",
  needs_update: "bg-chart-3/10 text-chart-3",
}

export function VerificationQueue({ applications, onStatusChange }: VerificationQueueProps) {
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAction = async (status: ApplicationStatus) => {
    if (!selectedApp) return
    setIsSubmitting(true)
    await onStatusChange(selectedApp.id, status, feedback)
    setIsSubmitting(false)
    setSelectedApp(null)
    setFeedback("")
  }

  return (
    <>
      <div className="space-y-4">
        {applications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No applications pending review</p>
            </CardContent>
          </Card>
        ) : (
          applications.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:border-primary transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{app.title}</h3>
                          <Badge variant="secondary" className={statusColors[app.status]}>
                            {app.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{app.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(app.submitted_at).toLocaleDateString()}
                          </span>
                          <span className="capitalize">{app.application_type}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setSelectedApp(app)} className="bg-transparent">
                      Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Review Dialog */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Application</DialogTitle>
            <DialogDescription>Review the application details and take action</DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-6">
              {/* Application Details */}
              <div className="space-y-4">
                <div className="bg-secondary/30 rounded-xl p-4">
                  <h4 className="font-medium mb-2">{selectedApp.title}</h4>
                  <p className="text-sm text-muted-foreground">{selectedApp.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Type:</span>{" "}
                    <span className="capitalize">{selectedApp.application_type}</span>
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
                      {selectedApp.documents.map((doc: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-sm bg-secondary/30 rounded-lg px-3 py-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <span className="flex-1 truncate">{doc}</span>
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
    </>
  )
}
