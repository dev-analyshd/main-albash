-- Allow insertions from API in development mode by checking a special context
-- This is a temporary policy to support dev/testing

ALTER POLICY "Users can create listings" ON listings
  USING (auth.uid() = user_id OR (current_setting('app.api_dev_mode', true) = 'true'));

-- Alternative simpler approach: just allow anyone to insert (dev only - remove in production)
-- This should be wrapped in a migration that only runs in development
