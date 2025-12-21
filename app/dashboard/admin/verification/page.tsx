import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { VerifierDashboard } from "@/components/verification/verifier-dashboard"

export default async function AdminVerificationPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  // Only allow admin/verifier access
  if (profile?.role !== "admin" && profile?.role !== "verifier") {
    redirect("/dashboard")
  }

  // Get pending and in-review verification requests
  const { data: verificationRequests } = await supabase
    .from("verification_requests")
    .select(
      `
      *,
      profiles:profiles!verification_requests_user_id_fkey(full_name, email, avatar_url)
    `,
    )
    .order("created_at", { ascending: false })

  // Get stats
  const { count: pendingCount } = await supabase
    .from("verification_requests")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  const { count: inReviewCount } = await supabase
    .from("verification_requests")
    .select("*", { count: "exact", head: true })
    .eq("status", "in_review")

  const { count: approvedToday } = await supabase
    .from("verification_requests")
    .select("*", { count: "exact", head: true })
    .eq("status", "approved")
    .gte("reviewed_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

  const { count: totalProcessed } = await supabase
    .from("verification_requests")
    .select("*", { count: "exact", head: true })
    .eq("reviewed_by", user.id)
    .in("status", ["approved", "rejected"])

  return (
    <VerifierDashboard
      applications={verificationRequests || []}
      stats={{
        pending: pendingCount || 0,
        approvedToday: approvedToday || 0,
        totalProcessed: totalProcessed || 0,
      }}
      verifierId={user.id}
    />
  )
}
