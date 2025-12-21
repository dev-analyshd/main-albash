import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const userId = searchParams.get("userId")
    const type = searchParams.get("type") // 'sent' or 'received'

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let query = supabase
      .from("swap_requests")
      .select(
        `
        *,
        initiator:profiles!swap_requests_initiator_id_fkey(id, full_name, avatar_url, reputation_score, is_verified),
        target_user:profiles!swap_requests_target_user_id_fkey(id, full_name, avatar_url, reputation_score, is_verified),
        target_listing:listings!swap_requests_target_listing_id_fkey(id, title, images, price),
        offering_listing:listings!swap_requests_offering_listing_id_fkey(id, title, images, price)
      `
      )

    if (type === "sent") {
      query = query.eq("initiator_id", user.id)
    } else if (type === "received") {
      query = query.eq("target_user_id", user.id)
    } else if (userId) {
      query = query.or(`initiator_id.eq.${userId},target_user_id.eq.${userId}`)
    }

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Swaps fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch swaps" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile (verification not required for swaps)
    const { data: profile } = await supabase.from("profiles").select("reputation_score").eq("id", user.id).single()

    const body = await request.json()

    // Get target listing if provided
    let targetListing = null
    if (body.target_listing_id) {
      const { data: listing } = await supabase.from("listings").select("*").eq("id", body.target_listing_id).single()
      targetListing = listing

      // Check if listing has swap enabled
      if (!listing?.swap_enabled) {
        return NextResponse.json({ error: "This listing does not accept swaps" }, { status: 400 })
      }

      // Check minimum reputation if required
      if (listing.minimum_reputation && (profile?.reputation_score ?? 0) < listing.minimum_reputation) {
        return NextResponse.json(
          { error: `This listing requires a minimum reputation of ${listing.minimum_reputation}` },
          { status: 403 }
        )
      }

      // Check if accepted swap types match
      if (listing.accepted_swap_types && listing.accepted_swap_types.length > 0) {
        if (!listing.accepted_swap_types.includes(body.offering_type)) {
          return NextResponse.json(
            { error: `This listing only accepts swaps of type: ${listing.accepted_swap_types.join(", ")}` },
            { status: 400 }
          )
        }
      }
    }

    // Create swap request
    const { data: swapRequest, error: swapError } = await supabase
      .from("swap_requests")
      .insert({
        initiator_id: user.id,
        target_listing_id: body.target_listing_id || null,
        target_user_id: body.target_user_id || targetListing?.user_id,
        swap_mode: body.swap_mode || "contract_based",
        offering_type: body.offering_type,
        offering_listing_id: body.offering_listing_id || null,
        offering_description: body.offering_description,
        offering_value: body.offering_value || null,
        offering_metadata: body.offering_metadata || {},
        requesting_type: body.requesting_type,
        requesting_description: body.requesting_description,
        requesting_value: body.requesting_value || null,
        requesting_metadata: body.requesting_metadata || {},
        price_difference: body.price_difference || null,
        contract_duration_days: body.contract_duration_days || null,
        ownership_transfer_type: body.ownership_transfer_type || null,
        usage_rights: body.usage_rights || null,
        upgrade_expectations: body.upgrade_expectations || null,
        terms: body.terms || {},
        escrow_required: body.escrow_required || false,
        escrow_amount: body.escrow_amount || null,
        expires_at: body.expires_at || null,
        status: "pending",
      })
      .select()
      .single()

    if (swapError) throw swapError

    // Create swap assets for offering
    if (body.offering_listing_id || body.offering_description) {
      await supabase.from("swap_assets").insert({
        swap_request_id: swapRequest.id,
        asset_type: body.offering_type,
        asset_id: body.offering_listing_id || null,
        listing_id: body.offering_listing_id || null,
        owner_id: user.id,
        asset_description: body.offering_description,
        asset_value: body.offering_value || null,
        asset_metadata: body.offering_metadata || {},
      })
    }

    // Create swap assets for requesting (if listing exists)
    if (body.target_listing_id) {
      await supabase.from("swap_assets").insert({
        swap_request_id: swapRequest.id,
        asset_type: targetListing?.listing_type || "product",
        asset_id: body.target_listing_id,
        listing_id: body.target_listing_id,
        owner_id: body.target_user_id || targetListing?.user_id,
        asset_description: targetListing?.description || "",
        asset_value: targetListing?.price || null,
        asset_metadata: {},
      })
    }

    // Send notification to target user
    await supabase.from("notifications").insert({
      user_id: body.target_user_id || targetListing?.user_id,
      title: "New Swap Proposal",
      message: `You have received a new swap proposal for "${targetListing?.title || "your listing"}"`,
      type: "swap_proposal",
      reference_id: swapRequest.id,
    })

    return NextResponse.json({ data: swapRequest })
  } catch (error) {
    console.error("Swap creation error:", error)
    return NextResponse.json({ error: "Failed to create swap proposal" }, { status: 500 })
  }
}

