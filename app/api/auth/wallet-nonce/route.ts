import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { address } = body

    if (!address) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
    }

    // Validate Ethereum address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json({ error: "Invalid wallet address format" }, { status: 400 })
    }

    // Generate a unique nonce for this address
    const nonce = crypto.randomBytes(32).toString("hex")

    // Store nonce temporarily (you might want to use Redis or database for this)
    // For now, we'll just return it - in production, store with expiration
    
    return NextResponse.json({ nonce, address })
  } catch (error) {
    console.error("Error generating nonce:", error)
    return NextResponse.json({ error: "Failed to generate nonce" }, { status: 500 })
  }
}

