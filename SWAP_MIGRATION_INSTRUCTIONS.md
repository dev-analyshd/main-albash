# Swap System Database Migration Instructions

## Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor** from the left sidebar
3. Click **New Query**
4. Copy and paste the entire contents of `scripts/010-add-swap-system.sql`
5. Click **Run** (or press Ctrl+Enter / Cmd+Enter)
6. Verify success - you should see "Success. No rows returned"

## Option 2: Supabase CLI (If Installed)

If you have Supabase CLI installed:

```bash
# Make sure you're logged in
supabase login

# Link to your project (if not already linked)
supabase link --project-ref your-project-ref

# Run the migration
supabase db push --file scripts/010-add-swap-system.sql
```

## Option 3: Direct psql Connection

If you have direct database access:

```bash
psql "postgresql://[user]:[password]@[host]:[port]/[database]" -f scripts/010-add-swap-system.sql
```

## Verification

After running the migration, verify the tables were created:

```sql
-- Check if swap_requests table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'swap%';

-- Check if swap columns were added to listings
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'listings' 
AND column_name LIKE 'swap%';
```

Expected output should show:
- swap_requests
- swap_contracts
- swap_assets
- value_assessments
- ownership_transfers
- upgrade_records
- swap_counter_offers
- swap_disputes

And columns in listings:
- swap_enabled
- accepted_swap_types
- valuation_method
- minimum_reputation
- swap_verification_required

## Troubleshooting

If you encounter errors:

1. **"type already exists"** - This is okay, the script uses `CREATE TYPE IF NOT EXISTS` but some PostgreSQL versions may still show warnings.

2. **"relation already exists"** - The tables might already exist. The script uses `CREATE TABLE IF NOT EXISTS` so this is safe to ignore.

3. **"column already exists"** - The swap columns might already be in the listings table. The script uses `ADD COLUMN IF NOT EXISTS` so this is safe to ignore.

## Next Steps

After successful migration:
1. Test the swap system by creating a listing with swaps enabled
2. Try proposing a swap from another user
3. Verify notifications are working
4. Check admin dashboard for swap management
