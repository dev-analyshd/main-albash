export type UserRole = "builder" | "institution" | "business" | "company" | "organization" | "verifier" | "admin"
export type ApplicationStatus = "pending" | "in_review" | "approved" | "rejected" | "needs_update"
export type VerificationStatus =
  | "UNAUTHENTICATED"
  | "AUTHENTICATED_UNVERIFIED"
  | "VERIFICATION_PENDING"
  | "VERIFIED"
  | "SUSPENDED"
  | "REVOKED"
export type ListingType = "physical" | "digital" | "tokenized" | "nft" | "tool" | "service" | "idea" | "talent"
export type DepartmentType =
  | "verification"
  | "institution"
  | "business"
  | "blockchain"
  | "reputation"
  | "tech"
  | "idea"
  | "talent"
  | "organization"

export type AuctionStatus = "scheduled" | "active" | "ended" | "cancelled" | "sold"

// Swap system types
export type SwapStatus = "pending" | "accepted" | "rejected" | "cancelled" | "completed" | "disputed" | "expired"
export type SwapMode = 
  | "direct_swap" 
  | "value_difference" 
  | "contract_based" 
  | "time_based" 
  | "equity_based" 
  | "license_based" 
  | "upgrade_path"
export type SwapAssetType = 
  | "idea" 
  | "talent" 
  | "skill" 
  | "product" 
  | "service" 
  | "asset" 
  | "nft" 
  | "equity" 
  | "reputation" 
  | "abstract_value"
export type ValuationMethod = "contract" | "fixed" | "hybrid"

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  bio: string | null
  wallet_address: string | null
  phone_number: string | null
  reputation_score: number
  is_verified: boolean
  verification_status?: VerificationStatus
  created_at: string
  updated_at: string
}

export interface VerificationRequest {
  id: string
  user_id: string
  verification_type: UserRole
  status: ApplicationStatus
  form_data: Record<string, any>
  documents: string[]
  submitted_at: string
  reviewed_at: string | null
  reviewed_by: string | null
  feedback: string | null
  rejection_reason: string | null
  created_at: string
  updated_at: string
}

export interface Department {
  id: string
  name: string
  type: DepartmentType
  description: string | null
  icon: string | null
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  parent_id: string | null
  icon: string | null
  created_at: string
}

export interface Application {
  id: string
  user_id: string
  application_type: UserRole
  title: string
  description: string
  documents: any[]
  status: ApplicationStatus
  department_id: string | null
  assigned_verifier_id: string | null
  feedback: string | null
  submitted_at: string
  reviewed_at: string | null
  created_at: string
  updated_at: string
  tracking_code?: string | null
}

export interface Listing {
  id: string
  user_id: string
  title: string
  description: string
  price: number
  currency?: string
  listing_type: ListingType
  category_id: string | null
  images: string[]
  is_verified: boolean
  is_tokenized: boolean
  token_id: string | null
  contract_address: string | null
  metadata: Record<string, any>
  view_count: number
  created_at: string
  updated_at: string
  // Swap configuration
  swap_enabled?: boolean
  accepted_swap_types?: SwapAssetType[]
  valuation_method?: ValuationMethod
  minimum_reputation?: number
  swap_verification_required?: boolean
  // Joined fields
  user?: Profile
  category?: Category
  auction?: Auction
}

export interface Tool {
  id: string
  name: string
  description: string
  category: string
  icon: string | null
  url: string | null
  is_premium: boolean
  created_at: string
}

export interface ReputationLog {
  id: string
  user_id: string
  points: number
  reason: string
  event_type: string
  reference_id: string | null
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: string
  is_read: boolean
  reference_id: string | null
  created_at: string
}

export interface Program {
  id: string
  title: string
  description: string | null
  program_type: string
  start_date: string | null
  end_date: string | null
  capacity: number | null
  is_active: boolean
  created_at: string
}

