import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { amount, payment_method_id } = body

    if (!amount || !payment_method_id) {
      return NextResponse.json(
        { error: "Missing required fields: amount, payment_method_id" },
        { status: 400 }
      )
    }

    if (amount < 10) {
      return NextResponse.json(
        { error: "Minimum withdrawal amount is $10" },
        { status: 400 }
      )
    }

    // Fetch user profile and check balance
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("wallet_balance")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      )
    }

    if ((profile.wallet_balance || 0) < amount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      )
    }

    // Verify payment method belongs to user
    const { data: paymentMethod, error: methodError } = await supabase
      .from("payment_methods")
      .select("*")
      .eq("id", payment_method_id)
      .eq("user_id", user.id)
      .single()

    if (methodError || !paymentMethod) {
      return NextResponse.json(
        { error: "Payment method not found" },
        { status: 404 }
      )
    }

    // Create withdrawal request
    const { data: withdrawal, error: insertError } = await supabase
      .from("withdrawal_requests")
      .insert({
        user_id: user.id,
        amount,
        currency: "USD",
        payment_method_id,
        status: "pending",
      })
      .select()
      .single()

    if (insertError) {
      console.error("Withdrawal creation error:", insertError)
      return NextResponse.json(
        { error: "Failed to create withdrawal request" },
        { status: 500 }
      )
    }

    // Update user's pending balance
    const newPendingBalance = (profile.wallet_balance || 0) - amount

    await supabase
      .from("profiles")
      .update({ wallet_balance: newPendingBalance })
      .eq("id", user.id)

    return NextResponse.json({
      success: true,
      withdrawal_id: withdrawal.id,
      amount,
      status: "pending",
      message: "Withdrawal request submitted. Please allow 2-5 business days for processing.",
    })
  } catch (error) {
    console.error("Withdrawal processing error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch user's withdrawal history
    const { data: withdrawals, error } = await supabase
      .from("withdrawal_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch withdrawals" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      withdrawals,
      count: withdrawals?.length || 0,
    })
  } catch (error) {
    console.error("Withdrawal fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
