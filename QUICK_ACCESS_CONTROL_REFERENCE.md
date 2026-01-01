# 🔐 Access Control - Quick Reference Guide

**Use this for adding guards to new routes or protecting new UI components**

---

## Adding a Guard to an API Route

### Step 1: Choose the Right Guard

| Guard Function | Use When | Requires |
|---|---|---|
| `guardMarketplaceAction` | Creating listings, swaps, offers | VERIFIED + marketplace role |
| `guardCommunityAction` | Creating posts, replies, likes | VERIFIED + any role |
| `guardFinancialAction` | Payments, withdrawals, NFT mints | VERIFIED + payment setup |

### Step 2: Add to Your Route

```typescript
// app/api/your/route/route.ts
import { guardMarketplaceAction } from '@/lib/api-guards'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // Step 1: Call guard
  const guard = await guardMarketplaceAction(request as any)
  
  // Step 2: Check authorization
  if (!guard.authorized) {
    return guard.response!  // Returns 401 or 403
  }

  // Step 3: Extract user ID
  const userId = guard.user?.id
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Step 4: Use userId in your logic
  const data = await request.json()
  
  // Your business logic here...
  
  return NextResponse.json({ success: true })
}
```

---

## Protecting a UI Component

### Step 1: Import ProtectedButton

```tsx
import { ProtectedButton } from '@/components/protected-feature'
```

### Step 2: Wrap Your Action Button

**Before:**
```tsx
<button onClick={handleClick} className="btn">
  Click Me
</button>
```

**After:**
```tsx
<ProtectedButton onClick={handleClick} variant="outline">
  Click Me
</ProtectedButton>
```

### Step 3: ProtectedButton Features

```tsx
// Basic usage
<ProtectedButton onClick={handler}>Action</ProtectedButton>

// With styling variants
<ProtectedButton variant="outline" size="sm">Small Button</ProtectedButton>

// With icons
<ProtectedButton className="gap-2">
  <IconComponent /> Action Text
</ProtectedButton>

// Disabled state
<ProtectedButton disabled>Disabled</ProtectedButton>
```

**What it does:**
- ✅ Shows disabled state for unverified users
- ✅ Tooltip: "You must be verified to perform this action"
- ✅ Navigates to verification page on click
- ✅ Supports all Button component variants

---

## Database RLS Pattern

**For user-scoped tables, add this policy:**

```sql
-- Users can only see their own records
CREATE POLICY "Users can view own records"
  ON your_table
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own records
CREATE POLICY "Users can insert own records"
  ON your_table
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own records
CREATE POLICY "Users can update own records"
  ON your_table
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

**For admin access:**

```sql
-- Admins can do everything
CREATE POLICY "Admins can manage all records"
  ON your_table
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_access_control
      WHERE user_id = auth.uid()
      AND user_state = 'ADMIN'
    )
  );
```

---

## Sending Verification Emails

### Notification Templates Available

```typescript
import { emailService } from '@/lib/email-service'

// 1. Notify user of submission
await emailService.sendVerificationSubmittedConfirmation(
  userEmail,
  userName
)

// 2. Alert admins of new submission
const adminEmails = await getAdminEmails()
await emailService.sendVerificationSubmittedToAdmins(
  adminEmails,
  userName,
  userEmail,
  role
)

// 3. Notify user of approval
await emailService.sendVerificationApproved(
  userEmail,
  userName,
  verificationId
)

// 4. Notify user of rejection
await emailService.sendVerificationRejected(
  userEmail,
  userName,
  rejectionReason  // Human-readable message
)
```

### Error Handling Pattern

```typescript
try {
  await emailService.sendVerificationRejected(email, name, reason)
} catch (error) {
  console.warn("Email failed (non-blocking):", error)
  // Don't fail the API request if email fails
}
```

---

## User State Transitions

### Valid State Changes

```
GUEST
  ↓ (login)
AUTHORIZED_UNVERIFIED
  ├─→ (submit verification) → PENDING
  │   ├─→ (admin approves) → VERIFIED
  │   └─→ (admin rejects) → AUTHORIZED_UNVERIFIED
  └─→ stays AUTHORIZED_UNVERIFIED if never submits

VERIFIED
  ├─→ (normal usage) → stays VERIFIED
  └─→ (violate policy) → SUSPENDED

ADMIN (special)
  ├─→ has full access
  └─→ skips verification
```

### Checking User State

```typescript
import { getAuthUser } from '@/lib/auth-server'

const user = await getAuthUser(userId)

if (user.userState === 'GUEST') {
  // Not logged in
}

if (user.userState === 'AUTHORIZED_UNVERIFIED') {
  // Logged in but not verified
  // Show verification prompt
}

if (user.userState === 'VERIFIED') {
  // Fully verified, allow access
}

if (user.userState === 'ADMIN') {
  // Admin user, allow everything
}

if (user.userState === 'SUSPENDED') {
  // User was suspended, deny access
}
```

---

## Testing a New Guard

### Basic Guard Test

```typescript
// __tests__/my-guard.test.ts
import { guardMarketplaceAction } from '@/lib/api-guards'
import { createMockRequest } from '@/test-utils'

describe('guardMarketplaceAction', () => {
  test('rejects unverified users', async () => {
    const request = createMockRequest({
      userId: 'unverified-user-id',
      isVerified: false
    })
    
    const result = await guardMarketplaceAction(request)
    
    expect(result.authorized).toBe(false)
    expect(result.response?.status).toBe(403)
  })

  test('allows verified users', async () => {
    const request = createMockRequest({
      userId: 'verified-user-id',
      isVerified: true,
      role: 'BUILDER'
    })
    
    const result = await guardMarketplaceAction(request)
    
    expect(result.authorized).toBe(true)
    expect(result.user?.id).toBe('verified-user-id')
  })
})
```

### API Route Test

```typescript
// __tests__/my-route.test.ts
import { POST } from '@/app/api/my/route/route'
import { createMockRequest } from '@/test-utils'

