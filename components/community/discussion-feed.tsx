"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { Heart, MessageCircle, Repeat2, Share, Search, Plus, Loader2, AlertCircle, CheckCircle, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

const MAX_POST_LENGTH = 280
const DEBOUNCE_DELAY = 300

interface User {
  id: string
  full_name: string | null
  avatar_url: string | null
  is_verified: boolean
}

interface Post {
  id: string
  content: string
  category: string
  likes_count: number
  replies_count: number
  reposts_count: number
  is_pinned: boolean
  created_at: string
  user: User
}

interface Toast {
  id: string
  type: "success" | "error"
  message: string
}

// Debounce helper
function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [value, delay])

  return debouncedValue
}

export function DiscussionFeed() {
  const supabase = createClient()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [newPostContent, setNewPostContent] = useState("")
  const [posting, setPosting] = useState(false)
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [repostedPosts, setRepostedPosts] = useState<Set<string>>(new Set())
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [expandedPost, setExpandedPost] = useState<string | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [actionInProgress, setActionInProgress] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadPosts()
    subscribeToPostChanges()
  }, [])

  const loadPosts = async () => {
    const res = await fetch("/api/discussions/posts?page=1&limit=50")
    const data = await res.json()
    setPosts(data.posts || [])
    // load which posts the current user has liked/reposted
    loadUserInteractions(data.posts || [])
    setLoading(false)
  }

  const loadUserInteractions = async (postsList: Post[]) => {
    if (!postsList || postsList.length === 0) return

    try {
      const liked = new Set<string>()
      const reposted = new Set<string>()

      await Promise.all(
        postsList.map(async (p) => {
          try {
            const [likeRes, repostRes] = await Promise.all([
              fetch(`/api/discussions/posts/${p.id}/like`),
              fetch(`/api/discussions/posts/${p.id}/repost`),
            ])

            if (likeRes.ok) {
              const j = await likeRes.json()
              if (j.liked) liked.add(p.id)
            }

            if (repostRes.ok) {
              const j2 = await repostRes.json()
              if (j2.reposted) reposted.add(p.id)
            }
          } catch (err) {
            // ignore per-post errors
          }
        }),
      )

      setLikedPosts(liked)
      setRepostedPosts(reposted)
    } catch (error) {
      console.error("Error loading user interactions:", error)
    }
  }

  const subscribeToPostChanges = () => {
    const channel = supabase
      .channel("public:posts")
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, (payload: any) => {
        if (payload.eventType === "INSERT") {
          loadPosts()
        } else if (payload.eventType === "UPDATE") {
          setPosts((prev) =>
            prev.map((p) =>
              p.id === payload.new.id
                ? {
                    ...p,
                    likes_count: payload.new.likes_count,
                    replies_count: payload.new.replies_count,
                    reposts_count: payload.new.reposts_count,
                  }
                : p,
            ),
          )
        }
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "post_reposts" }, (payload: any) => {
        // When reposts are inserted or deleted, reload posts to keep counts and state consistent
        if (payload.eventType === "INSERT" || payload.eventType === "DELETE") {
          loadPosts()
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const addToast = (message: string, type: "success" | "error") => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      addToast("Post cannot be empty", "error")
      return
    }

    if (newPostContent.length > MAX_POST_LENGTH) {
      addToast(`Post exceeds ${MAX_POST_LENGTH} characters`, "error")
      return
    }

    setPosting(true)

    try {
      const res = await fetch("/api/discussions/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newPostContent }),
      })

      if (!res.ok) throw new Error("Failed to create post")

      setNewPostContent("")
      addToast("Post published!", "success")
      await loadPosts()
    } catch (error) {
      console.error("Error creating post:", error)
      addToast("Failed to publish post", "error")
    } finally {
      setPosting(false)
    }
  }

  const handleLikePost = useCallback(async (postId: string) => {
    if (actionInProgress.has(postId)) return

    const isLiked = likedPosts.has(postId)
    const newLiked = new Set(likedPosts)

    if (isLiked) {
      newLiked.delete(postId)
    } else {
      newLiked.add(postId)
    }

    setLikedPosts(newLiked)
    setActionInProgress((prev) => new Set(prev).add(postId))

    try {
      const res = await fetch(`/api/discussions/posts/${postId}/like`, { method: "POST" })
      if (!res.ok) throw new Error("Failed to like post")
      await loadPosts()
    } catch (error) {
      console.error("Error toggling like:", error)
      setLikedPosts(likedPosts)
      addToast("Failed to like post", "error")
    } finally {
      setActionInProgress((prev) => {
        const next = new Set(prev)
        next.delete(postId)
        return next
      })
    }
  }, [likedPosts, actionInProgress, addToast])

  const handleRepostPost = useCallback(async (postId: string) => {
    if (actionInProgress.has(postId)) return

    const isReposted = repostedPosts.has(postId)
    const newReposted = new Set(repostedPosts)

    if (isReposted) {
      newReposted.delete(postId)
    } else {
      newReposted.add(postId)
    }

    setRepostedPosts(newReposted)
    setActionInProgress((prev) => new Set(prev).add(postId))

    try {
      const res = await fetch(`/api/discussions/posts/${postId}/repost`, { method: "POST" })
      if (!res.ok) throw new Error("Failed to repost")
      await loadPosts()
    } catch (error) {
      console.error("Error toggling repost:", error)
      setRepostedPosts(repostedPosts)
      addToast("Failed to repost", "error")
    } finally {
      setActionInProgress((prev) => {
        const next = new Set(prev)
        next.delete(postId)
        return next
      })
    }
  }, [repostedPosts, actionInProgress, addToast])

  const handleReply = async (postId: string) => {
    if (!replyContent.trim()) {
      addToast("Reply cannot be empty", "error")
      return
    }

    try {
      const res = await fetch(`/api/discussions/posts/${postId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyContent }),
      })

      if (!res.ok) throw new Error("Failed to create reply")

      setReplyContent("")
      setReplyingTo(null)
      addToast("Reply posted!", "success")
      await loadPosts()
    } catch (error) {
      console.error("Error creating reply:", error)
      addToast("Failed to post reply", "error")
    }
  }

  const formatTime = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const minutes = Math.floor(diff / (1000 * 60))

    if (minutes < 60) return `${minutes}m`
    if (hours < 24) return `${hours}h`
    if (days < 7) return `${days}d`
    return d.toLocaleDateString()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-8">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium",
              toast.type === "success" ? "bg-green-500" : "bg-red-500",
            )}
          >
            {toast.type === "success" ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            {toast.message}
          </motion.div>
        ))}
      </div>

      {/* Compose Post */}
      <Card className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <CardContent className="p-4">
          <div className="space-y-4">
            <Textarea
              placeholder="What's happening?!"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value.substring(0, MAX_POST_LENGTH))}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && newPostContent.trim()) {
                  handleCreatePost()
                }
              }}
              className="resize-none min-h-20 text-base border-0 focus:ring-0 focus:outline-none"
            />

            {/* Character Counter & Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-sm font-medium",
                    newPostContent.length > MAX_POST_LENGTH * 0.9
                      ? "text-orange-500"
                      : "text-muted-foreground",
                  )}
                >
                  {newPostContent.length}/{MAX_POST_LENGTH}
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setNewPostContent("")}
                  disabled={!newPostContent.trim()}
                  size="sm"
                >
                  Clear
                </Button>
                <Button
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim() || posting || newPostContent.length > MAX_POST_LENGTH}
                  size="sm"
                  className="rounded-full px-6 font-bold"
                >
                  {posting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Posting
                    </>
                  ) : (
                    "Post"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      {loading ? (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        </div>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No posts yet. Be the first to start a discussion!
          </CardContent>
        </Card>
      ) : (
        posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer border-b hover:border-primary/50">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Avatar className="h-12 w-12 shrink-0 ring-1 ring-primary/10">
                    <AvatarImage src={post.user?.avatar_url || undefined} />
                    <AvatarFallback>{post.user?.full_name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-base">{post.user?.full_name || "Anonymous"}</span>
                      {post.user?.is_verified && (
                        <Badge variant="secondary" className="text-xs gap-1">
                          ✓ Verified
                        </Badge>
                      )}
                      <span className="text-muted-foreground text-sm">·</span>
                      <span className="text-muted-foreground text-sm hover:underline">
                        {formatTime(post.created_at)}
                      </span>
                    </div>

                    {/* Category */}
                    {post.category && post.category !== "general" && (
                      <Badge variant="outline" className="mb-3 capitalize text-xs">
                        {post.category}
                      </Badge>
                    )}

                    {/* Content */}
                    <p className="text-base whitespace-pre-wrap mb-3 leading-relaxed">{post.content}</p>

                    {/* Interactions */}
                    <div className="flex justify-between text-muted-foreground text-sm max-w-xs">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 h-9 px-0 text-xs hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950"
                        onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                        disabled={actionInProgress.has(post.id)}
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-xs">{post.replies_count}</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "gap-2 h-9 px-0 text-xs hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-950 transition-colors",
                          repostedPosts.has(post.id) && "text-green-500",
                        )}
                        onClick={() => handleRepostPost(post.id)}
                        disabled={actionInProgress.has(post.id)}
                      >
                        <Repeat2 className={cn("h-4 w-4", repostedPosts.has(post.id) && "fill-current")} />
                        <span className="text-xs">{post.reposts_count}</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "gap-2 h-9 px-0 text-xs hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors",
                          likedPosts.has(post.id) && "text-red-500",
                        )}
                        onClick={() => handleLikePost(post.id)}
                        disabled={actionInProgress.has(post.id)}
                      >
                        <Heart className={cn("h-4 w-4", likedPosts.has(post.id) && "fill-current")} />
                        <span className="text-xs">{post.likes_count}</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 h-9 px-0 text-xs hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950"
                      >
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Reply Composer */}
                    {replyingTo === post.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t space-y-2"
                      >
                        <Textarea
                          placeholder="Write your reply..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          className="resize-none min-h-16 text-sm border-0 focus:ring-0"
                          autoFocus
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setReplyingTo(null)
                              setReplyContent("")
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleReply(post.id)}
                            disabled={!replyContent.trim()}
                            className="rounded-full px-4"
                          >
                            Reply
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))
      )}
    </div>
  )
}
