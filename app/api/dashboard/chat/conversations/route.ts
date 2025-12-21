import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// POST: create or return existing conversation between current user and partner
export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  const body = await req.json()
  const { partner_id } = body || {}
  if (!partner_id) return NextResponse.json({ error: "partner_id required" }, { status: 400 })

  // Ensure stable ordering for pair (use least/greatest in SQL)
  const { data: existing } = await supabase
    .from("conversations")
    .select("*")
    .or(`and(user_a.eq.${user.id},user_b.eq.${partner_id}),and(user_a.eq.${partner_id},user_b.eq.${user.id})`)
    .limit(1)

  if (existing && existing.length > 0) {
    return NextResponse.json({ conversation: existing[0] })
  }

  const { data, error } = await supabase
    .from("conversations")
    .insert({ user_a: user.id, user_b: partner_id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ conversation: data })
}

// GET: list conversations for current user
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  const { data } = await supabase
    .from("conversations")
    .select(
      `*, last_message:messages!conversations_last_message_id_fkey(*),
        user_a:profiles!conversations_user_a_fkey(id, full_name, avatar_url),
        user_b:profiles!conversations_user_b_fkey(id, full_name, avatar_url)`,
    )
    .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
    .order("last_message_at", { ascending: false })

  return NextResponse.json({ conversations: data || [] })
}
