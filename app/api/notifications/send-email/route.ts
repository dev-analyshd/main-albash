/**
 * API endpoint to send email notifications
 * POST /api/notifications/send-email
 */
import { NextRequest, NextResponse } from "next/server";
import { emailService } from "@/lib/email-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, recipientEmail, userName, ...data } = body;

    // Validate required fields
    if (!type || !recipientEmail || !userName) {
      return NextResponse.json(
        { error: "Missing required fields: type, recipientEmail, userName" },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case "verification_approved":
        result = await emailService.sendVerificationApproved(
          recipientEmail,
          userName,
          data.verificationId
        );
        break;

      case "swap_accepted":
        result = await emailService.sendSwapAccepted(
          recipientEmail,
          userName,
          data.sellerName,
          data.swapId,
          data.itemDetails
        );
        break;

      case "swap_disputed":
        result = await emailService.sendSwapDisputed(
          recipientEmail,
          userName,
          data.swapId,
          data.disputer
        );
        break;

      case "dispute_resolved":
        result = await emailService.sendDisputeResolved(
          recipientEmail,
          userName,
          data.swapId,
          data.resolution // "completed" or "refunded"
        );
        break;

      case "swap_refunded_on_timeout":
        result = await emailService.sendSwapRefundedOnTimeout(
          recipientEmail,
          userName,
          data.swapId
        );
        break;

      default:
        return NextResponse.json(
          { error: `Unknown notification type: ${type}` },
          { status: 400 }
        );
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      type,
    });
  } catch (error) {
    console.error("Notification endpoint error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
