"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeftRight, Plus, Inbox, Send, ChevronDown, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { SwapCard } from "./swap-card"
import { SwapProposalForm } from "./swap-proposal-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Link from "next/link"
import type { SwapRequest } from "@/lib/types"

interface SwapCenterContentProps {
  sentSwaps: any[]
  receivedSwaps: any[]
  userId: string
}

interface Item {
  id: string
  title: string
  description?: string
}

const ITEMS: Item[] = [
  { id: "idea", title: "Idea" },
  { id: "feature", title: "Feature" },
  { id: "service", title: "Service" },
  { id: "skill", title: "Skill" },
  { id: "resource", title: "Resource" },
]

export function SwapCenterContent({ sentSwaps, receivedSwaps, userId }: SwapCenterContentProps) {
  const [showProposalDialog, setShowProposalDialog] = useState(false)
  const [offerText, setOfferText] = useState("")
  const [requestText, setRequestText] = useState("")
  const [offerItem, setOfferItem] = useState<Item>(ITEMS[0])
  const [requestItem, setRequestItem] = useState<Item>(ITEMS[1])
  const [showOfferDropdown, setShowOfferDropdown] = useState(false)
  const [showRequestDropdown, setShowRequestDropdown] = useState(false)

  const pendingReceived = receivedSwaps.filter((s) => s.status === "pending")
  const activeSwaps = [...sentSwaps, ...receivedSwaps].filter((s) => ["accepted", "pending"].includes(s.status))

  const handleSwapItems = () => {
    const temp = offerItem
    setOfferItem(requestItem)
    setRequestItem(temp)
    const tmp = offerText
    setOfferText(requestText)
    setRequestText(tmp)
  }

  const handleOfferSelect = (item: Item) => {
    if (item.id !== requestItem.id) setOfferItem(item)
    setShowOfferDropdown(false)
  }

  const handleRequestSelect = (item: Item) => {
    if (item.id !== offerItem.id) setRequestItem(item)
    setShowRequestDropdown(false)
  }

  return (
    <div className="space-y-12">
      {/* Offer/Request Swap Section */}
      <div className="flex items-center justify-center px-4 py-12 bg-white rounded-2xl border border-slate-200">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-slate-900 mb-1">Swap Offers</h1>
            <p className="text-sm text-slate-500">Create an offer and request something in return</p>
          </div>

          {/* Main Card */}
          <Card className="bg-white border border-slate-200 p-6 space-y-4">
            {/* Offer Section */}
            <div className="rounded-xl p-4 border border-slate-100">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-3">Offer</label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Describe what you're offering"
                    value={offerText}
                    onChange={(e) => setOfferText(e.target.value)}
                    className="bg-transparent border-0 text-lg font-medium text-slate-900 placeholder-slate-400 p-0 focus-visible:ring-0 h-auto"
                  />
                  <div className="text-xs text-slate-500 mt-1">Optional: add short details</div>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowOfferDropdown(!showOfferDropdown)}
                    className="flex items-center gap-2 bg-slate-100 hover:bg-slate-50 px-4 py-2 rounded-lg transition-colors border border-slate-200"
                  >
                    <span className="font-semibold text-slate-900">{offerItem.title}</span>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </button>

                  {showOfferDropdown && (
                    <div className="absolute right-0 top-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-20 w-56">
                      {ITEMS.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleOfferSelect(item)}
                          className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
                        >
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="font-semibold text-slate-900">{item.title}</div>
                              <div className="text-xs text-slate-400">{item.description || ""}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <button
                onClick={handleSwapItems}
                className="p-3 rounded-full bg-slate-100 hover:bg-slate-50 border border-slate-200 transition-colors"
                title="Swap items"
              >
                <ArrowDown className="h-5 w-5 text-slate-700" />
              </button>
            </div>

            {/* Request Section */}
            <div className="rounded-xl p-4 border border-slate-100">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-3">Request</label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Describe what you request in return"
                    value={requestText}
                    onChange={(e) => setRequestText(e.target.value)}
                    className="bg-transparent border-0 text-lg font-medium text-slate-900 placeholder-slate-400 p-0 focus-visible:ring-0 h-auto"
                  />
                  <div className="text-xs text-slate-500 mt-1">Optional: add short details</div>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowRequestDropdown(!showRequestDropdown)}
                    className="flex items-center gap-2 bg-slate-100 hover:bg-slate-50 px-4 py-2 rounded-full transition-colors font-semibold text-slate-900 border border-slate-200"
                  >
                    <span>{requestItem.title}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {showRequestDropdown && (
                    <div className="absolute right-0 top-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-20 w-56">
                      {ITEMS.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleRequestSelect(item)}
                          className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
                        >
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="font-semibold text-slate-900">{item.title}</div>
                              <div className="text-xs text-slate-400">{item.description || ""}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full bg-primary hover:opacity-90 text-white font-semibold h-14 text-lg rounded-lg transition-colors"
              onClick={() => setShowProposalDialog(true)}
              disabled={!offerText}
            >
              Get started
            </Button>
          </Card>
        </div>
      </div>

      {/* Existing Swap Management Section */}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-full bg-primary/10">
                <ArrowLeftRight className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Your Swaps</h2>
                <p className="text-muted-foreground">Manage your exchanges</p>
              </div>
            </div>
          </div>
          <Dialog open={showProposalDialog} onOpenChange={setShowProposalDialog}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Swap Proposal</DialogTitle>
                <DialogDescription>Propose a value exchange with another user</DialogDescription>
              </DialogHeader>
              <SwapProposalForm onClose={() => setShowProposalDialog(false)} />
            </DialogContent>
          </Dialog>
          <Button onClick={() => setShowProposalDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Swap
          </Button>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Requests</p>
                  <p className="text-2xl font-bold">{pendingReceived.length}</p>
                </div>
                <Inbox className="h-8 w-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Swaps</p>
                  <p className="text-2xl font-bold">{activeSwaps.length}</p>
                </div>
                <ArrowLeftRight className="h-8 w-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Sent Swaps</p>
                  <p className="text-2xl font-bold">{sentSwaps.length}</p>
                </div>
                <Send className="h-8 w-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="received" className="space-y-4">
          <TabsList>
            <TabsTrigger value="received">
              Received ({receivedSwaps.length})
            </TabsTrigger>
            <TabsTrigger value="sent">
              Sent ({sentSwaps.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active ({activeSwaps.length})
            </TabsTrigger>
          </TabsList>

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
                  <p className="text-muted-foreground mb-4">You haven't received any swap proposals yet.</p>
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
                  <Button onClick={() => setShowProposalDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Swap
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {activeSwaps.length > 0 ? (
              <div className="grid gap-4">
                {activeSwaps.map((swap) => (
                  <Link key={swap.id} href={`/swap-center/${swap.id}`}>
                    <SwapCard
                      swap={swap}
                      viewType={swap.initiator_id === userId ? "sent" : "received"}
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <ArrowLeftRight className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No active swaps</h3>
                  <p className="text-muted-foreground mb-4">You don't have any active swaps at the moment.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

