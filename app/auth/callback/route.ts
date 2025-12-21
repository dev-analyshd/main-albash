import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Get user profile to determine redirect
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

      const role = profile?.role || data.user.user_metadata?.role || "builder"
      return NextResponse.redirect(`${origin}/dashboard/${role}`)
    }
  }

  // Return to login page on error
  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_error`)
}
