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

    // Get swap request
    const { data: swapRequest, error: fetchError } = await supabase
      .from("swap_requests")
      .select("*")
      .eq("id", id)
      .single()

    if (fetchError) throw fetchError

    // Verify user is part of the swap
    if (swapRequest.initiator_id !== user.id && swapRequest.target_user_id !== user.id) {
      return NextResponse.json({ error: "Only swap participants can sign contracts" }, { status: 403 })
    }

    // Create or update contract
    const { data: existingContract } = await supabase
      .from("swap_contracts")
      .select("*")
      .eq("swap_request_id", id)
      .maybeSingle()

    let contractData: any = {
      swap_request_id: id,
      contract_terms: body.contract_terms || swapRequest.terms || {},
    }

    if (swapRequest.initiator_id === user.id) {
      contractData.digital_signature_initiator = body.signature || `signed_by_${user.id}_${Date.now()}`
      contractData.signed_at_initiator = new Date().toISOString()
    } else {
      contractData.digital_signature_target = body.signature || `signed_by_${user.id}_${Date.now()}`
      contractData.signed_at_target = new Date().toISOString()
    }

    // Generate contract hash
    const contractString = JSON.stringify(contractData.contract_terms)
    contractData.contract_hash = `hash_${Buffer.from(contractString).toString("base64").slice(0, 32)}`

    let contract
    if (existingContract) {
      const { data: updated, error: updateError } = await supabase
        .from("swap_contracts")
        .update(contractData)
        .eq("id", existingContract.id)
        .select()
        .single()

      if (updateError) throw updateError
      contract = updated
    } else {
      const { data: created, error: createError } = await supabase
        .from("swap_contracts")
        .insert(contractData)
        .select()
        .single()

      if (createError) throw createError
      contract = created
    }

    // If both parties have signed, mark swap as ready
    if (contract.digital_signature_initiator && contract.digital_signature_target && swapRequest.status === "accepted") {
      // Contract is fully signed - swap can proceed
      await supabase.from("swap_requests").update({ contract_hash: contract.contract_hash }).eq("id", id)
    }

    return NextResponse.json({ data: contract })
  } catch (error) {
    console.error("Contract signing error:", error)
    return NextResponse.json({ error: "Failed to sign contract" }, { status: 500 })
  }
}

