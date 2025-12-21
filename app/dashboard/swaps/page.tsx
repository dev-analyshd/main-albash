import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SwapDashboardContent } from "@/components/swap/swap-dashboard-content"

export default async function SwapDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/dashboard/swaps")
  }

  // Swaps are now open to all authenticated users

  // Fetch swaps
  const [sentSwaps, receivedSwaps, activeSwaps] = await Promise.all([
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
      .or(`initiator_id.eq.${user.id},target_user_id.eq.${user.id}`)
      .in("status", ["pending", "accepted"])
      .order("created_at", { ascending: false }),
  ])

  const allSwaps = [...(sentSwaps.data || []), ...(receivedSwaps.data || [])]
  const completedSwaps = allSwaps.filter((s) => s.status === "completed")
  const pendingSwaps = allSwaps.filter((s) => s.status === "pending")

  return (
    <SwapDashboardContent
      sentSwaps={sentSwaps.data || []}
      receivedSwaps={receivedSwaps.data || []}
      activeSwaps={activeSwaps.data || []}
      completedSwaps={completedSwaps}
      pendingSwaps={pendingSwaps}
      userId={user.id}
    />
  )
}

