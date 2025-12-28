import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/verification/status/:userId
 * Get user's verification status
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    // Get user verification status
    const { data: user, error: userError } = await supabase
      .from("users")
      .select(
        "id, verification_status, verified_at, entity_type, blockchain_verified"
      )
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get latest verification request if exists
    const { data: latestRequest, error: requestError } = await supabase
      .from("verification_requests")
      .select(
        "id, status, created_at, review_date, review_notes, entity_type"
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (requestError && requestError.code !== "PGRST116") {
      throw requestError;
    }

    return NextResponse.json({
      success: true,
      verification: {
        status: user.verification_status,
        verified_at: user.verified_at,
        entity_type: user.entity_type,
        blockchain_verified: user.blockchain_verified,
        latest_request: latestRequest || null,
      },
    });
  } catch (error: any) {
    console.error("Error fetching verification status:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch verification status" },
      { status: 500 }
    );
  }
}
