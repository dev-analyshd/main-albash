/**
 * Email notification service using Resend
 */
import { Resend } from "resend";
import { emailTemplates } from "@/lib/email-templates";

// Initialize Resend lazily - only when email sending is needed
let resendInstance: Resend | null = null;

function getResend(): Resend {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error(
        "RESEND_API_KEY environment variable is required for email notifications"
      );
    }
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

export const emailService = {
  /**
   * Send verification approved notification
   */
  async sendVerificationApproved(
    userEmail: string,
    userName: string,
    verificationId: string
  ) {
    try {
      const resend = getResend();
      const template = emailTemplates.verificationApproved(userName, verificationId);
      const result = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "noreply@albash.com",
        to: userEmail,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });
      return { success: true, messageId: result.data?.id };
    } catch (error) {
      console.error("Failed to send verification approved email:", error);
      return { success: false, error: String(error) };
    }
  },

  /**
   * Send swap accepted notification to buyer
   */
  async sendSwapAccepted(
    buyerEmail: string,
    buyerName: string,
    sellerName: string,
    swapId: string,
    itemDetails: string
  ) {
    try {
      const resend = getResend();
      const template = emailTemplates.swapAccepted(buyerName, sellerName, swapId, itemDetails);
      const result = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "noreply@albash.com",
        to: buyerEmail,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });
      return { success: true, messageId: result.data?.id };
    } catch (error) {
      console.error("Failed to send swap accepted email:", error);
      return { success: false, error: String(error) };
    }
  },

  /**
   * Send swap disputed notification to both parties
   */
  async sendSwapDisputed(
    recipientEmail: string,
    recipientName: string,
    swapId: string,
    disputer: string
  ) {
    try {
      const resend = getResend();
      const template = emailTemplates.swapDisputed(recipientName, swapId, disputer);
      const result = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "noreply@albash.com",
        to: recipientEmail,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });
      return { success: true, messageId: result.data?.id };
    } catch (error) {
      console.error("Failed to send swap disputed email:", error);
      return { success: false, error: String(error) };
    }
  },

  /**
   * Send dispute resolved notification (completed or refunded)
   */
  async sendDisputeResolved(
    recipientEmail: string,
    recipientName: string,
    swapId: string,
    resolution: "completed" | "refunded"
  ) {
    try {
      const resend = getResend();
      const template = emailTemplates.disputeResolved(recipientName, swapId, resolution);
      const result = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "noreply@albash.com",
        to: recipientEmail,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });
      return { success: true, messageId: result.data?.id };
    } catch (error) {
      console.error("Failed to send dispute resolved email:", error);
      return { success: false, error: String(error) };
    }
  },

  /**
   * Send auto-refund notification on dispute timeout (7 days)
   */
  async sendSwapRefundedOnTimeout(
    recipientEmail: string,
    recipientName: string,
    swapId: string
  ) {
    try {
      const resend = getResend();
      const template = emailTemplates.swapRefundedOnApproval(recipientName, swapId);
      const result = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "noreply@albash.com",
        to: recipientEmail,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });
      return { success: true, messageId: result.data?.id };
    } catch (error) {
      console.error("Failed to send auto-refund email:", error);
      return { success: false, error: String(error) };
    }
  },
};
