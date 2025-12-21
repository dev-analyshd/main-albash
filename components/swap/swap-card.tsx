"use client"

import { motion } from "framer-motion"
import { ArrowLeftRight, Clock, CheckCircle, XCircle, AlertCircle, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import type { SwapRequest } from "@/lib/types"

interface SwapCardProps {
  swap: SwapRequest & {
    initiator?: any
    target_user?: any
    target_listing?: any
    offering_listing?: any
  }
  viewType?: "sent" | "received"
  onClick?: () => void
}

export function SwapCard({ swap, viewType, onClick }: SwapCardProps) {
  const statusConfig = {
    pending: { icon: Clock, color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20", label: "Pending" },
    accepted: { icon: CheckCircle, color: "bg-green-500/10 text-green-600 border-green-500/20", label: "Accepted" },
    rejected: { icon: XCircle, color: "bg-red-500/10 text-red-600 border-red-500/20", label: "Rejected" },
    cancelled: { icon: XCircle, color: "bg-gray-500/10 text-gray-600 border-gray-500/20", label: "Cancelled" },
    completed: { icon: CheckCircle, color: "bg-blue-500/10 text-blue-600 border-blue-500/20", label: "Completed" },
    disputed: { icon: AlertCircle, color: "bg-orange-500/10 text-orange-600 border-orange-500/20", label: "Disputed" },
    expired: { icon: Clock, color: "bg-gray-500/10 text-gray-600 border-gray-500/20", label: "Expired" },
  }

  const statusInfo = statusConfig[swap.status] || statusConfig.pending
  const StatusIcon = statusInfo.icon

  const otherParty = viewType === "sent" ? swap.target_user : swap.initiator
  const offeringAsset = swap.offering_listing || { title: swap.offering_description }
  const requestingAsset = swap.target_listing || { title: swap.requesting_description }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className="hover:border-primary/50 transition-colors">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <ArrowLeftRight className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">
                    {viewType === "sent" ? "You offered" : "You received"}
                  </h3>
                  <Badge variant="outline" className={statusInfo.color}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusInfo.label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {viewType === "sent" ? `To ${otherParty?.full_name || "User"}` : `From ${otherParty?.full_name || "User"}`}
                </p>
              </div>
            </div>
            <Avatar className="h-10 w-10">
              <AvatarImage src={otherParty?.avatar_url || undefined} />
              <AvatarFallback>{(otherParty?.full_name || "U")[0]}</AvatarFallback>
            </Avatar>
          </div>

          {/* Swap Details */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Offering</p>
                <p className="font-medium text-sm">{offeringAsset.title || swap.offering_description}</p>
                {swap.offering_value && (
                  <p className="text-xs text-muted-foreground mt-1">Value: ${swap.offering_value}</p>
                )}
              </div>
              <ArrowLeftRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 text-right">
                <p className="text-xs text-muted-foreground mb-1">Requesting</p>
                <p className="font-medium text-sm">{requestingAsset.title || swap.requesting_description}</p>
                {swap.requesting_value && (
                  <p className="text-xs text-muted-foreground mt-1">Value: ${swap.requesting_value}</p>
                )}
              </div>
            </div>

            {swap.price_difference && swap.price_difference !== 0 && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Price difference:</span>
                <span className={`font-semibold ${swap.price_difference > 0 ? "text-green-600" : "text-red-600"}`}>
                  {swap.price_difference > 0 ? "+" : ""}${swap.price_difference}
                </span>
              </div>
            )}

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {swap.swap_mode.replace("_", " ")}
              </span>
              <span>{new Date(swap.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Link href={`/swap-center/${swap.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                View Details
              </Button>
            </Link>
            {swap.status === "pending" && viewType === "received" && (
              <Link href={`/swap-center/${swap.id}`} className="flex-1">
                <Button size="sm" className="w-full">
                  Review
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

