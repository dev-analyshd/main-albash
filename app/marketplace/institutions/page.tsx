import { ListingsGrid } from "@/components/marketplace/listings-grid"
import type { Listing } from "@/lib/types"

const demoListings: Listing[] = [
  {
    id: "i1",
    user_id: "inst1",
    title: "Online MBA Program",
    description: "Accredited online MBA program with flexible scheduling. Learn from industry experts.",
    price: 2999,
    listing_type: "digital",
    category_id: "educational",
    images: ["/online-mba-program.jpg"],
    is_verified: true,
    is_tokenized: false,
    token_id: null,
    contract_address: null,
    metadata: {},
    view_count: 3200,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "i2",
    user_id: "inst2",
    title: "Data Science Bootcamp",
    description: "12-week intensive bootcamp covering Python, ML, and data visualization.",
    price: 1499,
    listing_type: "digital",
    category_id: "educational",
    images: ["/coding-bootcamp-students.png"],
    is_verified: true,
    is_tokenized: false,
    token_id: null,
    contract_address: null,
    metadata: {},
    view_count: 2800,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "i3",
    user_id: "inst3",
    title: "Digital Marketing Certificate",
    description: "Comprehensive certification program covering SEO, PPC, social media, and analytics.",
    price: 699,
    listing_type: "digital",
    category_id: "educational",
    images: ["/digital-marketing-certificate.jpg"],
    is_verified: true,
    is_tokenized: true,
    token_id: null,
    contract_address: null,
    metadata: {},
    view_count: 1900,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export default function InstitutionsMarketplacePage() {
  return (
    <ListingsGrid
      title="Institution Marketplace"
      description="Educational programs, courses, and certifications from verified institutions."
      listings={demoListings}
    />
  )
}
