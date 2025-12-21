import { createClient } from "@/lib/supabase/server"
import { ListingsGrid } from "@/components/marketplace/listings-grid"

export default async function TalentsMarketplacePage() {
  const supabase = await createClient()

  const { data: listings } = await supabase
    .from("listings")
    .select("*, profiles!listings_user_id_fkey(full_name, avatar_url, reputation_score), categories(name)")
    .eq("is_verified", true)
    .eq("listing_type", "talent")
    .order("created_at", { ascending: false })
    .limit(50)

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <ListingsGrid
        title="Talents Directory"
        description="Connect with skilled craftsmen, professionals, and experts. Hire verified talent for your projects."
        listings={listings || []}
        showCategories
      />
    </div>
  )
}
