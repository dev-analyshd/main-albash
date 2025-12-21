"use client"

import { motion } from "framer-motion"
import { ArrowLeftRight, Plus, Inbox, Send, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SwapCard } from "./swap-card"
import Link from "next/link"
import type { SwapRequest } from "@/lib/types"

interface SwapDashboardContentProps {
  sentSwaps: any[]
  receivedSwaps: any[]
  activeSwaps: any[]
  completedSwaps: any[]
  pendingSwaps: any[]
  userId: string
}

export function SwapDashboardContent({
  sentSwaps,
  receivedSwaps,
  activeSwaps,
  completedSwaps,
  pendingSwaps,
  userId,
}: SwapDashboardContentProps) {
  const stats = [
    {
      title: "Pending Requests",
      value: pendingSwaps.filter((s) => s.target_user_id === userId).length,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Active Swaps",
      value: activeSwaps.length,
      icon: ArrowLeftRight,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Completed",
      value: completedSwaps.length,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Swaps",
      value: sentSwaps.length + receivedSwaps.length,
      icon: ArrowLeftRight,
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Swaps</h1>
          <p className="text-muted-foreground">Manage your value exchange proposals</p>
        </div>
        <Link href="/swap-center">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Swap
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active ({activeSwaps.length})</TabsTrigger>
          <TabsTrigger value="received">Received ({receivedSwaps.length})</TabsTrigger>
          <TabsTrigger value="sent">Sent ({sentSwaps.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedSwaps.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeSwaps.length > 0 ? (
            <div className="grid gap-4">
              {activeSwaps.map((swap) => (
                <Link key={swap.id} href={`/swap-center/${swap.id}`}>
                  <SwapCard swap={swap} viewType={swap.initiator_id === userId ? "sent" : "received"} />
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <ArrowLeftRight className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="font-semibold text-lg mb-2">No active swaps</h3>
                <p className="text-muted-foreground mb-4">You don't have any active swaps at the moment.</p>
                <Link href="/swap-center">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Swap
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="received" className="space-y-4">
          {receivedSwaps.length > 0 ? (
            <div className="grid gap-4">
              {receivedSwaps.map((swap) => (
                <Link key={swap.id} href={`/swap-center/${swap.id}`}>
                  <SwapCard swap={swap} viewType="received" />
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Inbox className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="font-semibold text-lg mb-2">No received swaps</h3>
                <p className="text-muted-foreground">You haven't received any swap proposals yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          {sentSwaps.length > 0 ? (
            <div className="grid gap-4">
              {sentSwaps.map((swap) => (
                <Link key={swap.id} href={`/swap-center/${swap.id}`}>
                  <SwapCard swap={swap} viewType="sent" />
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Send className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="font-semibold text-lg mb-2">No sent swaps</h3>
                <p className="text-muted-foreground mb-4">Create your first swap proposal to get started.</p>
                <Link href="/swap-center">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Swap
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedSwaps.length > 0 ? (
            <div className="grid gap-4">
              {completedSwaps.map((swap) => (
                <Link key={swap.id} href={`/swap-center/${swap.id}`}>
                  <SwapCard swap={swap} viewType={swap.initiator_id === userId ? "sent" : "received"} />
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="font-semibold text-lg mb-2">No completed swaps</h3>
                <p className="text-muted-foreground">Your completed swaps will appear here.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