export interface Event {
  id: string
  title: string
  description: string | null
  event_type: string
  start_date: string
  end_date: string | null
  location: string | null
  is_virtual: boolean
  max_attendees: number | null
  created_by: string | null
  created_at: string
}

export interface Auction {
  id: string
  listing_id: string
  seller_id: string
  starting_price: number
  reserve_price: number | null
  current_bid: number | null
  current_bidder_id: string | null
  bid_increment: number
  start_time: string
  end_time: string
  status: AuctionStatus
  winner_id: string | null
  final_price: number | null
  created_at: string
  updated_at: string
  // Joined fields
  listing?: Listing
  seller?: Profile
  current_bidder?: Profile
  bids?: AuctionBid[]
  bid_count?: number
}

export interface AuctionBid {
  id: string
  auction_id: string
  bidder_id: string
  amount: number
  is_winning: boolean
  created_at: string
  // Joined fields
  bidder?: Profile
}

// Swap system interfaces
export interface SwapRequest {
  id: string
  initiator_id: string
  target_listing_id: string | null
  target_user_id: string
  swap_mode: SwapMode
  status: SwapStatus
  
  // What initiator is offering
  offering_type: SwapAssetType
  offering_listing_id: string | null
  offering_description: string
  offering_value: number | null
  offering_metadata: Record<string, any>
  
  // What initiator wants
  requesting_type: SwapAssetType
  requesting_description: string
  requesting_value: number | null
  requesting_metadata: Record<string, any>
  
  // Swap terms
  price_difference: number | null
  contract_duration_days: number | null
  ownership_transfer_type: string | null
  usage_rights: string | null
  upgrade_expectations: string | null
  terms: Record<string, any>
  
  // Contract and execution
  contract_hash: string | null
  escrow_required: boolean
  escrow_amount: number | null
  smart_contract_address: string | null
  
  // Timestamps
  expires_at: string | null
  accepted_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
  
  // Joined fields
  initiator?: Profile
  target_user?: Profile
  target_listing?: Listing
  offering_listing?: Listing
}

export interface SwapContract {
  id: string
  swap_request_id: string
  contract_terms: Record<string, any>
  digital_signature_initiator: string | null
  digital_signature_target: string | null
  signed_at_initiator: string | null
  signed_at_target: string | null
  contract_hash: string | null
  smart_contract_address: string | null
  created_at: string
  updated_at: string
}

export interface SwapAsset {
  id: string
  swap_request_id: string
  asset_type: SwapAssetType
  asset_id: string | null
  listing_id: string | null
  owner_id: string
  asset_description: string
  asset_value: number | null
  asset_metadata: Record<string, any>
  is_locked: boolean
  locked_at: string | null
  transferred_at: string | null
  created_at: string
}

export interface OwnershipTransfer {
  id: string
  swap_request_id: string
  asset_id: string
  asset_type: SwapAssetType
  from_user_id: string
  to_user_id: string
  transfer_type: string
  transfer_amount: number | null
  transfer_metadata: Record<string, any>
  blockchain_tx_hash: string | null
  completed_at: string | null
  created_at: string
}

export interface UpgradeRecord {
  id: string
  original_listing_id: string
  upgraded_listing_id: string
  swap_request_id: string | null
  contributor_id: string
  contribution_type: string
  contribution_description: string
  ownership_percentage: number | null
  revenue_share_percentage: number | null
  upgrade_metadata: Record<string, any>
  completed_at: string | null
  created_at: string
}

export interface SwapCounterOffer {
  id: string
  original_swap_request_id: string
  counter_initiator_id: string
  counter_terms: Record<string, any>
  status: SwapStatus
  expires_at: string | null
  created_at: string
  updated_at: string
}

export interface SwapDispute {
  id: string
  swap_request_id: string
  initiator_id: string
  target_user_id: string
  dispute_reason: string
  dispute_details: Record<string, any>
  status: string
  resolved_by: string | null
  resolution: string | null
  resolved_at: string | null
  created_at: string
  updated_at: string
}
