import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const { id } = await params

    const { data: swapRequest, error } = await supabase
      .from("swap_requests")
      .select(
        `
        *,
        initiator:profiles!swap_requests_initiator_id_fkey(id, full_name, avatar_url, reputation_score, is_verified, role),
        target_user:profiles!swap_requests_target_user_id_fkey(id, full_name, avatar_url, reputation_score, is_verified, role),
        target_listing:listings!swap_requests_target_listing_id_fkey(id, title, description, images, price, listing_type),
        offering_listing:listings!swap_requests_offering_listing_id_fkey(id, title, description, images, price, listing_type),
        swap_assets(*),
        swap_contracts(*),
        ownership_transfers(*)
      `
      )
      .eq("id", id)
      .single()

    if (error) throw error

    return NextResponse.json({ data: swapRequest })
  } catch (error) {
    console.error("Swap fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch swap" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
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
    const action = body.action // 'accept', 'reject', 'cancel', 'complete'

    // Get swap request
    const { data: swapRequest, error: fetchError } = await supabase
      .from("swap_requests")
      .select("*")
      .eq("id", id)
      .single()

    if (fetchError) throw fetchError

    if (!swapRequest) {
      return NextResponse.json({ error: "Swap request not found" }, { status: 404 })
    }

    // Verify user has permission
    if (action === "accept" || action === "reject") {
      if (swapRequest.target_user_id !== user.id) {
        return NextResponse.json({ error: "Only the target user can accept or reject swaps" }, { status: 403 })
      }
    } else if (action === "cancel") {
      if (swapRequest.initiator_id !== user.id && swapRequest.target_user_id !== user.id) {
        return NextResponse.json({ error: "Only swap participants can cancel" }, { status: 403 })
      }
    } else if (action === "complete") {
      if (swapRequest.initiator_id !== user.id && swapRequest.target_user_id !== user.id) {
        return NextResponse.json({ error: "Only swap participants can complete swaps" }, { status: 403 })
      }
    }

    let updateData: any = {}
    let notificationTitle = ""
    let notificationMessage = ""

    switch (action) {
      case "accept":
        updateData = {
          status: "accepted",
          accepted_at: new Date().toISOString(),
        }
        notificationTitle = "Swap Accepted"
        notificationMessage = "Your swap proposal has been accepted"
        break

      case "reject":
        updateData = {
          status: "rejected",
        }
        notificationTitle = "Swap Rejected"
        notificationMessage = `Your swap proposal has been rejected${body.reason ? `: ${body.reason}` : ""}`
        break

      case "cancel":
        updateData = {
          status: "cancelled",
        }
        notificationTitle = "Swap Cancelled"
        notificationMessage = "The swap has been cancelled"
        break

      case "complete":
        updateData = {
          status: "completed",
          completed_at: new Date().toISOString(),
        }
        notificationTitle = "Swap Completed"
        notificationMessage = "Your swap has been successfully completed"
        break

      default:
        updateData = body
    }

    const { data: updatedSwap, error: updateError } = await supabase
      .from("swap_requests")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (updateError) throw updateError

    // Send notifications
    if (action && ["accept", "reject", "cancel", "complete"].includes(action)) {
      const notifyUserId = action === "accept" || action === "reject" ? swapRequest.initiator_id : swapRequest.target_user_id
      
      await supabase.from("notifications").insert({
        user_id: notifyUserId,
        title: notificationTitle,
        message: notificationMessage,
        type: `swap_${action}`,
        reference_id: id,
      })
    }

    return NextResponse.json({ data: updatedSwap })
  } catch (error) {
    console.error("Swap update error:", error)
    return NextResponse.json({ error: "Failed to update swap" }, { status: 500 })
  }
}

