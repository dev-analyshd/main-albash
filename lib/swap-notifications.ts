/**
 * Helper functions to send email notifications for swap events
 * Can be called from API routes or components that handle swap operations
 */
import { emailService } from "@/lib/email-service";
import { createClient } from "@/lib/supabase/server";

/**
 * Send notification when a swap is accepted
 */
export async function notifySwapAccepted(
  buyerId: string,
  sellerId: string,
  swapId: string,
  itemDetails: string
) {
  try {
    const supabase = await createClient();

    // Get buyer info
    const { data: buyerData } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", buyerId)
      .single();

    // Get seller info
    const { data: sellerData } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", sellerId)
      .single();

    if (!buyerData?.email || !sellerData?.full_name) {
      console.warn("Missing buyer email or seller name for swap notification");
      return;
    }

    await emailService.sendSwapAccepted(
      buyerData.email,
      buyerData.full_name || "User",
      sellerData.full_name,
      swapId,
      itemDetails
    );
  } catch (error) {
    console.error("Failed to send swap accepted notification:", error);
    // Don't throw - email failures shouldn't block swap completion
  }
}

/**
 * Send notification when a swap is disputed
 */
export async function notifySwapDisputed(
  swapId: string,
  partyAId: string,
  partyBId: string,
  disputerId: string
) {
  try {
    const supabase = await createClient();

    // Get dispute info
    const { data: disputer } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", disputerId)
      .single();

    const disputerName = disputer?.full_name || "User";

    // Notify party A
    const { data: partyAData } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", partyAId)
      .single();

    if (partyAData?.email) {
      await emailService.sendSwapDisputed(
        partyAData.email,
        partyAData.full_name || "User",
        swapId,
        disputerName
      );
    }

    // Notify party B
    const { data: partyBData } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", partyBId)
      .single();

    if (partyBData?.email) {
      await emailService.sendSwapDisputed(
        partyBData.email,
        partyBData.full_name || "User",
        swapId,
        disputerName
      );
    }
  } catch (error) {
    console.error("Failed to send dispute notification:", error);
  }
}

/**
 * Send notification when a dispute is resolved
 */
export async function notifyDisputeResolved(
  swapId: string,
  partyAId: string,
  partyBId: string,
  resolution: "completed" | "refunded"
) {
  try {
    const supabase = await createClient();

    // Notify party A
    const { data: partyAData } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", partyAId)
      .single();

    if (partyAData?.email) {
      await emailService.sendDisputeResolved(
        partyAData.email,
        partyAData.full_name || "User",
        swapId,
        resolution
      );
    }

    // Notify party B
    const { data: partyBData } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", partyBId)
      .single();

    if (partyBData?.email) {
      await emailService.sendDisputeResolved(
        partyBData.email,
        partyBData.full_name || "User",
        swapId,
        resolution
      );
    }
  } catch (error) {
    console.error("Failed to send dispute resolved notification:", error);
  }
}

/**
 * Send notification when a dispute times out and auto-refund is triggered
 */
export async function notifySwapAutoRefundedOnTimeout(
  swapId: string,
  partyAId: string,
  partyBId: string
) {
  try {
    const supabase = await createClient();

    // Notify party A
    const { data: partyAData } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", partyAId)
      .single();

    if (partyAData?.email) {
      await emailService.sendSwapRefundedOnTimeout(
        partyAData.email,
        partyAData.full_name || "User",
        swapId
      );
    }

    // Notify party B
    const { data: partyBData } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", partyBId)
      .single();

    if (partyBData?.email) {
      await emailService.sendSwapRefundedOnTimeout(
        partyBData.email,
        partyBData.full_name || "User",
        swapId
      );
    }
  } catch (error) {
    console.error("Failed to send auto-refund notification:", error);
  }
}
