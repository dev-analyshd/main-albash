import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { event_type, transaction_id, status, reference, error_message } = body

    if (!event_type || !transaction_id) {
      return NextResponse.json(
        { error: "Missing event_type or transaction_id" },
        { status: 400 }
      )
    }

    // Verify webhook signature (in production, verify webhook authenticity)
    // This is a simplified version

    // Update transaction status based on webhook event
    let newStatus = "pending"
    if (event_type === "payment.success") {
      newStatus = "completed"
    } else if (event_type === "payment.failed") {
      newStatus = "failed"
    } else if (event_type === "payment.pending") {
      newStatus = "processing"
    }

    const { data: transaction, error: fetchError } = await supabase
      .from("transactions")
      .select("*")
      .eq("id", transaction_id)
      .single()

    if (fetchError || !transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      )
    }

    // Update transaction
    const { error: updateError } = await supabase
      .from("transactions")
      .update({
        status: newStatus,
        external_reference: reference || transaction.external_reference,
        updated_at: new Date().toISOString(),
        metadata: {
          ...transaction.metadata,
          webhook_event: event_type,
          error_message,
          processed_at: new Date().toISOString(),
        },
      })
      .eq("id", transaction_id)

    if (updateError) {
      console.error("Transaction update error:", updateError)
      return NextResponse.json(
        { error: "Failed to update transaction" },
        { status: 500 }
      )
    }

    // If payment successful, update wallet balance
    if (newStatus === "completed") {
      const { data: profile } = await supabase
        .from("profiles")
        .select("wallet_balance")
        .eq("id", transaction.user_id)
        .single()

      if (profile) {
        // For deposits/payments received, add to balance
        const newBalance =
          (profile.wallet_balance || 0) + (transaction.type === "deposit" ? transaction.amount : 0)

        await supabase
          .from("profiles")
          .update({ wallet_balance: newBalance })
          .eq("id", transaction.user_id)
      }
    }

    return NextResponse.json({
      success: true,
      transaction_id,
      status: newStatus,
    })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}
