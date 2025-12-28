import { createServerClient } from "@supabase/ssr"
import { NextRequest, NextResponse } from "next/server"
import { withRateLimitAndSecurity } from "@/lib/api-security"
import { sanitizeQueryParams } from "@/lib/middleware/security"

/**
 * GET /api/listings/search
 * Search and filter listings by title, category, condition, price range, seller
 * Query params: q (search query), category, condition, minPrice, maxPrice, sellerId, limit, offset
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
      category: searchParams.get("category") || null,
      condition: searchParams.get("condition") || null,
      minPrice: searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : null,
      maxPrice: searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : null,
      sellerId: searchParams.get("sellerId") || null,
      limit: parseInt(searchParams.get("limit") || "20"),
      offset: parseInt(searchParams.get("offset") || "0"),
    })

    const { q, category, condition, minPrice, maxPrice, sellerId, limit, offset } = params

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

    // Validate price filters
    if (minPrice !== null && minPrice < 0) {
      return NextResponse.json(
        { error: "minPrice must be >= 0" },
        { status: 400 }
      )
    }

    if (maxPrice !== null && maxPrice < 0) {
      return NextResponse.json(
        { error: "maxPrice must be >= 0" },
        { status: 400 }
      )
    }

    // Start building query
    let query = supabase
      .from("listings")
      .select(
        `
        id,
        title,
        description,
        category,
        condition,
        price,
        image_url,
        seller_id,
        created_at,
        profiles:user_id (id, full_name, avatar_url, reputation_score)
      `,
        { count: "exact" }
      )
      .eq("status", "published")

    // Search by title or description
    if (q) {
      query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
    }

    // Filter by category
    if (category) {
      query = query.eq("category", category)
    }

    // Filter by condition
    if (condition) {
      query = query.eq("condition", condition)
    }

    // Filter by price range
    if (minPrice !== null) {
      query = query.gte("price", minPrice)
    }
    if (maxPrice !== null) {
      query = query.lte("price", maxPrice)
    }

    // Filter by seller
    if (sellerId) {
      query = query.eq("seller_id", sellerId)
    }

    // Apply pagination
    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Listing search error:", error)
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
    console.error("Listing search API error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}

// Export with rate limiting and security middleware (50 req/min for search)
export const GET = withRateLimitAndSecurity(handler, { preset: "search" })
