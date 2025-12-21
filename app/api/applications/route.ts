import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Generate tracking code if not provided
    const trackingCode =
      body.trackingCode ||
      `APP-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`

    const { data, error } = await supabase
      .from("applications")
      .insert({
        user_id: user.id,
        application_type: body.applicationType,
        title: body.title,
        description: body.description,
        documents: body.documents || [],
        status: "pending",
        tracking_code: trackingCode,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Application creation error:", error)
    return NextResponse.json({ error: "Failed to create application" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let query = supabase.from("applications").select("*").eq("user_id", user.id)

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Application fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}
