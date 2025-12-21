# Verification System Testing Guide

## Prerequisites
- ✅ Migration 015 applied to Supabase
- ✅ Dev server running on http://localhost:3000
- ✅ Admin user account with role='admin'
- ✅ Test user account for submissions

## Complete Testing Flow

### TEST 1: User Verification Submission
**Goal:** Verify user can submit a verification request

**Steps:**
1. Navigate to http://localhost:3000/verification
2. Login as test user (if not already logged in)
3. Fill in form with:
   - Full Name: "Test User"
   - Email: your test email
   - Document Type: Select from dropdown
   - Business Name: "Test Business"
   - Select verification type
   - Upload valid jpg/png image (< 2MB)
4. Click **Submit**

**Expected Results:**
- ✅ Form submission successful (no error)
- ✅ Redirect to success page or dashboard
- ✅ User sees "Verification request submitted" message
- ✅ Verification request appears in Supabase `verification_requests` table
- ✅ Status should be `VERIFICATION_PENDING` (set by trigger)

**Database Verification:**
```sql
-- In Supabase SQL Editor, run:
SELECT id, user_id, status, verification_type, created_at 
FROM verification_requests 
WHERE status = 'VERIFICATION_PENDING' 
ORDER BY created_at DESC 
LIMIT 5;
```

---

### TEST 2: Admin Dashboard - View Pending Requests
**Goal:** Verify admin can see pending verification requests

**Steps:**
1. Logout from test user account
2. Login as admin user (role='admin')
3. Navigate to http://localhost:3000/dashboard/admin/verification

**Expected Results:**
- ✅ Admin dashboard loads without errors
- ✅ **Pending Requests** section shows the request you just submitted
- ✅ Request displays:
  - User name
  - Verification type
  - Submission date
  - "Review" button
- ✅ Stats show:
  - Pending count = 1 (or more if multiple tests)
  - In Review = 0
  - Total = correct number

**What Should Display:**
```
Verification Management Dashboard
├── Quick Stats
│   ├── Pending: 1
│   ├── In Review: 0
│   └── Total: 1
└── Pending Requests
    └── [Test User] - [verification_type] - [date]
        └── [Review Button]
```

---

### TEST 3: Admin Approval Flow
**Goal:** Verify admin can approve a verification request

**Prerequisites:**
- Admin logged in
- At least one VERIFICATION_PENDING request visible

**Steps:**
1. Click **Review** button on a pending request
2. Review modal opens showing:
   - User details
   - Document image
   - Status dropdown
   - Feedback text area
3. Change status dropdown to **"Approved"**
4. Add optional feedback: "Document verified and valid"
5. Click **Confirm/Submit** button
6. Wait for success message

**Expected Results:**
- ✅ Modal closes
- ✅ Success toast/notification appears
- ✅ Page refreshes automatically
- ✅ Request is no longer in "Pending Requests"
- ✅ Request count decreases

**Database Verification (Run in Supabase SQL Editor):**
```sql
-- Check verification_requests table
SELECT id, user_id, status, feedback, reviewed_at 
FROM verification_requests 
WHERE id = '[paste_the_id_from_test]' 
LIMIT 1;
-- Expected status: 'approved'

-- Check profiles table (user should be verified)
SELECT id, is_verified, verification_status, reputation_score 
FROM profiles 
WHERE id IN (
  SELECT user_id FROM verification_requests 
  WHERE id = '[paste_the_id]'
);
-- Expected: is_verified = true, verification_status = 'VERIFIED', reputation_score increased by 100

-- Check verification_records table (audit)
SELECT id, verifier_id, status, notes, created_at 
FROM verification_records 
WHERE application_id = '[paste_the_id]';
-- Expected: One record with status='approved'

-- Check admin_audit_logs (compliance)
SELECT id, admin_id, action_type, details, created_at 
FROM admin_audit_logs 
WHERE action_type = 'verification_approved' 
ORDER BY created_at DESC 
LIMIT 1;
-- Expected: One entry logged
```

**Notification Check:**
- Test user should receive in-app notification
- (Optional) Check notifications table:
```sql
SELECT id, user_id, title, message, type 
FROM notifications 
WHERE type = 'verification' 
ORDER BY created_at DESC 
LIMIT 1;
-- Expected: "✅ Your Verification is Approved!" notification
```

---

### TEST 4: User Dashboard - Verification Status
**Goal:** Verify user sees updated profile with verification status

**Steps:**
1. Logout from admin
2. Login as the test user who was approved
3. Navigate to user dashboard/profile page
4. Check for verification status badge/indicator

