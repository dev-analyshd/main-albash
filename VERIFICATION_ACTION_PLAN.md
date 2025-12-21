# Quick Verification System Testing - Action Plan

## Current Status ✅
- TypeScript: Zero errors
- Code: All endpoints created & secured
- Dev Server: Running on localhost:3000
- Documentation: Complete testing guide available

## IMMEDIATE ACTIONS

### BEFORE TESTING - CRITICAL
**You MUST apply the migration first:**

1. Open Supabase Dashboard: https://app.supabase.com
2. Go to SQL Editor → New Query
3. Copy contents of `scripts/015-verification-records-audit.sql`
4. Paste & Run in Supabase
5. Wait for ✅ success confirmation

**Why?** Without the migration, you'll get "table does not exist" errors.

---

## TEST SEQUENCE (30 minutes)

### Phase 1: Submission Flow (5 min)
**Goal:** User can submit verification

Steps:
1. Go to http://localhost:3000/verification
2. Login as test user
3. Fill form (name, document, type, etc.)
4. Upload image (< 2MB, jpg/png)
5. Submit

Expected: ✅ Success message, redirect to dashboard

---

### Phase 2: Admin Review (5 min)
**Goal:** Admin sees pending request

Steps:
1. Logout
2. Login as admin user
3. Go to http://localhost:3000/dashboard/admin/verification

Expected: 
- ✅ Admin page loads
- ✅ See "Pending Requests" section
- ✅ See your test request listed
- ✅ See "Review" button

---

### Phase 3: Approval Flow (5 min)
**Goal:** Admin approves, user gets updated

Steps:
1. Click "Review" on pending request
2. Modal opens - see user details
3. Change status to "Approved"
4. Add feedback (optional)
5. Click "Confirm"

Expected:
- ✅ Modal closes
- ✅ Success toast
- ✅ Request disappears from pending
- ✅ Database updated (see verification checklist below)

---

### Phase 4: Verification (10 min)
**Goal:** Verify all database updates

In Supabase SQL Editor, run these queries:

**Query 1:** Check approval status
```sql
SELECT status, feedback, reviewed_at 
FROM verification_requests 
ORDER BY created_at DESC LIMIT 1;
-- Should show: status='approved'
```

**Query 2:** Check user profile updated
```sql
SELECT is_verified, verification_status, reputation_score 
FROM profiles 
WHERE id = '[test_user_id]';
-- Should show: is_verified=true, verification_status='VERIFIED', reputation_score higher
```

**Query 3:** Check audit record created
```sql
SELECT * FROM verification_records 
ORDER BY created_at DESC LIMIT 1;
-- Should show one record with status='approved'
```

**Query 4:** Check admin audit log
```sql
SELECT * FROM admin_audit_logs 
ORDER BY created_at DESC LIMIT 1;
-- Should show action_type='verification_approved'
```

**Query 5:** Check notification sent
```sql
SELECT title, message FROM notifications 
WHERE type = 'verification' 
ORDER BY created_at DESC LIMIT 1;
-- Should show: "✅ Your Verification is Approved!"
```

---

## SUCCESS CHECKLIST

After all tests:
- [ ] User submission works
- [ ] Admin sees pending requests
- [ ] Approval flow completes
- [ ] All 5 database queries return expected data
- [ ] Notifications sent correctly
- [ ] No console errors
- [ ] TypeScript still clean (`npx tsc --noEmit`)

---

## If Something Fails

**"Table does not exist" error:**
- Migration not applied. Go to Supabase SQL Editor and run migration 015.

**Admin doesn't see requests:**
- Verify admin user has `role='admin'` in profiles table
- Clear browser cache (Ctrl+Shift+Delete) and refresh

**Approval doesn't work:**
- Check browser DevTools → Network tab for API errors
- Verify `/api/admin/verification` endpoint exists
- Check if RPC functions exist in Supabase: Database → Functions

**No database updates:**
- Run Query 1-5 above to see what's actually in database
- Check Supabase logs for errors

---

## Next Phase (After Tests Pass)

Once all tests pass:
1. ✅ Test rejection flow (mark request as "Rejected")
2. ✅ Test "Needs Update" flow
3. ✅ Test multiple approvals simultaneously
4. ✅ Review complete workflow documentation

Then system is **production-ready** ✅

---

## Quick Links
- Dev Server: http://localhost:3000
- Verification Form: http://localhost:3000/verification
- Admin Dashboard: http://localhost:3000/dashboard/admin/verification
- Supabase: https://app.supabase.com
- Testing Guide: See VERIFICATION_TESTING_GUIDE.md
