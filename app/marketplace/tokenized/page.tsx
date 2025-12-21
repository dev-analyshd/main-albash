import { ListingsGrid } from "@/components/marketplace/listings-grid"
import type { Listing } from "@/lib/types"

const demoListings: Listing[] = [
  {
    id: "nft1",
    user_id: "artist1",
    title: "Digital Art Collection #1",
    description: "Exclusive digital art piece from the Genesis collection. 1 of 100 editions.",
    price: 0.5,
    listing_type: "nft",
    category_id: "art",
    images: ["/digital-art-nft-collection.jpg"],
    is_verified: true,
    is_tokenized: true,
    token_id: "1001",
    contract_address: "0x123...",
    metadata: { edition: "1/100", chain: "Ethereum" },
    view_count: 5600,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "nft2",
    user_id: "artist2",
    title: "Tokenized Music Rights",
    description: "Own a piece of this hit single. Royalty sharing through smart contracts.",
    price: 0.25,
    listing_type: "nft",
    category_id: "art",
    images: ["/tokenized-music-rights.jpg"],
    is_verified: true,
    is_tokenized: true,
    token_id: "2001",
    contract_address: "0x456...",
    metadata: { royalty: "5%", chain: "Polygon" },
    view_count: 3200,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "nft3",
    user_id: "builder1",
    title: "IdeaNFT - Tech Startup Concept",
    description: "Verified and tokenized startup idea with full documentation and roadmap.",
    price: 2.0,
    listing_type: "nft",
    category_id: "ideas",
    images: ["/tech-startup-idea-nft.jpg"],
    is_verified: true,
    is_tokenized: true,
    token_id: "3001",
    contract_address: "0x789...",
    metadata: { category: "SaaS", chain: "Ethereum" },
    view_count: 1800,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "nft4",
    user_id: "talent1",
    title: "TalentToken - Senior Developer",
    description: "Access 10 hours of senior developer consulting through this talent token.",
    price: 1.5,
    listing_type: "nft",
    category_id: "talents",
    images: ["/talent-token-developer.jpg"],
    is_verified: true,
    is_tokenized: true,
    token_id: "4001",
    contract_address: "0xabc...",
    metadata: { hours: "10", expertise: "Full-stack" },
    view_count: 920,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export default function TokenizedMarketplacePage() {
  return (
    <ListingsGrid
      title="Tokenized & NFT Marketplace"
      description="Discover verified NFTs, tokenized ideas, talents, and digital assets."
      listings={demoListings}
    />
  )
}
