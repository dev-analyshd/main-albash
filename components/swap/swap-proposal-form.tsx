"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeftRight, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { SwapMode, SwapAssetType, Listing } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"

interface SwapProposalFormProps {
  targetListing?: Listing
  targetUserId?: string
  onClose?: () => void
}

export function SwapProposalForm({ targetListing, targetUserId, onClose }: SwapProposalFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userListings, setUserListings] = useState<Listing[]>([])
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [useBlockchain, setUseBlockchain] = useState(false)

  const [formData, setFormData] = useState({
    swap_mode: "contract_based" as SwapMode,
    offering_type: "product" as SwapAssetType,
    offering_listing_id: "",
    offering_description: "",
    offering_value: "",
    requesting_type: (targetListing?.listing_type || "product") as SwapAssetType,
    requesting_description: targetListing?.description || "",
    requesting_value: targetListing?.price?.toString() || "",
    price_difference: "",
    contract_duration_days: "",
    ownership_transfer_type: "full",
    usage_rights: "",
    upgrade_expectations: "",
  })

  // Fetch user's listings for offering
  useEffect(() => {
    const fetchListings = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        // Allow all listings for swaps (verified or not)
        const { data } = await supabase.from("listings").select("*").eq("user_id", user.id)
        setUserListings(data || [])
      }
    }
    fetchListings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/swaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_listing_id: targetListing?.id || null,
          target_user_id: targetUserId || targetListing?.user_id,
          swap_mode: formData.swap_mode,
          offering_type: formData.offering_type,
          offering_listing_id: formData.offering_listing_id || null,
          offering_description: formData.offering_description,
          offering_value: formData.offering_value ? parseFloat(formData.offering_value) : null,
          requesting_type: formData.requesting_type,
          requesting_description: formData.requesting_description,
          requesting_value: formData.requesting_value ? parseFloat(formData.requesting_value) : null,
          price_difference: formData.price_difference ? parseFloat(formData.price_difference) : null,
          contract_duration_days: formData.contract_duration_days ? parseInt(formData.contract_duration_days) : null,
          ownership_transfer_type: formData.ownership_transfer_type,
          usage_rights: formData.usage_rights || null,
          upgrade_expectations: formData.upgrade_expectations || null,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to create swap proposal")
      }

      router.push(`/swap-center/${result.data.id}`)
      router.refresh()
      if (onClose) onClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-full bg-primary/10">
          <ArrowLeftRight className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Propose Swap</h2>
          <p className="text-muted-foreground">Create a value exchange proposal</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Swap Mode */}
        <Card>
          <CardHeader>
            <CardTitle>Swap Type</CardTitle>
            <CardDescription>Choose how you want to exchange value</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={formData.swap_mode} onValueChange={(value) => setFormData({ ...formData, swap_mode: value as SwapMode })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="direct_swap">Direct Swap (1:1 exchange)</SelectItem>
                <SelectItem value="value_difference">Value Difference (with payment)</SelectItem>
                <SelectItem value="contract_based">Contract Based (custom terms)</SelectItem>
                <SelectItem value="time_based">Time Based (future delivery)</SelectItem>
                <SelectItem value="equity_based">Equity Based (ownership share)</SelectItem>
                <SelectItem value="license_based">License Based (usage rights)</SelectItem>
                <SelectItem value="upgrade_path">Upgrade Path (idea → product)</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* What You're Offering */}
        <Card>
          <CardHeader>
            <CardTitle>What You're Offering</CardTitle>
            <CardDescription>Describe what you want to swap</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Offering Type</Label>
              <Select
                value={formData.offering_type}
                onValueChange={(value) => setFormData({ ...formData, offering_type: value as SwapAssetType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="idea">Idea</SelectItem>
                  <SelectItem value="talent">Talent</SelectItem>
                  <SelectItem value="skill">Skill</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="asset">Asset</SelectItem>
                  <SelectItem value="nft">NFT</SelectItem>
                  <SelectItem value="equity">Equity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {userListings.length > 0 && (
              <div>
                <Label>Link to Your Listing (Optional)</Label>
                <Select
                  value={formData.offering_listing_id}
                  onValueChange={(value) => setFormData({ ...formData, offering_listing_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a listing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None - Custom Offering</SelectItem>
                    {userListings.map((listing) => (
                      <SelectItem key={listing.id} value={listing.id}>
                        {listing.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label>Description *</Label>
              <Textarea
                value={formData.offering_description}
                onChange={(e) => setFormData({ ...formData, offering_description: e.target.value })}
                placeholder="Describe what you're offering in detail..."
                required
                rows={4}
              />
            </div>

            <div>
              <Label>Estimated Value (Optional)</Label>
              <Input
                type="number"
                value={formData.offering_value}
                onChange={(e) => setFormData({ ...formData, offering_value: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </CardContent>
        </Card>

        {/* What You Want */}
        <Card>
          <CardHeader>
            <CardTitle>What You Want</CardTitle>
            <CardDescription>What you're requesting in exchange</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {targetListing && (
              <div className="p-4 bg-secondary/30 rounded-lg">
                <p className="font-semibold mb-1">{targetListing.title}</p>
                <p className="text-sm text-muted-foreground">{targetListing.description}</p>
                {targetListing.price && <p className="text-sm font-medium mt-2">${targetListing.price}</p>}
              </div>
            )}

            {!targetListing && (
              <>
                <div>
                  <Label>Requesting Type</Label>
                  <Select
                    value={formData.requesting_type}
                    onValueChange={(value) => setFormData({ ...formData, requesting_type: value as SwapAssetType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="idea">Idea</SelectItem>
                      <SelectItem value="talent">Talent</SelectItem>
                      <SelectItem value="skill">Skill</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                      <SelectItem value="asset">Asset</SelectItem>
                      <SelectItem value="nft">NFT</SelectItem>
                      <SelectItem value="equity">Equity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Description *</Label>
                  <Textarea
                    value={formData.requesting_description}
                    onChange={(e) => setFormData({ ...formData, requesting_description: e.target.value })}
                    placeholder="Describe what you want..."
                    required
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Estimated Value (Optional)</Label>
                  <Input
                    type="number"
                    value={formData.requesting_value}
                    onChange={(e) => setFormData({ ...formData, requesting_value: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Swap Terms */}
        <Card>
          <CardHeader>
            <CardTitle>Swap Terms</CardTitle>
            <CardDescription>Additional details for the swap agreement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.swap_mode === "value_difference" && (
              <div>
                <Label>Price Difference (if any)</Label>
                <Input
                  type="number"
                  value={formData.price_difference}
                  onChange={(e) => setFormData({ ...formData, price_difference: e.target.value })}
                  placeholder="0.00"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Amount to be paid in addition to the swap (positive = you pay, negative = they pay)
                </p>
              </div>
            )}

            <div>
              <Label>Ownership Transfer Type</Label>
              <Select
                value={formData.ownership_transfer_type}
                onValueChange={(value) => setFormData({ ...formData, ownership_transfer_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Ownership</SelectItem>
                  <SelectItem value="partial">Partial Ownership</SelectItem>
                  <SelectItem value="license">License/Usage Rights</SelectItem>
                  <SelectItem value="lease">Lease/Temporary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.swap_mode === "time_based" && (
              <div>
                <Label>Contract Duration (Days)</Label>
                <Input
                  type="number"
                  value={formData.contract_duration_days}
                  onChange={(e) => setFormData({ ...formData, contract_duration_days: e.target.value })}
                  placeholder="30"
                />
              </div>
            )}

            <div>
              <Label>Usage Rights (Optional)</Label>
              <Textarea
                value={formData.usage_rights}
                onChange={(e) => setFormData({ ...formData, usage_rights: e.target.value })}
                placeholder="Describe any usage rights or restrictions..."
                rows={3}
              />
            </div>

            {formData.swap_mode === "upgrade_path" && (
              <div>
                <Label>Upgrade Expectations</Label>
                <Textarea
                  value={formData.upgrade_expectations}
                  onChange={(e) => setFormData({ ...formData, upgrade_expectations: e.target.value })}
                  placeholder="Describe how the idea will be transformed into a product..."
                  rows={3}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          {onClose && (
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Propose Swap
          </Button>
        </div>
      </form>
    </motion.div>
  )
}

