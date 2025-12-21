-- Row Level Security Policies for AlbashSolution

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Departments policies (public read)
CREATE POLICY "Departments are viewable by everyone" ON departments
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage departments" ON departments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Categories policies (public read)
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage categories" ON categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Applications policies
CREATE POLICY "Users can view own applications" ON applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Verifiers can view assigned applications" ON applications
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('verifier', 'admin'))
  );

CREATE POLICY "Users can create applications" ON applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending applications" ON applications
  FOR UPDATE USING (auth.uid() = user_id AND status IN ('pending', 'needs_update'));

CREATE POLICY "Verifiers can update applications" ON applications
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('verifier', 'admin'))
  );

-- Verification records policies
CREATE POLICY "Users can view own verification records" ON verification_records
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM applications WHERE id = application_id AND user_id = auth.uid())
  );

CREATE POLICY "Verifiers can manage verification records" ON verification_records
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('verifier', 'admin'))
  );

-- Listings policies
CREATE POLICY "Verified listings are viewable by everyone" ON listings
  FOR SELECT USING (is_verified = true OR user_id = auth.uid());

CREATE POLICY "Users can create listings" ON listings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own listings" ON listings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own listings" ON listings
  FOR DELETE USING (auth.uid() = user_id);

-- Tools policies (public read)
CREATE POLICY "Tools are viewable by everyone" ON tools
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage tools" ON tools
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can create transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Reputation logs policies
CREATE POLICY "Users can view own reputation logs" ON reputation_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Public reputation logs are viewable" ON reputation_logs
  FOR SELECT USING (true);

-- NFT mints policies
CREATE POLICY "Users can view own mints" ON nft_mints
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own mints" ON nft_mints
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Events policies (public read)
CREATE POLICY "Events are viewable by everyone" ON events
  FOR SELECT USING (true);

CREATE POLICY "Users can create events" ON events
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can update own events" ON events
  FOR UPDATE USING (auth.uid() = created_by);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Users can create comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON comments
  FOR DELETE USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Programs policies (public read)
CREATE POLICY "Programs are viewable by everyone" ON programs
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage programs" ON programs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
