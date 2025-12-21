"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import {
  ArrowLeft,
  Download,
  Share2,
  Undo,
  Redo,
  Type,
  Square,
  Circle,
  ImageIcon,
  Palette,
  Layers,
  Move,
} from "lucide-react"
import Link from "next/link"

const colorPalettes = [
  { name: "Ocean", colors: ["#0077B6", "#00B4D8", "#90E0EF", "#CAF0F8", "#03045E"] },
  { name: "Sunset", colors: ["#FF6B6B", "#FFA06D", "#FFD93D", "#6BCB77", "#4D96FF"] },
  { name: "Forest", colors: ["#2D6A4F", "#40916C", "#52B788", "#74C69D", "#95D5B2"] },
  { name: "Lavender", colors: ["#7209B7", "#560BAD", "#480CA8", "#3A0CA3", "#3F37C9"] },
]

const templates = [
  { id: 1, name: "Social Post", size: "1080x1080", category: "social" },
  { id: 2, name: "Story", size: "1080x1920", category: "social" },
  { id: 3, name: "Logo", size: "500x500", category: "brand" },
  { id: 4, name: "Business Card", size: "1050x600", category: "brand" },
  { id: 5, name: "Banner", size: "1200x628", category: "marketing" },
  { id: 6, name: "Flyer", size: "2480x3508", category: "marketing" },
]

export default function DesignStudioPage() {
  const [selectedTool, setSelectedTool] = useState("select")
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })

  const tools = [
    { id: "select", icon: Move, label: "Select" },
    { id: "text", icon: Type, label: "Text" },
    { id: "rectangle", icon: Square, label: "Rectangle" },
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "image", icon: ImageIcon, label: "Image" },
  ]

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-4">
            <Link href="/studio">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <Input
                defaultValue="Untitled Design"
                className="h-8 w-48 border-none bg-transparent font-medium focus-visible:ring-0 px-0"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Redo className="h-4 w-4" />
            </Button>
            <Button variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Left Sidebar - Tools */}
        <aside className="w-16 border-r bg-background flex flex-col items-center py-4 gap-2">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={selectedTool === tool.id ? "secondary" : "ghost"}
              size="icon"
              className="w-12 h-12"
              onClick={() => setSelectedTool(tool.id)}
              title={tool.label}
            >
              <tool.icon className="h-5 w-5" />
            </Button>
          ))}
        </aside>

        {/* Left Panel - Elements */}
        <aside className="w-72 border-r bg-background overflow-y-auto">
          <Tabs defaultValue="templates" className="w-full">
            <TabsList className="w-full rounded-none border-b">
              <TabsTrigger value="templates" className="flex-1">
                Templates
              </TabsTrigger>
              <TabsTrigger value="elements" className="flex-1">
                Elements
              </TabsTrigger>
              <TabsTrigger value="uploads" className="flex-1">
                Uploads
              </TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="p-4">
              <Input placeholder="Search templates..." className="mb-4" />
              <div className="grid grid-cols-2 gap-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    className="aspect-square bg-muted rounded-lg border hover:border-primary transition-colors flex flex-col items-center justify-center text-center p-2"
                  >
                    <Layers className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-xs font-medium">{template.name}</span>
                    <span className="text-xs text-muted-foreground">{template.size}</span>
                  </button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="elements" className="p-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Shapes</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {["square", "circle", "triangle", "star"].map((shape) => (
                      <button
                        key={shape}
                        className="aspect-square bg-muted rounded-lg border hover:border-primary transition-colors flex items-center justify-center"
                      >
                        <div
                          className={`w-6 h-6 bg-foreground ${shape === "circle" ? "rounded-full" : "rounded-sm"}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Lines</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((i) => (
                      <button
                        key={i}
                        className="aspect-square bg-muted rounded-lg border hover:border-primary transition-colors flex items-center justify-center"
                      >
                        <div className="w-8 h-0.5 bg-foreground" style={{ transform: `rotate(${(i - 1) * 45}deg)` }} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="uploads" className="p-4">
              <Button variant="outline" className="w-full bg-transparent">
                <ImageIcon className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-4">
                Drag and drop files here or click to upload
              </p>
            </TabsContent>
          </Tabs>
        </aside>

        {/* Canvas Area */}
        <main className="flex-1 bg-muted/50 flex items-center justify-center p-8 overflow-auto">
          <div className="bg-white shadow-lg rounded-lg" style={{ width: canvasSize.width, height: canvasSize.height }}>
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <p className="text-sm">Click to add elements</p>
            </div>
          </div>
        </main>

        {/* Right Panel - Properties */}
        <aside className="w-72 border-l bg-background overflow-y-auto p-4">
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Color Palettes
              </h3>
              <div className="space-y-3">
                {colorPalettes.map((palette) => (
                  <div key={palette.name}>
                    <p className="text-xs text-muted-foreground mb-1">{palette.name}</p>
                    <div className="flex gap-1">
                      {palette.colors.map((color) => (
                        <button
                          key={color}
                          className="w-8 h-8 rounded-md border hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Canvas Size</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Width</Label>
                  <Input
                    type="number"
                    value={canvasSize.width}
                    onChange={(e) => setCanvasSize({ ...canvasSize, width: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Height</Label>
                  <Input
                    type="number"
                    value={canvasSize.height}
                    onChange={(e) => setCanvasSize({ ...canvasSize, height: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Opacity</h3>
              <Slider defaultValue={[100]} max={100} step={1} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
