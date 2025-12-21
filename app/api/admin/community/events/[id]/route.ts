import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

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
    const { data: event } = await supabase.from("events").select("title").eq("id", id).single()

    const { error } = await supabase.from("events").delete().eq("id", id)

    if (error) throw error

    // Log admin action
    await supabase.rpc("log_admin_action", {
      p_admin_id: user.id,
      p_action_type: "event_deleted",
      p_target_type: "event",
      p_target_id: id,
      p_details: { title: event?.title },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Event deletion error:", error)
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
  }
}

