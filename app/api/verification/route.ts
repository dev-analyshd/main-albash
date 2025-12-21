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

    const body = await request.json()

    // Check if user already has a pending request
    const { data: existingRequest } = await supabase
      .from("verification_requests")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "pending")
      .maybeSingle()

    if (existingRequest) {
      return NextResponse.json({ error: "You already have a pending verification request" }, { status: 400 })
    }

    // Create verification request
    const { data, error } = await supabase
      .from("verification_requests")
      .insert({
        user_id: user.id,
        verification_type: body.verificationType,
        form_data: body.formData,
        documents: body.documents || [],
        status: "pending",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Verification request error:", error)
    return NextResponse.json({ error: "Failed to submit verification request" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's verification requests
    const { data, error } = await supabase
      .from("verification_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Verification fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch verification requests" }, { status: 500 })
  }
}

