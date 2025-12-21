-- AlbashSolution Swap System Implementation
-- This script creates all tables and types needed for the Value Swap & Transformation Engine

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Swap status enum
CREATE TYPE swap_status AS ENUM ('pending', 'accepted', 'rejected', 'cancelled', 'completed', 'disputed', 'expired');
CREATE TYPE swap_mode AS ENUM ('direct_swap', 'value_difference', 'contract_based', 'time_based', 'equity_based', 'license_based', 'upgrade_path');
CREATE TYPE swap_asset_type AS ENUM ('idea', 'talent', 'skill', 'product', 'service', 'asset', 'nft', 'equity', 'reputation', 'abstract_value');

-- Add swap configuration columns to listings table
ALTER TABLE listings 
  ADD COLUMN IF NOT EXISTS swap_enabled BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS accepted_swap_types TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS valuation_method TEXT DEFAULT 'fixed',
  ADD COLUMN IF NOT EXISTS minimum_reputation INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS swap_verification_required BOOLEAN DEFAULT TRUE;

-- Swap requests table
CREATE TABLE IF NOT EXISTS swap_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  initiator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  target_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  swap_mode swap_mode NOT NULL,
  status swap_status DEFAULT 'pending',
  
  -- What initiator is offering
  offering_type swap_asset_type NOT NULL,
  offering_listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  offering_description TEXT NOT NULL,
  offering_value DECIMAL(10, 2),
  offering_metadata JSONB DEFAULT '{}',
  
  -- What initiator wants
  requesting_type swap_asset_type NOT NULL,
  requesting_description TEXT NOT NULL,
  requesting_value DECIMAL(10, 2),
  requesting_metadata JSONB DEFAULT '{}',
  
  -- Swap terms
  price_difference DECIMAL(10, 2) DEFAULT 0,
  contract_duration_days INTEGER,
  ownership_transfer_type TEXT,
  usage_rights TEXT,
  upgrade_expectations TEXT,
  terms JSONB DEFAULT '{}',
  
  -- Contract and execution
  contract_hash TEXT,
  escrow_required BOOLEAN DEFAULT FALSE,
  escrow_amount DECIMAL(10, 2),
  smart_contract_address TEXT,
  
  -- Timestamps
  expires_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Swap contracts table (detailed contract terms)
CREATE TABLE IF NOT EXISTS swap_contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  swap_request_id UUID NOT NULL REFERENCES swap_requests(id) ON DELETE CASCADE,
  contract_terms JSONB NOT NULL DEFAULT '{}',
  digital_signature_initiator TEXT,
  digital_signature_target TEXT,
  signed_at_initiator TIMESTAMPTZ,
  signed_at_target TIMESTAMPTZ,
  contract_hash TEXT,
  smart_contract_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(swap_request_id)
);

-- Swap assets table (tracks assets involved in swaps)
CREATE TABLE IF NOT EXISTS swap_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  swap_request_id UUID NOT NULL REFERENCES swap_requests(id) ON DELETE CASCADE,
  asset_type swap_asset_type NOT NULL,
  asset_id UUID,
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  asset_description TEXT NOT NULL,
  asset_value DECIMAL(10, 2),
  asset_metadata JSONB DEFAULT '{}',
  is_locked BOOLEAN DEFAULT FALSE,
  locked_at TIMESTAMPTZ,
  transferred_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Value assessments table (for valuing abstract swaps)
CREATE TABLE IF NOT EXISTS value_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  swap_request_id UUID REFERENCES swap_requests(id) ON DELETE CASCADE,
  assessor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  assessed_item_type swap_asset_type NOT NULL,
  assessed_item_id UUID,
  assessed_value DECIMAL(10, 2) NOT NULL,
  assessment_method TEXT NOT NULL,
  assessment_details JSONB DEFAULT '{}',
  confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ownership transfers table
CREATE TABLE IF NOT EXISTS ownership_transfers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  swap_request_id UUID NOT NULL REFERENCES swap_requests(id) ON DELETE CASCADE,
  asset_id UUID NOT NULL,
  asset_type swap_asset_type NOT NULL,
  from_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  transfer_type TEXT NOT NULL,
  transfer_amount DECIMAL(10, 2),
  transfer_metadata JSONB DEFAULT '{}',
  blockchain_tx_hash TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Upgrade records table (for idea → product transformations)
CREATE TABLE IF NOT EXISTS upgrade_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  original_listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  upgraded_listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  swap_request_id UUID REFERENCES swap_requests(id) ON DELETE SET NULL,
  contributor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  contribution_type TEXT NOT NULL,
  contribution_description TEXT NOT NULL,
  ownership_percentage DECIMAL(5, 2),
  revenue_share_percentage DECIMAL(5, 2),
  upgrade_metadata JSONB DEFAULT '{}',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Swap counter offers table
CREATE TABLE IF NOT EXISTS swap_counter_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  original_swap_request_id UUID NOT NULL REFERENCES swap_requests(id) ON DELETE CASCADE,
  counter_initiator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  counter_terms JSONB NOT NULL DEFAULT '{}',
  status swap_status DEFAULT 'pending',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Swap disputes table
