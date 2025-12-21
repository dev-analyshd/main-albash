"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Send, Users, Settings, Crown, UserMinus } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

interface CollaborationRoomProps {
  room: {
    id: string
    name: string
    description: string | null
    room_type: string
    owner: { id: string; full_name: string | null; avatar_url: string | null }
    members: {
      user_id: string
      role: string
      user: { id: string; full_name: string | null; avatar_url: string | null }
    }[]
    messages: {
      id: string
      content: string
      created_at: string
      user: { id: string; full_name: string | null; avatar_url: string | null }
    }[]
  }
  currentUserId: string
}

export function CollaborationRoom({ room, currentUserId }: CollaborationRoomProps) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState(room.messages || [])
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const isOwner = room.owner?.id === currentUserId

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Subscribe to new messages
  useEffect(() => {
    const channel = supabase
      .channel(`room-${room.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "room_messages",
          filter: `room_id=eq.${room.id}`,
        },
        async (payload: any) => {
          // Fetch full message with user data
          const { data } = await supabase
            .from("room_messages")
            .select("*, user:profiles(id, full_name, avatar_url)")
            .eq("id", payload.new.id)
            .single()

          if (data) {
            setMessages((prev) => [...prev, data])
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [room.id, supabase])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setSending(true)
    await supabase.from("room_messages").insert({
      room_id: room.id,
      user_id: currentUserId,
      content: message.trim(),
    })
    setMessage("")
    setSending(false)
  }

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/community/collaboration">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-semibold text-lg">{room.name}</h1>
            <p className="text-sm text-muted-foreground">{room.members?.length || 0} members</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="capitalize">
            {room.room_type}
          </Badge>
          {isOwner && (
            <Button variant="outline" size="icon" className="bg-transparent">
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.user?.id === currentUserId
                  return (
                    <div key={msg.id} className={`flex items-start gap-3 ${isOwn ? "flex-row-reverse" : ""}`}>
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={msg.user?.avatar_url || undefined} />
                        <AvatarFallback className="text-xs">{msg.user?.full_name?.charAt(0) || "?"}</AvatarFallback>
                      </Avatar>
                      <div className={`max-w-[70%] ${isOwn ? "text-right" : ""}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{msg.user?.full_name || "Unknown"}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <div className={`rounded-lg p-3 ${isOwn ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <form onSubmit={sendMessage} className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={sending}
              />
              <Button type="submit" disabled={sending || !message.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>

        {/* Members Sidebar */}
        <div className="hidden lg:block w-64 border-l">
          <Card className="h-full rounded-none border-0">
            <CardHeader className="py-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4" />
                Members ({room.members?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-16rem)]">
                <div className="px-4 space-y-2">
                  {room.members?.map((member) => (
                    <div key={member.user_id} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.user?.avatar_url || undefined} />
                          <AvatarFallback className="text-xs">
                            {member.user?.full_name?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium line-clamp-1">{member.user?.full_name}</p>
                          {member.role === "owner" && (
                            <div className="flex items-center gap-1 text-xs text-yellow-600">
                              <Crown className="h-3 w-3" />
                              Owner
                            </div>
                          )}
                        </div>
                      </div>
                      {isOwner && member.user_id !== currentUserId && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
