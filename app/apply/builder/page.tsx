import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function ApplyBuilderPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // CRITICAL: Authenticated users must NEVER see public application pages
  // Redirect to dashboard or verification page
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("verification_status, is_verified").eq("id", user.id).single()
    
    if (profile?.is_verified || profile?.verification_status === "VERIFIED") {
      redirect("/dashboard")
    } else if (profile?.verification_status === "VERIFICATION_PENDING") {
      redirect("/verification")
    } else {
      redirect("/verification")
    }
  }

  // For unauthenticated users, show login prompt
  redirect("/auth/login?redirect=/verification")
}
