import { createClient } from "@/lib/supabase/server"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

/**
 * Middleware to check if user has active verification
 * Used to protect features that require verification
 */
export async function requireVerification(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        isAuthorized: false,
        user: null,
        profile: null,
        message: "Unauthorized - Please sign in",
      }
    }

    // Get user profile with verification status
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    // Check if user is verified
    const isVerified = profile?.is_verified === true || profile?.verification_status === "VERIFIED"

    if (!isVerified) {
      return {
        isAuthorized: false,
        user,
        profile,
        message: "This feature requires verification. Please complete the verification process.",
      }
    }

    return {
      isAuthorized: true,
      user,
      profile,
      message: null,
    }
  } catch (error) {
    console.error("Verification check error:", error)
    return {
      isAuthorized: false,
      user: null,
      profile: null,
      message: "Error checking verification status",
    }
  }
}

/**
 * Helper function to get user verification status
 */
export async function getVerificationStatus(userId: string) {
  try {
    const supabase = await createClient()

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single()

    const isVerified = profile?.is_verified === true || profile?.verification_status === "VERIFIED"

    return {
      isVerified,
      status: profile?.verification_status || "AUTHENTICATED_UNVERIFIED",
      profile,
    }
  } catch (error) {
    console.error("Error getting verification status:", error)
    return {
      isVerified: false,
      status: "AUTHENTICATED_UNVERIFIED",
      profile: null,
    }
  }
}

/**
 * Check if user has pending verification request
 */
export async function hasPendingVerification(userId: string) {
  try {
    const supabase = await createClient()

    const { data: pendingRequest } = await supabase
      .from("verification_requests")
      .select("*")
      .eq("user_id", userId)
      .in("status", ["pending", "in_review"])
      .maybeSingle()

    return {
      hasPending: !!pendingRequest,
      request: pendingRequest,
    }
  } catch (error) {
    console.error("Error checking pending verification:", error)
    return {
      hasPending: false,
      request: null,
    }
  }
}
