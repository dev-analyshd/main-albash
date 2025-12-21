import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MessagesPage } from "@/components/dashboard/messages-page"

export default async function DashboardMessagesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Use conversations table for faster metadata
  const { data: convs } = await supabase
    .from("conversations")
    .select(
      `id, last_message_preview, last_message_at, unread_counts, 
       user_a:profiles!conversations_user_a_fkey(id, full_name, avatar_url),
       user_b:profiles!conversations_user_b_fkey(id, full_name, avatar_url)`,
    )
    .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
    .order("last_message_at", { ascending: false })

  const conversations = (convs || []).map((c: any) => {
    const partner = c.user_a?.id === user.id ? c.user_b : c.user_a
    return {
      partnerId: partner?.id,
      partner,
      lastMessage: { content: c.last_message_preview, created_at: c.last_message_at },
      unreadCount: (c.unread_counts && c.unread_counts[user.id]) || 0,
    }
  })

  return <MessagesPage conversations={conversations} currentUserId={user.id} />
}
