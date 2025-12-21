"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, MoreVertical, Eye, Trash2, CheckCircle, XCircle, AlertTriangle, Download } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface ListingManagementProps {
  listings: any[]
}

export function ListingManagement({ listings: initialListings }: ListingManagementProps) {
  const router = useRouter()
  const supabase = createClient()
  const [listings, setListings] = useState(initialListings)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [actionDialog, setActionDialog] = useState<{ type: string; listing: any } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || listing.status === filterStatus
    const matchesType = filterType === "all" || listing.listing_type === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  const handleAction = async (action: string, listing: any) => {
    setIsLoading(true)
    try {
      switch (action) {
        case "approve":
          await supabase.from("listings").update({ status: "active" }).eq("id", listing.id)
          setListings(listings.map((l) => (l.id === listing.id ? { ...l, status: "active" } : l)))
          break
        case "reject":
          await supabase.from("listings").update({ status: "rejected" }).eq("id", listing.id)
          setListings(listings.map((l) => (l.id === listing.id ? { ...l, status: "rejected" } : l)))
          break
        case "suspend":
          await supabase.from("listings").update({ status: "suspended" }).eq("id", listing.id)
          setListings(listings.map((l) => (l.id === listing.id ? { ...l, status: "suspended" } : l)))
          break
        case "delete":
          await supabase.from("listings").delete().eq("id", listing.id)
          setListings(listings.filter((l) => l.id !== listing.id))
          break
      }
      router.refresh()
    } catch (error) {
      console.error("Error performing action:", error)
    } finally {
      setIsLoading(false)
      setActionDialog(null)
    }
  }

  const stats = {
    total: listings.length,
    active: listings.filter((l) => l.status === "active").length,
    pending: listings.filter((l) => l.status === "pending").length,
    suspended: listings.filter((l) => l.status === "suspended").length,
  }

  const statusColors: Record<string, string> = {
    active: "bg-green-500/10 text-green-600",
    pending: "bg-yellow-500/10 text-yellow-600",
    draft: "bg-gray-500/10 text-gray-600",
    suspended: "bg-red-500/10 text-red-600",
    rejected: "bg-red-500/10 text-red-600",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Listing Management</h1>
          <p className="text-muted-foreground mt-1">Review and manage platform listings</p>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Listings</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pending Review</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Suspended</p>
            <p className="text-2xl font-bold text-red-600">{stats.suspended}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search listings..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="project">Project</SelectItem>
                <SelectItem value="tool">Tool</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Listings Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Listing</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredListings.map((listing, index) => (
                <motion.tr
                  key={listing.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="group"
                >
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="font-medium truncate">{listing.title}</p>
                      <p className="text-sm text-muted-foreground truncate">{listing.description?.slice(0, 50)}...</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{listing.profiles?.full_name || "Unknown"}</p>
                      <p className="text-sm text-muted-foreground">{listing.profiles?.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{listing.categories?.name || "Uncategorized"}</TableCell>
                  <TableCell className="capitalize">{listing.listing_type || "service"}</TableCell>
                  <TableCell>${listing.price || 0}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[listing.status] || "bg-gray-100"}>{listing.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(listing.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href={`/marketplace/listing/${listing.id}`}>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Listing
                          </DropdownMenuItem>
                        </Link>
                        {listing.status === "pending" && (
                          <>
                            <DropdownMenuItem onClick={() => setActionDialog({ type: "approve", listing })}>
                              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setActionDialog({ type: "reject", listing })}>
                              <XCircle className="h-4 w-4 mr-2 text-red-600" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        {listing.status === "active" && (
                          <DropdownMenuItem onClick={() => setActionDialog({ type: "suspend", listing })}>
                            <AlertTriangle className="h-4 w-4 mr-2 text-yellow-600" />
                            Suspend
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setActionDialog({ type: "delete", listing })}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
          {filteredListings.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No listings found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={!!actionDialog} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              {actionDialog?.type === "approve" && `Approve "${actionDialog.listing.title}"?`}
              {actionDialog?.type === "reject" && `Reject "${actionDialog.listing.title}"?`}
              {actionDialog?.type === "suspend" &&
                `Suspend "${actionDialog.listing.title}"? It will be hidden from the marketplace.`}
              {actionDialog?.type === "delete" &&
                `Permanently delete "${actionDialog.listing.title}"? This cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)} className="bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={() => actionDialog && handleAction(actionDialog.type, actionDialog.listing)}
              disabled={isLoading}
              variant={actionDialog?.type === "delete" || actionDialog?.type === "reject" ? "destructive" : "default"}
            >
              {isLoading ? "Processing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
