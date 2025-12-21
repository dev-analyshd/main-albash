-- Migration: Add missing columns to payment_methods (safe)
BEGIN;

ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS holder_name TEXT;
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS label TEXT;
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS last_four TEXT;
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT FALSE;
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Ensure user_id exists and indexed
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS user_id UUID;
CREATE INDEX IF NOT EXISTS idx_payment_methods_user ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_default ON payment_methods(user_id, is_default);

COMMIT;
