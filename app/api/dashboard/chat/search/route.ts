import { NextResponse } from "next/server"
import { createDevClient } from "@/lib/supabase/dev-server"
import { createClient } from "@/lib/supabase/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q") || ""

  // Try to use service-role dev client to read auth users (safe in dev)
  try {
    const dev = await createDevClient()
    const usersRes: any = await dev.auth.admin.listUsers({ perPage: 100 })
    const users = usersRes?.data?.users || []

    const filtered = users
      .filter((u: any) => u.last_sign_in_at) // signed-in users only
      .filter((u: any) => {
        if (!q) return true
        const email = u.email || ""
        return (u.user_metadata?.full_name || "" ).toLowerCase().includes(q.toLowerCase()) || email.toLowerCase().includes(q.toLowerCase())
      })
      .slice(0, 50)

    // Map to simple shape; try to include profile info from profiles table
    const results = []
    for (const u of filtered) {
      const { data: profile } = await dev.from("profiles").select("id,full_name,avatar_url,email").eq("id", u.id).single()
      results.push({ id: u.id, email: u.email, full_name: profile?.full_name || u.user_metadata?.full_name || null, avatar_url: profile?.avatar_url || null })
    }

    return NextResponse.json({ users: results })
  } catch (err) {
    // Fallback: query profiles table (limited suitability without service key)
    try {
      const supabase = await createClient()
      const { data } = await supabase.from("profiles").select("id, full_name, avatar_url, email").ilike("full_name", `%${q}%`).limit(50)
      return NextResponse.json({ users: data || [] })
    } catch (e) {
      return NextResponse.json({ users: [] })
    }
  }
}
