-- Create payment_methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('card', 'bank', 'crypto')),
  label TEXT,
  holder_name TEXT,
  last_four TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_payment_methods_user ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_default ON payment_methods(user_id, is_default);

-- Enable RLS
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view their payment methods" ON payment_methods;
CREATE POLICY "Users can view their payment methods" ON payment_methods FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create payment methods" ON payment_methods;
CREATE POLICY "Users can create payment methods" ON payment_methods FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their payment methods" ON payment_methods;
CREATE POLICY "Users can update their payment methods" ON payment_methods FOR UPDATE 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their payment methods" ON payment_methods;
CREATE POLICY "Users can delete their payment methods" ON payment_methods FOR DELETE 
  USING (auth.uid() = user_id);
