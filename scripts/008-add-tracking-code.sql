-- Add tracking_code column to applications table
ALTER TABLE applications ADD COLUMN IF NOT EXISTS tracking_code TEXT UNIQUE;

-- Create index for faster lookups by tracking code
CREATE INDEX IF NOT EXISTS idx_applications_tracking_code ON applications(tracking_code);

-- Generate tracking codes for existing applications that don't have one
UPDATE applications
SET tracking_code = 'APP-' || EXTRACT(YEAR FROM created_at) || '-' || UPPER(SUBSTRING(MD5(id::text) FROM 1 FOR 5))
WHERE tracking_code IS NULL;

