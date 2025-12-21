import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CollaborationRoom } from "@/components/community/collaboration-room"

export default async function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/sign-in")
  }

  // Require verification for collaboration participation
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_verified, verification_status")
    .eq("id", user.id)
    .single()
  const isVerified = profile?.is_verified || profile?.verification_status === "VERIFIED"
  if (!isVerified) {
    redirect("/verification")
  }

  const { data: room, error } = await supabase
    .from("collaboration_rooms")
    .select(
      `
      *,
      owner:profiles!collaboration_rooms_owner_id_fkey(id, full_name, avatar_url),
      members:room_members(*, user:profiles(id, full_name, avatar_url)),
      messages:room_messages(*, user:profiles(id, full_name, avatar_url))
    `,
    )
    .eq("id", id)
    .single()

  if (error || !room) {
    notFound()
  }

  // Check if user is a member
  const isMember = room.members?.some((m: any) => m.user_id === user.id)

  // If not a member and room is public, join automatically
  if (!isMember && room.is_public) {
    await supabase.from("room_members").insert({
      room_id: id,
      user_id: user.id,
      role: "member",
    })
  } else if (!isMember && !room.is_public) {
    redirect("/community/collaboration")
  }

  return <CollaborationRoom room={room} currentUserId={user.id} />
}
