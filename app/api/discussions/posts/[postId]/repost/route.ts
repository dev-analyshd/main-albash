import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// POST: toggle repost on a post
export async function POST(req: Request, { params }: { params: Promise<{ postId: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  const { postId } = await params

  // Check if already reposted
  const { data: existing } = await supabase
    .from("post_reposts")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .single()

  if (existing) {
    // Remove repost
    await supabase.from("post_reposts").delete().eq("id", existing.id)
    return NextResponse.json({ reposted: false })
  } else {
    // Add repost
    await supabase.from("post_reposts").insert({ post_id: postId, user_id: user.id })
    return NextResponse.json({ reposted: true })
  }
}

// GET: check if user reposted this post
export async function GET(req: Request, { params }: { params: Promise<{ postId: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ reposted: false })

  const { postId } = await params
  const { data: repost } = await supabase
    .from("post_reposts")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .single()

  return NextResponse.json({ reposted: !!repost })
}
