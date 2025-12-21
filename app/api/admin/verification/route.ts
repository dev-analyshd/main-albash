import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { requireAdminOrVerifier } from "@/lib/middleware/admin"
import type { NextRequest } from "next/server"

export async function PATCH(request: NextRequest) {
  try {
    const { user, profile, isAuthorized } = await requireAdminOrVerifier(request)

    if (!isAuthorized) {
      return NextResponse.json({ error: "Forbidden: Admin/Verifier access required" }, { status: 403 })
    }

    const supabase = await createClient()
    const body = await request.json()
    const { id, status, feedback, rejection_reason } = body

    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields: id, status" }, { status: 400 })
    }

    // Validate status
    const validStatuses = ["pending", "in_review", "approved", "rejected", "needs_update"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` }, { status: 400 })
    }

    // Get the verification request to find the user
    const { data: verificationRequest, error: fetchError } = await supabase
      .from("verification_requests")
      .select("*")
      .eq("id", id)
      .single()

    if (fetchError || !verificationRequest) {
      return NextResponse.json({ error: "Verification request not found" }, { status: 404 })
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 })
    }

    // Update verification request
    const { error: updateError } = await supabase
      .from("verification_requests")
      .update({
        status,
        feedback: feedback || null,
        rejection_reason: status === "rejected" ? rejection_reason : null,
        reviewed_by: user.id,
        reviewed_at: ["approved", "rejected", "needs_update"].includes(status) ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (updateError) throw updateError

    // If approved, update user profile verification status
    if (status === "approved") {
      await supabase
        .from("profiles")
        .update({
          is_verified: true,
          verification_status: "VERIFIED",
          role: verificationRequest.verification_type,
          updated_at: new Date().toISOString(),
        })
        .eq("id", verificationRequest.user_id)

      // Add reputation points
      await supabase.from("reputation_logs").insert({
        user_id: verificationRequest.user_id,
        points: 100,
        reason: "Verification approved",
        event_type: "verification_approved",
        reference_id: id,
      })

      // Update reputation score
      await supabase.rpc("increment_reputation", {
        user_id: verificationRequest.user_id,
        points: 100,
      })
    } else if (status === "rejected") {
      // Reset to unverified status
      await supabase
        .from("profiles")
        .update({
          verification_status: "AUTHENTICATED_UNVERIFIED",
          updated_at: new Date().toISOString(),
        })
        .eq("id", verificationRequest.user_id)
    } else if (status === "needs_update") {
      // Mark as needing update
      await supabase
        .from("profiles")
        .update({
          verification_status: "VERIFICATION_PENDING",
          updated_at: new Date().toISOString(),
        })
        .eq("id", verificationRequest.user_id)
    }

    // Create verification record
    await supabase.from("verification_records").insert({
      application_id: id,
      verifier_id: user.id,
      status,
      notes: feedback || rejection_reason || null,
    })

    // Send notification to user
    await supabase.from("notifications").insert({
      user_id: verificationRequest.user_id,
      title:
        status === "approved"
          ? "✅ Your Verification is Approved!"
          : status === "rejected"
            ? "❌ Verification Application Rejected"
            : "⏳ Verification Review In Progress",
      message:
        feedback ||
        (status === "approved"
          ? "Congratulations! Your verification has been approved. Welcome to the platform!"
          : status === "rejected"
            ? `Your verification application was not approved. ${rejection_reason ? `Reason: ${rejection_reason}` : "Please try again later."}`
            : "Your verification application is being reviewed. We'll notify you soon."),
      type: "verification",
      reference_id: id,
    })

    // Log admin action
    try {
      await supabase.rpc("log_admin_action", {
        p_admin_id: user.id,
        p_action_type: `verification_${status}`,
        p_target_type: "verification",
        p_target_id: id,
        p_details: {
          status,
          feedback: feedback || null,
          rejection_reason: rejection_reason || null,
          user_id: verificationRequest.user_id,
        },
      })
    } catch (logError) {
      // Logging is optional, don't fail the whole operation
      console.warn("Failed to log admin action:", logError)
    }

    return NextResponse.json({
      success: true,
      data: { id, status, updated_at: new Date().toISOString() },
    })
  } catch (error) {
    console.error("Verification update error:", error)
    return NextResponse.json(
      {
        error: "Failed to update verification request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
