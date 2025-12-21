import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { data, error } = await supabase
      .from("announcements")
      .select("*, created_by:profiles!announcements_created_by_fkey(id, full_name, email)")
      .order("is_pinned", { ascending: false })
      .order("priority", { ascending: false })
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Announcements fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()

    const { data, error } = await supabase
      .from("announcements")
      .insert({
        title: body.title,
        content: body.content,
        type: body.type || "update",
        priority: body.priority || 0,
        is_pinned: body.is_pinned || false,
        is_active: body.is_active !== false,
        scheduled_at: body.scheduled_at || null,
        expires_at: body.expires_at || null,
        target_audience: body.target_audience || "all",
        target_role: body.target_role || null,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) throw error

    // Log admin action
    await supabase.rpc("log_admin_action", {
      p_admin_id: user.id,
      p_action_type: "announcement_created",
      p_target_type: "announcement",
      p_target_id: data.id,
      p_details: { title: body.title, type: body.type },
    })

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Announcement creation error:", error)
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 })
  }
}

