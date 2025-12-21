"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Clock, Gavel, Users, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Auction } from "@/lib/types"

interface AuctionCardProps {
  auction: Auction & {
    listing?: {
      id: string
      title: string
      description: string
      images: string[]
      listing_type: string
    }
    seller?: {
      id: string
      full_name: string | null
      avatar_url: string | null
      is_verified: boolean
    }
    bids?: { count: number }[]
  }
  index?: number
}

export function AuctionCard({ auction, index = 0 }: AuctionCardProps) {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const end = new Date(auction.end_time).getTime()
      const start = new Date(auction.start_time).getTime()

      if (auction.status === "scheduled" && now < start) {
        const diff = start - now
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        setTimeLeft(`Starts in ${days > 0 ? `${days}d ` : ""}${hours}h ${mins}m`)
      } else if (now < end) {
        const diff = end - now
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const secs = Math.floor((diff % (1000 * 60)) / 1000)
        setTimeLeft(`${days > 0 ? `${days}d ` : ""}${hours}h ${mins}m ${secs}s`)
      } else {
        setTimeLeft("Ended")
      }
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(interval)
  }, [auction.end_time, auction.start_time, auction.status])

  const bidCount = auction.bids?.[0]?.count || 0
  const listing = auction.listing

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
      <Link href={`/marketplace/auctions/${auction.id}`}>
        <div className="group bg-card rounded-xl border border-border overflow-hidden hover:border-primary hover:shadow-lg transition-all">
          {/* Image */}
          <div className="aspect-[4/3] relative overflow-hidden bg-secondary/30">
            <img
              src={listing?.images?.[0] || "/placeholder.svg?height=300&width=400&query=auction item"}
              alt={listing?.title || "Auction"}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            {/* Status Badge */}
            <div className="absolute top-3 left-3">
              <Badge
                className={`gap-1 ${
                  auction.status === "active" ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600"
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${auction.status === "active" ? "bg-white animate-pulse" : "bg-white"}`}
                />
                {auction.status === "active" ? "Live" : "Upcoming"}
              </Badge>
            </div>
            {/* Timer */}
            <div className="absolute bottom-3 left-3 right-3">
              <div className="bg-background/90 backdrop-blur rounded-lg p-2 flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-mono font-medium">{timeLeft}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{bidCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-1 capitalize">{listing?.listing_type || "Item"}</p>
            <h3 className="font-semibold line-clamp-1 mb-3 group-hover:text-primary transition-colors">
              {listing?.title || "Untitled Auction"}
            </h3>

            {/* Price Info */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-muted-foreground">
                  {auction.current_bid ? "Current Bid" : "Starting Price"}
                </p>
                <p className="text-lg font-bold text-primary">
                  ${(auction.current_bid || auction.starting_price).toFixed(2)}
                </p>
              </div>
              {auction.reserve_price && !auction.current_bid && (
                <Badge variant="outline" className="text-xs">
                  Reserve: ${auction.reserve_price.toFixed(2)}
                </Badge>
              )}
            </div>

            {/* Seller */}
            {auction.seller && (
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={auction.seller.avatar_url || undefined} />
                    <AvatarFallback className="text-xs">{auction.seller.full_name?.charAt(0) || "?"}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground truncate max-w-[100px]">
                    {auction.seller.full_name}
                  </span>
                  {auction.seller.is_verified && <Shield className="h-3 w-3 text-primary" />}
                </div>
                <Button size="sm" variant="secondary" className="gap-1">
                  <Gavel className="h-3 w-3" />
                  Bid
                </Button>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
