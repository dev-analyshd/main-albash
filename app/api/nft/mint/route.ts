import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { storeNFTMetadata, createTokenURI } from "@/lib/web3/nft-storage"

export async function POST(request: Request) {
	try {
		const supabase = await createClient()
		const {
			data: { user },
		} = await supabase.auth.getUser()

		if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

		const contentType = request.headers.get("content-type") || ""

		let name: string | undefined
		let description: string | undefined
		let attributes: any[] | undefined
		let listingId: string | undefined
		let image: any

		if (contentType.includes("multipart/form-data")) {
			const form = await request.formData()
			name = form.get("name") ? String(form.get("name")) : undefined
			description = form.get("description") ? String(form.get("description")) : undefined
			const attrs = form.get("attributes")
			attributes = attrs ? JSON.parse(String(attrs)) : []
			listingId = form.get("listingId") ? String(form.get("listingId")) : undefined
			const file = form.get("image") as File | null
			if (file) image = file
		} else {
			const body = await request.json()
			name = body?.name
			description = body?.description
			attributes = body?.attributes || []
			listingId = body?.listingId
			image = body?.image
		}

		if (!name || !description || !image) {
			return NextResponse.json({ error: "Missing required fields: name, description, image" }, { status: 400 })
		}

		const MAX_FILE_SIZE = 2 * 1024 * 1024
		if (image && typeof (image as any).size === "number") {
			const file = image as File
			if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "File too large. Max size is 2 MB." }, { status: 400 })
			if (!file.type || !file.type.startsWith("image/")) return NextResponse.json({ error: "Invalid file type. Only images are allowed." }, { status: 400 })
		}

		const metadata: any = {
			name,
			description,
			image: image,
			external_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://albashsolutions.com"}/nft/${listingId}`,
			attributes: attributes || [],
		}

		const ipfsUrl = await storeNFTMetadata(metadata)
		const tokenURI = createTokenURI(ipfsUrl)

		const { data: mintRecord, error: mintError } = await supabase
			.from("nft_mint_records")
			.insert({
				user_id: user.id,
				listing_id: listingId,
				ipfs_url: ipfsUrl,
				token_uri: tokenURI,
				metadata: metadata,
				status: "pending",
			})
			.select()
			.single()

		if (mintError) console.error("Database error:", mintError)

		return NextResponse.json({ success: true, ipfsUrl, tokenURI, metadata, mintRecordId: mintRecord?.id })
	} catch (error) {
		console.error("NFT minting error:", error)
		return NextResponse.json({ error: "Failed to mint NFT", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
	}
}

export async function GET(request: Request) {
	try {
		const supabase = await createClient()
		const {
			data: { user },
		} = await supabase.auth.getUser()

		if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

		const { searchParams } = new URL(request.url)
		const listingId = searchParams.get("listingId")

		let query = supabase.from("nft_mint_records").select("*").eq("user_id", user.id)
		if (listingId) query = query.eq("listing_id", listingId)

		const { data, error } = await query.order("created_at", { ascending: false })
		if (error) throw error
		return NextResponse.json({ data })
	} catch (error) {
		console.error("Error fetching NFT records:", error)
		return NextResponse.json({ error: "Failed to fetch NFT records" }, { status: 500 })
	}
}
