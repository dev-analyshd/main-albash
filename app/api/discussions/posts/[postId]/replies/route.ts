import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET: fetch replies for a post
export async function GET(req: Request, { params }: { params: Promise<{ postId: string }> }) {
  const supabase = await createClient()
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "10")
  const offset = (page - 1) * limit

  const { postId } = await params
  const { data: replies, error } = await supabase
    .from("post_replies")
    .select(
      `id, content, likes_count, created_at,
       user:profiles(id, full_name, avatar_url, is_verified)`,
    )
    .eq("post_id", postId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ replies })
}

// POST: create a reply
export async function POST(req: Request, { params }: { params: Promise<{ postId: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  const { content } = await req.json()
  if (!content || content.trim().length === 0) return NextResponse.json({ error: "Content required" }, { status: 400 })

  const { postId } = await params
  const { data: reply, error } = await supabase
    .from("post_replies")
    .insert({ post_id: postId, user_id: user.id, content: content.trim() })
    .select(
      `id, content, likes_count, created_at,
       user:profiles(id, full_name, avatar_url, is_verified)`,
    )
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ reply }, { status: 201 })
}
