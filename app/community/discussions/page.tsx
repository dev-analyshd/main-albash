import { createClient } from "@/lib/supabase/server"
import { DiscussionsPage } from "@/components/community/discussions-page"

export default async function CommunityDiscussionsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: discussions } = await supabase
    .from("discussions")
    .select(
      `
      *,
      profiles(full_name, avatar_url, is_verified)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(50)

  const { data: categories } = await supabase.from("discussions").select("category").limit(100)

  const uniqueCategories = [...new Set(categories?.map((c) => c.category) || [])]

  return <DiscussionsPage discussions={discussions || []} categories={uniqueCategories} currentUserId={user?.id} />
}
