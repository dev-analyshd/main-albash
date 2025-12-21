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
    if (body.is_pinned !== undefined) updateData.is_pinned = body.is_pinned
    if (body.is_locked !== undefined) updateData.is_locked = body.is_locked

    const { data, error } = await supabase
      .from("discussions")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    // Log admin action
    await supabase.rpc("log_admin_action", {
      p_admin_id: user.id,
      p_action_type: "discussion_updated",
      p_target_type: "discussion",
      p_target_id: id,
      p_details: updateData,
    })

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Discussion update error:", error)
    return NextResponse.json({ error: "Failed to update discussion" }, { status: 500 })
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
    const { data: discussion } = await supabase.from("discussions").select("title").eq("id", id).single()

    const { error } = await supabase.from("discussions").delete().eq("id", id)

    if (error) throw error

    // Log admin action
    await supabase.rpc("log_admin_action", {
      p_admin_id: user.id,
      p_action_type: "discussion_deleted",
      p_target_type: "discussion",
      p_target_id: id,
      p_details: { title: discussion?.title },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Discussion deletion error:", error)
    return NextResponse.json({ error: "Failed to delete discussion" }, { status: 500 })
  }
}

