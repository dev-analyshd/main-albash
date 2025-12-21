"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Gavel, Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function CreateAuctionPage() {
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    listing_id: "",
    starting_price: "",
    reserve_price: "",
    bid_increment: "1",
    duration: "7",
  })

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function fetchListings() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from("listings")
          .select("id, title, images")
          .eq("seller_id", user.id)
          .eq("status", "active")

        setListings(data || [])
      }
      setLoading(false)
    }
    fetchListings()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const startTime = new Date()
    const endTime = new Date(startTime.getTime() + Number.parseInt(formData.duration) * 24 * 60 * 60 * 1000)

    const { error } = await supabase.from("auctions").insert({
      listing_id: formData.listing_id,
      seller_id: user.id,
      starting_price: Number.parseFloat(formData.starting_price),
      reserve_price: formData.reserve_price ? Number.parseFloat(formData.reserve_price) : null,
      bid_increment: Number.parseFloat(formData.bid_increment),
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      status: "active",
    })

    if (!error) {
      setSuccess(true)
      setTimeout(() => router.push("/marketplace/auctions"), 2000)
    }

    setSubmitting(false)
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-12 pb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Auction Created!</h2>
            <p className="text-muted-foreground">Redirecting to auctions page...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gavel className="h-5 w-5" />
            Create Auction
          </CardTitle>
          <CardDescription>Set up an auction for one of your listings</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p className="text-muted-foreground">Loading your listings...</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-8">
              <Gavel className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No Listings Available</h3>
              <p className="text-muted-foreground mb-4">Create a listing first before starting an auction</p>
              <Link href="/dashboard/listings/new">
                <Button>Create Listing</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="listing">Select Listing *</Label>
                <Select value={formData.listing_id} onValueChange={(v) => setFormData({ ...formData, listing_id: v })}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Choose a listing" />
                  </SelectTrigger>
                  <SelectContent>
                    {listings.map((listing) => (
                      <SelectItem key={listing.id} value={listing.id}>
                        {listing.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="starting_price">Starting Price ($) *</Label>
                  <Input
                    id="starting_price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.starting_price}
                    onChange={(e) => setFormData({ ...formData, starting_price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="reserve_price">Reserve Price ($)</Label>
                  <Input
                    id="reserve_price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.reserve_price}
                    onChange={(e) => setFormData({ ...formData, reserve_price: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bid_increment">Bid Increment ($)</Label>
                  <Select
                    value={formData.bid_increment}
                    onValueChange={(v) => setFormData({ ...formData, bid_increment: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">$1.00</SelectItem>
                      <SelectItem value="5">$5.00</SelectItem>
                      <SelectItem value="10">$10.00</SelectItem>
                      <SelectItem value="25">$25.00</SelectItem>
                      <SelectItem value="50">$50.00</SelectItem>
                      <SelectItem value="100">$100.00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Select value={formData.duration} onValueChange={(v) => setFormData({ ...formData, duration: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Day</SelectItem>
                      <SelectItem value="3">3 Days</SelectItem>
                      <SelectItem value="5">5 Days</SelectItem>
                      <SelectItem value="7">7 Days</SelectItem>
                      <SelectItem value="14">14 Days</SelectItem>
                      <SelectItem value="30">30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={submitting || !formData.listing_id}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {submitting ? "Creating..." : "Create Auction"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
