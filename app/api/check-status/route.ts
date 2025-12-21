import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { applicationId } = await request.json()

    if (!applicationId) {
      return NextResponse.json({ error: "Application ID is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Query for the application
    // First try to find by tracking_code (APP-YYYY-XXXXX format)
    // If not found, try to find by UUID
    let query = supabase
      .from("applications")
      .select("id, application_type, status, title, created_at, updated_at, reviewed_at, feedback, tracking_code")

    // Check if it's a tracking code format or UUID format
    if (applicationId.startsWith("APP-")) {
      // Search by tracking_code
      query = query.eq("tracking_code", applicationId)
    } else {
      // Try UUID lookup
      query = query.eq("id", applicationId)
    }

    const { data: application, error } = await query.maybeSingle()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to check status" }, { status: 500 })
    }

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    // Map database status to display status
    const statusMap: Record<string, string> = {
      pending: "pending",
      under_review: "in_review",
      approved: "approved",
      rejected: "rejected",
      update_required: "needs_update",
    }

    return NextResponse.json({
      success: true,
      application: {
        id: application.id,
        trackingCode: application.tracking_code || application.id,
        type: application.application_type,
        status: statusMap[application.status] || application.status,
        title: application.title,
        createdAt: application.created_at,
        updatedAt: application.updated_at,
        reviewedAt: application.reviewed_at,
        feedback: application.feedback,
      },
    })
  } catch (error) {
    console.error("Check status error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
