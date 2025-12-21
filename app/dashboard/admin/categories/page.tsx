import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CategoryManagement } from "@/components/admin/category-management"

export default async function AdminCategoriesPage() {
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

  const { data: categories } = await supabase.from("categories").select("*").order("created_at", { ascending: false })

  return <CategoryManagement categories={categories || []} />
}

