import { createClient } from "@/lib/supabase/server"
import { ListingsGrid } from "@/components/marketplace/listings-grid"

export default async function ProductsMarketplacePage() {
  const supabase = await createClient()

  const { data: listings } = await supabase
    .from("listings")
    .select("*, profiles!listings_user_id_fkey(full_name, avatar_url, reputation_score), categories(name)")
    .eq("is_verified", true)
    .in("listing_type", ["physical", "digital"])
    .order("created_at", { ascending: false })
    .limit(50)

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <ListingsGrid
        title="Products Marketplace"
        description="Shop verified physical and digital products from local artisans, businesses, and creators."
        listings={listings || []}
        showCategories
      />
    </div>
  )
}
