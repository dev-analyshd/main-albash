import { createClient } from "@/lib/supabase/server"
import { ListingsGrid } from "@/components/marketplace/listings-grid"

export default async function BuildersMarketplacePage() {
  const supabase = await createClient()

  // Get listings from users with builder role
  const { data: listings } = await supabase
    .from("listings")
    .select(
      `
      *,
      profiles!listings_user_id_fkey(full_name, avatar_url, reputation_score, role),
      categories(name)
    `,
    )
    .eq("is_verified", true)
    .order("created_at", { ascending: false })
    .limit(50)

  // Filter to only builder listings
  const builderListings = listings?.filter((l) => l.profiles?.role === "builder") || []

  return (
    <ListingsGrid
      title="Builder Marketplace"
      description="Discover innovative ideas, products, and services from verified builders worldwide."
      listings={builderListings}
      showCategories
    />
  )
}
