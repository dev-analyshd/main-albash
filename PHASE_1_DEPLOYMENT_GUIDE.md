# Phase 1 Quick Start - Deployment & Testing Guide

## 🚀 Quick Deployment (10 minutes)

### Step 1: Deploy Smart Contract to Testnet (3 min)

```bash
cd contracts

# Compile
npx hardhat compile

# Deploy to Arbitrum Sepolia testnet
npx hardhat run scripts/deploy.js --network arbitrum-sepolia

# Output will show:
# AlbashVerification deployed to: 0x...
```

**Save the contract address** - you'll need it in the next step.

### Step 2: Execute Database Migration (3 min)

**Option A: Via Supabase Dashboard** (Easiest)
1. Go to https://app.supabase.com
2. Select your project
3. Go to SQL Editor
4. Click "New Query"
5. Copy-paste contents of `scripts/017-add-verification-system.sql`
6. Click "Run"

**Option B: Via Command Line**
```bash
# Using psql (if installed)
psql -h db.xkcgbdactkehqmzutizl.supabase.co \
     -U postgres \
     -d postgres \
     -f scripts/017-add-verification-system.sql

# When prompted for password, use your Supabase database password
```

### Step 3: Update Environment Variables (2 min)

Add to `.env.local`:

```env
# Smart contract address from Step 1
NEXT_PUBLIC_VERIFICATION_CONTRACT_ADDRESS=0x... (from deploy output)

# Arbitrum Sepolia RPC
NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC=https://sepolia-rollup.arbitrum.io/rpc
```

### Step 4: Restart Dev Server (2 min)

```bash
# Kill current dev server (Ctrl+C)
# Restart
pnpm run dev
```

---

## 🧪 Testing Phase 1 (15 minutes)

### Test 1: Submit Verification Request

```bash
# Get a user ID from Supabase auth first
# Or use any UUID: 550e8400-e29b-41d4-a716-446655440000

curl -X POST http://localhost:3000/api/verification/request \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "entity_type": "builder",
    "documents": [
      "https://example.com/doc1.pdf",
      "https://example.com/doc2.png"
    ],
    "answers": {
      "What is your GitHub username?": "octocat",
      "What blockchains have you built on?": "Ethereum, Arbitrum",
      "Describe your most recent project": "Built a DEX on Arbitrum"
    }
  }'

# Expected response:
# {
#   "success": true,
#   "request_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
#   "status": "pending",
#   "message": "Verification request submitted successfully"
# }
```

### Test 2: Check Request Status

```bash
# Use the request_id from Test 1
REQUEST_ID="f47ac10b-58cc-4372-a567-0e02b2c3d479"

curl -X GET "http://localhost:3000/api/verification/status/550e8400-e29b-41d4-a716-446655440000"

# Expected response shows pending status
```

### Test 3: List Pending Requests (Admin)

```bash
curl -X GET "http://localhost:3000/api/admin/verification/pending?limit=10&offset=0" \
  -H "Content-Type: application/json"

# Expected response:
# {
#   "success": true,
#   "total": 1,
#   "limit": 10,
#   "offset": 0,
#   "requests": [{
#     "id": "f47ac10b-...",
#     "user_id": "550e8400-...",
#     "entity_type": "builder",
#     "status": "pending",
#     "created_at": "2025-12-28T...",
#     "users": {
#       "email": "user@example.com",
#       "full_name": "Test User"
#     }
#   }]
# }
```

### Test 4: Admin Approves Request

```bash
REQUEST_ID="f47ac10b-58cc-4372-a567-0e02b2c3d479"

curl -X POST "http://localhost:3000/api/admin/verification/$REQUEST_ID/approve" \
  -H "Content-Type: application/json" \
  -d '{
    "review_notes": "All documents verified and legitimate. Full GitHub portfolio reviewed."
  }'

# Expected response:
# {
#   "success": true,
#   "message": "Verification approved successfully",
#   "user_id": "550e8400-...",
#   "status": "verified"
# }
```

### Test 5: Check Verified Status

