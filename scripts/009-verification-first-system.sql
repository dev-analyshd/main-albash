-- Verification-First System Implementation
-- This script implements the verification-first architecture

-- Add verification_status enum
CREATE TYPE verification_status AS ENUM (
  'UNAUTHENTICATED',
  'AUTHENTICATED_UNVERIFIED',
  'VERIFICATION_PENDING',
  'VERIFIED',
  'SUSPENDED',
  'REVOKED'
);

-- Add verification_status column to profiles if not exists
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_status verification_status DEFAULT 'AUTHENTICATED_UNVERIFIED';

-- Update existing profiles based on is_verified
UPDATE profiles 
SET verification_status = CASE 
  WHEN is_verified = true THEN 'VERIFIED'::verification_status
  ELSE 'AUTHENTICATED_UNVERIFIED'::verification_status
END
WHERE verification_status IS NULL OR verification_status = 'AUTHENTICATED_UNVERIFIED'::verification_status;

-- Create verification_requests table
CREATE TABLE IF NOT EXISTS verification_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  verification_type user_role NOT NULL,
  status application_status DEFAULT 'pending',
  form_data JSONB NOT NULL DEFAULT '{}',
  documents JSONB DEFAULT '[]',
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES profiles(id),
  feedback TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, verification_type, status) WHERE status = 'pending'
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_verification_requests_user_id ON verification_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_requests_status ON verification_requests(status);
CREATE INDEX IF NOT EXISTS idx_verification_requests_type ON verification_requests(verification_type);
CREATE INDEX IF NOT EXISTS idx_profiles_verification_status ON profiles(verification_status);

-- Function to update user verification status when request is approved
CREATE OR REPLACE FUNCTION update_user_verification_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    -- Update user verification status
    UPDATE profiles 
    SET 
      verification_status = 'VERIFIED'::verification_status,
      is_verified = true,
      role = NEW.verification_type,
      updated_at = NOW()
    WHERE id = NEW.user_id;
    
    -- Add reputation points
    INSERT INTO reputation_logs (user_id, points, reason, event_type, reference_id)
    VALUES (NEW.user_id, 100, 'Verification approved', 'verification_approved', NEW.id);
    
    -- Update reputation score
    UPDATE profiles 
    SET reputation_score = reputation_score + 100
    WHERE id = NEW.user_id;
    
  ELSIF NEW.status = 'rejected' AND OLD.status != 'rejected' THEN
    -- Return user to unverified status
    UPDATE profiles 
    SET 
      verification_status = 'AUTHENTICATED_UNVERIFIED'::verification_status,
      updated_at = NOW()
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update verification status
DROP TRIGGER IF EXISTS trigger_update_verification_status ON verification_requests;
CREATE TRIGGER trigger_update_verification_status
  AFTER UPDATE OF status ON verification_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_user_verification_status();

-- Function to set user status to VERIFICATION_PENDING when request is submitted
CREATE OR REPLACE FUNCTION set_verification_pending()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'pending' THEN
    UPDATE profiles 
    SET verification_status = 'VERIFICATION_PENDING'::verification_status
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set pending status on new verification request
DROP TRIGGER IF EXISTS trigger_set_verification_pending ON verification_requests;
CREATE TRIGGER trigger_set_verification_pending
  AFTER INSERT ON verification_requests
  FOR EACH ROW
  EXECUTE FUNCTION set_verification_pending();


