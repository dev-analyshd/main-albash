# Verification System - Complete Workflow Documentation

## Overview
The Albash verification system implements a complete user verification workflow: Submit → Review → Approve/Reject → Confirm.

---

## 1. User Submission Flow

### User Actions
1. **Access Verification Form** → `/verification`
   - User must be authenticated
   - If already verified → redirected to dashboard
   - If pending verification → shows pending status

2. **Fill Enhanced Verification Form**
   - **Step 1: Identity**
     - Full name, country, city, phone
     - Profile photo, national ID, passport
   
   - **Step 2: Role & Department**
     - Select role (builder, student, institution, business, company, organization, creator)
     - Maps to user_role enum: builder, institution, business, company, organization
   
   - **Step 3: Evidence**
     - Work samples, portfolio, certificates, awards
     - Recommendation letters, videos, prototypes
     - Portfolio links
   
   - **Step 4: Questions & Test**
     - 5 open-ended questions (optional test)
   
   - **Step 5: Review & Submit**
     - Confirm truthfulness, accept terms

3. **Submit Verification Request**
   - API: `POST /api/verification`
   - Creates `verification_requests` entry with:
     - `status: "pending"`
     - `form_data`: All submission data (JSONB)
     - `documents`: Uploaded file URLs/metadata
     - `verification_type`: User role (builder, institution, etc.)

4. **Database Trigger Automation**
   - Trigger: `trigger_set_verification_pending`
   - Sets user `verification_status` → `VERIFICATION_PENDING`
   - User can now see "Pending" status in dashboard

---

## 2. Admin Review Flow

### Admin Dashboard Access
- **Route**: `/dashboard/admin/verification`
- **Requirements**: Admin or Verifier role
- **Server-side**: `app/dashboard/admin/verification/page.tsx`

### Admin Actions

1. **View Pending Applications**
   - Fetch from `verification_requests` where `status IN ('pending', 'in_review', 'needs_update')`
   - Display with:
     - Applicant avatar, name, email
     - Verification type, submitted date
     - Status badge (pending, in_review, approved, rejected, needs_update)

2. **Filter & Search**
   - By verification type (builder, institution, business, etc.)
   - By name or email
   - By status

3. **Review Application**
   - Click "Review" to open modal
   - View:
     - Full form data
     - All uploaded documents
     - Answers to questions
     - Test answer (if applicable)

4. **Take Action**
   - **Approve**: Sets status → "approved"
   - **Reject**: Sets status → "rejected"  
   - **Request Update**: Sets status → "needs_update"
   - Add feedback/notes in all cases

### Admin Approval Action Flow

**Component**: `components/verification/verifier-dashboard.tsx`
**Handler**: `handleAction()` function

```typescript
// Calls API endpoint
POST /api/admin/verification
{
  id: string,          // verification_requests.id
  status: string,      // "approved" | "rejected" | "needs_update" | "in_review"
  feedback: string,    // Optional feedback
  rejection_reason: string  // Optional rejection reason
}
```

---

## 3. API Endpoint: POST /api/admin/verification

**Location**: `app/api/admin/verification/route.ts`
**Authentication**: Admin or Verifier role required

### Request Body
```json
{
  "id": "uuid",
  "status": "approved|rejected|needs_update|in_review",
  "feedback": "Optional feedback string",
  "rejection_reason": "Optional reason for rejection"
}
```

### Processing Steps

1. **Validate Request**
   - Check admin/verifier authorization
   - Validate status is valid
   - Find verification request

2. **Update Request Status**
   - `verification_requests.status` → new status
   - `verification_requests.feedback` → feedback (if provided)
   - `verification_requests.rejection_reason` → reason (if rejected)
   - `verification_requests.reviewed_by` → admin user ID
   - `verification_requests.reviewed_at` → current timestamp

3. **Handle Approval Logic** (if status === "approved")
   - Update user profile:
     - `profiles.is_verified` → true
     - `profiles.verification_status` → "VERIFIED"
     - `profiles.role` → verification_type (e.g., "builder")
   - Add reputation:
     - Insert into `reputation_logs` (+100 points)
     - Call `increment_reputation()` RPC

4. **Handle Rejection Logic** (if status === "rejected")
   - Update user profile:
     - `profiles.verification_status` → "AUTHENTICATED_UNVERIFIED"

5. **Handle Needs Update Logic** (if status === "needs_update")
   - User profile stays `VERIFICATION_PENDING`
   - User can resubmit form

6. **Create Verification Record**
   - Insert into `verification_records`:
     - Tracks approval/rejection decisions
     - Links to `verification_requests` and verifier

7. **Send User Notification**
   - Via `notifications` table:
     - **Approved**: "✅ Your Verification is Approved!"
     - **Rejected**: "❌ Verification Application Rejected"
     - **In Review**: "⏳ Verification Review In Progress"

8. **Log Admin Action**
   - RPC: `log_admin_action()`
   - Records: action_type, target, details for audit trail

