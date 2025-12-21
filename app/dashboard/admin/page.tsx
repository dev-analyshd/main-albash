import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default async function AdminPage() {
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

  // Get platform statistics
  const [
    { count: totalUsers },
    { count: verifiedUsers },
    { count: totalListings },
    { count: activeListings },
    { count: pendingApplications },
    { count: totalTransactions },
    { data: recentUsers },
    { data: recentApplications },
    { data: departmentStats },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("is_verified", true),
    supabase.from("listings").select("*", { count: "exact", head: true }),
    supabase.from("listings").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("applications").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("transactions").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(5),
    supabase
      .from("applications")
      .select("*, profiles(full_name, email)")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("departments").select("id, name, applications(count)"),
  ])

  // Calculate revenue (sum of completed transactions)
  const { data: revenueData } = await supabase.from("transactions").select("amount").eq("status", "completed")

  const totalRevenue = revenueData?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0

  return (
    <AdminDashboard
      stats={{
        totalUsers: totalUsers || 0,
        verifiedUsers: verifiedUsers || 0,
        totalListings: totalListings || 0,
        activeListings: activeListings || 0,
        pendingApplications: pendingApplications || 0,
        totalTransactions: totalTransactions || 0,
        totalRevenue,
      }}
      recentUsers={recentUsers || []}
      recentApplications={recentApplications || []}
      departmentStats={departmentStats || []}
    />
  )
}
