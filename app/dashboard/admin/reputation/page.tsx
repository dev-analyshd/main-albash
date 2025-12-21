import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ReputationManagement } from "@/components/admin/reputation-management"

export default async function AdminReputationPage() {
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

  const { data: users } = await supabase
    .from("profiles")
    .select("id, full_name, email, reputation_score")
    .order("reputation_score", { ascending: false })
    .limit(100)

  const { data: reputationLogs } = await supabase
    .from("reputation_logs")
    .select("*, profiles(full_name, email)")
    .order("created_at", { ascending: false })
    .limit(100)

  return <ReputationManagement users={users || []} reputationLogs={reputationLogs || []} />
}

