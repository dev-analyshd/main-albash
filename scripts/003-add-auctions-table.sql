-- Create auctions table
CREATE TABLE IF NOT EXISTS auctions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  starting_price DECIMAL(12, 2) NOT NULL,
  reserve_price DECIMAL(12, 2),
  current_bid DECIMAL(12, 2),
  current_bidder_id UUID REFERENCES profiles(id),
  bid_increment DECIMAL(12, 2) DEFAULT 1.00,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'ended', 'cancelled', 'sold')),
  winner_id UUID REFERENCES profiles(id),
  final_price DECIMAL(12, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create auction bids table
CREATE TABLE IF NOT EXISTS auction_bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE,
  bidder_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL,
  is_winning BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create auction watchlist table
CREATE TABLE IF NOT EXISTS auction_watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, auction_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_auctions_status ON auctions(status);
CREATE INDEX IF NOT EXISTS idx_auctions_end_time ON auctions(end_time);
CREATE INDEX IF NOT EXISTS idx_auction_bids_auction ON auction_bids(auction_id);
CREATE INDEX IF NOT EXISTS idx_auction_bids_bidder ON auction_bids(bidder_id);

-- Enable RLS
ALTER TABLE auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE auction_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE auction_watchlist ENABLE ROW LEVEL SECURITY;

-- RLS Policies for auctions
CREATE POLICY "Auctions are viewable by everyone" ON auctions FOR SELECT USING (true);
CREATE POLICY "Users can create auctions for their listings" ON auctions FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Users can update their own auctions" ON auctions FOR UPDATE USING (auth.uid() = seller_id);

-- RLS Policies for bids
CREATE POLICY "Bids are viewable by everyone" ON auction_bids FOR SELECT USING (true);
CREATE POLICY "Authenticated users can place bids" ON auction_bids FOR INSERT WITH CHECK (auth.uid() = bidder_id);

-- RLS Policies for watchlist
CREATE POLICY "Users can view their watchlist" ON auction_watchlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to watchlist" ON auction_watchlist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove from watchlist" ON auction_watchlist FOR DELETE USING (auth.uid() = user_id);
