# 📧 Email Notifications System - Complete Implementation

## Overview

The Albash email notification system provides automated, production-ready email notifications for critical user events:

- ✅ Verification approvals
- ✅ Swap offer acceptances  
- ✅ Swap disputes
- ✅ Dispute resolutions
- ✅ Automatic dispute refunds (7-day timeout)

## Quick Start

### 1. Set Up Resend Account

1. Go to [resend.com](https://resend.com)
2. Create a free account
3. Get your API key from the dashboard
4. Add to `.env.local`:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Note:** Resend offers 100 free emails/day during development, unlimited for production.

### 2. Deploy Environment Variables

When deploying to production (Vercel, Render, etc.), add the same environment variables to your hosting platform's settings.

## Architecture

### Files Created

```
lib/
├── email-templates.ts          ← Email HTML templates
├── email-service.ts            ← Resend API integration
└── swap-notifications.ts       ← Helper functions for swap events

app/api/notifications/
└── send-email/route.ts         ← API endpoint for sending emails
```

### System Flow

```
User Event
    ↓
API Endpoint Triggered
    ↓
Helper Function Called (optional)
    ↓
Email Service Method Called
    ↓
Template Generated
    ↓
Resend API
    ↓
User Receives Email ✅
```

## API Endpoints

### POST /api/notifications/send-email

Send any notification type programmatically.

**Request Body:**

```json
{
  "type": "verification_approved",
  "recipientEmail": "user@example.com",
  "userName": "John Doe",
  "verificationId": "ver_123"
}
```

**Supported Types:**

| Type | Required Fields | Description |
|------|-----------------|-------------|
| `verification_approved` | `verificationId` | User verification approved |
| `swap_accepted` | `sellerName`, `swapId`, `itemDetails` | Swap offer accepted |
| `swap_disputed` | `swapId`, `disputer` | Swap dispute raised |
| `dispute_resolved` | `swapId`, `resolution` | Dispute resolved (completed/refunded) |
| `swap_refunded_on_timeout` | `swapId` | Auto-refund on 7-day timeout |

**Response:**

```json
{
  "success": true,
  "messageId": "msg_xxxxx",
  "type": "verification_approved"
}
```

## Integration Examples

### Verification Approval Email

Already integrated into `app/api/admin/verification/route.ts`:

```typescript
// Automatically sends email when verification approved
if (status === "approved") {
  const userProfile = await supabase
    .from("profiles")
    .select("email, full_name")
    .eq("id", verificationRequest.user_id)
    .single()

  if (userProfile.data?.email) {
    await emailService.sendVerificationApproved(
      userProfile.data.email,
      userProfile.data.full_name || "User",
      id
    )
  }
}
```

### Swap Accepted Email

Use from your swap acceptance endpoint:

```typescript
import { notifySwapAccepted } from "@/lib/swap-notifications"

// After swap is accepted:
await notifySwapAccepted(
  buyerId,
  sellerId,
  swapId,
  "iPhone 12 ↔ MacBook Pro"
)
```

### Swap Disputed Email

Use from your dispute endpoint:

```typescript
import { notifySwapDisputed } from "@/lib/swap-notifications"

// When swap is disputed:
await notifySwapDisputed(swapId, partyAId, partyBId, disputerId)
```

### Dispute Resolution Email

Use from your dispute resolution endpoint:

```typescript
import { notifyDisputeResolved } from "@/lib/swap-notifications"

// When dispute is resolved:
await notifyDisputeResolved(swapId, partyAId, partyBId, "completed")
// or
await notifyDisputeResolved(swapId, partyAId, partyBId, "refunded")
```

### Auto-Refund on Timeout Email

Use from your dispute timeout handler (7 days):

```typescript
import { notifySwapAutoRefundedOnTimeout } from "@/lib/swap-notifications"

// When 7-day timeout is reached:
await notifySwapAutoRefundedOnTimeout(swapId, partyAId, partyBId)
```

## Email Templates

All emails are professionally designed with:

- ✅ Responsive HTML design
- ✅ Brand colors and styling
- ✅ Clear call-to-action buttons
- ✅ Plain text fallback
- ✅ Mobile-friendly layout
- ✅ Security/warning badges (where appropriate)

### Template List

1. **Verification Approved** - Success email with access confirmation
2. **Swap Accepted** - Notification that offer was accepted
3. **Swap Disputed** - Warning email about dispute and timeline
4. **Dispute Resolved** - Final resolution notification (completed/refunded)
5. **Refunded on Timeout** - Auto-refund notification after 7 days

See [lib/email-templates.ts](../lib/email-templates.ts) for full HTML/text versions.

## Configuration

### Environment Variables Required

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx              # Get from resend.com
RESEND_FROM_EMAIL=noreply@yourdomain.com    # Your sending email
NEXT_PUBLIC_APP_URL=http://localhost:3000   # For email links (not secret)
```

### Optional

```env
NEXT_PUBLIC_SUPPORT_EMAIL=support@yourdomain.com
NEXT_PUBLIC_COMPANY_NAME=Albash Solutions
```

## Error Handling

Email failures are intentionally **non-blocking**:

```typescript
try {
  await emailService.sendVerificationApproved(...)
} catch (error) {
  console.warn("Email failed but won't block operation:", error)
  // Operation continues successfully
}
```

This ensures user experience isn't impacted if email service is temporarily down.

## Testing

### Manual Test via API

```bash
curl -X POST http://localhost:3000/api/notifications/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "type": "verification_approved",
    "recipientEmail": "your-email@example.com",
    "userName": "Test User",
    "verificationId": "test-123"
  }'
