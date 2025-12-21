"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeftRight,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  MoreVertical,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import type { SwapRequest } from "@/lib/types"

interface SwapManagementProps {
  swaps: any[]
  stats: {
    total: number
    pending: number
    active: number
    completed: number
    disputed: number
  }
}

export function SwapManagement({ swaps: initialSwaps, stats }: SwapManagementProps) {
  const [swaps] = useState(initialSwaps)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredSwaps = swaps.filter((swap) => {
    const matchesSearch =
      swap.initiator?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      swap.target_user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      swap.target_listing?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      swap.offering_listing?.title?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || swap.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statusConfig = {
    pending: { icon: Clock, color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20", label: "Pending" },
    accepted: { icon: CheckCircle, color: "bg-green-500/10 text-green-600 border-green-500/20", label: "Accepted" },
    rejected: { icon: XCircle, color: "bg-red-500/10 text-red-600 border-red-500/20", label: "Rejected" },
    cancelled: { icon: XCircle, color: "bg-gray-500/10 text-gray-600 border-gray-500/20", label: "Cancelled" },
    completed: { icon: CheckCircle, color: "bg-blue-500/10 text-blue-600 border-blue-500/20", label: "Completed" },
    disputed: { icon: AlertCircle, color: "bg-orange-500/10 text-orange-600 border-orange-500/20", label: "Disputed" },
    expired: { icon: Clock, color: "bg-gray-500/10 text-gray-600 border-gray-500/20", label: "Expired" },
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Swap Management</h1>
        <p className="text-muted-foreground mt-1">Manage all swap proposals and transactions</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Swaps</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
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
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Disputed</p>
            <p className="text-2xl font-bold text-orange-600">{stats.disputed}</p>
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
                placeholder="Search swaps by user or listing..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="disputed">Disputed</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Swaps Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Initiator</TableHead>
                <TableHead>Target User</TableHead>
                <TableHead>Swap Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSwaps.length > 0 ? (
                filteredSwaps.map((swap) => {
                  const statusInfo = statusConfig[swap.status as keyof typeof statusConfig] || statusConfig.pending
                  const StatusIcon = statusInfo.icon

                  return (
                    <TableRow key={swap.id}>
                      <TableCell className="font-mono text-xs">{swap.id.slice(0, 8)}...</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{swap.initiator?.full_name || "Unknown"}</p>
                          <p className="text-xs text-muted-foreground">{swap.initiator?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{swap.target_user?.full_name || "Unknown"}</p>
                          <p className="text-xs text-muted-foreground">{swap.target_user?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-sm font-medium truncate">
                            {swap.offering_listing?.title || swap.offering_description || "Offering"}
                          </p>
                          <p className="text-xs text-muted-foreground">→</p>
                          <p className="text-sm font-medium truncate">
                            {swap.target_listing?.title || swap.requesting_description || "Requesting"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusInfo.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(swap.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/swap-center/${swap.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No swaps found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