CREATE TABLE IF NOT EXISTS swap_disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  swap_request_id UUID NOT NULL REFERENCES swap_requests(id) ON DELETE CASCADE,
  initiator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  dispute_reason TEXT NOT NULL,
  dispute_details JSONB DEFAULT '{}',
  status TEXT DEFAULT 'open',
  resolved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  resolution TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_swap_requests_initiator ON swap_requests(initiator_id);
CREATE INDEX IF NOT EXISTS idx_swap_requests_target_user ON swap_requests(target_user_id);
CREATE INDEX IF NOT EXISTS idx_swap_requests_target_listing ON swap_requests(target_listing_id);
CREATE INDEX IF NOT EXISTS idx_swap_requests_status ON swap_requests(status);
CREATE INDEX IF NOT EXISTS idx_swap_requests_created_at ON swap_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_swap_assets_swap_request ON swap_assets(swap_request_id);
CREATE INDEX IF NOT EXISTS idx_swap_assets_owner ON swap_assets(owner_id);
CREATE INDEX IF NOT EXISTS idx_ownership_transfers_swap_request ON ownership_transfers(swap_request_id);
CREATE INDEX IF NOT EXISTS idx_upgrade_records_original_listing ON upgrade_records(original_listing_id);
CREATE INDEX IF NOT EXISTS idx_upgrade_records_upgraded_listing ON upgrade_records(upgraded_listing_id);

-- Function to update swap request updated_at timestamp
CREATE OR REPLACE FUNCTION update_swap_request_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update swap request timestamps
DROP TRIGGER IF EXISTS trigger_update_swap_request_updated_at ON swap_requests;
CREATE TRIGGER trigger_update_swap_request_updated_at
  BEFORE UPDATE ON swap_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_swap_request_updated_at();

-- Function to lock assets when swap is accepted
CREATE OR REPLACE FUNCTION lock_swap_assets()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'accepted' AND OLD.status != 'accepted' THEN
    -- Lock offering assets
    UPDATE swap_assets
    SET is_locked = TRUE, locked_at = NOW()
    WHERE swap_request_id = NEW.id AND owner_id = NEW.initiator_id;
    
    -- Lock requesting assets (if listing exists)
    IF NEW.target_listing_id IS NOT NULL THEN
      UPDATE swap_assets
      SET is_locked = TRUE, locked_at = NOW()
      WHERE swap_request_id = NEW.id AND owner_id = NEW.target_user_id;
    END IF;
    
    -- Create ownership transfer records (pending)
    INSERT INTO ownership_transfers (swap_request_id, asset_id, asset_type, from_user_id, to_user_id, transfer_type)
    SELECT 
      NEW.id,
      sa.id,
      sa.asset_type,
      sa.owner_id,
      CASE 
        WHEN sa.owner_id = NEW.initiator_id THEN NEW.target_user_id
        ELSE NEW.initiator_id
      END,
      'swap_transfer'
    FROM swap_assets sa
    WHERE sa.swap_request_id = NEW.id;
    
    -- Send notifications
    INSERT INTO notifications (user_id, title, message, type, reference_id)
    VALUES 
      (NEW.target_user_id, 'Swap Accepted', 'Your swap proposal has been accepted', 'swap_accepted', NEW.id),
      (NEW.initiator_id, 'Swap Accepted', 'Your swap proposal has been accepted', 'swap_accepted', NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to lock assets on swap acceptance
DROP TRIGGER IF EXISTS trigger_lock_swap_assets ON swap_requests;
CREATE TRIGGER trigger_lock_swap_assets
  AFTER UPDATE OF status ON swap_requests
  FOR EACH ROW
  EXECUTE FUNCTION lock_swap_assets();

-- Function to complete swap and update ownership
CREATE OR REPLACE FUNCTION complete_swap_transfer()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Complete ownership transfers
    UPDATE ownership_transfers
    SET completed_at = NOW()
    WHERE swap_request_id = NEW.id AND completed_at IS NULL;
    
    -- Transfer assets
    UPDATE swap_assets
    SET transferred_at = NOW()
    WHERE swap_request_id = NEW.id;
    
    -- Update reputation for both parties
    INSERT INTO reputation_logs (user_id, points, reason, event_type, reference_id)
    VALUES 
      (NEW.initiator_id, 10, 'Successful swap completed', 'swap_completed', NEW.id),
      (NEW.target_user_id, 10, 'Successful swap completed', 'swap_completed', NEW.id);
    
    UPDATE profiles
    SET reputation_score = reputation_score + 10
    WHERE id IN (NEW.initiator_id, NEW.target_user_id);
    
    -- Send completion notifications
    INSERT INTO notifications (user_id, title, message, type, reference_id)
    VALUES 
      (NEW.target_user_id, 'Swap Completed', 'Your swap has been successfully completed', 'swap_completed', NEW.id),
      (NEW.initiator_id, 'Swap Completed', 'Your swap has been successfully completed', 'swap_completed', NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to complete swap transfers
DROP TRIGGER IF EXISTS trigger_complete_swap_transfer ON swap_requests;
CREATE TRIGGER trigger_complete_swap_transfer
  AFTER UPDATE OF status ON swap_requests
  FOR EACH ROW
  EXECUTE FUNCTION complete_swap_transfer();

-- Enable Row Level Security
ALTER TABLE swap_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE swap_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE swap_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE value_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ownership_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE upgrade_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE swap_counter_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE swap_disputes ENABLE ROW LEVEL SECURITY;

