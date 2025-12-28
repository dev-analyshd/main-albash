import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/admin/verification/pending
 * Get all pending verification requests (admin only)
 * Query params:
 * - limit: number of results (default 20, max 100)
 * - offset: pagination offset (default 0)
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Add proper authentication check here
    // const adminId = request.headers.get("x-admin-id");
    // if (!adminId) {
    //   return NextResponse.json(
    //     { error: "Unauthorized" },
    //     { status: 401 }
    //   );
    // }

    const url = new URL(request.url);
    const limit = Math.min(
      parseInt(url.searchParams.get("limit") || "20"),
      100
    );
    const offset = parseInt(url.searchParams.get("offset") || "0");

    // Get pending verification requests with user info
    const { data: pendingRequests, error, count } = await supabase
      .from("verification_requests")
      .select(
        `
        id,
        user_id,
        entity_type,
        status,
        created_at,
        document_types,
        users:user_id (
          id,
          email,
          raw_user_meta_data->>'full_name' as full_name
        )
      `,
        { count: "exact" }
      )
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      total: count,
      limit,
      offset,
      requests: pendingRequests,
    });
  } catch (error: any) {
    console.error("Error fetching pending requests:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch pending requests" },
      { status: 500 }
    );
  }
}
