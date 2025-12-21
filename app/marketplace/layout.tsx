import type React from "react"
import { MarketplaceSidebar } from "@/components/marketplace/marketplace-sidebar"

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <MarketplaceSidebar />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  )
}
