import { createServerClient } from "@supabase/ssr"
import { NextRequest, NextResponse } from "next/server"

/**
 * GET /api/users/search
 * Search and filter users by name, email, role, department, verification status
 * Query params: q (search query), role, department, verified, limit, offset
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
        },
      }
    )

    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get("q")?.toLowerCase() || ""
    const role = searchParams.get("role")
    const department = searchParams.get("department")
    const verified = searchParams.get("verified")
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")

    // Start building query
    let query = supabase
      .from("profiles")
      .select("id, email, full_name, avatar_url, role, department, is_verified, reputation_score, created_at", {
        count: "exact",
      })

    // Search by name or email
    if (q) {
      query = query.or(`full_name.ilike.%${q}%,email.ilike.%${q}%`)
    }

    // Filter by role
    if (role) {
      query = query.eq("role", role)
    }

    // Filter by department
    if (department) {
      query = query.eq("department", department)
    }

    // Filter by verification status
    if (verified !== null) {
      query = query.eq("is_verified", verified === "true")
    }

    // Apply pagination
    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("User search error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data,
      pagination: {
        total: count,
        limit,
        offset,
        hasMore: offset + limit < (count || 0),
      },
    })
  } catch (error) {
    console.error("User search API error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
