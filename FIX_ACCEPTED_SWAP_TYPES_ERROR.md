# Fix: "accepted_swap_types column not found" Error

## Problem
When trying to create a listing, you may encounter this error:
```
Could not find the 'accepted_swap_types' column of 'listings' in the schema cache
```

This happens because the swap system columns haven't been added to your `listings` table yet.

## Solution

### Step 1: Run the Database Migration

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `scripts/012-fix-swap-columns.sql`
5. Click **Run** (or press Ctrl+Enter)

Alternatively, you can run this SQL directly:

```sql
-- Add swap configuration columns to listings table
ALTER TABLE listings 
  ADD COLUMN IF NOT EXISTS swap_enabled BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS accepted_swap_types TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS valuation_method TEXT DEFAULT 'fixed',
  ADD COLUMN IF NOT EXISTS minimum_reputation INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS swap_verification_required BOOLEAN DEFAULT TRUE;

-- Verify columns were added
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'listings' 
  AND column_name IN ('swap_enabled', 'accepted_swap_types', 'valuation_method', 'minimum_reputation', 'swap_verification_required');
```

### Step 2: Refresh Schema Cache

After running the migration:

1. **Option A**: Wait a few seconds - Supabase usually refreshes the schema cache automatically
2. **Option B**: Restart your Next.js development server:
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```
3. **Option C**: Clear Next.js cache:
   ```bash
   rm -rf .next
   npm run dev
   ```

### Step 3: Verify the Fix

After running the migration and refreshing:

1. Try creating a listing again
2. The error should be resolved
3. Swap options should now be available in the listing form

## Code Changes Made

The listing creation code has also been updated to:
- Only include swap fields when swap is enabled
- Handle cases where swap columns might not exist (defensive coding)
- Provide better error messages

## What Columns Were Added?

- `swap_enabled` (BOOLEAN): Whether the listing accepts swaps
- `accepted_swap_types` (TEXT[]): Array of accepted swap asset types
- `valuation_method` (TEXT): How swaps are valued (fixed/contract/hybrid)
- `minimum_reputation` (INTEGER): Minimum reputation required to propose swaps
- `swap_verification_required` (BOOLEAN): Whether verification is required for swaps

All columns have safe defaults, so existing listings won't be affected.

## Still Having Issues?

If the error persists after running the migration:

1. **Check if columns exist**:
   ```sql
   SELECT column_name FROM information_schema.columns 
   WHERE table_name = 'listings' 
   AND column_name LIKE 'swap%';
   ```

2. **Check for typos** in the migration script

3. **Verify you're connected to the correct database** in Supabase

4. **Check Supabase logs** for any error messages during migration

5. **Ensure you have proper permissions** to alter the listings table

