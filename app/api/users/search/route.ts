import { createServerClient } from "@supabase/ssr"
import { NextRequest, NextResponse } from "next/server"
import { withRateLimitAndSecurity } from "@/lib/api-security"
import { sanitizeQueryParams } from "@/lib/middleware/security"

/**
 * GET /api/users/search
 * Search and filter users by name, email, role, department, verification status
 * Query params: q (search query), role, department, verified, limit, offset
 * Rate limited: 50 requests per minute (search preset)
 */
async function handler(request: NextRequest) {
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
    
    // Sanitize input parameters
    const params = sanitizeQueryParams({
      q: searchParams.get("q")?.toLowerCase() || "",
      role: searchParams.get("role") || null,
      department: searchParams.get("department") || null,
      verified: searchParams.get("verified") || null,
      limit: parseInt(searchParams.get("limit") || "20"),
      offset: parseInt(searchParams.get("offset") || "0"),
    })

    const { q, role, department, verified, limit, offset } = params

    // Validate limit and offset
    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Limit must be between 1 and 100" },
        { status: 400 }
      )
    }

    if (offset < 0) {
      return NextResponse.json(
        { error: "Offset must be >= 0" },
        { status: 400 }
      )
    }

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

// Export with rate limiting and security middleware (50 req/min for search)
export const GET = withRateLimitAndSecurity(handler, { preset: "search" })