**Expected Results:**
- ✅ Profile shows "✅ Verified" status or similar badge
- ✅ User role may have updated (if applicable)
- ✅ Reputation score increased by 100 points
- ✅ User can see verification status in profile settings

---

### TEST 5: Admin Rejection Flow
**Goal:** Verify rejection workflow

**Prerequisites:**
- Submit a NEW verification request from test user
- Have admin ready to review

**Steps:**
1. Admin reviews new request
2. Change status to **"Rejected"**
3. Add rejection reason: "Document quality insufficient"
4. Click **Confirm**

**Expected Results:**
- ✅ Request status changes to "rejected"
- ✅ User profile shows `verification_status = 'AUTHENTICATED_UNVERIFIED'`
- ✅ User receives rejection notification with reason
- ✅ Verification record created with notes
- ✅ Admin audit log recorded

**Database Verification:**
```sql
-- Check status changed
SELECT status, rejection_reason, feedback 
FROM verification_requests 
WHERE id = '[paste_id]';
-- Expected: status = 'rejected', rejection_reason populated

-- Check user profile reset
SELECT verification_status, is_verified 
FROM profiles 
WHERE id = (SELECT user_id FROM verification_requests WHERE id = '[paste_id]');
-- Expected: verification_status = 'AUTHENTICATED_UNVERIFIED', is_verified = false

-- Check notification sent
SELECT title, message 
FROM notifications 
WHERE reference_id = '[paste_id]' 
ORDER BY created_at DESC 
LIMIT 1;
-- Expected: "❌ Verification Application Rejected"
```

---

### TEST 6: Needs Update Flow
**Goal:** Verify "needs update" status flow

**Steps:**
1. Admin reviews another request
2. Change status to **"Needs Update"**
3. Add feedback: "Please resubmit with higher resolution document"
4. Click **Confirm**

**Expected Results:**
- ✅ Request status = "needs_update"
- ✅ User notified with feedback
- ✅ User can resubmit verification
- ✅ Audit logged

**Database Verification:**
```sql
SELECT status FROM verification_requests WHERE id = '[paste_id]';
-- Expected: status = 'needs_update'
```

---

### TEST 7: Concurrent Admin Actions
**Goal:** Verify system handles multiple approvals

**Steps:**
1. Submit 3-5 different verification requests
2. Admin approves each one
3. Check all processed correctly

**Expected Results:**
- ✅ All approvals process without errors
- ✅ Each user profile updated independently
- ✅ Each gets +100 reputation
- ✅ Each audit log entry created
- ✅ Each gets notification

---

## Debugging / Troubleshooting

### Issue: "Table does not exist" error
**Solution:**
- Migration likely not applied. Run migration 015 in Supabase SQL Editor first.

### Issue: Admin cannot see pending requests
**Possible causes & fixes:**
1. **Admin role not set** - Verify user has `role = 'admin'` in profiles table
   ```sql
   SELECT role FROM profiles WHERE id = '[admin_user_id]';
   ```

2. **No pending requests** - Submit a new verification request first

3. **Filter issue** - Clear browser cache (Ctrl+Shift+Delete) and refresh

### Issue: Approval doesn't update user profile
**Possible causes & fixes:**
1. **RPC function failed** - Check Supabase logs
2. **Foreign key error** - Verify user_id matches between tables
3. **RLS policy blocking** - Verify admin role in policies

### Issue: Notification not received
**Check:**
```sql
SELECT * FROM notifications 
WHERE type = 'verification' 
ORDER BY created_at DESC 
LIMIT 5;
```

### Issue: Audit log not created
**Check:**
```sql
SELECT * FROM admin_audit_logs 
ORDER BY created_at DESC 
LIMIT 5;
```

If empty, RPC function may not have been called. Check API logs in browser DevTools.

---

## Quick Success Checklist

- [ ] Migration 015 applied to Supabase
- [ ] User can submit verification form
- [ ] Admin can see pending requests on dashboard
- [ ] Admin can click Review button
- [ ] Approval changes status to "approved"
- [ ] User profile updated (is_verified = true)
- [ ] Reputation increased by 100 points
- [ ] Verification record created in audit table
- [ ] Admin audit log entry created
- [ ] User receives notification
- [ ] Rejection flow works with different status
- [ ] "Needs Update" status works
- [ ] Multiple approvals don't cause errors
- [ ] No TypeScript compilation errors
- [ ] Dev server running without issues

---

## Performance Notes

- Verification_records table: 4 indexes
- Admin_audit_logs table: 5 indexes
- RLS policies: Optimized for admin/verifier/user access
- RPC functions: Efficient bulk operations

Database should handle 1000s of verification requests without performance issues.
