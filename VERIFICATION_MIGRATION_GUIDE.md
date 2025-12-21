# Verification Migration Application Guide

## Step 1: Apply Migration 015

### Via Supabase Dashboard (Recommended)

1. **Login to Supabase**
   - Go to https://app.supabase.com
   - Select your project

2. **Navigate to SQL Editor**
   - Click on **SQL Editor** in the left sidebar
   - Click **New Query** button

3. **Copy the Migration**
   - Open `scripts/015-verification-records-audit.sql` from your project
   - Select ALL the content (Ctrl+A)
   - Copy (Ctrl+C)

4. **Paste and Execute**
   - Paste the entire SQL into the editor (Ctrl+V)
   - Review the script (it should be 177 lines)
   - Click the **Run** button (or Ctrl+Enter)
   - Wait for success confirmation

5. **Verify Tables Created**
   - In Supabase, go to **Database** → **Tables**
   - Confirm you see:
     - ✅ `verification_records` table
     - ✅ `admin_audit_logs` table

### Via CLI (If Supabase CLI is configured)

```bash
# In your project directory
supabase db push
```

## Step 2: What This Migration Creates

### Tables
- **verification_records**: Tracks all verification decisions
  - `id` (UUID) - Primary key
  - `application_id` (UUID) - Reference to verification_requests
  - `verifier_id` (UUID) - Admin/verifier who reviewed
  - `status` - approval status
  - `notes` - feedback/comments
  - `created_at`, `updated_at` - timestamps

- **admin_audit_logs**: Audit trail of all admin actions
  - `id` (UUID) - Primary key
  - `admin_id` (UUID) - Who performed the action
  - `action_type` - Type of action (e.g., "verification_approved")
  - `target_type` - What was affected (e.g., "verification")
  - `target_id` (UUID) - ID of affected item
  - `details` (JSONB) - Additional context
  - `ip_address`, `user_agent` - Request details
  - `created_at` - Timestamp

### RPC Functions
- **`log_admin_action()`**: Logs admin actions to audit trail
- **`increment_reputation()`**: Safely increments user reputation scores

### Indexes
- 8 indexes created for performance optimization on:
  - application_id, verifier_id, status, created_at, admin_id, action_type, etc.

### Row-Level Security (RLS) Policies
- Admins: Full access to both tables
- Verifiers: Can view/create their records
- Users: Can view their own verification records
- Audit logs: Admin-only access

## Step 3: Test the Flow

Once migration is applied:

### Test 1: User Submission
1. Go to http://localhost:3000/verification
2. Fill out and submit verification form
3. Verify it appears in `/dashboard/admin/verification`

### Test 2: Admin Review & Approval
1. Login as admin user
2. Go to `/dashboard/admin/verification`
3. Click on a pending request
4. Click "Review" button
5. Change status to "Approved"
6. Submit
7. **Verify:**
   - ✅ Request status changed to "approved"
   - ✅ User profile now shows `is_verified=true`
   - ✅ Reputation score increased by 100 points
   - ✅ User receives notification
   - ✅ Admin audit log created

### Test 3: Rejection Flow
1. Repeat with status "Rejected"
2. **Verify:**
   - ✅ Status changed to "rejected"
   - ✅ User profile shows `verification_status=AUTHENTICATED_UNVERIFIED`
   - ✅ User receives rejection notification

### Test 4: Needs Update Flow
1. Repeat with status "Needs Update"
2. **Verify:**
   - ✅ Status shows "needs_update"
   - ✅ User can submit again

## Troubleshooting

### Issue: "Table already exists" error
- **Solution**: The script includes `IF NOT EXISTS` checks, so it's safe to re-run. Error is just a warning.

### Issue: Function error "log_admin_action not found"
- **Solution**: Ensure the migration ran completely. Check that RPC functions appear in Supabase under **Database** → **Functions**.

### Issue: RLS policies blocking inserts
- **Solution**: Verify user has correct role ('admin' or 'verifier') in `profiles.role` column.

### Issue: Verification request shows in DB but not in admin dashboard
- **Solution**: Clear browser cache and do a hard refresh (Ctrl+Shift+R)

## Files Modified/Created

- ✅ `app/api/admin/verification/route.ts` - Admin action endpoint
- ✅ `components/verification/verifier-dashboard.tsx` - Updated to use API
- ✅ `scripts/015-verification-records-audit.sql` - Migration script
- ✅ `VERIFICATION_WORKFLOW.md` - Complete documentation

## Success Checklist

After migration:
- [ ] Tables created in Supabase
- [ ] RPC functions available
- [ ] Can submit verification form
- [ ] Admin can review requests
- [ ] Approval updates user profile
- [ ] User receives notification
- [ ] Audit log records action
- [ ] Reputation increases correctly
