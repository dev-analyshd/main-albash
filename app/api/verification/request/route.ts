import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/verification/request
 * User submits verification request with documents and answers
 */
export async function POST(request: NextRequest) {
  try {
    const { user_id, entity_type, documents, answers } = await request.json();

    // Validate input
    if (!user_id) return NextResponse.json(
      { error: "user_id required" },
      { status: 400 }
    );

    if (!entity_type) return NextResponse.json(
      { error: "entity_type required" },
      { status: 400 }
    );

    if (!["builder", "institution", "company", "organization", "individual"].includes(entity_type)) {
      return NextResponse.json(
        { error: "Invalid entity_type" },
        { status: 400 }
      );
    }

    // Check if user already has pending verification
    const { data: existingRequest } = await supabase
      .from("verification_requests")
      .select("id, status")
      .eq("user_id", user_id)
      .eq("status", "pending")
      .single();

    if (existingRequest) {
      return NextResponse.json(
        { error: "You already have a pending verification request" },
        { status: 409 }
      );
    }

    // Create verification request
    const { data, error } = await supabase
      .from("verification_requests")
      .insert({
        user_id,
        entity_type,
        document_urls: documents || [],
        answers: answers || {},
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    // Update user's verification status
    await supabase
      .from("users")
      .update({
        verification_status: "pending",
        entity_type,
        verification_request_id: data.id,
      })
      .eq("id", user_id);

    // Log action
    await supabase.from("admin_audit_log").insert({
      admin_id: user_id,
      action: "verification_requested",
      target_user_id: user_id,
      target_verification_id: data.id,
      details: {
        entity_type,
        document_count: documents?.length || 0,
      },
    });

    return NextResponse.json({
      success: true,
      request_id: data.id,
      status: "pending",
      message: "Verification request submitted. Admin will review within 24-48 hours.",
    });
  } catch (error: any) {
    console.error("Error creating verification request:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create verification request" },
      { status: 500 }
    );
  }
}
