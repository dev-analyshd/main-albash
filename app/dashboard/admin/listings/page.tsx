import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ListingManagement } from "@/components/admin/listing-management"

export default async function AdminListingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin") {
    redirect("/dashboard")
  }

  const { data: listings } = await supabase
    .from("listings")
    .select("*, profiles(full_name, email), categories(name)")
    .order("created_at", { ascending: false })

  return <ListingManagement listings={listings || []} />
}
