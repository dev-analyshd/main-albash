import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch user's payment methods
    const { data: methods, error } = await supabase
      .from("payment_methods")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch payment methods" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      methods: (methods || []).map((method) => ({
        id: method.id,
        type: method.type,
        label: method.label,
        last_four: method.last_four,
        is_default: method.is_default,
        created_at: method.created_at,
        // Don't expose full metadata in API responses
      })),
      count: methods?.length || 0,
    })
  } catch (error) {
    console.error("Payment methods fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

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
    const { type, label, last_four, is_default, metadata } = body

    if (!type || !last_four) {
      return NextResponse.json(
        { error: "Missing required fields: type, last_four" },
        { status: 400 }
      )
    }

    if (!["card", "bank", "crypto_wallet"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid payment method type" },
        { status: 400 }
      )
    }

    // If setting as default, unset other defaults
    if (is_default) {
      await supabase
        .from("payment_methods")
        .update({ is_default: false })
        .eq("user_id", user.id)
    }

    // Create payment method
    const { data: method, error } = await supabase
      .from("payment_methods")
      .insert({
        user_id: user.id,
        type,
        label: label || null,
        last_four,
        is_default: is_default || false,
        metadata: metadata || {},
      })
      .select()
      .single()

    if (error) {
      console.error("Payment method creation error:", error)
      return NextResponse.json(
        { error: "Failed to create payment method" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      method: {
        id: method.id,
        type: method.type,
        label: method.label,
        last_four: method.last_four,
        is_default: method.is_default,
      },
    })
  } catch (error) {
    console.error("Payment method creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const methodId = searchParams.get("id")

    if (!methodId) {
      return NextResponse.json(
        { error: "Missing method id" },
        { status: 400 }
      )
    }

    // Verify method belongs to user
    const { data: method } = await supabase
      .from("payment_methods")
      .select("*")
      .eq("id", methodId)
      .eq("user_id", user.id)
      .single()

    if (!method) {
      return NextResponse.json(
        { error: "Payment method not found" },
        { status: 404 }
      )
    }

    // Delete payment method
    const { error } = await supabase
      .from("payment_methods")
      .delete()
      .eq("id", methodId)
      .eq("user_id", user.id)

    if (error) {
      console.error("Payment method deletion error:", error)
      return NextResponse.json(
        { error: "Failed to delete payment method" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Payment method deleted",
    })
  } catch (error) {
    console.error("Payment method deletion error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const methodId = searchParams.get("id")

    if (!methodId) {
      return NextResponse.json(
        { error: "Missing method id" },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { label, is_default } = body

    // If setting as default, unset other defaults
    if (is_default) {
      await supabase
        .from("payment_methods")
        .update({ is_default: false })
        .eq("user_id", user.id)
    }

    // Update payment method
    const { data: method, error } = await supabase
      .from("payment_methods")
      .update({
        label: label !== undefined ? label : undefined,
        is_default: is_default !== undefined ? is_default : undefined,
      })
      .eq("id", methodId)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      console.error("Payment method update error:", error)
      return NextResponse.json(
        { error: "Failed to update payment method" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      method: {
        id: method.id,
        label: method.label,
        is_default: method.is_default,
      },
    })
  } catch (error) {
    console.error("Payment method update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
