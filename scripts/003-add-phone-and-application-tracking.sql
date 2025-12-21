-- Add phone number to profiles if not exists
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_number text;

-- Create index for faster application lookups
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at DESC);

-- Create a public application status view for applicants to check their status
CREATE OR REPLACE VIEW public_application_status AS
SELECT 
  id,
  application_type,
  status,
  title,
  created_at,
  updated_at,
  reviewed_at,
  feedback
FROM applications;

-- Enable RLS on the view
ALTER VIEW public_application_status SET (security_invoker = on);
