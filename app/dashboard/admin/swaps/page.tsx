import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SwapManagement } from "@/components/admin/swap-management"

export default async function AdminSwapsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin") {
    redirect("/dashboard")
  }

  // Fetch all swaps
  const { data: swaps } = await supabase
    .from("swap_requests")
    .select(
      `
      *,
      initiator:profiles!swap_requests_initiator_id_fkey(id, full_name, email, avatar_url),
      target_user:profiles!swap_requests_target_user_id_fkey(id, full_name, email, avatar_url),
      target_listing:listings!swap_requests_target_listing_id_fkey(id, title),
      offering_listing:listings!swap_requests_offering_listing_id_fkey(id, title)
    `
    )
    .order("created_at", { ascending: false })

  // Fetch swap statistics
  const [
    { count: totalSwaps },
    { count: pendingSwaps },
    { count: activeSwaps },
    { count: completedSwaps },
    { count: disputedSwaps },
  ] = await Promise.all([
    supabase.from("swap_requests").select("*", { count: "exact", head: true }),
    supabase.from("swap_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("swap_requests").select("*", { count: "exact", head: true }).eq("status", "accepted"),
    supabase.from("swap_requests").select("*", { count: "exact", head: true }).eq("status", "completed"),
    supabase.from("swap_requests").select("*", { count: "exact", head: true }).eq("status", "disputed"),
  ])

  return (
    <SwapManagement
      swaps={swaps || []}
      stats={{
        total: totalSwaps || 0,
        pending: pendingSwaps || 0,
        active: activeSwaps || 0,
        completed: completedSwaps || 0,
        disputed: disputedSwaps || 0,
      }}
    />
  )
}

