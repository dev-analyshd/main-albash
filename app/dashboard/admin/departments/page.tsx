import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DepartmentManagement } from "@/components/admin/department-management"

export default async function AdminDepartmentsPage() {
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

  const { data: departments } = await supabase.from("departments").select("*").order("created_at", { ascending: false })

  return <DepartmentManagement departments={departments || []} />
}

