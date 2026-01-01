-- Create verification_requests table for Phase 1
-- Tracks all user verification applications and admin reviews

CREATE TABLE IF NOT EXISTS verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Entity Information
  entity_type VARCHAR(50) NOT NULL,
  -- Values: builder, institution, company, organization, individual, other
  
  -- Documents (stored as S3/Cloudinary URLs)
  document_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  document_types VARCHAR(50)[] DEFAULT ARRAY[]::VARCHAR(50)[],
  -- Examples: id_card, business_registration, passport, tax_id, certificate
  
  -- Application Answers (custom questions per entity type)
  answers JSONB DEFAULT '{}'::jsonb,
  
  -- Status Tracking
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  -- Values: pending, approved, rejected, expired
  
  -- Admin Review
  reviewed_by_admin UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  review_notes TEXT,
  review_date TIMESTAMP WITH TIME ZONE,
  
  -- KYC Information (optional)
  kyc_completed BOOLEAN DEFAULT FALSE,
  kyc_provider VARCHAR(100), -- e.g., 'privy', 'jumio', 'none'
  kyc_reference_id VARCHAR(255),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
  
  -- Constraints
  UNIQUE(user_id, created_at) -- Prevent duplicate pending requests
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_verification_requests_user_id 
  ON verification_requests(user_id);

CREATE INDEX IF NOT EXISTS idx_verification_requests_status 
  ON verification_requests(status);

CREATE INDEX IF NOT EXISTS idx_verification_requests_created_at 
  ON verification_requests(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_verification_requests_reviewed_by 
  ON verification_requests(reviewed_by_admin);

-- ===== Add verification fields to users table =====

-- Check if columns exist before adding (for safety)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='users' AND column_name='verification_status'
  ) THEN
    ALTER TABLE users 
    ADD COLUMN verification_status VARCHAR(50) DEFAULT 'unverified';
    -- Values: unverified, pending, verified, suspended, revoked
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='users' AND column_name='verified_at'
  ) THEN
    ALTER TABLE users 
    ADD COLUMN verified_at TIMESTAMP WITH TIME ZONE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='users' AND column_name='verified_by_admin'
  ) THEN
    ALTER TABLE users 
    ADD COLUMN verified_by_admin UUID REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='users' AND column_name='entity_type'
  ) THEN
    ALTER TABLE users 
    ADD COLUMN entity_type VARCHAR(50);
    -- Values: builder, institution, company, organization, individual
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='users' AND column_name='verification_request_id'
  ) THEN
    ALTER TABLE users 
    ADD COLUMN verification_request_id UUID REFERENCES verification_requests(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='users' AND column_name='blockchain_verified'
  ) THEN
    ALTER TABLE users 
    ADD COLUMN blockchain_verified BOOLEAN DEFAULT FALSE;
  END IF;

END $$;

-- Create index on verification_status
CREATE INDEX IF NOT EXISTS idx_users_verification_status 
  ON users(verification_status);

-- ===== Create admin audit log table =====

CREATE TABLE IF NOT EXISTS admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Action details
  action VARCHAR(100) NOT NULL,
  -- Examples: verify_approve, verify_reject, verify_revoke, verify_suspend
  
  target_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  target_verification_id UUID REFERENCES verification_requests(id) ON DELETE CASCADE,
  
  -- Details as JSON for flexibility
  details JSONB DEFAULT '{}'::jsonb,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Index for audit log searches
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin_id 
  ON admin_audit_log(admin_id);

CREATE INDEX IF NOT EXISTS idx_admin_audit_log_target_user 
  ON admin_audit_log(target_user_id);

CREATE INDEX IF NOT EXISTS idx_admin_audit_log_action 
  ON admin_audit_log(action);

CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created_at 
  ON admin_audit_log(created_at DESC);

-- ===== Row-Level Security (RLS) =====

-- Enable RLS
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Users can only see their own verification requests
CREATE POLICY verification_requests_user_select
  ON verification_requests FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own verification requests
CREATE POLICY verification_requests_user_insert
  ON verification_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Only admins can update verification requests
CREATE POLICY verification_requests_admin_update
  ON verification_requests FOR UPDATE
  USING (auth.uid() IN (
    SELECT id FROM users WHERE is_admin = TRUE
  ));

-- Only admins can select all verification requests
CREATE POLICY verification_requests_admin_select
  ON verification_requests FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM users WHERE is_admin = TRUE
  )
  OR auth.uid() = user_id);

-- Only admins can insert to audit log
CREATE POLICY admin_audit_log_insert
  ON admin_audit_log FOR INSERT
  WITH CHECK (auth.uid() IN (
    SELECT id FROM users WHERE is_admin = TRUE
  ));

-- Only admins can select audit log
CREATE POLICY admin_audit_log_select
  ON admin_audit_log FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM users WHERE is_admin = TRUE
  ));

-- ===== Grant permissions =====

-- Anon users can insert (for signup flow)
GRANT INSERT ON verification_requests TO anon;

-- Authenticated users can select and insert their own
GRANT SELECT, INSERT ON verification_requests TO authenticated;

-- Service role can do anything (for backend)
GRANT ALL ON verification_requests TO service_role;
GRANT ALL ON admin_audit_log TO service_role;
