"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Clock,
  Gavel,
  Users,
  Shield,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Award,
  TrendingUp,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import type { Auction, AuctionBid, Listing, Profile } from "@/lib/types"

interface AuctionDetailProps {
  auction: Auction & {
    listing: Listing
    seller: Profile
    bids: (AuctionBid & { bidder: Profile })[]
  }
  currentUserId?: string
  initialWatching: boolean
}

export function AuctionDetail({ auction, currentUserId, initialWatching }: AuctionDetailProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const [bidAmount, setBidAmount] = useState("")
  const [isWatching, setIsWatching] = useState(initialWatching)
  const [timeLeft, setTimeLeft] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const supabase = createClient()
  const images = auction.listing?.images?.length > 0 ? auction.listing.images : ["/placeholder.svg"]
  const minimumBid = auction.current_bid ? auction.current_bid + auction.bid_increment : auction.starting_price

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const end = new Date(auction.end_time).getTime()

      if (now >= end) {
        setTimeLeft("Auction Ended")
        return
      }

      const diff = end - now
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const secs = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft(`${days > 0 ? `${days}d ` : ""}${hours}h ${mins}m ${secs}s`)
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(interval)
  }, [auction.end_time])

  const handleBid = async () => {
    if (!currentUserId) {
      setError("Please sign in to place a bid")
      return
    }

    const amount = Number.parseFloat(bidAmount)
    if (Number.isNaN(amount) || amount < minimumBid) {
      setError(`Minimum bid is $${minimumBid.toFixed(2)}`)
      return
    }

    setSubmitting(true)
    setError("")

    const { error: bidError } = await supabase.from("auction_bids").insert({
      auction_id: auction.id,
      bidder_id: currentUserId,
      amount,
    })

    if (bidError) {
      setError("Failed to place bid. Please try again.")
    } else {
      // Update auction current bid
      await supabase
        .from("auctions")
        .update({ current_bid: amount, current_bidder_id: currentUserId })
        .eq("id", auction.id)

      setBidAmount("")
      window.location.reload()
    }

    setSubmitting(false)
  }

  const toggleWatchlist = async () => {
    if (!currentUserId) return

    if (isWatching) {
      await supabase.from("auction_watchlist").delete().eq("auction_id", auction.id).eq("user_id", currentUserId)
    } else {
      await supabase.from("auction_watchlist").insert({ auction_id: auction.id, user_id: currentUserId })
    }
    setIsWatching(!isWatching)
  }

  return (
    <div className="pb-12">
      <div className="mb-6">
        <Link href="/marketplace/auctions" className="text-sm text-muted-foreground hover:text-primary">
          ← Back to Auctions
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-secondary/30">
            <motion.img
              key={currentImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={images[currentImage] || "/placeholder.svg"}
              alt={auction.listing?.title}
              className="w-full h-full object-cover"
            />

            {images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full"
                  onClick={() => setCurrentImage((prev) => (prev - 1 + images.length) % images.length)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full"
                  onClick={() => setCurrentImage((prev) => (prev + 1) % images.length)}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}

            <div className="absolute top-4 left-4">
              <Badge
                className={`gap-1 ${
                  auction.status === "active" ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600"
                }`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                {auction.status === "active" ? "Live Auction" : "Upcoming"}
              </Badge>
            </div>
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${
                    currentImage === i ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img src={img || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-sm text-muted-foreground capitalize mb-1">{auction.listing?.listing_type}</p>
              <h1 className="text-3xl font-bold">{auction.listing?.title}</h1>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleWatchlist}
                className={`bg-transparent ${isWatching ? "text-destructive border-destructive" : ""}`}
              >
                <Heart className={`h-5 w-5 ${isWatching ? "fill-current" : ""}`} />
              </Button>
              <Button variant="outline" size="icon" className="bg-transparent">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Timer */}
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="font-medium">Time Remaining</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{auction.bids?.length || 0} bids</span>
                </div>
              </div>
              <p className="text-4xl font-bold font-mono text-primary">{timeLeft}</p>
            </CardContent>
          </Card>

          {/* Bidding */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current Bid</p>
                  <p className="text-3xl font-bold text-primary">
                    ${(auction.current_bid || auction.starting_price).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Starting Price</p>
                  <p className="text-xl font-semibold">${auction.starting_price.toFixed(2)}</p>
                </div>
              </div>

              {auction.reserve_price && (
                <div className="flex items-center gap-2 mb-4 text-sm">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="text-muted-foreground">
                    Reserve price: ${auction.reserve_price.toFixed(2)}
                    {auction.current_bid && auction.current_bid >= auction.reserve_price && (
                      <Badge variant="secondary" className="ml-2">
                        Met
                      </Badge>
                    )}
                  </span>
                </div>
              )}

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {auction.status === "active" && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder={`Min: $${minimumBid.toFixed(2)}`}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      min={minimumBid}
                      step="0.01"
                    />
                    <Button onClick={handleBid} disabled={submitting} className="gap-2">
                      <Gavel className="h-4 w-4" />
                      {submitting ? "Placing..." : "Place Bid"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Minimum bid increment: ${auction.bid_increment.toFixed(2)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Seller */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={auction.seller?.avatar_url || undefined} />
                  <AvatarFallback>{auction.seller?.full_name?.charAt(0) || "?"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{auction.seller?.full_name || "Anonymous"}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {auction.seller?.is_verified && (
                      <>
                        <Shield className="h-3 w-3 text-primary" />
                        Verified Seller
                      </>
                    )}
                    <span className="flex items-center gap-1">
                      <Award className="h-3 w-3 text-chart-4" />
                      {auction.seller?.reputation_score || 0} pts
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="bg-transparent">
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="description" className="mt-8">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="bids">Bid History ({auction.bids?.length || 0})</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <p className="whitespace-pre-line">{auction.listing?.description}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bids" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Bid History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {auction.bids && auction.bids.length > 0 ? (
                <div className="space-y-3">
                  {auction.bids
                    .sort((a, b) => b.amount - a.amount)
                    .map((bid, index) => (
                      <div
                        key={bid.id}
                        className={`flex items-center justify-between p-3 rounded-lg ${index === 0 ? "bg-primary/10 border border-primary/20" : "bg-muted"}`}
                      >
                        <div className="flex items-center gap-3">
                          {index === 0 && <Badge>Leading</Badge>}
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={bid.bidder?.avatar_url || undefined} />
                            <AvatarFallback>{bid.bidder?.full_name?.charAt(0) || "?"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{bid.bidder?.full_name || "Anonymous"}</p>
                            <p className="text-xs text-muted-foreground">{new Date(bid.created_at).toLocaleString()}</p>
                          </div>
                        </div>
                        <p className={`font-bold ${index === 0 ? "text-primary" : ""}`}>${bid.amount.toFixed(2)}</p>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">No bids yet. Be the first to bid!</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Auction Started</p>
                  <p className="font-medium">{new Date(auction.start_time).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Auction Ends</p>
                  <p className="font-medium">{new Date(auction.end_time).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bid Increment</p>
                  <p className="font-medium">${auction.bid_increment.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Bids</p>
                  <p className="font-medium">{auction.bids?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
