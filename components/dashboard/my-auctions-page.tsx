"use client"
import { motion } from "framer-motion"
import { Gavel, Clock, TrendingUp, Plus, Eye, Edit, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface MyAuctionsPageProps {
  myAuctions: any[]
  myBids: any[]
}

export function MyAuctionsPage({ myAuctions, myBids }: MyAuctionsPageProps) {
  const activeAuctions = myAuctions.filter((a) => a.status === "active")
  const endedAuctions = myAuctions.filter((a) => a.status === "ended")
  const wonBids = myBids.filter((b) => b.auctions?.winner_id === b.bidder_id)

  const calculateTimeLeft = (endTime: string) => {
    const end = new Date(endTime).getTime()
    const now = Date.now()
    const diff = end - now

    if (diff <= 0) return "Ended"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Gavel className="h-8 w-8" />
            My Auctions
          </h1>
          <p className="text-muted-foreground mt-1">Manage your auctions and track your bids</p>
        </div>
        <Link href="/dashboard/auctions/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Auction
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Gavel className="h-4 w-4 text-primary" />
              <p className="text-sm text-muted-foreground">Active Auctions</p>
            </div>
            <p className="text-2xl font-bold">{activeAuctions.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-yellow-600" />
              <p className="text-sm text-muted-foreground">Ended</p>
            </div>
            <p className="text-2xl font-bold">{endedAuctions.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-muted-foreground">My Bids</p>
            </div>
            <p className="text-2xl font-bold">{myBids.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <p className="text-sm text-muted-foreground">Won</p>
            </div>
            <p className="text-2xl font-bold text-green-600">{wonBids.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="my-auctions">
        <TabsList>
          <TabsTrigger value="my-auctions">My Auctions ({myAuctions.length})</TabsTrigger>
          <TabsTrigger value="my-bids">My Bids ({myBids.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="my-auctions" className="mt-6">
          {myAuctions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Gavel className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No auctions yet</p>
                <p className="text-sm text-muted-foreground mb-4">Create your first auction to start selling</p>
                <Link href="/dashboard/auctions/create">
                  <Button>Create Auction</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {myAuctions.map((auction, index) => (
                <motion.div
                  key={auction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden">
                    <div className="aspect-video bg-muted relative">
                      {auction.listings?.image_url && (
                        <img
                          src={auction.listings.image_url || "/placeholder.svg"}
                          alt={auction.listings.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <Badge
                        className={cn(
                          "absolute top-2 right-2",
                          auction.status === "active"
                            ? "bg-green-500"
                            : auction.status === "ended"
                              ? "bg-gray-500"
                              : "bg-yellow-500",
                        )}
                      >
                        {auction.status}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold truncate">{auction.listings?.title || "Untitled"}</h3>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Current Bid</span>
                          <span className="font-bold">${auction.current_bid || auction.starting_price}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Bids</span>
                          <span>{auction.bid_count || 0}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Time Left</span>
                          <span
                            className={cn(
                              "font-medium",
                              calculateTimeLeft(auction.end_time) === "Ended" ? "text-red-500" : "text-green-600",
                            )}
                          >
                            {calculateTimeLeft(auction.end_time)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Link href={`/marketplace/auctions/${auction.id}`} className="flex-1">
                          <Button variant="outline" className="w-full gap-2 bg-transparent">
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        </Link>
                        <Button variant="outline" size="icon" className="bg-transparent">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-bids" className="mt-6">
          {myBids.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No bids yet</p>
                <p className="text-sm text-muted-foreground mb-4">Browse auctions and start bidding</p>
                <Link href="/marketplace/auctions">
                  <Button>Browse Auctions</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {myBids.map((bid, index) => {
                const auction = bid.auctions
                const isWinning = auction?.current_bid === bid.amount
                const isWon = auction?.winner_id === bid.bidder_id

                return (
                  <motion.div
                    key={bid.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden shrink-0">
                            {auction?.listings?.image_url && (
                              <img
                                src={auction.listings.image_url || "/placeholder.svg"}
                                alt={auction.listings.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold truncate">{auction?.listings?.title || "Untitled"}</h3>
                              {isWon && <Badge className="bg-green-500">Won</Badge>}
                              {!isWon && isWinning && auction?.status === "active" && (
                                <Badge className="bg-blue-500">Winning</Badge>
                              )}
                              {!isWon && !isWinning && auction?.status === "active" && (
                                <Badge variant="secondary">Outbid</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              <span>Your bid: ${bid.amount}</span>
                              <span>Current: ${auction?.current_bid}</span>
                              <span>
                                {auction?.status === "active"
                                  ? `Ends in ${calculateTimeLeft(auction.end_time)}`
                                  : "Ended"}
                              </span>
                            </div>
                          </div>
                          <Link href={`/marketplace/auctions/${auction?.id}`}>
                            <Button variant="outline" className="bg-transparent">
                              View Auction
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
