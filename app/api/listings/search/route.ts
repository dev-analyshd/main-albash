import { createServerClient } from "@supabase/ssr"
import { NextRequest, NextResponse } from "next/server"

/**
 * GET /api/listings/search
 * Search and filter listings by title, category, condition, price range, seller
 * Query params: q (search query), category, condition, minPrice, maxPrice, sellerId, limit, offset
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
    const category = searchParams.get("category")
    const condition = searchParams.get("condition")
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : null
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : null
    const sellerId = searchParams.get("sellerId")
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")

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
