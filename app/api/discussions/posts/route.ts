import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET: fetch posts with pagination
export async function GET(req: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "20")
  const offset = (page - 1) * limit

  const { data: posts, error } = await supabase
    .from("posts")
    .select(
      `id, content, category, likes_count, replies_count, reposts_count, is_pinned, created_at,
       user:profiles(id, full_name, avatar_url, is_verified)`,
    )
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ posts })
}

// POST: create a new post
export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  const { content, category } = await req.json()
  if (!content || content.trim().length === 0) return NextResponse.json({ error: "Content required" }, { status: 400 })

  const { data: post, error } = await supabase
    .from("posts")
    .insert({ user_id: user.id, content: content.trim(), category: category || "general" })
    .select(
      `id, content, category, likes_count, replies_count, reposts_count, is_pinned, created_at,
       user:profiles(id, full_name, avatar_url, is_verified)`,
    )
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ post }, { status: 201 })
}