### Response
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "approved|rejected|needs_update",
    "updated_at": "2024-12-17T..."
  }
}
```

---

## 4. Database Schema

### verification_requests Table
```sql
id (UUID PRIMARY KEY)
user_id (UUID → profiles.id)
verification_type (ENUM user_role)
status (ENUM application_status: pending, in_review, approved, rejected, needs_update)
form_data (JSONB) - All submission data
documents (JSONB) - Array of uploaded file URLs
submitted_at (TIMESTAMPTZ)
reviewed_at (TIMESTAMPTZ) - Null until approval/rejection
reviewed_by (UUID → profiles.id) - Admin/verifier who reviewed
feedback (TEXT) - Notes from reviewer
rejection_reason (TEXT) - Why rejected
created_at, updated_at (TIMESTAMPTZ)
UNIQUE constraint on (user_id, verification_type) WHERE status='pending'
```

### verification_records Table
```sql
id (UUID PRIMARY KEY)
application_id (UUID → verification_requests.id)
verifier_id (UUID → profiles.id)
status (ENUM application_status)
notes (TEXT)
created_at (TIMESTAMPTZ)
```

### profiles Table (Relevant Fields)
```sql
id (UUID PRIMARY KEY)
is_verified (BOOLEAN)
verification_status (ENUM verification_status:
  UNAUTHENTICATED,
  AUTHENTICATED_UNVERIFIED,
  VERIFICATION_PENDING,
  VERIFIED,
  SUSPENDED,
  REVOKED
)
role (ENUM user_role)
reputation_score (INTEGER)
```

### reputation_logs Table
```sql
id (UUID PRIMARY KEY)
user_id (UUID → profiles.id)
points (INTEGER)
reason (TEXT)
event_type (TEXT: 'verification_approved', etc.)
reference_id (UUID) - Links to verification_requests.id
created_at (TIMESTAMPTZ)
```

---

## 5. Automation: Database Triggers

### Trigger 1: `trigger_set_verification_pending`
**Event**: AFTER INSERT on `verification_requests`

```sql
IF NEW.status = 'pending' THEN
  UPDATE profiles
  SET verification_status = 'VERIFICATION_PENDING'
  WHERE id = NEW.user_id
END IF
```

**Purpose**: Mark user as pending verification immediately on submission

---

### Trigger 2: `trigger_update_verification_status`
**Event**: AFTER UPDATE OF status on `verification_requests`

```sql
IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
  UPDATE profiles 
  SET 
    verification_status = 'VERIFIED',
    is_verified = true,
    role = NEW.verification_type,
    reputation_score += 100,
    updated_at = NOW()
  WHERE id = NEW.user_id
  
  INSERT INTO reputation_logs
  VALUES (NEW.user_id, 100, 'Verification approved', 'verification_approved', NEW.id)

ELSIF NEW.status = 'rejected' THEN
  UPDATE profiles
  SET 
    verification_status = 'AUTHENTICATED_UNVERIFIED',
    updated_at = NOW()
  WHERE id = NEW.user_id
END IF
```

**Purpose**: Automatically update user profile when verification is approved/rejected

---

## 6. Complete User Journey

### Timeline

```
User → Submission     → Admin Review → Approval → Confirmation
  ↓                      ↓                ↓           ↓
Fill form          View application  Click approve  User notified
Upload docs        Add feedback       DB updated     Profile updated
Submit request     Click action       Reputation++   Verified badge
  ↓                                    
Status: PENDING
  ↓
trigger_set_verification_pending
  ↓
User profile: VERIFICATION_PENDING
```

---

## 7. Status Flow Diagram

```
UNVERIFIED
    ↓
[Submit Form]
    ↓
VERIFICATION_PENDING (via trigger)
    ↓
[Admin Reviews]
    ├→ [Approve] → VERIFIED (via trigger + RPC)
    │                ↓
    │           is_verified: true
    │           role: updated
    │           reputation+100
    │
    ├→ [Reject] → AUTHENTICATED_UNVERIFIED (via trigger)
    │
    └→ [Request Update] → VERIFICATION_PENDING
                             ↓
                         [User Resubmits]
```

---

## 8. Key Features

✅ **Fully Automated**
- Database triggers handle profile updates
- RPC calls manage reputation
- Notifications sent automatically

✅ **Role-Based Access**
- Only admins/verifiers can review
- Role mapping: student/creator → builder

✅ **Comprehensive Audit Trail**
- All actions logged via `log_admin_action()`
- `verification_records` tracks decisions
- `reputation_logs` tracks points

✅ **User Communication**
- Real-time notifications
- Status visible in dashboard
- Detailed feedback on rejection

✅ **Extensible**
- Support for multiple verification types
- Custom questions per type
- File upload for evidence

---

## 9. Setup Checklist

- ✅ Database migration `009-verification-first-system.sql` applied
- ✅ All tables created with proper enums and indexes
- ✅ Triggers set up for automation
- ✅ RPC function `log_admin_action()` available
- ✅ RPC function `increment_reputation()` available
- ✅ API endpoints working: `/api/verification` (POST, GET), `/api/admin/verification` (PATCH)
- ✅ Admin dashboard at `/dashboard/admin/verification`
- ✅ User form at `/verification`

---

## 10. Testing

### Test User Verification Flow
1. Sign up new user
2. Navigate to `/verification`
3. Fill out form and submit
4. As admin, go to `/dashboard/admin/verification`
5. Review and approve
6. Check user profile → should show VERIFIED status
7. Check reputation_score → should be +100

### Test Rejection Flow
1. Submit verification
2. Admin rejects with reason
3. User notified
4. User profile returns to AUTHENTICATED_UNVERIFIED
5. User can resubmit

---

## API Quick Reference

| Endpoint | Method | Role | Purpose |
|----------|--------|------|---------|
| `/api/verification` | POST | User | Submit verification request |
| `/api/verification` | GET | User | Get user's verification requests |
| `/api/admin/verification` | PATCH | Admin/Verifier | Approve/reject/update application |
| `/dashboard/admin/verification` | GET | Admin/Verifier | View verification queue |

