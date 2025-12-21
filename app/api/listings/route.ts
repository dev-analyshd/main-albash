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
      .select("*, profiles!listings_user_id_fkey(id, full_name, avatar_url, reputation_score, is_verified, email, phone)")

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

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile to check verification status
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_verified")
      .eq("id", user.id)
      .single()

    const isVerified = profile?.is_verified ?? false

    // Prepare listing data
    const listingData = {
      user_id: user.id,
      title: body.title,
      description: body.description,
      price: body.price ? Number.parseFloat(body.price) : null,
      category_id: body.category_id || null,
      listing_type: body.listing_type || "physical",
      images: body.images || [],
      is_verified: isVerified,
      is_tokenized: body.is_tokenized || false,
      swap_enabled: body.swap_enabled || false,
      accepted_swap_types: body.accepted_swap_types || null,
      metadata: {
        currency: body.currency || "NGN",
        payment_methods: body.payment_methods || ["card", "bank"],
      },
    }

    // Insert listing
    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .insert(listingData)
      .select("*")
      .single()

    if (listingError) {
      console.error("Listing creation error:", listingError)
      return NextResponse.json({ error: "Failed to create listing", details: listingError.message }, { status: 500 })
    }

    return NextResponse.json({ data: listing })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : JSON.stringify(error)
    console.error("Listing API error:", errorMsg)
    return NextResponse.json({ error: "Failed to create listing", details: errorMsg }, { status: 500 })
  }
}
