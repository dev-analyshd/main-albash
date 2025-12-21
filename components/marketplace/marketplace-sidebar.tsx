"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Briefcase, Building2, Store, Wrench, Hexagon, Filter, X, Gavel, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const categories = [
  { href: "/marketplace/builders", label: "Builders", icon: Briefcase },
  { href: "/marketplace/institutions", label: "Institutions", icon: Building2 },
  { href: "/marketplace/businesses", label: "Businesses", icon: Store },
  { href: "/marketplace/tools", label: "Tools", icon: Wrench },
  { href: "/marketplace/ideas", label: "Ideas", icon: Lightbulb },
  { href: "/marketplace/tokenized", label: "Tokenized/NFTs", icon: Hexagon },
  { href: "/marketplace/auctions", label: "Live Auctions", icon: Gavel },
]

function SidebarContent() {
  const pathname = usePathname()
  const [priceRange, setPriceRange] = useState([0, 1000])

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-4">Categories</h3>
        <nav className="space-y-1">
          {categories.map((cat) => {
            const isActive = pathname === cat.href
            return (
              <Link key={cat.href} href={cat.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-secondary",
                  )}
                >
                  <cat.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{cat.label}</span>
                </div>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Filters */}
      <div className="border-t border-border pt-6">
        <h3 className="font-semibold mb-4">Filters</h3>

        {/* Verified Only */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="verified" />
            <Label htmlFor="verified" className="text-sm">
              Verified Only
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="tokenized" />
            <Label htmlFor="tokenized" className="text-sm">
              Tokenized Only
            </Label>
          </div>
        </div>

        {/* Price Range */}
        <div className="mt-6">
          <Label className="text-sm font-medium">Price Range</Label>
          <Slider value={priceRange} onValueChange={setPriceRange} min={0} max={1000} step={10} className="mt-3" />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}+</span>
          </div>
        </div>

        {/* Listing Type */}
        <div className="mt-6">
          <Label className="text-sm font-medium mb-3 block">Listing Type</Label>
          <div className="space-y-2">
            {["Physical", "Digital", "Service", "NFT"].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox id={type.toLowerCase()} />
                <Label htmlFor={type.toLowerCase()} className="text-sm">
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reset Filters */}
      <Button variant="outline" className="w-full bg-transparent">
        Reset Filters
      </Button>
    </div>
  )
}

export function MarketplaceSidebar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-lg">Marketplace</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 bg-card rounded-xl border border-border p-4">
          <SidebarContent />
        </div>
      </aside>
    </>
  )
}
