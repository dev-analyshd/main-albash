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
    const { amount, payment_method_id, transaction_type, description, listing_id, processor, crypto_chain } = body

    if (!amount || !transaction_type) {
      return NextResponse.json(
        { error: "Missing required fields: amount, transaction_type" },
        { status: 400 }
      )
    }

    // Allow test payments without saved payment method
    let paymentMethod: any = null
    if (payment_method_id && payment_method_id !== 'test_card') {
      // Fetch payment method details
      const { data: method, error: methodError } = await supabase
        .from("payment_methods")
        .select("*")
        .eq("id", payment_method_id)
        .eq("user_id", user.id)
        .single()

      if (methodError || !method) {
        return NextResponse.json({ error: "Payment method not found" }, { status: 404 })
      }
      paymentMethod = method
    }

    // Create payment transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from("transactions")
      .insert({
        user_id: user.id,
        amount,
        currency: "USD",
        payment_method_id: payment_method_id !== 'test_card' ? payment_method_id : null,
        type: transaction_type, // 'purchase', 'withdrawal', 'deposit'
        status: "pending",
        description,
        listing_id: listing_id || null,
        metadata: {
          payment_method_type: paymentMethod?.type || 'card_test',
          timestamp: new Date().toISOString(),
          processor_choice: processor || null,
          crypto_chain: crypto_chain || null,
        },
      })
      .select()
      .single()

    if (transactionError) {
      console.error("Transaction creation error:", transactionError)
      return NextResponse.json(
        { error: "Failed to create transaction" },
        { status: 500 }
      )
    }

    const processorChoice = processor || null
    const chainChoice = crypto_chain || null

    // Route to appropriate payment processor based on method type
    let processingResult: any = {}

    if (!paymentMethod || paymentMethod.type === "card") {
      // Use Stripe/choice for card payments or test mode
      processingResult = await processCardPayment(amount, paymentMethod, transaction.id, processorChoice)
    } else if (paymentMethod.type === "bank") {
      processingResult = await processBankTransfer(amount, paymentMethod, transaction.id, processorChoice)
    } else if (paymentMethod.type === "crypto_wallet") {
      processingResult = await processCryptoPayment(amount, paymentMethod, transaction.id, chainChoice)
    } else {
      return NextResponse.json({ error: "Unsupported payment method" }, { status: 400 })
    }

    // Update transaction status
    if (processingResult.success) {
      await supabase
        .from("transactions")
        .update({
          status: "processing",
          external_reference: processingResult.reference,
          metadata: {
            ...transaction.metadata,
            processor: processingResult.processor,
            authorization_code: processingResult.authCode,
          },
        })
        .eq("id", transaction.id)
    } else {
      await supabase
        .from("transactions")
        .update({
          status: "failed",
          metadata: {
            ...transaction.metadata,
            error_message: processingResult.error,
          },
        })
        .eq("id", transaction.id)

      return NextResponse.json(
        { error: processingResult.error || "Payment processing failed" },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      transaction_id: transaction.id,
      status: "processing",
      reference: processingResult.reference,
      next_action: processingResult.nextAction,
    })
  } catch (error) {
    console.error("Payment processing error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

async function processCardPayment(amount: number, paymentMethod: any, transactionId: string, processorChoice?: string) {
  try {
    // This would integrate with Stripe/Paystack
    // For now, returning mock success
    const processorUsed = processorChoice || 'stripe'
    const reference = `CARD_${transactionId.slice(0, 8)}_${Date.now()}`
    return {
      success: true,
      processor: processorUsed,
      reference,
      authCode: `AUTH_${Math.random().toString(36).substring(7).toUpperCase()}`,
      nextAction: "confirm",
    }
  } catch (error) {
    return {
      success: false,
      error: "Card payment processing failed",
    }
  }
}

async function processBankTransfer(amount: number, paymentMethod: any, transactionId: string, processorChoice?: string) {
  try {
    // For bank transfers, create escrow
    const processorUsed = processorChoice || 'bank_transfer'
    const reference = `BANK_${transactionId.slice(0, 8)}_${Date.now()}`
    return {
      success: true,
      processor: processorUsed,
      reference,
      authCode: `AUTH_${Math.random().toString(36).substring(7).toUpperCase()}`,
      nextAction: "wait_for_deposit",
    }
  } catch (error) {
    return {
      success: false,
      error: "Bank transfer setup failed",
    }
  }
}

async function processCryptoPayment(amount: number, paymentMethod: any, transactionId: string, chainChoice?: string) {
  try {
    // This would integrate with Web3 wallet verification
    const usedChain = chainChoice || paymentMethod?.metadata?.chain || 'ethereum'
    const reference = `CRYPTO_${transactionId.slice(0, 8)}_${Date.now()}`
    return {
      success: true,
      processor: `crypto_${usedChain}`,
      reference,
      authCode: paymentMethod?.metadata?.full_address || `WALLET_${usedChain}`,
      nextAction: "confirm_in_wallet",
    }
  } catch (error) {
    return {
      success: false,
      error: "Crypto payment verification failed",
    }
  }
}