describe('POST /api/my/route', () => {
  test('creates item for verified user', async () => {
    const request = createMockRequest({
      userId: 'verified-user-id',
      isVerified: true,
      method: 'POST',
      body: { name: 'Test Item' }
    })
    
    const response = await POST(request)
    
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.success).toBe(true)
  })

  test('blocks unverified user', async () => {
    const request = createMockRequest({
      userId: 'unverified-user-id',
      isVerified: false,
      method: 'POST'
    })
    
    const response = await POST(request)
    
    expect(response.status).toBe(403)
  })
})
```

---

## Common Patterns

### Pattern 1: Route with Guard + User Data

```typescript
export async function POST(request: NextRequest) {
  const guard = await guardCommunityAction(request as any)
  if (!guard.authorized) return guard.response!

  const userId = guard.user?.id
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const data = await request.json()
  
  // Create database record
  const result = await db.table('posts').insert({
    id: generateId(),
    user_id: userId,
    content: data.content,
    created_at: new Date()
  })
  
  return NextResponse.json(result)
}
```

### Pattern 2: Component with ProtectedButton

```tsx
'use client'

import { ProtectedButton } from '@/components/protected-feature'
import { useState } from 'react'

export function MyComponent() {
  const [loading, setLoading] = useState(false)
  
  const handleAction = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/my/route', { method: 'POST' })
      const data = await response.json()
      // Handle success
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <ProtectedButton 
      onClick={handleAction}
      disabled={loading}
    >
      {loading ? 'Processing...' : 'Take Action'}
    </ProtectedButton>
  )
}
```

### Pattern 3: Email on Database Change

```typescript
// In your API route
import { emailService } from '@/lib/email-service'

export async function POST(request: NextRequest) {
  // ... guard check ...

  const userId = guard.user?.id
  
  // Create record
  const result = await db.table('verification_requests').insert({
    user_id: userId,
    status: 'PENDING',
    submitted_at: new Date()
  })

  // Send email (non-blocking)
  const user = await db.table('profiles').findOne({ id: userId })
  try {
    await emailService.sendVerificationSubmittedConfirmation(
      user.email,
      user.name
    )
  } catch (error) {
    console.warn("Email failed:", error)
  }

  return NextResponse.json(result)
}
```

---

## Troubleshooting

### "User is not authorized" (403)

**Check:**
1. User is verified: `user_access_control.user_state = 'VERIFIED'`
2. User has correct role: `user_access_control.verified_role` matches action
3. Guard function is correct for action type

**Fix:**
```sql
SELECT user_id, user_state, verified_role 
FROM user_access_control 
WHERE user_id = 'problematic-user-id';
```

### "Guard function not found" (Error)

**Check:**
1. Import path is correct: `from '@/lib/api-guards'`
2. Guard name matches: `guard[MarketplaceAction|CommunityAction|FinancialAction]`
3. All three guards are exported

**Fix:**
```typescript
// ✅ Correct
import { guardMarketplaceAction } from '@/lib/api-guards'

// ❌ Wrong
import { guard } from '@/lib/api-guards'  // Named import
```

### Email not delivering

**Check:**
1. RESEND_API_KEY is set: `echo $RESEND_API_KEY`
2. Email address is valid
3. Resend dashboard shows delivery status
4. Check spam folder

**Fix:**
```bash
# Verify key is set
echo $RESEND_API_KEY

# Check Resend logs
# https://resend.com/logs
```

---

## Adding Guard to Existing Route

### Find the Route
```bash
find . -path ./node_modules -prune -o -name "route.ts" -type f -print | grep your-feature
```

### Apply Guard
1. Add import: `import { guardXxxAction } from '@/lib/api-guards'`
2. Call guard: `const guard = await guardXxxAction(request as any)`
3. Check: `if (!guard.authorized) return guard.response!`
4. Extract: `const userId = guard.user?.id`
5. Verify: `if (!userId) return NextResponse.json(...)`

### Test
```bash
npm run test -- your-route.test.ts
npx tsc --noEmit
```

---

## File Locations

| What | Where |
|------|-------|
| Guard functions | `lib/api-guards.ts` |
| Email service | `lib/email-service.ts` |
| Email templates | `lib/email-templates.ts` |
| Protected components | `components/protected-feature.tsx` |
| Auth helpers | `lib/auth-server.ts` |
| Tests | `__tests__/access-control.integration.test.ts` |
| Database schema | `DATABASE_MIGRATION_SCRIPT.sql` |
| Types | `lib/access-control.ts` |

---

## Common Commands

```bash
# Check TypeScript errors
npx tsc --noEmit

# Run access control tests
npm run test -- access-control.integration.test.ts

# Start dev server
npm run dev

# View database
# https://supabase.com/dashboard → your-project

# Check email delivery
# https://resend.com/logs
```

---

## Three-Stage Enforcement Summary

1. **AUTHORIZATION** → Is user logged in?
   - ✅ Guard checks `req.headers.get('authorization')`
   - ❌ Returns 401 if not authenticated

2. **VERIFICATION** → Is user approved by admin?
   - ✅ Guard checks `user_access_control.user_state = 'VERIFIED'`
   - ❌ Returns 403 if unverified

3. **INTERACTION** → Does user have role for this action?
   - ✅ Guard checks `verified_role` matches action requirements
   - ❌ Returns 403 if role doesn't match

---

**Remember:** Every user-facing action should be protected. When in doubt, add a guard.
