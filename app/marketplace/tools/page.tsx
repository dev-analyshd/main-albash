"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Star, Lock, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import * as Icons from "lucide-react"

const toolCategories = [
  "All",
  "Business",
  "Design",
  "Builder",
  "Academic",
  "Verification",
  "Tokenization",
  "Marketplace",
  "Data",
]

const tools = [
  {
    id: 1,
    name: "Business Plan Generator",
    description: "AI-powered business plan creation tool",
    category: "Business",
    icon: "FileText",
    isPremium: false,
  },
  {
    id: 2,
    name: "Logo Maker",
    description: "Create professional logos instantly",
    category: "Design",
    icon: "PenTool",
    isPremium: false,
  },
  {
    id: 3,
    name: "Idea Validator",
    description: "Validate your business ideas",
    category: "Builder",
    icon: "CheckCircle",
    isPremium: false,
  },
  {
    id: 4,
    name: "Syllabus Builder",
    description: "Create course syllabi",
    category: "Academic",
    icon: "BookOpen",
    isPremium: false,
  },
  {
    id: 5,
    name: "Document Verifier",
    description: "Verify document authenticity",
    category: "Verification",
    icon: "FileCheck",
    isPremium: true,
  },
  {
    id: 6,
    name: "NFT Minter",
    description: "Create and mint NFTs",
    category: "Tokenization",
    icon: "Hexagon",
    isPremium: true,
  },
  {
    id: 7,
    name: "Product Lister",
    description: "List products quickly",
    category: "Marketplace",
    icon: "PlusSquare",
    isPremium: false,
  },
  {
    id: 8,
    name: "Data Visualizer",
    description: "Create data charts",
    category: "Data",
    icon: "PieChart",
    isPremium: false,
  },
  {
    id: 9,
    name: "Invoice Creator",
    description: "Professional invoice generation system",
    category: "Business",
    icon: "Receipt",
    isPremium: false,
  },
  {
    id: 10,
    name: "Color Palette Generator",
    description: "Generate beautiful color schemes",
    category: "Design",
    icon: "Palette",
    isPremium: false,
  },
  {
    id: 11,
    name: "MVP Planner",
    description: "Plan your minimum viable product",
    category: "Builder",
    icon: "Rocket",
    isPremium: false,
  },
  {
    id: 12,
    name: "Citation Generator",
    description: "Academic citation tool",
    category: "Academic",
    icon: "Link",
    isPremium: false,
  },
  {
    id: 13,
    name: "Identity Checker",
    description: "Identity verification system",
    category: "Verification",
    icon: "UserCheck",
    isPremium: true,
  },
  {
    id: 14,
    name: "Token Creator",
    description: "Create custom tokens",
    category: "Tokenization",
    icon: "Circle",
    isPremium: true,
  },
  {
    id: 15,
    name: "Inventory Manager",
    description: "Track inventory levels",
    category: "Marketplace",
    icon: "Package",
    isPremium: false,
  },
  {
    id: 16,
    name: "Form Builder",
    description: "Build custom forms",
    category: "Data",
    icon: "Edit3",
    isPremium: false,
  },
]

export default function ToolsMarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tools Marketplace</h1>
        <p className="text-muted-foreground">100+ professional tools to help you build, create, and grow.</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tools..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {toolCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      <p className="text-sm text-muted-foreground mb-4">{filteredTools.length} tools available</p>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredTools.map((tool, index) => {
          const IconComponent = (Icons as any)[tool.icon] || Icons.Wrench
          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <div className="group bg-card rounded-xl border border-border p-4 hover:border-primary hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm truncate">{tool.name}</h3>
                      {tool.isPremium && (
                        <Badge variant="secondary" className="gap-1 shrink-0">
                          <Lock className="h-3 w-3" />
                          Pro
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{tool.description}</p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {tool.category}
                    </Badge>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 fill-chart-4 text-chart-4" />
                    4.8
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                    Launch
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
