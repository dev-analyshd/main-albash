import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// POST: like/unlike a post
export async function POST(req: Request, { params }: { params: Promise<{ postId: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  const { postId } = await params

  // Check if already liked
  const { data: existing } = await supabase
    .from("post_likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .single()

  if (existing) {
    // Unlike
    await supabase.from("post_likes").delete().eq("id", existing.id)
    return NextResponse.json({ liked: false })
  } else {
    // Like
    await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id })
    return NextResponse.json({ liked: true })
  }
}

// GET: check if user liked this post
export async function GET(req: Request, { params }: { params: Promise<{ postId: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ liked: false })

  const { postId } = await params
  const { data: like } = await supabase
    .from("post_likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .single()

  return NextResponse.json({ liked: !!like })
}
