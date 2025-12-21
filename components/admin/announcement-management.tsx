"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Search, Pin, PinOff, Calendar, AlertCircle, Info, Handshake, Settings, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
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

interface AnnouncementManagementProps {
  announcements: any[]
  currentUserId: string
}

const announcementTypes = [
  { value: "update", label: "Update", icon: Info, color: "bg-blue-500/10 text-blue-600" },
  { value: "critical", label: "Critical", icon: AlertCircle, color: "bg-red-500/10 text-red-600" },
  { value: "partnership", label: "Partnership", icon: Handshake, color: "bg-green-500/10 text-green-600" },
  { value: "maintenance", label: "Maintenance", icon: Settings, color: "bg-yellow-500/10 text-yellow-600" },
]

const targetAudiences = [
  { value: "all", label: "All Users" },
  { value: "verified", label: "Verified Users Only" },
  { value: "unverified", label: "Unverified Users Only" },
  { value: "specific_role", label: "Specific Role" },
]

export function AnnouncementManagement({ announcements: initialAnnouncements, currentUserId }: AnnouncementManagementProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [announcements, setAnnouncements] = useState(initialAnnouncements)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "update",
    priority: "0",
    is_pinned: false,
    is_active: true,
    scheduled_at: "",
    expires_at: "",
    target_audience: "all",
    target_role: "",
  })

  const filteredAnnouncements = announcements.filter((ann) =>
    ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ann.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreate = () => {
    setSelectedAnnouncement(null)
    setFormData({
      title: "",
      content: "",
      type: "update",
      priority: "0",
      is_pinned: false,
      is_active: true,
      scheduled_at: "",
      expires_at: "",
      target_audience: "all",
      target_role: "",
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (announcement: any) => {
    setSelectedAnnouncement(announcement)
    setFormData({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type || "update",
      priority: announcement.priority?.toString() || "0",
      is_pinned: announcement.is_pinned || false,
      is_active: announcement.is_active !== false,
      scheduled_at: announcement.scheduled_at ? new Date(announcement.scheduled_at).toISOString().slice(0, 16) : "",
      expires_at: announcement.expires_at ? new Date(announcement.expires_at).toISOString().slice(0, 16) : "",
      target_audience: announcement.target_audience || "all",
      target_role: announcement.target_role || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (announcement: any) => {
    setSelectedAnnouncement(announcement)
    setIsDeleteDialogOpen(true)
  }

  const handleTogglePin = async (announcement: any) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/admin/announcements/${announcement.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_pinned: !announcement.is_pinned }),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || "Failed to update announcement")
      }

      toast({
        title: "Success",
        description: announcement.is_pinned ? "Announcement unpinned" : "Announcement pinned",
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const url = selectedAnnouncement
        ? `/api/admin/announcements/${selectedAnnouncement.id}`
        : "/api/admin/announcements"
      const method = selectedAnnouncement ? "PATCH" : "POST"

      const payload: any = {
        title: formData.title,
        content: formData.content,
        type: formData.type,
        priority: parseInt(formData.priority) || 0,
        is_pinned: formData.is_pinned,
        is_active: formData.is_active,
        target_audience: formData.target_audience,
      }

      if (formData.scheduled_at) {
        payload.scheduled_at = new Date(formData.scheduled_at).toISOString()
      }

      if (formData.expires_at) {
        payload.expires_at = new Date(formData.expires_at).toISOString()
      }

      if (formData.target_audience === "specific_role" && formData.target_role) {
        payload.target_role = formData.target_role
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to save announcement")
      }

      toast({
        title: "Success",
        description: selectedAnnouncement ? "Announcement updated" : "Announcement created",
      })

      setIsDialogOpen(false)
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/admin/announcements/${selectedAnnouncement.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || "Failed to delete announcement")
      }

      toast({
        title: "Success",
        description: "Announcement deleted",
      })

      setIsDeleteDialogOpen(false)
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getTypeIcon = (type: string) => {
    return announcementTypes.find((t) => t.value === type)?.icon || Info
  }

  const getTypeColor = (type: string) => {
    return announcementTypes.find((t) => t.value === type)?.color || "bg-gray-500/10 text-gray-600"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Announcement Management</h1>
          <p className="text-muted-foreground mt-1">Create and manage official platform announcements</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          New Announcement
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Announcements</CardTitle>
              <CardDescription>{filteredAnnouncements.length} announcements</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search announcements..."
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
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAnnouncements.map((ann) => (
                <TableRow key={ann.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {ann.is_pinned && <Pin className="h-4 w-4 text-primary" />}
                      {ann.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getTypeColor(ann.type)}>
                      {ann.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={ann.is_active ? "default" : "secondary"}>
                      {ann.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize">{ann.target_audience || "all"}</TableCell>
                  <TableCell>{ann.priority || 0}</TableCell>
                  <TableCell>{ann.view_count || 0}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleTogglePin(ann)} disabled={isSubmitting}>
                        {ann.is_pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(ann)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(ann)}>
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

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedAnnouncement ? "Edit Announcement" : "Create Announcement"}</DialogTitle>
            <DialogDescription>
              {selectedAnnouncement ? "Update announcement information" : "Create a new official announcement"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Announcement title"
              />
            </div>
            <div className="space-y-2">
              <Label>Content *</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Announcement content (supports markdown)"
                rows={8}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Type *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {announcementTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Input
                  type="number"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  placeholder="0"
                  min="0"
                />
                <p className="text-xs text-muted-foreground">Higher number = higher priority</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Target Audience *</Label>
                <Select
                  value={formData.target_audience}
                  onValueChange={(value) => setFormData({ ...formData, target_audience: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {targetAudiences.map((audience) => (
                      <SelectItem key={audience.value} value={audience.value}>
                        {audience.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {formData.target_audience === "specific_role" && (
                <div className="space-y-2">
                  <Label>Target Role</Label>
                  <Select
                    value={formData.target_role}
                    onValueChange={(value) => setFormData({ ...formData, target_role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="builder">Builder</SelectItem>
                      <SelectItem value="institution">Institution</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="company">Company</SelectItem>
                      <SelectItem value="organization">Organization</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Scheduled At (Optional)</Label>
                <Input
                  type="datetime-local"
                  value={formData.scheduled_at}
                  onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Expires At (Optional)</Label>
                <Input
                  type="datetime-local"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_pinned"
                  checked={formData.is_pinned}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_pinned: checked as boolean })}
                />
                <Label htmlFor="is_pinned" className="cursor-pointer">
                  Pin announcement
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked as boolean })}
                />
                <Label htmlFor="is_active" className="cursor-pointer">
                  Active
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || !formData.title || !formData.content}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {selectedAnnouncement ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the announcement "{selectedAnnouncement?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

