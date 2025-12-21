import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  const body = await req.json()
  const { receiver_id, content } = body || {}
  if (!receiver_id || !content) return NextResponse.json({ error: "Missing fields" }, { status: 400 })

  // Insert message
  const { data: msg, error } = await supabase.from("messages").insert({ sender_id: user.id, receiver_id, content }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Find or create conversation and update metadata
  const { data: convs } = await supabase
    .from("conversations")
    .select("id")
    .or(`and(user_a.eq.${user.id},user_b.eq.${receiver_id}),and(user_a.eq.${receiver_id},user_b.eq.${user.id})`)
    .limit(1)

  let conv_id = convs?.[0]?.id
  if (!conv_id) {
    const { data: newConv } = await supabase.from("conversations").insert({ user_a: user.id, user_b: receiver_id }).select("id").single()
    conv_id = newConv?.id
  }

  // Update conversation metadata
  if (conv_id) {
    const unread_counts: Record<string, number> = {}
    unread_counts[receiver_id] = 1
    await supabase.from("conversations").update({
      last_message_id: msg.id,
      last_message_preview: content.substring(0, 100),
      last_message_at: new Date().toISOString(),
      unread_counts,
    }).eq("id", conv_id)
  }

  return NextResponse.json({ message: msg })
}
