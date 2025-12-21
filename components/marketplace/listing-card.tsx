"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Star, Shield, Hexagon, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Listing } from "@/lib/types"

interface ListingCardProps {
  listing: Listing
  index?: number
}

export function ListingCard({ listing, index = 0 }: ListingCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
      <Link href={`/marketplace/listing/${listing.id}`}>
        <div className="group bg-card rounded-xl border border-border overflow-hidden hover:border-primary hover:shadow-lg transition-all">
          {/* Image */}
          <div className="aspect-[4/3] relative overflow-hidden bg-secondary/30">
            <img
              src={listing.images?.[0] || "/placeholder.svg?height=300&width=400&query=product"}
              alt={listing.title}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              {listing.is_verified && (
                <Badge variant="secondary" className="gap-1 bg-background/90 backdrop-blur">
                  <Shield className="h-3 w-3" />
                  Verified
                </Badge>
              )}
              {listing.is_tokenized && (
                <Badge variant="secondary" className="gap-1 bg-background/90 backdrop-blur">
                  <Hexagon className="h-3 w-3" />
                  NFT
                </Badge>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-1 capitalize">{listing.listing_type}</p>
            <h3 className="font-semibold line-clamp-1 mb-2 group-hover:text-primary transition-colors">
              {listing.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{listing.description}</p>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <span className="font-bold text-primary">
                {listing.price ? `$${listing.price.toFixed(2)}` : "Contact"}
              </span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 fill-chart-4 text-chart-4" />
                  4.8
                </div>
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-3 w-3 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
