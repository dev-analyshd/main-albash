-- Drop existing table if it exists
DROP TABLE IF EXISTS transactions CASCADE;

-- Create fresh transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  amount DECIMAL(12, 2),
  currency TEXT DEFAULT 'USD',
  type TEXT,
  status TEXT DEFAULT 'pending',
  payment_method_id UUID,
  listing_id UUID,
  external_reference TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_type ON transactions(type);