```bash
curl -X GET "http://localhost:3000/api/verification/status/550e8400-e29b-41d4-a716-446655440000"

# Status should now show:
# {
#   "success": true,
#   "verification": {
#     "status": "verified",
#     "verified_at": "2025-12-28T...",
#     "entity_type": "builder",
#     "blockchain_verified": false,
#     "latest_request": {
#       "status": "approved",
#       "review_notes": "All documents verified..."
#     }
#   }
# }
```

### Test 6: Duplicate Prevention

```bash
# Try submitting again with same user
curl -X POST http://localhost:3000/api/verification/request \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "entity_type": "builder",
    "documents": ["https://example.com/doc.pdf"],
    "answers": {}
  }'

# Expected response (409 Conflict):
# {
#   "error": "User already has a pending or recent verification request"
# }
```

---

## 🔌 Frontend Integration

### Add Verification Pages

Create `app/verification/apply/page.tsx`:
```tsx
import { VerificationForm } from "@/components/verification/verification-form"

export default function ApplyPage() {
  return (
    <div className="container py-12">
      <VerificationForm />
    </div>
  )
}
```

Create `app/verification/status/[userId]/page.tsx`:
```tsx
import { VerificationStatus } from "@/components/verification/verification-status"

export default function StatusPage({ params }: { params: { userId: string } }) {
  return (
    <div className="container py-12">
      <VerificationStatus userId={params.userId} />
    </div>
  )
}
```

Create `app/admin/verification/page.tsx`:
```tsx
import { AdminVerificationPanel } from "@/components/verification/admin-verification-panel"

export default function AdminPage() {
  return (
    <div className="container py-12">
      <AdminVerificationPanel />
    </div>
  )
}
```

---

## 📊 Database Verification

Check if migration worked:

```sql
-- Connect to Supabase and run:

-- Check tables exist
SELECT * FROM information_schema.tables 
WHERE table_name IN ('verification_requests', 'admin_audit_log');

-- Check verification_requests
SELECT COUNT(*) FROM verification_requests;

-- Check users table has new fields
SELECT * FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('verification_status', 'verified_at', 'blockchain_verified');

-- Check indexes exist
SELECT * FROM pg_indexes 
WHERE tablename = 'verification_requests';
```

---

## ✅ Success Checklist

- [ ] Smart contract deployed to testnet
- [ ] Got contract address and saved it
- [ ] Database migration executed successfully
- [ ] Environment variables updated
- [ ] Dev server restarted
- [ ] Can submit verification request (Test 1)
- [ ] Can check request status (Test 2)
- [ ] Admin can list pending requests (Test 3)
- [ ] Admin can approve request (Test 4)
- [ ] Verified status shows correctly (Test 5)
- [ ] Duplicate prevention works (Test 6)
- [ ] Frontend pages created and accessible
- [ ] Database has all required tables

---

## 🐛 Troubleshooting

### Error: "Contract not found at address"
- Make sure you copied the correct address from deploy output
- Check it's deployed to the right network

### Error: "Relation 'verification_requests' does not exist"
- Migration didn't execute successfully
- Try running it again via Supabase SQL Editor
- Check for any SQL errors in the output

### Error: "401 Unauthorized" in admin endpoints
- JWT validation is not yet implemented
- These endpoints are temporary/for testing
- Will be secured in next update

### Error: "User not found" on verification endpoints
- The user_id must be a valid UUID
- Make sure the user exists in Supabase auth

### Port 3000 already in use
```bash
# Kill the process using port 3000
npx kill-port 3000
pnpm run dev
```

---

## 📈 Next Steps

After testing Phase 1:

1. **Add JWT Validation** (Security)
   - Update admin endpoints to validate Supabase tokens
   - Check admin role/permissions

2. **Add Email Notifications**
   - Send email when application submitted
   - Send approval/rejection emails

3. **Integrate with OAuth** (Phase 2)
   - Add Google login
   - Add X (Twitter) login

4. **Add Wallet Login** (Phase 2)
   - MetaMask integration
   - Sync verified status to blockchain

5. **Scale Testing**
   - Test with 100+ users
   - Performance testing on API endpoints

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review logs in browser DevTools (F12)
3. Check terminal output for error messages
4. Verify all environment variables are set correctly
5. Review the main documentation in PHASE_1_VERIFICATION_COMPLETE.md

Good luck! 🚀
