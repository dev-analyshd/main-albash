import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AuctionDetail } from "@/components/marketplace/auction-detail"

export default async function AuctionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: auction, error } = await supabase
    .from("auctions")
    .select(
      `
      *,
      listing:listings(*),
      seller:profiles!auctions_seller_id_fkey(id, full_name, avatar_url, reputation_score, is_verified, role),
      bids:auction_bids(*, bidder:profiles(id, full_name, avatar_url))
    `,
    )
    .eq("id", id)
    .single()

  if (error || !auction) {
    notFound()
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if user is watching
  let isWatching = false
  if (user) {
    const { data: watchlist } = await supabase
      .from("auction_watchlist")
      .select("id")
      .eq("auction_id", id)
      .eq("user_id", user.id)
      .single()
    isWatching = !!watchlist
  }

  return <AuctionDetail auction={auction} currentUserId={user?.id} initialWatching={isWatching} />
}
