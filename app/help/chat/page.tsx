"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Send, Bot, User, Clock } from "lucide-react"

export default function LiveChatPage() {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content: "Hello! Welcome to AlbashSolutions support. How can I help you today?",
      time: "Just now",
    },
  ])
  const [input, setInput] = useState("")

  const sendMessage = () => {
    if (!input.trim()) return

    setMessages([
      ...messages,
      { type: "user", content: input, time: "Just now" },
      {
        type: "bot",
        content:
          "Thank you for your message. Our support team typically responds within 2-4 hours during business hours. In the meantime, you might find answers in our documentation or FAQ section.",
        time: "Just now",
      },
    ])
    setInput("")
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-8 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4">Support</Badge>
          <h1 className="text-3xl font-bold mb-2">Live Chat Support</h1>
          <p className="text-muted-foreground">Chat with our support team in real-time</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Status */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar>
                    <AvatarImage src="/support-agent.png" />
                    <AvatarFallback>AS</AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
                </div>
                <div>
                  <p className="font-medium">AlbashSolutions Support</p>
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    Online
                  </p>
                </div>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Avg. response: 5 mins
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="mb-6">
          <CardHeader className="border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Chat
            </CardTitle>
            <CardDescription>Our support team is here to help</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${message.type === "user" ? "flex-row-reverse" : ""}`}
                >
                  <Avatar className="h-8 w-8">
                    {message.type === "bot" ? (
                      <>
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </>
                    ) : (
                      <>
                        <AvatarFallback className="bg-muted">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  <div className={`max-w-[70%] ${message.type === "user" ? "text-right" : ""}`}>
                    <div
                      className={`rounded-lg p-3 ${
                        message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{message.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <Button onClick={sendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <p className="font-medium">View FAQs</p>
              <p className="text-sm text-muted-foreground">Find quick answers</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <p className="font-medium">Email Support</p>
              <p className="text-sm text-muted-foreground">Get detailed help</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
