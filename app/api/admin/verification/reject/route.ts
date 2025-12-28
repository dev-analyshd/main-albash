import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/admin/verification/:requestId/reject
 * Admin rejects a verification request
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { requestId: string } }
) {
  try {
    const { requestId } = params;
    const { review_notes } = await request.json();

    // Get verification request
    const { data: verificationRequest, error: fetchError } = await supabase
      .from("verification_requests")
      .select("id, user_id, status")
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
        status: "rejected",
        review_notes,
        review_date: new Date().toISOString(),
      })
      .eq("id", requestId);

    if (updateError) throw updateError;

    // Reset user verification status to unverified
    const { error: userError } = await supabase
      .from("users")
      .update({
        verification_status: "unverified",
      })
      .eq("id", verificationRequest.user_id);

    if (userError) throw userError;

    // Log action
    await supabase.from("admin_audit_log").insert({
      action: "verification_rejected",
      target_user_id: verificationRequest.user_id,
      target_verification_id: requestId,
      details: {
        review_notes,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Verification rejected. User can reapply after 30 days.",
      user_id: verificationRequest.user_id,
      status: "unverified",
    });
  } catch (error: any) {
    console.error("Error rejecting verification:", error);
    return NextResponse.json(
      { error: error.message || "Failed to reject verification" },
      { status: 500 }
    );
  }
}
