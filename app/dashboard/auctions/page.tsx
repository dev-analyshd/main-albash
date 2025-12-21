import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MyAuctionsPage } from "@/components/dashboard/my-auctions-page"

export default async function DashboardAuctionsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user's auctions (as seller)
  const { data: myAuctions } = await supabase
    .from("auctions")
    .select("*, listings(title, image_url)")
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false })

  // Get auctions user has bid on
  const { data: myBids } = await supabase
    .from("bids")
    .select("*, auctions(*, listings(title, image_url))")
    .eq("bidder_id", user.id)
    .order("created_at", { ascending: false })

  return <MyAuctionsPage myAuctions={myAuctions || []} myBids={myBids || []} />
}
