import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const { id } = await params
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Get original swap request
    const { data: originalSwap, error: fetchError } = await supabase
      .from("swap_requests")
      .select("*")
      .eq("id", id)
      .single()

    if (fetchError) throw fetchError

    if (originalSwap.target_user_id !== user.id) {
      return NextResponse.json({ error: "Only the target user can create counter offers" }, { status: 403 })
    }

    // Create counter offer
    const { data: counterOffer, error: counterError } = await supabase
      .from("swap_counter_offers")
      .insert({
        original_swap_request_id: id,
        counter_initiator_id: user.id,
        counter_terms: body.counter_terms || {},
        status: "pending",
        expires_at: body.expires_at || null,
      })
      .select()
      .single()

    if (counterError) throw counterError

    // Send notification to original initiator
    await supabase.from("notifications").insert({
      user_id: originalSwap.initiator_id,
      title: "Counter Offer Received",
      message: "You have received a counter offer for your swap proposal",
      type: "swap_counter_offer",
      reference_id: counterOffer.id,
    })

    return NextResponse.json({ data: counterOffer })
  } catch (error) {
    console.error("Counter offer creation error:", error)
    return NextResponse.json({ error: "Failed to create counter offer" }, { status: 500 })
  }
}

