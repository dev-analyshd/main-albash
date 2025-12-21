import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CommunityManagement } from "@/components/admin/community-management"

export default async function AdminCommunityPage() {
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

  // Fetch discussions, events, and groups
  const [discussions, events, groups] = await Promise.all([
    supabase
      .from("discussions")
      .select("*, user_id:profiles!discussions_user_id_fkey(id, full_name, email, avatar_url)")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("events")
      .select("*, created_by:profiles!events_created_by_fkey(id, full_name, email)")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("community_groups")
      .select("*, creator_id:profiles!community_groups_creator_id_fkey(id, full_name, email)")
      .order("created_at", { ascending: false })
      .limit(100),
  ])

  return (
    <CommunityManagement
      discussions={discussions.data || []}
      events={events.data || []}
      groups={groups.data || []}
      currentUserId={user.id}
    />
  )
}

