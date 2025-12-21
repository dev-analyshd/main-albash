"use client"

import { useState } from "react"
import { Search, Trash2, Pin, PinOff, Lock, Unlock, Edit, Loader2, Users, MessageSquare, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface CommunityManagementProps {
  discussions: any[]
  events: any[]
  groups: any[]
  currentUserId: string
}

export function CommunityManagement({ discussions: initialDiscussions, events: initialEvents, groups: initialGroups, currentUserId }: CommunityManagementProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [discussions] = useState(initialDiscussions)
  const [events] = useState(initialEvents)
  const [groups] = useState(initialGroups)
  const [searchQuery, setSearchQuery] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; type: string; id: string; title: string }>({
    open: false,
    type: "",
    id: "",
    title: "",
  })

  const filteredDiscussions = discussions.filter((disc) =>
    disc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    disc.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = (type: string, id: string, title: string) => {
    setDeleteDialog({ open: true, type, id, title })
  }

  const confirmDelete = async () => {
    setIsProcessing(true)
    try {
      let endpoint = ""
      if (deleteDialog.type === "discussion") {
        endpoint = `/api/admin/community/discussions/${deleteDialog.id}`
      } else if (deleteDialog.type === "event") {
        endpoint = `/api/admin/community/events/${deleteDialog.id}`
      } else if (deleteDialog.type === "group") {
        endpoint = `/api/admin/community/groups/${deleteDialog.id}`
      }

      const response = await fetch(endpoint, {
        method: "DELETE",
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || "Failed to delete")
      }

      toast({
        title: "Success",
        description: "Item deleted successfully",
      })

      setDeleteDialog({ open: false, type: "", id: "", title: "" })
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleTogglePin = async (id: string, currentState: boolean) => {
    setIsProcessing(true)
    try {
      const response = await fetch(`/api/admin/community/discussions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_pinned: !currentState }),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || "Failed to update")
      }

      toast({
        title: "Success",
        description: currentState ? "Discussion unpinned" : "Discussion pinned",
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleToggleLock = async (id: string, currentState: boolean) => {
    setIsProcessing(true)
    try {
      const response = await fetch(`/api/admin/community/discussions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_locked: !currentState }),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || "Failed to update")
      }

      toast({
        title: "Success",
        description: currentState ? "Discussion unlocked" : "Discussion locked",
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Community Management</h1>
          <p className="text-muted-foreground mt-1">Moderate discussions, events, and groups</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search community..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="discussions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="discussions">
            <MessageSquare className="h-4 w-4 mr-2" />
            Discussions ({discussions.length})
          </TabsTrigger>
          <TabsTrigger value="events">
            <Calendar className="h-4 w-4 mr-2" />
            Events ({events.length})
          </TabsTrigger>
          <TabsTrigger value="groups">
            <Users className="h-4 w-4 mr-2" />
            Groups ({groups.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discussions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Discussions</CardTitle>
              <CardDescription>Manage community discussions and posts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Replies</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDiscussions.map((disc) => (
                    <TableRow key={disc.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {disc.is_pinned && <Pin className="h-4 w-4 text-primary" />}
                          {disc.is_locked && <Lock className="h-4 w-4 text-muted-foreground" />}
                          <span className="max-w-xs truncate">{disc.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={disc.user_id?.avatar_url} />
                            <AvatarFallback>{(disc.user_id?.full_name || "U")[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{disc.user_id?.full_name || "Unknown"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{disc.category}</Badge>
                      </TableCell>
                      <TableCell>{disc.replies_count || 0}</TableCell>
                      <TableCell>{disc.views_count || 0}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {disc.is_pinned && <Badge variant="secondary">Pinned</Badge>}
                          {disc.is_locked && <Badge variant="secondary">Locked</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleTogglePin(disc.id, disc.is_pinned)}
                            disabled={isProcessing}
                          >
                            {disc.is_pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleLock(disc.id, disc.is_locked)}
                            disabled={isProcessing}
                          >
                            {disc.is_locked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete("discussion", disc.id, disc.title)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Events</CardTitle>
              <CardDescription>Manage community events</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Organizer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.title}</TableCell>
                      <TableCell>{event.created_by?.full_name || "Unknown"}</TableCell>
                      <TableCell>{new Date(event.start_date).toLocaleDateString()}</TableCell>
                      <TableCell>{event.location || "Virtual"}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete("event", event.id, event.title)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Groups</CardTitle>
              <CardDescription>Manage community groups</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGroups.map((group) => (
                    <TableRow key={group.id}>
                      <TableCell className="font-medium">{group.name}</TableCell>
                      <TableCell>{group.creator_id?.full_name || "Unknown"}</TableCell>
                      <TableCell>{group.member_count || 0}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{group.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete("group", group.id, group.name)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the {deleteDialog.type} "{deleteDialog.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isProcessing}>
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

