import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SwapCenterContent } from "@/components/swap/swap-center-content"

export default async function SwapCenterPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/swap-center")
  }

  // Swaps are now open to all authenticated users (verified or not)

  // Fetch swaps
  const [sentSwaps, receivedSwaps] = await Promise.all([
    supabase
      .from("swap_requests")
      .select(
        `
        *,
        initiator:profiles!swap_requests_initiator_id_fkey(id, full_name, avatar_url, reputation_score, is_verified),
        target_user:profiles!swap_requests_target_user_id_fkey(id, full_name, avatar_url, reputation_score, is_verified),
        target_listing:listings!swap_requests_target_listing_id_fkey(id, title, images, price),
        offering_listing:listings!swap_requests_offering_listing_id_fkey(id, title, images, price)
      `
      )
      .eq("initiator_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("swap_requests")
      .select(
        `
        *,
        initiator:profiles!swap_requests_initiator_id_fkey(id, full_name, avatar_url, reputation_score, is_verified),
        target_user:profiles!swap_requests_target_user_id_fkey(id, full_name, avatar_url, reputation_score, is_verified),
        target_listing:listings!swap_requests_target_listing_id_fkey(id, title, images, price),
        offering_listing:listings!swap_requests_offering_listing_id_fkey(id, title, images, price)
      `
      )
      .eq("target_user_id", user.id)
      .order("created_at", { ascending: false }),
  ])

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <SwapCenterContent
        sentSwaps={sentSwaps.data || []}
        receivedSwaps={receivedSwaps.data || []}
        userId={user.id}
      />
    </div>
  )
}

