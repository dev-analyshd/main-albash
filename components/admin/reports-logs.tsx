"use client"

import { useState } from "react"
import { Search, Filter, FileText, Activity, Calendar, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface ReportsAndLogsProps {
  auditLogs: any[]
  reputationLogs: any[]
}

export function ReportsAndLogs({ auditLogs: initialAuditLogs, reputationLogs: initialReputationLogs }: ReportsAndLogsProps) {
  const [auditLogs] = useState(initialAuditLogs)
  const [reputationLogs] = useState(initialReputationLogs)
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState("all")

  const filteredAuditLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.admin_id?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target_type?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesAction = actionFilter === "all" || log.action_type === actionFilter
    return matchesSearch && matchesAction
  })

  const filteredReputationLogs = reputationLogs.filter((log) =>
    log.user_id?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.event_type?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const actionTypes = [...new Set(auditLogs.map((log) => log.action_type))]

  const getActionColor = (actionType: string) => {
    if (actionType.includes("approved") || actionType.includes("created")) {
      return "bg-green-500/10 text-green-600"
    }
    if (actionType.includes("rejected") || actionType.includes("deleted") || actionType.includes("banned")) {
      return "bg-red-500/10 text-red-600"
    }
    if (actionType.includes("updated") || actionType.includes("modified")) {
      return "bg-blue-500/10 text-blue-600"
    }
    return "bg-gray-500/10 text-gray-600"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Logs</h1>
          <p className="text-muted-foreground mt-1">System logs and audit trails (Read-only)</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Logs
        </Button>
      </div>

      <Tabs defaultValue="audit" className="space-y-4">
        <TabsList>
          <TabsTrigger value="audit">
            <Activity className="h-4 w-4 mr-2" />
            Audit Logs ({auditLogs.length})
          </TabsTrigger>
          <TabsTrigger value="reputation">
            <FileText className="h-4 w-4 mr-2" />
            Reputation Logs ({reputationLogs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Admin Audit Logs</CardTitle>
                  <CardDescription>All admin actions are logged here</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search logs..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={actionFilter} onValueChange={setActionFilter}>
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      {actionTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Target ID</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAuditLogs.length > 0 ? (
                    filteredAuditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(log.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>{(log.admin_id?.full_name || "A")[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{log.admin_id?.full_name || "Unknown"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getActionColor(log.action_type)}>
                            {log.action_type.replace(/_/g, " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="capitalize">{log.target_type}</TableCell>
                        <TableCell className="font-mono text-xs">{log.target_id.slice(0, 8)}...</TableCell>
                        <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                          {log.details && typeof log.details === "object"
                            ? JSON.stringify(log.details)
                            : log.details || "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No audit logs found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reputation" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Reputation Logs</CardTitle>
                  <CardDescription>All reputation changes are logged here</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search logs..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Event Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReputationLogs.length > 0 ? (
                    filteredReputationLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(log.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>{(log.user_id?.full_name || "U")[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{log.user_id?.full_name || "Unknown"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={log.points > 0 ? "default" : "destructive"}>
                            {log.points > 0 ? "+" : ""}
                            {log.points}
                          </Badge>
                        </TableCell>
                        <TableCell>{log.reason}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.event_type}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No reputation logs found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

