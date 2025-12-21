"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, MoreVertical, Shield, ShieldOff, Ban, CheckCircle, Mail, Eye, Download, UserPlus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

interface UserManagementProps {
  users: any[]
}

export function UserManagement({ users: initialUsers }: UserManagementProps) {
  const router = useRouter()
  const supabase = createClient()
  const [users, setUsers] = useState(initialUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [actionDialog, setActionDialog] = useState<{ type: string; user: any } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === "all" || user.role === filterRole
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "verified" && user.is_verified) ||
      (filterStatus === "unverified" && !user.is_verified) ||
      (filterStatus === "suspended" && user.is_suspended)
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleAction = async (action: string, user: any) => {
    setIsLoading(true)
    try {
      switch (action) {
        case "verify":
          await supabase.from("profiles").update({ is_verified: true }).eq("id", user.id)
          setUsers(users.map((u) => (u.id === user.id ? { ...u, is_verified: true } : u)))
          break
        case "unverify":
          await supabase.from("profiles").update({ is_verified: false }).eq("id", user.id)
          setUsers(users.map((u) => (u.id === user.id ? { ...u, is_verified: false } : u)))
          break
        case "suspend":
          await supabase.from("profiles").update({ is_suspended: true }).eq("id", user.id)
          setUsers(users.map((u) => (u.id === user.id ? { ...u, is_suspended: true } : u)))
          break
        case "unsuspend":
          await supabase.from("profiles").update({ is_suspended: false }).eq("id", user.id)
          setUsers(users.map((u) => (u.id === user.id ? { ...u, is_suspended: false } : u)))
          break
        case "make_admin":
          await supabase.from("profiles").update({ role: "admin" }).eq("id", user.id)
          setUsers(users.map((u) => (u.id === user.id ? { ...u, role: "admin" } : u)))
          break
        case "make_verifier":
          await supabase.from("profiles").update({ role: "verifier" }).eq("id", user.id)
          setUsers(users.map((u) => (u.id === user.id ? { ...u, role: "verifier" } : u)))
          break
        case "remove_role":
          await supabase.from("profiles").update({ role: "user" }).eq("id", user.id)
          setUsers(users.map((u) => (u.id === user.id ? { ...u, role: "user" } : u)))
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
    total: users.length,
    verified: users.filter((u) => u.is_verified).length,
    admins: users.filter((u) => u.role === "admin").length,
    suspended: users.filter((u) => u.is_suspended).length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage platform users and permissions</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Invite User
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Users</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Verified</p>
            <p className="text-2xl font-bold text-green-600">{stats.verified}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Admins</p>
            <p className="text-2xl font-bold text-blue-600">{stats.admins}</p>
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
                placeholder="Search by name or email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="verifier">Verifier</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Account Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reputation</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="group"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback>{user.full_name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.full_name || "Unknown"}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === "admin" ? "default" : user.role === "verifier" ? "secondary" : "outline"}
                      className="capitalize"
                    >
                      {user.role || "user"}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize">{user.account_type || "individual"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {user.is_suspended ? (
                        <Badge variant="destructive">Suspended</Badge>
                      ) : user.is_verified ? (
                        <Badge className="bg-green-500/10 text-green-600">Verified</Badge>
                      ) : (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{user.reputation_score || 0}</span>
                      <span className="text-muted-foreground text-xs">pts</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString()}
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
                        <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.is_verified ? (
                          <DropdownMenuItem onClick={() => setActionDialog({ type: "unverify", user })}>
                            <ShieldOff className="h-4 w-4 mr-2" />
                            Remove Verification
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => setActionDialog({ type: "verify", user })}>
                            <Shield className="h-4 w-4 mr-2" />
                            Verify User
                          </DropdownMenuItem>
                        )}
                        {user.role !== "admin" && (
                          <DropdownMenuItem onClick={() => setActionDialog({ type: "make_admin", user })}>
                            <Shield className="h-4 w-4 mr-2" />
                            Make Admin
                          </DropdownMenuItem>
                        )}
                        {user.role !== "verifier" && user.role !== "admin" && (
                          <DropdownMenuItem onClick={() => setActionDialog({ type: "make_verifier", user })}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Make Verifier
                          </DropdownMenuItem>
                        )}
                        {user.role !== "user" && (
                          <DropdownMenuItem onClick={() => setActionDialog({ type: "remove_role", user })}>
                            <ShieldOff className="h-4 w-4 mr-2" />
                            Remove Role
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {user.is_suspended ? (
                          <DropdownMenuItem
                            onClick={() => setActionDialog({ type: "unsuspend", user })}
                            className="text-green-600"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Unsuspend User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => setActionDialog({ type: "suspend", user })}
                            className="text-destructive"
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            Suspend User
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No users found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Confirmation Dialog */}
      <Dialog open={!!actionDialog} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              {actionDialog?.type === "verify" && `Are you sure you want to verify ${actionDialog.user.full_name}?`}
              {actionDialog?.type === "unverify" && `Remove verification from ${actionDialog?.user.full_name}?`}
              {actionDialog?.type === "suspend" &&
                `Suspend ${actionDialog?.user.full_name}? They won't be able to access their account.`}
              {actionDialog?.type === "unsuspend" && `Unsuspend ${actionDialog?.user.full_name}?`}
              {actionDialog?.type === "make_admin" && `Make ${actionDialog?.user.full_name} an admin?`}
              {actionDialog?.type === "make_verifier" && `Make ${actionDialog?.user.full_name} a verifier?`}
              {actionDialog?.type === "remove_role" &&
                `Remove admin/verifier role from ${actionDialog?.user.full_name}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)} className="bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={() => actionDialog && handleAction(actionDialog.type, actionDialog.user)}
              disabled={isLoading}
              variant={actionDialog?.type === "suspend" ? "destructive" : "default"}
            >
              {isLoading ? "Processing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Profile Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="text-lg">{selectedUser.full_name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{selectedUser.full_name || "Unknown"}</h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Role</p>
                  <p className="font-medium capitalize">{selectedUser.role || "user"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Account Type</p>
                  <p className="font-medium capitalize">{selectedUser.account_type || "individual"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Reputation</p>
                  <p className="font-medium">{selectedUser.reputation_score || 0} points</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Joined</p>
                  <p className="font-medium">{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              {selectedUser.bio && (
                <div>
                  <p className="text-muted-foreground text-sm">Bio</p>
                  <p className="text-sm">{selectedUser.bio}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
