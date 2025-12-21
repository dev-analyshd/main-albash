import { createClient } from "@/lib/supabase/server"
import { GroupsPage } from "@/components/community/groups-page"

export default async function CommunityGroupsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: groups } = await supabase
    .from("community_groups")
    .select(
      `
      *,
      creator:profiles!community_groups_creator_id_fkey(full_name, avatar_url)
    `,
    )
    .order("member_count", { ascending: false })

  // Get user's groups
  let userGroups: string[] = []
  if (user) {
    const { data } = await supabase.from("group_members").select("group_id").eq("user_id", user.id)
    userGroups = data?.map((g) => g.group_id) || []
  }

  return <GroupsPage groups={groups || []} userGroups={userGroups} currentUserId={user?.id} />
}
