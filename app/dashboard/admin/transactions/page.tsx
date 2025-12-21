import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TransactionManagement } from "@/components/admin/transaction-management"

export default async function AdminTransactionsPage() {
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

  const { data: transactions } = await supabase
    .from("transactions")
    .select(
      `
      *,
      buyer:profiles!transactions_buyer_id_fkey(id, full_name, email),
      seller:profiles!transactions_seller_id_fkey(id, full_name, email),
      listing:listings(id, title)
    `
    )
    .order("created_at", { ascending: false })

  return <TransactionManagement transactions={transactions || []} />
}

