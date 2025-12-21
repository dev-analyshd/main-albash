"use client"

import { useState } from "react"
import { ChevronDown, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

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

export function UniswapStyleSwap() {
  const [offerText, setOfferText] = useState("")
  const [requestText, setRequestText] = useState("")
  const [offerItem, setOfferItem] = useState<Item>(ITEMS[0])
  const [requestItem, setRequestItem] = useState<Item>(ITEMS[1])
  const [showOfferDropdown, setShowOfferDropdown] = useState(false)
  const [showRequestDropdown, setShowRequestDropdown] = useState(false)

  const handleSwapItems = () => {
    const temp = offerItem
    setOfferItem(requestItem)
    setRequestItem(temp)
    const tmpText = offerText
    setOfferText(requestText)
    setRequestText(tmpText)
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
    <div className="flex items-center justify-center min-h-screen bg-white p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Swap ideas and offers
          </h1>
        </div>

        {/* Main Swap Card */}
        <Card className="bg-white border border-slate-200 p-6 space-y-4">
          {/* Sell Section */}
          <div className="rounded-xl p-4 border border-slate-100">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-3">
              Offer
            </label>
            
            <div className="flex gap-3">
              {/* Offer Input */}
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

              {/* Token Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowOfferDropdown(!showOfferDropdown)}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-50 px-4 py-2 rounded-lg transition-colors border border-slate-200"
                >
                  <span className="font-semibold text-slate-900">{offerItem.title}</span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>

                {/* Dropdown */}
                {showOfferDropdown && (
                  <div className="absolute right-0 top-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-10 w-56">
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

          {/* Swap Button / Arrow */}
          <div className="flex justify-center">
            <button
              onClick={handleSwapItems}
              className="p-3 rounded-full bg-slate-100 hover:bg-slate-50 border border-slate-200 transition-colors"
              title="Swap items"
            >
              <ArrowDown className="h-5 w-5 text-slate-700" />
            </button>
          </div>

          {/* Buy Section */}
          <div className="rounded-xl p-4 border border-slate-100">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-3">
              Request
            </label>

            <div className="flex gap-3">
              {/* Request Input */}
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

              {/* Item Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowRequestDropdown(!showRequestDropdown)}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-50 px-4 py-2 rounded-full transition-colors font-semibold text-slate-900 border border-slate-200"
                >
                  <span>{requestItem.title}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* Dropdown */}
                {showRequestDropdown && (
                  <div className="absolute right-0 top-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-10 w-56">
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

          {/* Get Started Button */}
          <Button
            size="lg"
            className="w-full bg-primary hover:opacity-90 text-white font-semibold h-14 text-lg rounded-lg transition-colors"
            disabled={!offerText}
          >
            Get started
          </Button>

          {/* Info Text */}
          <p className="text-center text-sm text-slate-500">
            Swap ideas, services, and proposals with others in the community.
          </p>
        </Card>
      </div>
    </div>
  )
}
