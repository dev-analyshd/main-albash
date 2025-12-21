import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const category = searchParams.get("category")
    const verified = searchParams.get("verified")
    const tokenized = searchParams.get("tokenized")
    const search = searchParams.get("search")

    let query = supabase
      .from("listings")
      .select("*, profiles!listings_user_id_fkey(full_name, avatar_url, reputation_score)")
      .eq("is_verified", true)

    if (type) query = query.eq("listing_type", type)
    if (category) query = query.eq("category_id", category)
    if (verified === "true") query = query.eq("is_verified", true)
    if (tokenized === "true") query = query.eq("is_tokenized", true)
    if (search) query = query.ilike("title", `%${search}%`)

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Listings fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.description || body.title.trim() === "") {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 })
    }

    // Validate price if provided
    if (body.price !== null && body.price !== undefined) {
      const price = typeof body.price === 'string' ? Number.parseFloat(body.price) : body.price
      if (isNaN(price) || price < 0) {
        return NextResponse.json({ error: "Price must be a valid positive number" }, { status: 400 })
      }
    }

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    // Allow a development-only bypass when no authenticated user is present.
    // Usage: send header `x-dev-user-id: <uuid>` or query `?devUserId=<uuid>`
    let user: any = authUser
    let isDevMode = false
    
    if (!user) {
      try {
        const url = new URL(request.url)
        const devUserId = url.searchParams.get("devUserId") || request.headers.get("x-dev-user-id")
        if (process.env.NODE_ENV === "development" && devUserId) {
          user = { id: devUserId }
          isDevMode = true
        }
      } catch (err) {
        // ignore URL parse errors
      }
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // For dev mode: bypass profile lookup and RLS by forcing auth context
    // For production: require normal auth flow
    let isVerified = false
    
    if (!isDevMode) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_verified")
        .eq("id", user.id)
        .single()
      
      isVerified = profile?.is_verified ?? false
      
      if (profileError && profileError.code !== 'PGRST116') {
        console.warn("Profile lookup warning:", profileError)
      }
    }

    // Accept both camelCase and snake_case fields from different clients
    const listingType = body.listingType ?? body.listing_type ?? null
    const categoryId = body.categoryId ?? body.category_id ?? null
    const isTokenized = body.isTokenized ?? body.is_tokenized ?? false

    // For dev mode: directly bypass insert via raw SQL or by using admin credentials
    // For now: just log the dev mode attempt and return a synthetic response
    if (isDevMode) {
      console.log("Dev mode listing creation:", { user_id: user.id, title: body.title })
      
      // In dev mode, synthesize a successful response without hitting RLS
      const syntheticId = require('crypto').randomUUID?.() || `dev-${Date.now()}`
      
      const syntheticListing = {
        id: syntheticId,
        user_id: user.id,
        title: body.title,
        description: body.description,
        price: body.price,
        listing_type: listingType,
        category_id: categoryId,
        images: body.images || [],
        is_verified: isVerified,
        is_tokenized: isTokenized,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      return NextResponse.json({ data: syntheticListing, devMode: true, note: "Dev mode: listing created synthetially, not persisted to DB" })
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : JSON.stringify(error)
    console.error("Listing creation error:", errorMsg)
    return NextResponse.json({ error: "Failed to create listing", details: process.env.NODE_ENV === "development" ? errorMsg : undefined }, { status: 500 })
  }
}
