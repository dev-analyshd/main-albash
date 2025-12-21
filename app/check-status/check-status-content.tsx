"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { FadeInUp } from "@/components/ui/motion-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Clock, CheckCircle, XCircle, AlertCircle, FileText, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"

type StatusType = "pending" | "in_review" | "approved" | "rejected" | "needs_update" | null

interface ApplicationData {
  id: string
  trackingCode?: string
  type: string
  status: StatusType
  title: string
  createdAt: string
  updatedAt: string
  reviewedAt: string | null
  feedback: string | null
}

const statusConfig = {
  pending: { icon: Clock, color: "text-chart-4", bg: "bg-chart-4/10", label: "Pending Review" },
  in_review: { icon: AlertCircle, color: "text-chart-1", bg: "bg-chart-1/10", label: "Under Review" },
  approved: { icon: CheckCircle, color: "text-chart-2", bg: "bg-chart-2/10", label: "Approved" },
  rejected: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Rejected" },
  needs_update: { icon: FileText, color: "text-chart-3", bg: "bg-chart-3/10", label: "Needs Update" },
}

export default function CheckStatusContent() {
  const searchParams = useSearchParams()
  const initialId = searchParams.get("id") || ""

  const [applicationId, setApplicationId] = useState(initialId)
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPolling, setIsPolling] = useState(false)

  // Auto-check if ID is provided in URL
  useEffect(() => {
    if (initialId) {
      handleCheck()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Real-time polling when application data is loaded
  useEffect(() => {
    if (!applicationData || !isPolling) return

    // Only poll if status is pending or in_review (not final states)
    if (applicationData.status !== "pending" && applicationData.status !== "in_review") {
      setIsPolling(false)
      return
    }

    let isMounted = true

    const pollInterval = setInterval(async () => {
      if (!isMounted) return

      try {
        const response = await fetch("/api/check-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ applicationId: applicationData.trackingCode || applicationData.id }),
        })

        if (response.ok) {
          const data = await response.json()
          if (data.application && isMounted) {
            setApplicationData(data.application)
            // Stop polling if status changed to a final state
            if (data.application.status !== "pending" && data.application.status !== "in_review") {
              setIsPolling(false)
            }
          }
        }
      } catch (err) {
        console.error("Polling error:", err)
        // Stop polling on repeated errors
        if (isMounted) {
          setIsPolling(false)
        }
      }
    }, 5000) // Poll every 5 seconds

    return () => {
      isMounted = false
      clearInterval(pollInterval)
    }
  }, [applicationData, isPolling])

  const handleCheck = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!applicationId.trim()) return

    setIsLoading(true)
    setNotFound(false)
    setError(null)
    setApplicationData(null)

    try {
      const response = await fetch("/api/check-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: applicationId.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 404) {
          setNotFound(true)
        } else {
          setError(data.error || "Failed to check status")
        }
        return
      }

      setApplicationData(data.application)
      // Start polling if status is pending or in_review
      if (data.application.status === "pending" || data.application.status === "in_review") {
        setIsPolling(true)
      }
    } catch (err) {
      setError("Failed to connect to server. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const status = applicationData?.status || null
  const StatusIcon = status ? statusConfig[status]?.icon : null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="pt-20 min-h-screen">
      <section className="py-24">
        <div className="container mx-auto px-4">
          <FadeInUp className="max-w-xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Check Application Status</CardTitle>
                <CardDescription>Enter your application ID to track your verification progress</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCheck} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="applicationId">Application ID</Label>
                    <Input
                      id="applicationId"
                      placeholder="Enter your application ID or email"
                      value={applicationId}
                      onChange={(e) => setApplicationId(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      You can use your application ID (e.g., APP-2024-XXXXX) or UUID
                    </p>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading || !applicationId.trim()}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      "Check Status"
                    )}
                  </Button>
                </form>

                {/* Error Message */}
                {error && (
                  <div className="mt-6 p-4 bg-destructive/10 rounded-lg text-center">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                {/* Status Result */}
                {applicationData && status && StatusIcon && statusConfig[status] && (
                  <div className="mt-8 pt-8 border-t border-border">
                    <div className={`rounded-xl p-6 ${statusConfig[status].bg}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center">
                          <StatusIcon className={`h-6 w-6 ${statusConfig[status].color}`} />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <p className={`font-semibold ${statusConfig[status].color}`}>{statusConfig[status].label}</p>
                        </div>
                      </div>
                        {isPolling && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            <span>Live updates</span>
                          </div>
                        )}
                      </div>
                      {applicationData.trackingCode && (
                        <div className="mb-4 p-3 bg-background/50 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Tracking Code</p>
                          <p className="font-mono font-semibold text-sm">{applicationData.trackingCode}</p>
                        </div>
                      )}
                      <div className="space-y-2 text-sm">
                        {applicationData.title && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Application</span>
                            <span className="font-medium">{applicationData.title}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type</span>
                          <span className="font-medium capitalize">{applicationData.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Submitted</span>
                          <span className="font-medium">{formatDate(applicationData.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Last Updated</span>
                          <span className="font-medium">{formatDate(applicationData.updatedAt)}</span>
                        </div>
                        {applicationData.reviewedAt && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Reviewed</span>
                            <span className="font-medium">{formatDate(applicationData.reviewedAt)}</span>
                          </div>
                        )}
                      </div>
                      {applicationData.feedback && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <p className="text-sm text-muted-foreground mb-2">Feedback from reviewer:</p>
                          <p className="text-sm">{applicationData.feedback}</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 text-center">
                      <Link href="/auth/login">
                        <Button variant="outline" className="gap-2 bg-transparent">
                          Login for Full Details
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Not Found */}
                {notFound && (
                  <div className="mt-8 pt-8 border-t border-border text-center">
                    <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                      <XCircle className="h-8 w-8 text-destructive" />
                    </div>
                    <p className="font-medium mb-2">Application Not Found</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      We couldn&apos;t find an application with that ID. Please double-check and try again.
                    </p>
                    <div className="text-sm text-muted-foreground">
                      <p>Tips:</p>
                      <ul className="list-disc list-inside mt-2 text-left max-w-xs mx-auto">
                        <li>Check for typos in your application ID</li>
                        <li>Make sure you&apos;re using the correct format</li>
                        <li>If you just applied, wait a few minutes and try again</li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </FadeInUp>
        </div>
      </section>
    </div>
  )
}
