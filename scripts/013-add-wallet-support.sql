-- Add wallet address support to profiles table
-- This allows users to link blockchain wallets to their accounts

ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS wallet_address TEXT;

-- Create index for faster wallet lookups
CREATE INDEX IF NOT EXISTS idx_profiles_wallet_address ON profiles(wallet_address) WHERE wallet_address IS NOT NULL;

-- Add unique constraint to prevent duplicate wallet addresses
-- Note: This allows NULL values (users without wallets)
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_wallet_address_unique ON profiles(wallet_address) WHERE wallet_address IS NOT NULL;

-- Comment on column
COMMENT ON COLUMN profiles.wallet_address IS 'Ethereum-compatible blockchain wallet address (e.g., MetaMask, WalletConnect)';

