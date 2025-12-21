import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Middleware helper to check if user is admin
 * Returns user data if admin, null otherwise
 */
export async function requireAdmin(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { user: null, profile: null, isAdmin: false }
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin") {
    return { user: null, profile: null, isAdmin: false }
  }

  return { user, profile, isAdmin: true }
}

/**
 * API route wrapper for admin-only endpoints
 */
export function withAdminAuth(handler: (request: NextRequest, context: { user: any; profile: any }) => Promise<Response>) {
  return async (request: NextRequest, context?: any) => {
    const { user, profile, isAdmin } = await requireAdmin(request)

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 })
    }

    return handler(request, { user, profile, ...context })
  }
}

/**
 * Check if user is admin or verifier
 */
export async function requireAdminOrVerifier(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { user: null, profile: null, isAuthorized: false }
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin" && profile?.role !== "verifier") {
    return { user: null, profile: null, isAuthorized: false }
  }

  return { user, profile, isAuthorized: true }
}

