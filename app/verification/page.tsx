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

  // If already verified, redirect to dashboard
  if (profile?.verification_status === "VERIFIED" || profile?.is_verified) {
    redirect("/dashboard")
  }

  // Check if there's a pending verification request
  const { data: pendingRequest } = await supabase
    .from("verification_requests")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "pending")
    .maybeSingle()

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-12">
        <VerificationForm
          user={user}
          profile={profile}
          pendingRequest={pendingRequest}
          verificationStatus={profile?.verification_status || "AUTHENTICATED_UNVERIFIED"}
        />
      </div>
    </div>
  )
}


