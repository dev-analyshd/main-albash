"use client"

import { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

export interface SearchFilters {
  q?: string
  category?: string
  condition?: string
  minPrice?: number
  maxPrice?: number
  sellerId?: string
  role?: string
  department?: string
  verified?: boolean
}

interface ListingSearchProps {
  onSearch: (filters: SearchFilters) => void
  categories?: string[]
  conditions?: string[]
  showPriceFilter?: boolean
  showRoleFilter?: boolean
  showVerificationFilter?: boolean
  isLoading?: boolean
}

export function SearchBar({
  onSearch,
  categories = [],
  conditions = [],
  showPriceFilter = false,
  showRoleFilter = false,
  showVerificationFilter = false,
  isLoading = false,
}: ListingSearchProps) {
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState<SearchFilters>({})
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleSearch = useCallback(() => {
    onSearch({
      ...filters,
      q: query,
    })
  }, [query, filters, onSearch])

  const handleClearFilters = () => {
    setQuery("")
    setFilters({})
    onSearch({})
  }

  return (
    <div className="space-y-4">
      {/* Main search bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, title, email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10"
            disabled={isLoading}
          />
        </div>
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </Button>
        {(query || Object.keys(filters).length > 0) && (
          <Button variant="outline" onClick={handleClearFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          Filters
        </Button>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4 bg-muted rounded-lg">
          {/* Category filter */}
          {categories.length > 0 && (
            <select
              value={filters.category || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  category: e.target.value || undefined,
                })
              }
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}

          {/* Condition filter */}
          {conditions.length > 0 && (
            <select
              value={filters.condition || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  condition: e.target.value || undefined,
                })
              }
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="">All Conditions</option>
              {conditions.map((cond) => (
                <option key={cond} value={cond}>
                  {cond}
                </option>
              ))}
            </select>
          )}

          {/* Price range */}
          {showPriceFilter && (
            <>
              <input
                type="number"
                placeholder="Min price"
                value={filters.minPrice || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    minPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                  })
                }
                className="px-3 py-2 border rounded-md bg-background"
              />
              <input
                type="number"
                placeholder="Max price"
                value={filters.maxPrice || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    maxPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                  })
                }
                className="px-3 py-2 border rounded-md bg-background"
              />
            </>
          )}

          {/* Role filter */}
          {showRoleFilter && (
            <select
              value={filters.role || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  role: e.target.value || undefined,
                })
              }
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="">All Roles</option>
              <option value="builder">Builder</option>
              <option value="business">Business</option>
              <option value="admin">Admin</option>
              <option value="verifier">Verifier</option>
            </select>
          )}

          {/* Verification filter */}
          {showVerificationFilter && (
            <select
              value={filters.verified !== undefined ? filters.verified.toString() : ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  verified: e.target.value === "true" ? true : e.target.value === "false" ? false : undefined,
                })
              }
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="">All Users</option>
              <option value="true">Verified Only</option>
              <option value="false">Unverified Only</option>
            </select>
          )}
        </div>
      )}
    </div>
  )
}
