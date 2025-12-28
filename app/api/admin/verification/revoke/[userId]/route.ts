import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/admin/verification/:userId/revoke
 * Admin revokes a user's verification status
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const { reason } = await request.json();

    // TODO: Add proper authentication check here
    // const adminId = request.headers.get("x-admin-id");

    // Get user
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, verification_status")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.verification_status !== "verified") {
      return NextResponse.json(
        { error: "User is not verified" },
        { status: 409 }
      );
    }

    // Update user status
    const { error: updateError } = await supabase
      .from("users")
      .update({
        verification_status: "revoked",
      })
      .eq("id", userId);

    if (updateError) throw updateError;

    // Log action
    await supabase.from("admin_audit_log").insert({
      action: "verification_revoked",
      target_user_id: userId,
      details: {
        reason,
      },
    });

    return NextResponse.json({
      success: true,
      message: "User verification revoked",
      user_id: userId,
      status: "revoked",
    });
  } catch (error: any) {
    console.error("Error revoking verification:", error);
    return NextResponse.json(
      { error: error.message || "Failed to revoke verification" },
      { status: 500 }
    );
  }
}
