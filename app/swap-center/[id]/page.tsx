import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SwapDetailView } from "@/components/swap/swap-detail-view"

export default async function SwapDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/auth/login?redirect=/swap-center/${id}`)
  }

  const { data: swap, error } = await supabase
    .from("swap_requests")
    .select(
      `
      *,
      initiator:profiles!swap_requests_initiator_id_fkey(id, full_name, avatar_url, reputation_score, is_verified, role),
      target_user:profiles!swap_requests_target_user_id_fkey(id, full_name, avatar_url, reputation_score, is_verified, role),
      target_listing:listings!swap_requests_target_listing_id_fkey(id, title, description, images, price, listing_type),
      offering_listing:listings!swap_requests_offering_listing_id_fkey(id, title, description, images, price, listing_type)
    `
    )
    .eq("id", id)
    .single()

  if (error || !swap) {
    notFound()
  }

  // Verify user is part of the swap
  if (swap.initiator_id !== user.id && swap.target_user_id !== user.id) {
    redirect("/swap-center")
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <SwapDetailView swap={swap} currentUserId={user.id} />
    </div>
  )
}

