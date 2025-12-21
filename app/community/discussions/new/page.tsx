import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NewDiscussionForm } from "@/components/community/new-discussion-form"

export default async function NewDiscussionPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/community/discussions/new")
  }

  return <NewDiscussionForm userId={user.id} />
}
