"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Search, Send, MoreVertical, Phone, Video, Paperclip, Smile, Check, CheckCheck } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"

interface Conversation {
  partnerId: string
  partner: { id: string; full_name: string | null; avatar_url: string | null }
  lastMessage: any
  unreadCount: number
}

interface MessagesPageProps {
  conversations: Conversation[]
  currentUserId: string
}

export function MessagesPage({ conversations: initialConversations, currentUserId }: MessagesPageProps) {
  const supabase = createClient()
  const [conversations, setConversations] = useState(initialConversations)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [showNewModal, setShowNewModal] = useState(false)
  const [userSearch, setUserSearch] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const filteredConversations = conversations.filter((conv) =>
    conv.partner?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Load messages for selected conversation
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.partnerId)
    }
  }, [selectedConversation])

  // Realtime: subscribe to new messages and updates
  useEffect(() => {
    const channel = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload: any) => {
          const msg = payload.new
          // ignore if we already have it
          if (messages.find((m) => m.id === msg.id)) return

          // If the message belongs to the currently open conversation, append
          if (
            selectedConversation &&
            ((msg.sender_id === selectedConversation.partnerId && msg.receiver_id === currentUserId) ||
              (msg.sender_id === currentUserId && msg.receiver_id === selectedConversation.partnerId))
          ) {
            setMessages((prev) => [...prev, msg])
          }

          // Update conversations list (lastMessage + unread count)
          setConversations((prev) => {
            const idx = prev.findIndex((c) => c.partnerId === (msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id))
            const partnerId = msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id
            if (idx === -1) {
              // fetch minimal partner info might be missing; create placeholder
              const partner = { id: partnerId, full_name: "Unknown", avatar_url: null }
              return [
                { partnerId, partner, lastMessage: msg, unreadCount: msg.receiver_id === currentUserId && !msg.read ? 1 : 0 },
                ...prev,
              ]
            }

            const newConvs = [...prev]
            const conv = newConvs[idx]
            conv.lastMessage = msg
            if (msg.receiver_id === currentUserId && !msg.read) {
              conv.unreadCount = (conv.unreadCount || 0) + 1
            }
            // move conversation to top
            newConvs.splice(idx, 1)
            return [conv, ...newConvs]
          })
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload: any) => {
          const msg = payload.new
          // update read status in messages and conversations
          setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, ...msg } : m)))
          setConversations((prev) => prev.map((c) => (c.lastMessage?.id === msg.id ? { ...c, lastMessage: { ...c.lastMessage, ...msg }, unreadCount: msg.read && c.unreadCount ? Math.max(0, c.unreadCount - 1) : c.unreadCount } : c)))
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, currentUserId, selectedConversation, messages])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const loadMessages = async (partnerId: string) => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${currentUserId},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${currentUserId})`,
      )
      .order("created_at", { ascending: true })

    setMessages(data || [])

    // Mark messages as read
    await supabase
      .from("messages")
      .update({ read: true })
      .eq("sender_id", partnerId)
      .eq("receiver_id", currentUserId)
      .eq("read", false)
  }

  const searchUsers = async () => {
    if (!userSearch.trim()) return
    setSearchLoading(true)
    try {
      const res = await fetch(`/api/dashboard/chat/search?q=${encodeURIComponent(userSearch.trim())}`)
      const json = await res.json()
      setSearchResults(json.users || [])
    } catch (e) {
      console.error(e)
      setSearchResults([])
    }
    setSearchLoading(false)
  }

  const startConversationWith = async (user: any) => {
    // Create a placeholder conversation and open it
    const conv = {
      partnerId: user.id,
      partner: { id: user.id, full_name: user.full_name, avatar_url: user.avatar_url },
      lastMessage: { id: `init-${Date.now()}`, content: "", created_at: new Date().toISOString() },
      unreadCount: 0,
    }

    setConversations((prev) => [conv, ...prev.filter((c) => c.partnerId !== conv.partnerId)])
    setSelectedConversation(conv)
    setMessages([])
    setShowNewModal(false)
    // Pre-create an empty message thread server-side? Not necessary here — client will post messages to messages endpoint.
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    setIsSending(true)
    const { data, error } = await supabase
      .from("messages")
      .insert({
        sender_id: currentUserId,
        receiver_id: selectedConversation.partnerId,
        content: newMessage.trim(),
      })
      .select()
      .single()

    if (!error && data) {
      setMessages([...messages, data])
      setNewMessage("")
    }
    setIsSending(false)
  }

  const formatTime = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (days === 1) {
      return "Yesterday"
    } else if (days < 7) {
      return d.toLocaleDateString([], { weekday: "short" })
    }
    return d.toLocaleDateString([], { month: "short", day: "numeric" })
  }

  return (
    <div className="h-[calc(100vh-8rem)] relative">
      <div className="flex h-full gap-4">
        {/* Conversations List */}
        <Card className="w-80 flex flex-col shrink-0">
          <CardHeader className="p-4 border-b">
            <h2 className="text-xl font-bold">Messages</h2>
            {/* floating 'New' handled by bottom-left button */}
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <ScrollArea className="flex-1">
            <div className="p-2">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No conversations yet</p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <motion.button
                    key={conv.partnerId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setSelectedConversation(conv)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                      selectedConversation?.partnerId === conv.partnerId ? "bg-primary/10" : "hover:bg-muted",
                    )}
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={conv.partner?.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback>{conv.partner?.full_name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{conv.partner?.full_name || "Unknown"}</p>
                        <span className="text-xs text-muted-foreground">{formatTime(conv.lastMessage.created_at)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conv.lastMessage.content}</p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <Badge className="h-5 w-5 p-0 flex items-center justify-center rounded-full bg-red-500">
                        {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                      </Badge>
                    )}
                  </motion.button>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* New Message Modal */}
        {showNewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowNewModal(false)} />
            <div className="bg-background rounded-lg w-full max-w-md p-4 z-10">
              <h3 className="text-lg font-semibold mb-2">Start a new conversation</h3>
              <Input
                placeholder="Search users by name"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchUsers()}
                className="mb-2"
              />
              <div className="mb-4">
                <Button onClick={searchUsers} disabled={searchLoading}>
                  {searchLoading ? "Searching..." : "Search"}
                </Button>
              </div>
              <div className="max-h-60 overflow-auto space-y-2">
                {searchResults.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No users found</div>
                ) : (
                  searchResults.map((u) => (
                    <div key={u.id} className="flex items-center justify-between gap-2 p-2 rounded hover:bg-muted">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={u.avatar_url || undefined} />
                          <AvatarFallback>{u.full_name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{u.full_name}</div>
                          <div className="text-xs text-muted-foreground">{u.email || ""}</div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          startConversationWith(u)
                        }}
                      >
                        Start
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <CardHeader className="p-4 border-b flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedConversation.partner?.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>{selectedConversation.partner?.full_name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedConversation.partner?.full_name || "Unknown"}</p>
                    <p className="text-sm text-muted-foreground">Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg, index) => {
                    const isMine = msg.sender_id === currentUserId
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className={cn("flex", isMine ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "max-w-[70%] rounded-2xl px-4 py-2",
                            isMine ? "bg-primary text-primary-foreground" : "bg-muted",
                          )}
                        >
                          <p>{msg.content}</p>
                          <div
                            className={cn(
                              "flex items-center gap-1 mt-1 text-xs",
                              isMine ? "text-primary-foreground/70 justify-end" : "text-muted-foreground",
                            )}
                          >
                            <span>{formatTime(msg.created_at)}</span>
                            {isMine && (msg.read ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />)}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input Area */}
              <CardContent className="p-4 border-t">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                    className="flex-1"
                  />
                  <Button variant="ghost" size="icon">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button onClick={sendMessage} disabled={!newMessage.trim() || isSending} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8" />
                </div>
                <p className="text-lg font-medium">Select a conversation</p>
                <p className="text-sm">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Floating start messaging button (bottom-right of chat area) */}
      <div className="absolute right-6 bottom-6 z-40">
        <Button onClick={() => setShowNewModal(true)} className="h-14 w-14 rounded-full p-0 flex items-center justify-center shadow-lg">
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Conversation actions menu (archive/pin) */}
      {selectedConversation && (
        <div className="absolute right-6 top-20 z-40 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.log("Archive:", selectedConversation.partnerId)
            }}
          >
            Archive
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.log("Pin:", selectedConversation.partnerId)
            }}
          >
            Pin
          </Button>
        </div>
      )}
    </div>
  )
}
