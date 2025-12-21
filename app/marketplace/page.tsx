import { createClient } from "@/lib/supabase/server"
import { ListingsGrid } from "@/components/marketplace/listings-grid"

export default async function MarketplacePage() {
  const supabase = await createClient()

  const { data: listings } = await supabase
    .from("listings")
    .select("*, profiles!listings_user_id_fkey(full_name, avatar_url, reputation_score), categories(name)")
    .eq("is_verified", true)
    .order("created_at", { ascending: false })
    .limit(50)

  return (
    <ListingsGrid
      title="Marketplace"
      description="Discover verified products, services, and digital assets from our trusted community."
      listings={listings || []}
      showCategories
    />
  )
}
