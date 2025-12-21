import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

    const { id } = await params
    const body = await request.json()

    const updateData: any = {}
    if (body.title !== undefined) updateData.title = body.title
    if (body.content !== undefined) updateData.content = body.content
    if (body.type !== undefined) updateData.type = body.type
    if (body.priority !== undefined) updateData.priority = body.priority
    if (body.is_pinned !== undefined) updateData.is_pinned = body.is_pinned
    if (body.is_active !== undefined) updateData.is_active = body.is_active
    if (body.scheduled_at !== undefined) updateData.scheduled_at = body.scheduled_at
    if (body.expires_at !== undefined) updateData.expires_at = body.expires_at
    if (body.target_audience !== undefined) updateData.target_audience = body.target_audience
    if (body.target_role !== undefined) updateData.target_role = body.target_role

    updateData.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from("announcements")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    // Log admin action
    await supabase.rpc("log_admin_action", {
      p_admin_id: user.id,
      p_action_type: "announcement_updated",
      p_target_type: "announcement",
      p_target_id: id,
      p_details: updateData,
    })

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Announcement update error:", error)
    return NextResponse.json({ error: "Failed to update announcement" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

    const { id } = await params

    // Log admin action before deletion
    const { data: announcement } = await supabase.from("announcements").select("title").eq("id", id).single()

    const { error } = await supabase.from("announcements").delete().eq("id", id)

    if (error) throw error

    // Log admin action
    await supabase.rpc("log_admin_action", {
      p_admin_id: user.id,
      p_action_type: "announcement_deleted",
      p_target_type: "announcement",
      p_target_id: id,
      p_details: { title: announcement?.title },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Announcement deletion error:", error)
    return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 })
  }
}

