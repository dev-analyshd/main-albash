# Verification Flow - Complete Guide

## ✅ System Overview

The verification system allows anyone to apply for verification, which provides access to premium features and builds user trust on the platform.

### Key Features:
1. ✅ **Open Application** - All authenticated users can apply for verification
2. ✅ **Admin Management** - Full control over all applications (approve, reject, request updates)
3. ✅ **Immediate Access** - Verified status grants instant access to verification-required tools
4. ✅ **Status Tracking** - Users see real-time status of their application
5. ✅ **Reapplication** - Users can reapply after rejection or updates needed
6. ✅ **Activity Audit** - All actions logged for admin review

---

## 📋 User Verification Flow

### Step 1: User Initiates Verification
**URL:** `/verification`
**Who:** Any authenticated user
**Status:** Redirects to form if not verified yet

**What Happens:**
- User clicks "Get Verified" or visits `/verification`
- System checks if they have an active request (pending/in_review)
- If active request exists → Shows status page
- If no active request → Shows verification form

### Step 2: User Completes Application
**Form Fields:**
- **Step 1 - Identity:** Full name, country, city, phone, ID documents
- **Step 2 - Role:** Select verification type (builder, institution, business, company, organization)
- **Step 3 - Evidence:** Upload work samples, portfolio, credentials, certificates
- **Step 4 - Questions:** Answer 5 security questions
- **Step 5 - Review:** Confirm truthfulness and accept terms

**Verification Types:**
- `builder` - Individual builders, creators, talents
- `institution` - Schools, colleges, educational bodies
- `business` - Small businesses and startups
- `company` - Established companies
- `organization` - NGOs and non-profits

### Step 3: Status Tracking
**User Can See:**
- Current application status (Pending/In Review/Approved/Rejected/Needs Update)
- Date submitted
- Verification type
- Expected review timeline (2-3 business days)

### Step 4: Notification
When admin takes action, user receives notification with:
- ✅ **If Approved:** "Your verification is approved! You now have access to verified features."
- ❌ **If Rejected:** "Your application was not approved. Reason: [provided reason]"
- 📝 **If Needs Update:** "Please update your application with: [requested changes]"

---

## 👨‍💼 Admin Verification Management

### Access
**URL:** `/dashboard/admin/verification`
**Who:** Admin, Verifier roles only
**Check:** `role = 'admin' OR role = 'verifier'`

### Dashboard Features

#### 1. Statistics
- **Pending:** Count of pending applications
- **In Review:** Count of applications being reviewed
- **Approved Today:** Count of applications approved in last 24 hours
- **Total Processed:** Count of all applications reviewed by current admin

#### 2. Filters & Search
**By Status:** Active (Pending + In Review), Pending, In Review, Approved, Rejected, All
**By Type:** All Types, Builder, Institution, Business, Company, Organization
**By Name/Email:** Full-text search

#### 3. Application Review
For each application, admin can see:
- Applicant name, email, avatar
- Verification type
- Current status with badge
- Submission date
- Time in review

#### 4. Actions Available

##### For Pending/In Review Applications:
- **👁️ Review** - View full application details
- **✅ Approve** - Mark as approved, grant access
- **❌ Reject** - Reject with reason
- **🔄 Request Update** - Ask user to provide more information
- **📝 Add Feedback** - Include notes for user

##### For Approved Applications:
- View verification details
- View user profile
- View audit trail

##### For Rejected Applications:
- View rejection reason
- View submitted details
- View user's reapplication if submitted

### Approval Process
**Step 1: Review Application**
- Click on application
- View all submitted documents and information
- Check answers to security questions

**Step 2: Take Action**
```
Status Update Options:
- pending → in_review (start reviewing)
- in_review → approved (verify user)
- in_review → rejected (deny verification)
- in_review → needs_update (request changes)
```

**Step 3: Result**
- ✅ **Approved:**
  - User's `is_verified = true`
  - `verification_status = "VERIFIED"`
  - `role` updated to verification type
  - +100 reputation points awarded
  - Immediate access to verification-required features
  - User notified via notification

- ❌ **Rejected:**
  - `verification_status = "AUTHENTICATED_UNVERIFIED"`
  - User can reapply later
  - Rejection reason visible to user

- 📝 **Needs Update:**
  - `verification_status = "VERIFICATION_PENDING"`
  - User notified to update application
  - User can submit new/revised application

---

## 🔐 Verification-Required Features

Features that require `is_verified = true`:

### Current Protected Features:
1. **Swap Trading** - Only verified users can propose swaps
2. **Discussion Moderator** - Verified status shown on posts
3. **Marketplace Verified Badge** - Verified sellers get badge

### How to Protect New Features:

**Option 1: API Protection**
```typescript
import { requireVerification } from "@/lib/middleware/verification"

export async function POST(request: NextRequest) {
  const { isAuthorized, user, profile, message } = await requireVerification(request)
  
  if (!isAuthorized) {
    return NextResponse.json({ error: message }, { status: 403 })
  }
  
  // Continue with your logic...
}
```

**Option 2: Component Protection**
```typescript
import { getVerificationStatus } from "@/lib/middleware/verification"

const { isVerified, status, profile } = await getVerificationStatus(userId)

if (!isVerified) {
  return <VerificationRequiredMessage />
}
```

**Option 3: Page-Level Protection**
```typescript
// In page.tsx
const { isVerified } = await getVerificationStatus(user.id)

if (!isVerified) {
  redirect("/verification?reason=verification_required")
}
```

