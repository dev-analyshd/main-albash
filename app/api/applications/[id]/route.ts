import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("applications")
      .select("*, verification_records(*)")
      .eq("id", id)
      .single()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Application fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch application" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is verifier or admin
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || !["verifier", "admin"].includes(profile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { data, error } = await supabase
      .from("applications")
      .update({
        status: body.status,
        feedback: body.feedback,
        reviewed_at: new Date().toISOString(),
        assigned_verifier_id: user.id,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    // Create verification record
    await supabase.from("verification_records").insert({
      application_id: id,
      verifier_id: user.id,
      status: body.status,
      notes: body.feedback,
    })

    // If approved, update user profile and add reputation
    if (body.status === "approved") {
      const { data: application } = await supabase
        .from("applications")
        .select("user_id, application_type")
        .eq("id", id)
        .single()

      if (application) {
        // Update profile verification status
        await supabase.from("profiles").update({ is_verified: true }).eq("id", application.user_id)

        // Add reputation points
        await supabase.from("reputation_logs").insert({
          user_id: application.user_id,
          points: 100,
          reason: "Application approved",
          event_type: "verification",
          reference_id: id,
        })

        // Update reputation score
        await supabase.rpc("increment_reputation", {
          user_id: application.user_id,
          points: 100,
        })
      }
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Application update error:", error)
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 })
  }
}
