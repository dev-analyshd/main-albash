import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function ApplyOrganizationPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase.from("profiles").select("verification_status, is_verified").eq("id", user.id).single()
    if (profile?.is_verified || profile?.verification_status === "VERIFIED") {
      redirect("/dashboard")
    } else {
      redirect("/verification")
    }
  }
  redirect("/auth/login?redirect=/verification")
}
