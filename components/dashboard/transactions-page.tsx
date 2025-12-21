"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, ArrowDownLeft, Search, Download, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface Transaction {
  id: string
  amount: number
  status: string
  type: string
  created_at: string
  buyer_id: string
  seller_id: string
  buyer?: { full_name: string | null; avatar_url: string | null }
  seller?: { full_name: string | null; avatar_url: string | null }
  listing?: { title: string }
}

interface TransactionsPageProps {
  transactions: Transaction[]
  currentUserId: string
}

const statusIcons: Record<string, any> = {
  completed: CheckCircle,
  pending: Clock,
  failed: XCircle,
  refunded: AlertCircle,
}

const statusColors: Record<string, string> = {
  completed: "text-green-600 bg-green-100",
  pending: "text-yellow-600 bg-yellow-100",
  failed: "text-red-600 bg-red-100",
  refunded: "text-orange-600 bg-orange-100",
}

export function TransactionsPage({ transactions, currentUserId }: TransactionsPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")

  const filteredTransactions = transactions.filter((tx) => {
    const isSale = tx.seller_id === currentUserId
    const matchesSearch =
      tx.listing?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (isSale ? tx.buyer?.full_name : tx.seller?.full_name)?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || tx.status === filterStatus
    const matchesType = filterType === "all" || (filterType === "sales" ? isSale : !isSale)
    return matchesSearch && matchesStatus && matchesType
  })

  const totalIncome = transactions
    .filter((tx) => tx.seller_id === currentUserId && tx.status === "completed")
    .reduce((sum, tx) => sum + tx.amount, 0)

  const totalSpent = transactions
    .filter((tx) => tx.buyer_id === currentUserId && tx.status === "completed")
    .reduce((sum, tx) => sum + tx.amount, 0)

  const pendingAmount = transactions.filter((tx) => tx.status === "pending").reduce((sum, tx) => sum + tx.amount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground mt-1">View your purchase and sales history</p>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ArrowDownLeft className="h-4 w-4 text-green-600" />
              <p className="text-sm text-muted-foreground">Total Income</p>
            </div>
            <p className="text-2xl font-bold text-green-600">${totalIncome.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-muted-foreground">Total Spent</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">${totalSpent.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
            <p className="text-2xl font-bold text-yellow-600">${pendingAmount.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              <p className="text-sm text-muted-foreground">Total Transactions</p>
            </div>
            <p className="text-2xl font-bold">{transactions.length}</p>
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
                placeholder="Search transactions..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="purchases">Purchases</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>{filteredTransactions.length} transactions found</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No transactions found</p>
              <p className="text-sm text-muted-foreground">
                {transactions.length === 0
                  ? "You haven't made any transactions yet"
                  : "Try adjusting your search or filters"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>With</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((tx, index) => {
                  const isSale = tx.seller_id === currentUserId
                  const counterparty = isSale ? tx.buyer : tx.seller
                  const StatusIcon = statusIcons[tx.status] || Clock

                  return (
                    <motion.tr
                      key={tx.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                    >
                      <TableCell>
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center",
                            isSale ? "bg-green-100" : "bg-blue-100",
                          )}
                        >
                          {isSale ? (
                            <ArrowDownLeft className="h-4 w-4 text-green-600" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{isSale ? "Sale" : "Purchase"}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-xs">
                            {tx.listing?.title || "Unknown listing"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={counterparty?.avatar_url || "/placeholder.svg"} />
                            <AvatarFallback>{counterparty?.full_name?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{counterparty?.full_name || "Unknown"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={cn("font-semibold", isSale ? "text-green-600" : "text-foreground")}>
                          {isSale ? "+" : "-"}${tx.amount.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("gap-1", statusColors[tx.status])}>
                          <StatusIcon className="h-3 w-3" />
                          {tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </TableCell>
                    </motion.tr>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
