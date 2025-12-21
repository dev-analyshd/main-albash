"use client"

import { useState } from "react"
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Star, Shield, ShoppingCart } from "lucide-react"

const products = [
  {
    id: 1,
    name: "Premium Verification Badge",
    category: "Badges",
    price: 49,
    image: "/verification-badge-premium-gold.jpg",
    rating: 4.9,
    isVerified: true,
    description: "Stand out with a premium verification badge on your profile.",
  },
  {
    id: 2,
    name: "Studio Pro Tools Pack",
    category: "Tools",
    price: 199,
    image: "/creative-tools-software-pack.jpg",
    rating: 4.8,
    isVerified: true,
    description: "Complete suite of professional creation tools.",
  },
  {
    id: 3,
    name: "Marketplace Boost Package",
    category: "Marketing",
    price: 79,
    image: "/marketing-boost-rocket.jpg",
    rating: 4.7,
    isVerified: true,
    description: "Boost your listings visibility for 30 days.",
  },
  {
    id: 4,
    name: "NFT Minting Credits (10)",
    category: "Blockchain",
    price: 149,
    image: "/nft-minting-blockchain-tokens.jpg",
    rating: 4.9,
    isVerified: true,
    description: "Credits for minting 10 NFTs on the platform.",
  },
  {
    id: 5,
    name: "Business Profile Theme",
    category: "Themes",
    price: 29,
    image: "/business-profile-theme-design.jpg",
    rating: 4.6,
    isVerified: true,
    description: "Professional theme for your business profile.",
  },
  {
    id: 6,
    name: "Mentorship Session (1hr)",
    category: "Services",
    price: 99,
    image: "/mentorship-coaching-session.jpg",
    rating: 5.0,
    isVerified: true,
    description: "One-on-one mentorship with industry experts.",
  },
]

const categories = ["All", "Badges", "Tools", "Marketing", "Blockchain", "Themes", "Services"]

export default function StorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <FadeInUp className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">AlbashSolutions Store</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Premium tools, badges, credits, and services to enhance your experience.
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border sticky top-16 bg-background/95 backdrop-blur z-30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-10 w-full sm:w-80"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <StaggerItem key={product.id}>
                <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="aspect-square relative overflow-hidden bg-secondary/30">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    {product.isVerified && (
                      <Badge className="absolute top-3 left-3 gap-1">
                        <Shield className="h-3 w-3" />
                        Official
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
                    <h3 className="font-semibold mb-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">${product.price}</span>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 fill-chart-4 text-chart-4" />
                        {product.rating}
                      </div>
                    </div>
                    <Button className="w-full mt-4 gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
