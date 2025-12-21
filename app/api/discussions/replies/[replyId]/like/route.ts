import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// POST: like/unlike a reply
export async function POST(req: Request, { params }: { params: Promise<{ replyId: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  const { replyId } = await params

  const { data: existing } = await supabase
    .from("reply_likes")
    .select("id")
    .eq("reply_id", replyId)
    .eq("user_id", user.id)
    .single()

  if (existing) {
    await supabase.from("reply_likes").delete().eq("id", existing.id)
    return NextResponse.json({ liked: false })
  } else {
    await supabase.from("reply_likes").insert({ reply_id: replyId, user_id: user.id })
    return NextResponse.json({ liked: true })
  }
}

// GET: check if user liked this reply
export async function GET(req: Request, { params }: { params: Promise<{ replyId: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ liked: false })

  const { replyId } = await params
  const { data: like } = await supabase
    .from("reply_likes")
    .select("id")
    .eq("reply_id", replyId)
    .eq("user_id", user.id)
    .single()

  return NextResponse.json({ liked: !!like })
}
