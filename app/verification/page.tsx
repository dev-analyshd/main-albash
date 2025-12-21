import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { EnhancedVerificationForm as VerificationForm } from "@/components/verification/enhanced-verification-form"

export default async function VerificationPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // CRITICAL: This page is ONLY for authenticated users
  if (!user) {
    redirect("/auth/login?redirect=/verification")
  }

  // Get user profile and verification status
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Check if there's any active verification request (pending, in_review, or needs_update)
  // Allow users to reapply if request was rejected or needs update
  const { data: activeRequest } = await supabase
    .from("verification_requests")
    .select("*")
    .eq("user_id", user.id)
    .in("status", ["pending", "in_review", "needs_update"])
    .maybeSingle()

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-12">
        <VerificationForm
          user={user}
          profile={profile}
          pendingRequest={activeRequest}
          verificationStatus={profile?.verification_status || "AUTHENTICATED_UNVERIFIED"}
        />
      </div>
    </div>
  )
}


