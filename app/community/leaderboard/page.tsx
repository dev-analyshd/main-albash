import { createClient } from "@/lib/supabase/server"
import { LeaderboardPage } from "@/components/community/leaderboard-page"

export default async function CommunityLeaderboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get leaderboard from profiles ordered by reputation
  const { data: leaderboard } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, reputation_score, is_verified, account_type")
    .order("reputation_score", { ascending: false })
    .limit(100)

  // Get current user's rank
  let userRank = null
  if (user) {
    const { data: userProfile } = await supabase.from("profiles").select("reputation_score").eq("id", user.id).single()

    if (userProfile) {
      const { count } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gt("reputation_score", userProfile.reputation_score)

      userRank = (count || 0) + 1
    }
  }

  return <LeaderboardPage leaderboard={leaderboard || []} currentUserId={user?.id} userRank={userRank} />
}
