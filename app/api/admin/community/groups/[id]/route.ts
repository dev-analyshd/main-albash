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
    const { data: group } = await supabase.from("community_groups").select("name").eq("id", id).single()

    const { error } = await supabase.from("community_groups").delete().eq("id", id)

    if (error) throw error

    // Log admin action
    await supabase.rpc("log_admin_action", {
      p_admin_id: user.id,
      p_action_type: "group_deleted",
      p_target_type: "group",
      p_target_id: id,
      p_details: { name: group?.name },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Group deletion error:", error)
    return NextResponse.json({ error: "Failed to delete group" }, { status: 500 })
  }
}

