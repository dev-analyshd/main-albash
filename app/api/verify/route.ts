import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const department = searchParams.get("department")
    const status = searchParams.get("status") || "pending"

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is verifier or admin
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || !["verifier", "admin"].includes(profile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    let query = supabase
      .from("applications")
      .select("*, profiles!applications_user_id_fkey(full_name, email, avatar_url)")
      .eq("status", status)

    if (department) {
      query = query.eq("department_id", department)
    }

    const { data, error } = await query.order("submitted_at", { ascending: true })

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Verification queue fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch verification queue" }, { status: 500 })
  }
}
