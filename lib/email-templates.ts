/**
 * Email templates for verification and swap notifications
 */

export const emailTemplates = {
  verificationApproved: (userName: string, verificationId: string) => ({
    subject: "🎉 Your Albash Verification Has Been Approved",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">Verification Approved! 🎉</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb; border: 1px solid #e5e7eb;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Hi <strong>${userName}</strong>,
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Great news! Your verification application has been approved by our team. You now have full access to all Albash features, including:
          </p>
          <ul style="color: #374151; font-size: 16px; line-height: 1.8; margin: 20px 0;">
            <li>✅ Marketplace listing and trading</li>
            <li>✅ Direct user messaging</li>
            <li>✅ Swap escrow services</li>
            <li>✅ Community participation</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://albash.com"}/dashboard" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
              Go to Dashboard
            </a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            Verification ID: <code style="background: #e5e7eb; padding: 2px 6px; border-radius: 3px;">${verificationId}</code>
          </p>
        </div>
        <div style="padding: 20px; background: #f3f4f6; font-size: 12px; color: #6b7280; text-align: center; border-radius: 0 0 8px 8px;">
          <p style="margin: 0;">© 2024 Albash. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `Verification Approved!\n\nHi ${userName},\n\nYour verification application has been approved. You now have full access to Albash features.\n\nVerification ID: ${verificationId}\n\nGo to: ${process.env.NEXT_PUBLIC_APP_URL || "https://albash.com"}/dashboard`,
  }),

  swapAccepted: (buyerName: string, sellerName: string, swapId: string, itemDetails: string) => ({
    subject: "✨ Your Swap Offer Was Accepted!",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">Swap Accepted! ✨</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb; border: 1px solid #e5e7eb;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Hi <strong>${buyerName}</strong>,
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Great news! Your swap offer has been accepted by <strong>${sellerName}</strong>.
          </p>
          <div style="background: white; padding: 20px; border: 2px solid #e5e7eb; border-radius: 6px; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;"><strong>Swap Details:</strong></p>
            <p style="color: #374151; font-size: 15px; margin: 0;">${itemDetails}</p>
          </div>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            The swap is now in escrow. Please verify the items and complete the exchange at your convenience.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://albash.com"}/swap-center/${swapId}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
              View Swap Details
            </a>
          </div>
        </div>
        <div style="padding: 20px; background: #f3f4f6; font-size: 12px; color: #6b7280; text-align: center; border-radius: 0 0 8px 8px;">
          <p style="margin: 0;">© 2024 Albash. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `Swap Accepted!\n\nHi ${buyerName},\n\nYour swap offer has been accepted by ${sellerName}.\n\nDetails: ${itemDetails}\n\nView the swap: ${process.env.NEXT_PUBLIC_APP_URL || "https://albash.com"}/swap-center/${swapId}`,
  }),

  swapDisputed: (recipientName: string, swapId: string, disputer: string) => ({
    subject: "⚠️ Swap Dispute Raised",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">Swap Dispute Raised ⚠️</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb; border: 1px solid #e5e7eb;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Hi <strong>${recipientName}</strong>,
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            A dispute has been raised on your swap by <strong>${disputer}</strong>. Our team will review the case within 24 hours.
          </p>
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="color: #92400e; margin: 0;">
              <strong>⚠️ Important:</strong> Do not transfer items until the dispute is resolved. Both parties will be refunded if unable to reach agreement.
            </p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://albash.com"}/swap-center/${swapId}" style="background: #d97706; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
              View Dispute Details
            </a>
          </div>
        </div>
        <div style="padding: 20px; background: #f3f4f6; font-size: 12px; color: #6b7280; text-align: center; border-radius: 0 0 8px 8px;">
          <p style="margin: 0;">© 2024 Albash. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `Swap Dispute Raised\n\nHi ${recipientName},\n\nA dispute has been raised by ${disputer}. Our team will review within 24 hours.\n\nView details: ${process.env.NEXT_PUBLIC_APP_URL || "https://albash.com"}/swap-center/${swapId}`,
  }),

  disputeResolved: (recipientName: string, swapId: string, resolution: "completed" | "refunded") => ({
    subject: resolution === "completed" ? "✅ Swap Completed" : "💰 Swap Refunded",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, ${resolution === "completed" ? "#10b981 0%, #059669 100%" : "#3b82f6 0%, #1d4ed8 100%"}); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">${resolution === "completed" ? "Swap Completed! ✅" : "Swap Refunded 💰"}</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb; border: 1px solid #e5e7eb;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Hi <strong>${recipientName}</strong>,
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            ${resolution === "completed"
              ? "The dispute has been resolved and your swap has been completed successfully."
              : "The dispute has been resolved. Both parties have been refunded per escrow terms."}
          </p>
          <div style="background: white; padding: 15px; border: 2px solid #e5e7eb; border-radius: 6px; margin: 20px 0; text-align: center;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">Status: <strong style="color: ${resolution === "completed" ? "#10b981" : "#3b82f6"};">${resolution === "completed" ? "COMPLETED" : "REFUNDED"}</strong></p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://albash.com"}/swap-center/${swapId}" style="background: ${resolution === "completed" ? "#10b981" : "#3b82f6"}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
              View Details
            </a>
          </div>
        </div>
        <div style="padding: 20px; background: #f3f4f6; font-size: 12px; color: #6b7280; text-align: center; border-radius: 0 0 8px 8px;">
          <p style="margin: 0;">© 2024 Albash. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `${resolution === "completed" ? "Swap Completed" : "Swap Refunded"}\n\nHi ${recipientName},\n\n${resolution === "completed" ? "Your swap has been completed successfully." : "Your swap has been refunded."}\n\nView details: ${process.env.NEXT_PUBLIC_APP_URL || "https://albash.com"}/swap-center/${swapId}`,
  }),

  swapRefundedOnApproval: (recipientName: string, swapId: string) => ({
    subject: "💰 Automatic Refund Issued",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">Automatic Refund Issued 💰</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb; border: 1px solid #e5e7eb;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Hi <strong>${recipientName}</strong>,
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            The dispute on your swap was not resolved within 7 days. Per our escrow terms, both parties have been automatically refunded.
          </p>
          <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="color: #1e40af; margin: 0;">
              Your funds have been returned to your account. Please check your account balance.
            </p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://albash.com"}/dashboard" style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
              Go to Dashboard
            </a>
          </div>
        </div>
        <div style="padding: 20px; background: #f3f4f6; font-size: 12px; color: #6b7280; text-align: center; border-radius: 0 0 8px 8px;">
          <p style="margin: 0;">© 2024 Albash. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `Automatic Refund Issued\n\nHi ${recipientName},\n\nYour swap dispute was not resolved within 7 days. Both parties have been refunded.\n\nYour funds have been returned to your account.`,
  }),
};
