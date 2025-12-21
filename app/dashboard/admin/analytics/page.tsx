import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard"

export default async function AdminAnalyticsPage() {
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

  // Get analytics data
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const [
    { data: dailySignups },
    { data: dailyListings },
    { data: dailyTransactions },
    { data: topCategories },
    { data: topUsers },
  ] = await Promise.all([
    // Daily signups for the last 30 days
    supabase
      .from("profiles")
      .select("created_at")
      .gte("created_at", thirtyDaysAgo.toISOString()),
    // Daily listings
    supabase
      .from("listings")
      .select("created_at")
      .gte("created_at", thirtyDaysAgo.toISOString()),
    // Daily transactions
    supabase
      .from("transactions")
      .select("created_at, amount")
      .gte("created_at", thirtyDaysAgo.toISOString()),
    // Top categories
    supabase
      .from("categories")
      .select("name, listings(count)")
      .limit(10),
    // Top users by reputation
    supabase
      .from("profiles")
      .select("full_name, avatar_url, reputation_score")
      .order("reputation_score", { ascending: false })
      .limit(10),
  ])

  return (
    <AnalyticsDashboard
      dailySignups={dailySignups || []}
      dailyListings={dailyListings || []}
      dailyTransactions={dailyTransactions || []}
      topCategories={topCategories || []}
      topUsers={topUsers || []}
    />
  )
}
