import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TransactionsPage } from "@/components/dashboard/transactions-page"

export default async function DashboardTransactionsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: transactions } = await supabase
    .from("transactions")
    .select(
      `
      *,
      buyer:profiles!transactions_buyer_id_fkey(full_name, avatar_url),
      seller:profiles!transactions_seller_id_fkey(full_name, avatar_url),
      listing:listings(title)
    `,
    )
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order("created_at", { ascending: false })

  return <TransactionsPage transactions={transactions || []} currentUserId={user.id} />
}
