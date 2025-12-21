import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ListingDetail } from "@/components/marketplace/listing-detail"

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: listing, error } = await supabase
    .from("listings")
    .select(
      `
      *,
      profiles!listings_user_id_fkey(id, full_name, avatar_url, reputation_score, is_verified, role),
      categories(name, slug)
    `,
    )
    .eq("id", id)
    .single()

  if (error || !listing) {
    notFound()
  }

  // Increment view count
  await supabase
    .from("listings")
    .update({ view_count: (listing.view_count || 0) + 1 })
    .eq("id", id)

  return <ListingDetail listing={listing} />
}
