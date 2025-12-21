"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeftRight,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  User,
  DollarSign,
  Calendar,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import type { SwapRequest } from "@/lib/types"
import Link from "next/link"

interface SwapDetailViewProps {
  swap: SwapRequest & {
    initiator?: any
    target_user?: any
    target_listing?: any
    offering_listing?: any
  }
  currentUserId: string
}

export function SwapDetailView({ swap, currentUserId }: SwapDetailViewProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isProcessing, setIsProcessing] = useState(false)
  const [actionDialog, setActionDialog] = useState<{ type: string; open: boolean }>({ type: "", open: false })
  const [rejectionReason, setRejectionReason] = useState("")

  const isInitiator = swap.initiator_id === currentUserId
  const otherParty = isInitiator ? swap.target_user : swap.initiator

  const handleAction = async (action: string) => {
    setIsProcessing(true)
    try {
      const body: any = { action }
      if (action === "reject" && rejectionReason) {
        body.reason = rejectionReason
      }

      const response = await fetch(`/api/swaps/${swap.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to process action")
      }

      router.refresh()
      setActionDialog({ type: "", open: false })
    } catch (error: any) {
      console.error("Action error:", error)
      alert(error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/swap-center">
            <Button variant="ghost" size="icon">
              ←
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Swap Details</h1>
            <p className="text-muted-foreground">View and manage swap proposal</p>
          </div>
        </div>
        <Badge
          variant="outline"
          className={
            swap.status === "pending"
              ? "bg-yellow-500/10 text-yellow-600"
              : swap.status === "accepted"
                ? "bg-green-500/10 text-green-600"
                : swap.status === "completed"
                  ? "bg-blue-500/10 text-blue-600"
                  : "bg-gray-500/10 text-gray-600"
          }
        >
          {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
        </Badge>
      </div>

      {/* Swap Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Swap Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Offering */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">You're Offering</span>
              </div>
              {swap.offering_listing ? (
                <Link href={`/marketplace/listing/${swap.offering_listing.id}`}>
                  <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <p className="font-semibold">{swap.offering_listing.title}</p>
                      {swap.offering_listing.images?.[0] && (
                        <img
                          src={swap.offering_listing.images[0]}
                          alt={swap.offering_listing.title}
                          className="w-full h-32 object-cover rounded-lg mt-2"
                        />
                      )}
                      {swap.offering_value && (
                        <p className="text-sm text-muted-foreground mt-2">Value: ${swap.offering_value}</p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ) : (
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <p className="font-medium">{swap.offering_description}</p>
                  {swap.offering_value && <p className="text-sm text-muted-foreground mt-2">Value: ${swap.offering_value}</p>}
                </div>
              )}
            </div>

            {/* Requesting */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <ArrowLeftRight className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">You're Requesting</span>
              </div>
              {swap.target_listing ? (
                <Link href={`/marketplace/listing/${swap.target_listing.id}`}>
                  <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <p className="font-semibold">{swap.target_listing.title}</p>
                      {swap.target_listing.images?.[0] && (
                        <img
                          src={swap.target_listing.images[0]}
                          alt={swap.target_listing.title}
                          className="w-full h-32 object-cover rounded-lg mt-2"
                        />
                      )}
                      {swap.requesting_value && (
                        <p className="text-sm text-muted-foreground mt-2">Value: ${swap.requesting_value}</p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ) : (
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <p className="font-medium">{swap.requesting_description}</p>
                  {swap.requesting_value && <p className="text-sm text-muted-foreground mt-2">Value: ${swap.requesting_value}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Price Difference */}
          {swap.price_difference && swap.price_difference !== 0 && (
            <div className="mt-4 p-4 bg-secondary/30 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Price Difference</span>
                <span className={`font-semibold ${swap.price_difference > 0 ? "text-green-600" : "text-red-600"}`}>
                  {swap.price_difference > 0 ? "+" : ""}${swap.price_difference}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {swap.price_difference > 0 ? "You pay this amount" : "You receive this amount"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Tabs */}
      <Tabs defaultValue="terms">
        <TabsList>
          <TabsTrigger value="terms">Terms</TabsTrigger>
          <TabsTrigger value="parties">Parties</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="terms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Swap Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm text-muted-foreground">Swap Mode</span>
                <p className="font-medium">{swap.swap_mode.replace("_", " ")}</p>
              </div>
              {swap.ownership_transfer_type && (
                <div>
                  <span className="text-sm text-muted-foreground">Ownership Transfer</span>
                  <p className="font-medium">{swap.ownership_transfer_type}</p>
                </div>
              )}
              {swap.usage_rights && (
                <div>
                  <span className="text-sm text-muted-foreground">Usage Rights</span>
                  <p className="font-medium">{swap.usage_rights}</p>
                </div>
              )}
              {swap.contract_duration_days && (
                <div>
                  <span className="text-sm text-muted-foreground">Contract Duration</span>
                  <p className="font-medium">{swap.contract_duration_days} days</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parties" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Initiator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={swap.initiator?.avatar_url || undefined} />
                    <AvatarFallback>{(swap.initiator?.full_name || "U")[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{swap.initiator?.full_name || "User"}</p>
                    <p className="text-sm text-muted-foreground">{swap.initiator?.reputation_score || 0} reputation</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Target User</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={swap.target_user?.avatar_url || undefined} />
                    <AvatarFallback>{(swap.target_user?.full_name || "U")[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{swap.target_user?.full_name || "User"}</p>
                    <p className="text-sm text-muted-foreground">{swap.target_user?.reputation_score || 0} reputation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">{new Date(swap.created_at).toLocaleString()}</p>
                </div>
              </div>
              {swap.accepted_at && (
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="font-medium">Accepted</p>
                    <p className="text-sm text-muted-foreground">{new Date(swap.accepted_at).toLocaleString()}</p>
                  </div>
                </div>
              )}
              {swap.completed_at && (
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-medium">Completed</p>
                    <p className="text-sm text-muted-foreground">{new Date(swap.completed_at).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      {swap.status === "pending" && !isInitiator && (
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Accept or reject this swap proposal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button
                onClick={() => handleAction("accept")}
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                Accept Swap
              </Button>
              <Button
                variant="destructive"
                onClick={() => setActionDialog({ type: "reject", open: true })}
                disabled={isProcessing}
                className="flex-1"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {swap.status === "accepted" && (
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>Complete the swap execution</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => handleAction("complete")}
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
              Mark as Completed
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Rejection Dialog */}
      <Dialog open={actionDialog.open && actionDialog.type === "reject"} onOpenChange={(open) => setActionDialog({ type: "", open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Swap Proposal</DialogTitle>
            <DialogDescription>Provide a reason for rejecting this swap (optional)</DialogDescription>
          </DialogHeader>
          <Textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Reason for rejection..."
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog({ type: "", open: false })}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleAction("reject")}
              disabled={isProcessing}
            >
              {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Reject Swap
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

