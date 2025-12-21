import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AnnouncementManagement } from "@/components/admin/announcement-management"

export default async function AdminAnnouncementsPage() {
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

  const { data: announcements } = await supabase
    .from("announcements")
    .select("*, created_by:profiles!announcements_created_by_fkey(id, full_name, email)")
    .order("is_pinned", { ascending: false })
    .order("priority", { ascending: false })
    .order("created_at", { ascending: false })

  return <AnnouncementManagement announcements={announcements || []} currentUserId={user.id} />
}

