"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Plus, MessageCircle, Heart, Eye, Filter, Pin, Lock, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Discussion {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  likes_count: number
  replies_count: number
  views_count: number
  is_pinned: boolean
  is_locked: boolean
  created_at: string
  profiles?: { full_name: string | null; avatar_url: string | null; is_verified: boolean }
}

interface DiscussionsPageProps {
  discussions: Discussion[]
  categories: string[]
  currentUserId?: string
}

export function DiscussionsPage({ discussions, categories, currentUserId }: DiscussionsPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("recent")

  const filteredDiscussions = discussions
    .filter((d) => {
      const matchesSearch =
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.content.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || d.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1
      if (!a.is_pinned && b.is_pinned) return 1
      if (sortBy === "recent") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      if (sortBy === "popular") return b.likes_count - a.likes_count
      if (sortBy === "active") return b.replies_count - a.replies_count
      return 0
    })

  const formatTime = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (hours < 1) return "Just now"
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return d.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <section className="py-12 bg-gradient-to-br from-primary/10 via-background to-background border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Community Discussions</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Ask questions, share knowledge, and connect with other builders
            </p>
            <div className="flex items-center gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search discussions..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Link href="/community/discussions/new">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Discussion
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={selectedCategory === "all" ? "default" : "ghost"}
                  className={cn("w-full justify-start", selectedCategory !== "all" && "bg-transparent")}
                  onClick={() => setSelectedCategory("all")}
                >
                  All Categories
                </Button>
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "ghost"}
                    className={cn("w-full justify-start capitalize", selectedCategory !== cat && "bg-transparent")}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Discussions</span>
                  <span className="font-bold">{discussions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Categories</span>
                  <span className="font-bold">{categories.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">This Week</span>
                  <span className="font-bold">
                    {
                      discussions.filter((d) => new Date(d.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000)
                        .length
                    }
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Discussions List */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
                  <TabsTrigger value="solved">Solved</TabsTrigger>
                </TabsList>
              </Tabs>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="active">Most Active</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredDiscussions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No discussions found</p>
                  <p className="text-sm text-muted-foreground mb-4">Be the first to start a discussion!</p>
                  <Link href="/community/discussions/new">
                    <Button>Start Discussion</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredDiscussions.map((discussion, index) => (
                  <motion.div
                    key={discussion.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-10 w-10 shrink-0">
                            <AvatarImage src={discussion.profiles?.avatar_url || "/placeholder.svg"} />
                            <AvatarFallback>{discussion.profiles?.full_name?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              {discussion.is_pinned && <Pin className="h-4 w-4 text-primary shrink-0" />}
                              {discussion.is_locked && <Lock className="h-4 w-4 text-muted-foreground shrink-0" />}
                              <Link href={`/community/discussions/${discussion.id}`}>
                                <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-1">
                                  {discussion.title}
                                </h3>
                              </Link>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                              <span>{discussion.profiles?.full_name || "Anonymous"}</span>
                              {discussion.profiles?.is_verified && <CheckCircle className="h-3 w-3 text-primary" />}
                              <span>·</span>
                              <span>{formatTime(discussion.created_at)}</span>
                            </div>
                            <p className="text-muted-foreground line-clamp-2 mb-3">{discussion.content}</p>
                            <div className="flex items-center gap-4 flex-wrap">
                              <Badge variant="secondary" className="capitalize">
                                {discussion.category}
                              </Badge>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Heart className="h-4 w-4" />
                                  {discussion.likes_count}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageCircle className="h-4 w-4" />
                                  {discussion.replies_count}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye className="h-4 w-4" />
                                  {discussion.views_count}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
