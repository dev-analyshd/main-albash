import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { mintRecordId, transactionHash, contractAddress, tokenId, status } = body

    if (!mintRecordId || !transactionHash || !contractAddress || !tokenId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Ensure the record belongs to the user (or user is admin)
    const { data: record, error: fetchError } = await supabase
      .from("nft_mint_records")
      .select("id, user_id")
      .eq("id", mintRecordId)
      .single()

    if (fetchError || !record) {
      return NextResponse.json({ error: "Mint record not found" }, { status: 404 })
    }

    // Fetch profile to check role
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    const isOwner = record.user_id === user.id
    const isAdmin = profile?.role === "admin"

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const updatePayload: any = {
      transaction_hash: transactionHash,
      contract_address: contractAddress,
      token_id: String(tokenId),
      status: status || "minted",
      updated_at: new Date().toISOString(),
    }

    const { data: updated, error: updateError } = await supabase
      .from("nft_mint_records")
      .update(updatePayload)
      .eq("id", mintRecordId)
      .select()
      .single()

    if (updateError) {
      console.error("Failed to update mint record:", updateError)
      return NextResponse.json({ error: "Failed to update record" }, { status: 500 })
    }

    return NextResponse.json({ success: true, record: updated })
  } catch (err) {
    console.error("Error confirming mint:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
