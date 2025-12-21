import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get platform settings (create settings table if needed, or use metadata)
    // For now, return default settings structure
    const settings = {
      platform: {
        name: "AlbashSolution",
        description: "Digital-Physical Value Transformation Ecosystem",
        maintenance: false,
        registrationEnabled: true,
        verificationRequired: true,
      },
      swap: {
        enabled: true,
        minimumReputation: 0,
        requireVerification: true,
        defaultPlatformFee: 5,
      },
      marketplace: {
        enabled: true,
        listingFee: 0,
        verificationRequired: true,
        maxListingsPerUser: 50,
      },
      reputation: {
        enabled: true,
        initialScore: 0,
        verificationBonus: 100,
        swapBonus: 10,
        listingBonus: 5,
      },
      payments: {
        enabled: true,
        supportedCurrencies: ["USD", "NGN", "USDT"],
        platformFeePercent: 5,
      },
    }

    return NextResponse.json({ data: settings })
  } catch (error) {
    console.error("Settings fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
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

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()

    // In a real implementation, you'd save to a settings table
    // For now, we'll log the update
    console.log("Settings updated:", body)

    return NextResponse.json({ success: true, message: "Settings updated successfully" })
  } catch (error) {
    console.error("Settings update error:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}