---

## 📊 Database Schema

### verification_requests Table
```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to profiles)
- verification_type: user_role enum
- status: application_status enum
  - 'pending': Initial submission
  - 'in_review': Being reviewed by admin
  - 'approved': User is verified
  - 'rejected': Application denied
  - 'needs_update': More info needed
- form_data: JSONB (All submitted information)
- documents: JSONB (File URLs/references)
- submitted_at: Timestamp
- reviewed_at: Timestamp
- reviewed_by: UUID (Foreign Key to profiles - which admin reviewed)
- feedback: Text (For in-process communication)
- rejection_reason: Text (Why rejected)
- created_at: Timestamp
- updated_at: Timestamp

Indexes:
- user_id (for fast lookups)
- status (for filtering)
- verification_type (for statistics)
```

### profiles Changes
```sql
- is_verified: BOOLEAN (Quick check)
- verification_status: enum
  - 'UNAUTHENTICATED': Not logged in
  - 'AUTHENTICATED_UNVERIFIED': Logged in, no verification
  - 'VERIFICATION_PENDING': Application submitted, waiting
  - 'VERIFIED': Approved, has access
  - 'SUSPENDED': Account suspended
  - 'REVOKED': Verification revoked
- role: user_role (Updated when verified)
- reputation_score: +100 when approved
```

---

## 🔄 Verification Lifecycle

```
User Registration
       ↓
Authenticated User Visits /verification
       ↓
[If no active request] → Show Form
       ├─ Fill out application
       ├─ Submit documents
       └─ Click Submit
            ↓
    Profile Status → VERIFICATION_PENDING
    Request Status → pending
            ↓
[In Admin Dashboard]
Admin Reviews Application
       ↓
       ├─ ✅ APPROVE
       │  ├─ is_verified = true
       │  ├─ status = VERIFIED
       │  ├─ +100 reputation
       │  ├─ User notified
       │  └─ Access granted
       │
       ├─ ❌ REJECT
       │  ├─ status = AUTHENTICATED_UNVERIFIED
       │  ├─ Reason sent to user
       │  └─ User can reapply
       │
       └─ 📝 NEEDS_UPDATE
          ├─ status = VERIFICATION_PENDING
          ├─ Changes requested
          └─ User can resubmit
```

---

## 🧪 Testing the Verification Flow

### Test Case 1: User Application
1. ✅ Log in as regular user
2. ✅ Navigate to `/verification`
3. ✅ Fill out application form
4. ✅ Submit verification
5. ✅ See "Under Review" status
6. ✅ Cannot submit another while active

### Test Case 2: Admin Approval
1. ✅ Log in as admin
2. ✅ Go to `/dashboard/admin/verification`
3. ✅ See pending applications
4. ✅ Click application
5. ✅ Review details
6. ✅ Click "Approve"
7. ✅ User receives notification
8. ✅ User now has access to verified features

### Test Case 3: Access Control
1. ✅ Create a feature that requires verification
2. ✅ Unverified user tries to access → Blocked
3. ✅ User applies for verification
4. ✅ Admin approves
5. ✅ User immediately gets access

### Test Case 4: Rejection & Reapplication
1. ✅ Submit verification
2. ✅ Admin rejects with reason
3. ✅ User receives rejection notification
4. ✅ User reapplies
5. ✅ New application appears in queue

---

## 📝 API Endpoints

### User Endpoints

#### POST `/api/verification`
Submit a new verification application
```json
{
  "verificationType": "builder",
  "formData": { ...all form data },
  "documents": ["url1", "url2"]
}
```
Returns: `{ data: verification_request }`

#### GET `/api/verification`
Get user's verification requests
Returns: `{ data: [verification_requests] }`

### Admin Endpoints

#### PATCH `/api/admin/verification`
Update verification status
```json
{
  "id": "request_id",
  "status": "approved|rejected|in_review|needs_update",
  "feedback": "optional message",
  "rejection_reason": "if rejected"
}
```
Returns: `{ success: true, data: { ... } }`

---

## ✅ Implementation Checklist

- [x] User form allows all authenticated users to apply
- [x] Only active (pending/in_review) applications block new submissions
- [x] Rejected users can reapply
- [x] Admin dashboard shows ALL applications (not just pending)
- [x] Admin can approve, reject, or request updates
- [x] Approval immediately sets is_verified = true
- [x] Verified users can access protected features
- [x] Users receive notifications on status changes
- [x] All actions logged in verification_records
- [x] Build successful with no errors

---

## 🚀 Quick Start for Developers

### To Add Verification to a Feature:

1. **API Endpoint:**
```typescript
import { requireVerification } from "@/lib/middleware/verification"

export async function POST(request: NextRequest) {
  const { isAuthorized, user, profile } = await requireVerification(request)
  if (!isAuthorized) return NextResponse.json({ error: "Verification required" }, { status: 403 })
  // Your code here
}
```

2. **Page Component:**
```typescript
import { getVerificationStatus } from "@/lib/middleware/verification"

const { isVerified } = await getVerificationStatus(userId)
if (!isVerified) redirect("/verification?reason=verification_required")
```

3. **Client Component:**
```typescript
if (!profile?.is_verified) {
  return <Button href="/verification">Get Verified</Button>
}
```

---

## 📞 Support

For issues with the verification system:
1. Check user's `verification_status` in profiles table
2. Check for active requests in `verification_requests` table
3. View admin logs in `verification_records` table
4. Check notifications table for delivery status
