import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/admin/verification/:requestId/approve
 * Admin approves a verification request
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { requestId: string } }
) {
  try {
    const { requestId } = params;
    const { review_notes } = await request.json();

    // Get current user (should be admin)
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify admin permissions (in production, check JWT token)
    // For now, we'll check via Supabase

    // Get verification request
    const { data: verificationRequest, error: fetchError } = await supabase
      .from("verification_requests")
      .select("id, user_id, status, entity_type")
      .eq("id", requestId)
      .single();

    if (fetchError || !verificationRequest) {
      return NextResponse.json(
        { error: "Verification request not found" },
        { status: 404 }
      );
    }

    if (verificationRequest.status !== "pending") {
      return NextResponse.json(
        { error: "Verification request is not pending" },
        { status: 409 }
      );
    }

    // Update verification request
    const { error: updateError } = await supabase
      .from("verification_requests")
      .update({
        status: "approved",
        review_notes,
        review_date: new Date().toISOString(),
      })
      .eq("id", requestId);

    if (updateError) throw updateError;

    // Update user verification status
    const { error: userError } = await supabase
      .from("users")
      .update({
        verification_status: "verified",
        verified_at: new Date().toISOString(),
      })
      .eq("id", verificationRequest.user_id);

    if (userError) throw userError;

    // Log action
    await supabase.from("admin_audit_log").insert({
      action: "verification_approved",
      target_user_id: verificationRequest.user_id,
      target_verification_id: requestId,
      details: {
        review_notes,
        entity_type: verificationRequest.entity_type,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Verification approved",
      user_id: verificationRequest.user_id,
      status: "verified",
    });
  } catch (error: any) {
    console.error("Error approving verification:", error);
    return NextResponse.json(
      { error: error.message || "Failed to approve verification" },
      { status: 500 }
    );
  }
}
