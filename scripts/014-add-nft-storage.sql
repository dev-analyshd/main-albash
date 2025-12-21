-- Create NFT Mint Records Table
CREATE TABLE IF NOT EXISTS nft_mint_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  ipfs_url TEXT NOT NULL,
  token_uri TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending', -- pending, minted, failed
  transaction_hash TEXT,
  contract_address TEXT,
  token_id TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_nft_mint_user_id ON nft_mint_records(user_id);
CREATE INDEX IF NOT EXISTS idx_nft_mint_listing_id ON nft_mint_records(listing_id);
CREATE INDEX IF NOT EXISTS idx_nft_mint_status ON nft_mint_records(status);
CREATE INDEX IF NOT EXISTS idx_nft_mint_created_at ON nft_mint_records(created_at);

-- Enable RLS
ALTER TABLE nft_mint_records ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own mint records
CREATE POLICY "Users can view own mint records"
  ON nft_mint_records
  FOR SELECT
  USING (user_id = auth.uid());

-- RLS Policy: Users can only insert their own mint records
CREATE POLICY "Users can insert own mint records"
  ON nft_mint_records
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- RLS Policy: Users can only update their own mint records
CREATE POLICY "Users can update own mint records"
  ON nft_mint_records
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admin can view all records
CREATE POLICY "Admins can view all mint records"
  ON nft_mint_records
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
