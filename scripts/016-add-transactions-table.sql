-- Step 1: Safely add user_id column to withdrawal_requests (nullable first)
ALTER TABLE IF EXISTS withdrawal_requests
ADD COLUMN IF NOT EXISTS user_id UUID;

-- Step 2: For any existing rows, update user_id from the creator/context
-- This is a placeholder - in production, map existing records properly
UPDATE withdrawal_requests 
SET user_id = (SELECT id FROM profiles LIMIT 1)
WHERE user_id IS NULL;

-- Step 3: Make user_id NOT NULL and add foreign key constraint
ALTER TABLE IF EXISTS withdrawal_requests
ALTER COLUMN user_id SET NOT NULL;

-- Add other missing columns if they don't exist
ALTER TABLE IF EXISTS withdrawal_requests
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';

ALTER TABLE IF EXISTS withdrawal_requests
ADD COLUMN IF NOT EXISTS payment_method_id UUID;

ALTER TABLE IF EXISTS withdrawal_requests
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE IF EXISTS withdrawal_requests
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create indexes for withdrawal_requests if they don't exist
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_user ON withdrawal_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_status ON withdrawal_requests(status);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_created ON withdrawal_requests(created_at DESC);

-- Enable RLS on withdrawal_requests
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for withdrawal_requests table
DROP POLICY IF EXISTS "Users can view their own withdrawals" ON withdrawal_requests;
CREATE POLICY "Users can view their own withdrawals" ON withdrawal_requests FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own withdrawals" ON withdrawal_requests;
CREATE POLICY "Users can create their own withdrawals" ON withdrawal_requests FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their withdrawals" ON withdrawal_requests;
CREATE POLICY "Users can update their withdrawals" ON withdrawal_requests FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create transactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  type TEXT NOT NULL CHECK (type IN ('purchase', 'withdrawal', 'deposit', 'refund')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  payment_method_id UUID REFERENCES payment_methods(id),
  listing_id UUID REFERENCES listings(id),
  external_reference TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_created ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_payment_method ON transactions(payment_method_id);
CREATE INDEX IF NOT EXISTS idx_transactions_listing ON transactions(listing_id);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for transactions table
DROP POLICY IF EXISTS "Users can view their own transactions" ON transactions;
CREATE POLICY "Users can view their own transactions" ON transactions FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own transactions" ON transactions;
CREATE POLICY "Users can create their own transactions" ON transactions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can update transaction status" ON transactions;
CREATE POLICY "System can update transaction status" ON transactions FOR UPDATE 
  USING (true);

-- Add transaction completion trigger
CREATE OR REPLACE FUNCTION update_transactions_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS transactions_update_timestamp ON transactions;
CREATE TRIGGER transactions_update_timestamp
BEFORE UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_transactions_timestamp();

-- Add wallet balance update trigger when transaction completes
CREATE OR REPLACE FUNCTION process_transaction_completion()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Handle different transaction types
    IF NEW.type = 'deposit' THEN
      UPDATE profiles
      SET wallet_balance = wallet_balance + NEW.amount
      WHERE id = NEW.user_id;
    ELSIF NEW.type = 'withdrawal' THEN
      -- Balance already deducted on request
      NULL;
    ELSIF NEW.type = 'refund' THEN
      UPDATE profiles
      SET wallet_balance = wallet_balance + NEW.amount
      WHERE id = NEW.user_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS process_transaction_completion_trigger ON transactions;
CREATE TRIGGER process_transaction_completion_trigger
AFTER UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION process_transaction_completion();
