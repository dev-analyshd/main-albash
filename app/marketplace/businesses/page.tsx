import { ListingsGrid } from "@/components/marketplace/listings-grid"
import type { Listing } from "@/lib/types"

const demoListings: Listing[] = [
  {
    id: "b1",
    user_id: "biz1",
    title: "Organic Coffee Subscription",
    description: "Premium organic coffee beans delivered monthly. Sourced from sustainable farms worldwide.",
    price: 29,
    listing_type: "physical",
    category_id: "physical",
    images: ["/organic-coffee-subscription.jpg"],
    is_verified: true,
    is_tokenized: false,
    token_id: null,
    contract_address: null,
    metadata: {},
    view_count: 2100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "b2",
    user_id: "biz2",
    title: "SaaS Analytics Platform",
    description: "Enterprise-grade analytics platform with real-time dashboards and AI insights.",
    price: 199,
    listing_type: "digital",
    category_id: "technology",
    images: ["/saas-analytics-platform.jpg"],
    is_verified: true,
    is_tokenized: false,
    token_id: null,
    contract_address: null,
    metadata: {},
    view_count: 3500,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "b3",
    user_id: "biz3",
    title: "Professional Photography Services",
    description: "High-quality photography for events, products, and corporate needs.",
    price: 500,
    listing_type: "digital",
    category_id: "services",
    images: ["/professional-photography-services.jpg"],
    is_verified: true,
    is_tokenized: false,
    token_id: null,
    contract_address: null,
    metadata: {},
    view_count: 890,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export default function BusinessesMarketplacePage() {
  return (
    <ListingsGrid
      title="Business Marketplace"
      description="Products and services from verified businesses and companies."
      listings={demoListings}
    />
  )
}
