import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ReportsAndLogs } from "@/components/admin/reports-logs"

export default async function AdminReportsPage() {
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

  // Fetch audit logs
  const { data: auditLogs } = await supabase
    .from("admin_audit_logs")
    .select("*, admin_id:profiles!admin_audit_logs_admin_id_fkey(id, full_name, email)")
    .order("created_at", { ascending: false })
    .limit(500)

  // Fetch reputation logs
  const { data: reputationLogs } = await supabase
    .from("reputation_logs")
    .select("*, user_id:profiles!reputation_logs_user_id_fkey(id, full_name, email)")
    .order("created_at", { ascending: false })
    .limit(200)

  return <ReportsAndLogs auditLogs={auditLogs || []} reputationLogs={reputationLogs || []} />
}

