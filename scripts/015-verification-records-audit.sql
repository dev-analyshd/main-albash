-- Verification Records and Admin Audit System
-- This script adds verification_records table and admin audit logging functions

-- Create verification_records table if not exists
CREATE TABLE IF NOT EXISTS verification_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES verification_requests(id) ON DELETE CASCADE,
  verifier_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  status application_status NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_verification_records_application_id ON verification_records(application_id);
CREATE INDEX IF NOT EXISTS idx_verification_records_verifier_id ON verification_records(verifier_id);
CREATE INDEX IF NOT EXISTS idx_verification_records_status ON verification_records(status);
CREATE INDEX IF NOT EXISTS idx_verification_records_created_at ON verification_records(created_at);

-- Create admin_audit_logs table if not exists
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID,
  target_reference TEXT,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for audit logs
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_admin_id ON admin_audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_action_type ON admin_audit_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_target_type ON admin_audit_logs(target_type);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at ON admin_audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_admin_action ON admin_audit_logs(admin_id, action_type, created_at);

-- RPC function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
  p_admin_id UUID,
  p_action_type TEXT,
  p_target_type TEXT,
  p_target_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT '{}'::JSONB,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO admin_audit_logs (
    admin_id,
    action_type,
    target_type,
    target_id,
    details,
    ip_address,
    user_agent
  ) VALUES (
    p_admin_id,
    p_action_type,
    p_target_type,
    p_target_id,
    p_details,
    p_ip_address,
    p_user_agent
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql;

-- RPC function to increment user reputation
CREATE OR REPLACE FUNCTION increment_reputation(
  user_id UUID,
  points INTEGER
)
RETURNS INTEGER AS $$
DECLARE
  v_new_score INTEGER;
BEGIN
  UPDATE profiles
  SET reputation_score = reputation_score + points,
      updated_at = NOW()
  WHERE id = user_id
  RETURNING reputation_score INTO v_new_score;
  
  RETURN v_new_score;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS on verification_records
ALTER TABLE verification_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for verification_records
-- Admins can view all
CREATE POLICY "Admins can view all verification records" ON verification_records
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Verifiers can view records they created
CREATE POLICY "Verifiers can view their records" ON verification_records
  FOR SELECT
  USING (
    auth.uid() = verifier_id OR
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

-- Users can view their own records
CREATE POLICY "Users can view their verification records" ON verification_records
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM verification_requests WHERE id = application_id
    )
  );

-- Admins/verifiers can insert
CREATE POLICY "Admins and verifiers can create records" ON verification_records
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role IN ('admin', 'verifier')
    )
  );

-- Enable RLS on admin_audit_logs
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_audit_logs (admins only)
CREATE POLICY "Only admins can view audit logs" ON admin_audit_logs
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

CREATE POLICY "Only admins can create audit logs" ON admin_audit_logs
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role IN ('admin', 'verifier')
    )
  );

-- Update trigger for verification_records
CREATE OR REPLACE FUNCTION update_verification_records_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_verification_records_timestamp ON verification_records;
CREATE TRIGGER trigger_update_verification_records_timestamp
  BEFORE UPDATE ON verification_records
  FOR EACH ROW
  EXECUTE FUNCTION update_verification_records_updated_at();

-- Add comments for documentation
COMMENT ON TABLE verification_records IS 'Tracks all verification application decisions and reviews';
COMMENT ON TABLE admin_audit_logs IS 'Audit trail for all admin actions';
COMMENT ON FUNCTION log_admin_action IS 'Logs admin actions for audit trail';
COMMENT ON FUNCTION increment_reputation IS 'Safely increments user reputation score';
