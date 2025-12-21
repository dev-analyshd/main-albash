import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// For development: create a service-role client that bypasses RLS
export async function createDevClient() {
  if (process.env.NODE_ENV !== "development") {
    throw new Error("Dev client only available in development mode")
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase dev config (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)")
  }

  // Service role key bypasses RLS; use carefully and only in dev
  return createServerClient(supabaseUrl, serviceRoleKey, {
    cookies: {
      getAll() {
        // Cookies not used for service role client
        return []
      },
      setAll() {
        // No-op for service role client
      },
    },
  })
}
