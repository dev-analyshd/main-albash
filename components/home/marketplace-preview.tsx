"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Star, Shield, Hexagon, Lightbulb, Users, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FadeInUp, SlideIn } from "@/components/ui/motion-wrapper"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const previewListings = {
  ideas: [
    {
      id: 1,
      title: "Smart Leather Inventory System",
      category: "Digital Product",
      price: 150000,
      image: "/leather-inventory-management-system.jpg",
      rating: 4.9,
      isVerified: true,
      isTokenized: false,
      currency: "NGN",
    },
    {
      id: 2,
      title: "Solar-Powered Irrigation Controller",
      category: "AgriTech",
      price: 350000,
      image: "/solar-irrigation-controller-farm.jpg",
      rating: 4.8,
      isVerified: true,
      isTokenized: true,
      currency: "NGN",
    },
    {
      id: 3,
      title: "Hausa Language Learning App",
      category: "EdTech",
      price: 350000,
      image: "/hausa-language-learning-app.jpg",
      rating: 4.7,
      isVerified: true,
      isTokenized: false,
      currency: "NGN",
    },
    {
      id: 4,
      title: "Calligraphy NFT Collection",
      category: "NFT",
      price: 0.5,
      image: "/arabic-calligraphy-nft-art.jpg",
      rating: 4.9,
      isVerified: true,
      isTokenized: true,
      currency: "ETH",
    },
  ],
  talents: [
    {
      id: 5,
      title: "Master Leather Craftsman",
      category: "Leatherworks",
      price: 50000,
      image: "/master-leather-craftsman-artisan.jpg",
      rating: 4.9,
      isVerified: true,
      isTokenized: false,
      currency: "NGN",
    },
    {
      id: 6,
      title: "Traditional Embroidery Specialist",
      category: "Tailoring",
      price: 45000,
      image: "/traditional-embroidery-specialist.jpg",
      rating: 4.8,
      isVerified: true,
      isTokenized: false,
      currency: "NGN",
    },
    {
      id: 7,
      title: "Arabic Calligrapher",
      category: "Artwork",
      price: 40000,
      image: "/arabic-calligraphy-artist.jpg",
      rating: 4.9,
      isVerified: true,
      isTokenized: false,
      currency: "NGN",
    },
    {
      id: 8,
      title: "Traditional Cuisine Chef",
      category: "Food & Culinary",
      price: 45000,
      image: "/traditional-nigerian-chef.jpg",
      rating: 4.7,
      isVerified: true,
      isTokenized: false,
      currency: "NGN",
    },
  ],
  products: [
    {
      id: 9,
      title: "Handcrafted Leather Briefcase",
      category: "Leatherworks",
      price: 75000,
      image: "/handcrafted-leather-briefcase-kano.jpg",
      rating: 4.9,
      isVerified: true,
      isTokenized: false,
      currency: "NGN",
    },
    {
      id: 10,
      title: "Embroidered Agbada Set",
      category: "Fashion",
      price: 150000,
      image: "/embroidered-agbada-nigerian.jpg",
      rating: 4.8,
      isVerified: true,
      isTokenized: false,
      currency: "NGN",
    },
    {
      id: 11,
      title: "Premium Kilishi (500g)",
      category: "Traditional Food",
      price: 8000,
      image: "/kilishi-nigerian-beef-jerky.jpg",
      rating: 4.9,
      isVerified: true,
      isTokenized: false,
      currency: "NGN",
    },
    {
      id: 12,
      title: "Arabic Calligraphy Wall Art",
      category: "Artwork",
      price: 55000,
      image: "/arabic-calligraphy-wall-art.jpg",
      rating: 4.8,
      isVerified: true,
      isTokenized: true,
      currency: "NGN",
    },
  ],
}

function formatPrice(price: number, currency: string) {
  if (currency === "ETH") return `${price} ETH`
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(price)
}

function ListingCard({ listing, index }: { listing: (typeof previewListings.ideas)[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group bg-card rounded-xl border border-border overflow-hidden transition-shadow hover:shadow-xl"
    >
      <div className="aspect-[3/2] relative overflow-hidden">
        <img
          src={listing.image || "/placeholder.svg"}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {listing.isVerified && (
            <Badge variant="secondary" className="gap-1 bg-background/80 backdrop-blur">
              <Shield className="h-3 w-3" />
              Verified
            </Badge>
          )}
          {listing.isTokenized && (
            <Badge variant="secondary" className="gap-1 bg-background/80 backdrop-blur">
              <Hexagon className="h-3 w-3" />
              NFT
            </Badge>
          )}
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1">{listing.category}</p>
        <h3 className="font-semibold mb-2 line-clamp-1">{listing.title}</h3>
        <div className="flex items-center justify-between">
          <span className="font-bold text-primary">{formatPrice(listing.price, listing.currency)}</span>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-chart-4 text-chart-4" />
            {listing.rating}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function MarketplacePreview() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 mb-12">
          <FadeInUp>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">Explore the Marketplace</h2>
            <p className="text-lg text-muted-foreground max-w-xl text-pretty">
              Discover verified ideas, talents, and products from Northern Nigeria's growing community of creators and
              artisans.
            </p>
          </FadeInUp>
          <SlideIn direction="right">
            <Link href="/marketplace">
              <Button variant="outline" className="gap-2 bg-transparent">
                View All Listings
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </SlideIn>
        </div>

        <Tabs defaultValue="ideas" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="ideas" className="gap-2">
              <Lightbulb className="h-4 w-4" />
              Ideas
            </TabsTrigger>
            <TabsTrigger value="talents" className="gap-2">
              <Users className="h-4 w-4" />
              Talents
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ideas">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {previewListings.ideas.map((listing, index) => (
                <ListingCard key={listing.id} listing={listing} index={index} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/marketplace/ideas">
                <Button variant="outline" className="gap-2 bg-transparent">
                  View All Ideas
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="talents">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {previewListings.talents.map((listing, index) => (
                <ListingCard key={listing.id} listing={listing} index={index} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/marketplace/talents">
                <Button variant="outline" className="gap-2 bg-transparent">
                  View All Talents
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {previewListings.products.map((listing, index) => (
                <ListingCard key={listing.id} listing={listing} index={index} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/marketplace/products">
                <Button variant="outline" className="gap-2 bg-transparent">
                  View All Products
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