```

### With Resend Console

1. Go to [resend.com/logs](https://resend.com/logs)
2. See all sent emails in real-time
3. Check delivery status, open rates, clicks
4. View full email content

## Production Deployment

### Vercel

1. Add environment variables in Vercel dashboard
2. Deploy normally - no additional config needed
3. Emails will use production API key

### Render/Other Platforms

1. Set `RESEND_API_KEY` in environment
2. Set `RESEND_FROM_EMAIL` to your domain email
3. Deploy
4. Test with curl command above

### Email Domain Setup (Optional)

For professional branding, configure a custom domain:

1. In Resend dashboard, add your domain
2. Follow DNS CNAME setup
3. Update `RESEND_FROM_EMAIL` to `noreply@yourdomain.com`
4. Verify domain

## Monitoring

### Email Metrics

Track in Resend dashboard:

- Emails sent
- Delivery rate
- Open rate
- Click rate
- Bounces
- Spam reports

### Server Logs

Check application logs for:

```log
Failed to send verification approved email: Error...
Failed to send dispute notification: Error...
Notification endpoint error: Error...
```

## Future Enhancements

Possible improvements:

- [ ] Email scheduling/batch sends
- [ ] Unsubscribe preferences
- [ ] Email preview in dashboard
- [ ] Custom email templates per tenant
- [ ] A/B testing for subject lines
- [ ] SMS fallback notifications
- [ ] Push notifications

## Support

### Resend Status

Check service status: [status.resend.com](https://status.resend.com)

### Common Issues

**Q: Emails not sending in development**
A: Add valid API key to `.env.local` and restart dev server

**Q: "Invalid recipient email"**
A: Ensure user profile has valid email in database

**Q: Emails going to spam**
A: Set up email domain verification in Resend dashboard

**Q: Rate limiting errors**
A: Free tier has 100/day; upgrade to paid for unlimited

## Summary

✅ **Complete email notification system**
- 5 email templates ready to use
- API endpoint for custom notifications
- Helper functions for common scenarios
- Integration into verification system
- Non-blocking error handling
- Production-ready with Resend

**Status: READY FOR USE** 🚀

To enable: Set `RESEND_API_KEY` and `RESEND_FROM_EMAIL` in `.env.local`
