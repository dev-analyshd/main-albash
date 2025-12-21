import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

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
    const { user_id, points, reason, event_type } = body

    // Create reputation log
    const { data: logData, error: logError } = await supabase
      .from("reputation_logs")
      .insert({
        user_id,
        points,
        reason: reason || "Admin adjustment",
        event_type: event_type || "admin_adjustment",
      })
      .select()
      .single()

    if (logError) throw logError

    // Update user reputation score
    const { data: userProfile } = await supabase.from("profiles").select("reputation_score").eq("id", user_id).single()

    const newScore = (userProfile?.reputation_score || 0) + points

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ reputation_score: Math.max(0, newScore) })
      .eq("id", user_id)

    if (updateError) throw updateError

    return NextResponse.json({ success: true, newScore: Math.max(0, newScore) })
  } catch (error) {
    console.error("Reputation adjustment error:", error)
    return NextResponse.json({ error: "Failed to adjust reputation" }, { status: 500 })
  }
}

