-- Fix swap columns in listings table
-- This ensures the swap-related columns exist in the listings table
-- Run this script in Supabase SQL Editor if you encounter "accepted_swap_types column not found" errors

-- Add swap configuration columns to listings table (if they don't exist)
ALTER TABLE listings 
  ADD COLUMN IF NOT EXISTS swap_enabled BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS accepted_swap_types TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS valuation_method TEXT DEFAULT 'fixed',
  ADD COLUMN IF NOT EXISTS minimum_reputation INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS swap_verification_required BOOLEAN DEFAULT TRUE;

-- Add status column if it doesn't exist (for listing status management)
ALTER TABLE listings 
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- Add index for swap-enabled listings for better query performance
CREATE INDEX IF NOT EXISTS idx_listings_swap_enabled ON listings(swap_enabled) WHERE swap_enabled = true;

-- Comment on columns for documentation
COMMENT ON COLUMN listings.swap_enabled IS 'Whether this listing accepts swap proposals';
COMMENT ON COLUMN listings.accepted_swap_types IS 'Array of swap asset types this listing accepts';
COMMENT ON COLUMN listings.valuation_method IS 'Method used to value swaps (fixed, contract, hybrid)';
COMMENT ON COLUMN listings.minimum_reputation IS 'Minimum reputation score required to propose swaps';
COMMENT ON COLUMN listings.swap_verification_required IS 'Whether verification is required to propose swaps';

-- Verify the columns were added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'listings' 
  AND column_name IN ('swap_enabled', 'accepted_swap_types', 'valuation_method', 'minimum_reputation', 'swap_verification_required')
ORDER BY column_name;
