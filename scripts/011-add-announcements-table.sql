-- Announcements table for official platform announcements
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'update', -- 'critical', 'update', 'partnership', 'maintenance'
  priority INTEGER DEFAULT 0, -- Higher number = higher priority
  is_pinned BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  scheduled_at TIMESTAMPTZ, -- For scheduled announcements
  expires_at TIMESTAMPTZ, -- For time-limited announcements
  target_audience TEXT, -- 'all', 'verified', 'unverified', 'specific_role'
  target_role TEXT, -- If target_audience is specific_role
  created_by UUID NOT NULL REFERENCES profiles(id),
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_announcements_active ON announcements(is_active, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_announcements_pinned ON announcements(is_pinned, priority DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_type ON announcements(type);

-- Audit logs table for admin actions
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES profiles(id),
  action_type TEXT NOT NULL, -- 'verification_approved', 'user_banned', 'listing_suspended', etc.
  target_type TEXT NOT NULL, -- 'user', 'listing', 'verification', 'announcement', etc.
  target_id UUID NOT NULL,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin ON admin_audit_logs(admin_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target ON admin_audit_logs(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON admin_audit_logs(action_type, created_at DESC);

-- Function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
  p_admin_id UUID,
  p_action_type TEXT,
  p_target_type TEXT,
  p_target_id UUID,
  p_details JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO admin_audit_logs (admin_id, action_type, target_type, target_id, details)
  VALUES (p_admin_id, p_action_type, p_target_type, p_target_id, p_details)
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql;

-- RLS for announcements (read-only for non-admins)
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Announcements are viewable by everyone" ON announcements
  FOR SELECT
  USING (is_active = true AND (scheduled_at IS NULL OR scheduled_at <= NOW()) AND (expires_at IS NULL OR expires_at > NOW()));

CREATE POLICY "Only admins can manage announcements" ON announcements
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS for audit logs (admins only)
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view audit logs" ON admin_audit_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

