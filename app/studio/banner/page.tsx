"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Download } from "lucide-react"
import Link from "next/link"

const presets = [
  { id: "hero", name: "Hero Banner", width: 1920, height: 600 },
  { id: "social", name: "Social Media", width: 1200, height: 628 },
  { id: "youtube", name: "YouTube Thumbnail", width: 1280, height: 720 },
  { id: "linkedin", name: "LinkedIn Banner", width: 1584, height: 396 },
  { id: "custom", name: "Custom Size", width: 1200, height: 400 },
]

const gradients = [
  { name: "Sunset", value: "from-orange-400 via-pink-500 to-purple-600" },
  { name: "Ocean", value: "from-cyan-400 via-blue-500 to-blue-600" },
  { name: "Forest", value: "from-green-400 via-emerald-500 to-teal-600" },
  { name: "Royal", value: "from-purple-400 via-violet-500 to-indigo-600" },
  { name: "Fire", value: "from-red-400 via-orange-500 to-yellow-600" },
]

export default function BannerMakerPage() {
  const [preset, setPreset] = useState("hero")
  const [gradient, setGradient] = useState(gradients[0].value)
  const [formData, setFormData] = useState({
    title: "Your Idea. Our Technology. Our Future.",
    subtitle: "Build, Verify, Tokenize, Grow",
    textColor: "#ffffff",
    fontSize: 48,
  })

  const selectedPreset = presets.find((p) => p.id === preset)

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-40 bg-background border-b">
        <div className="flex items-center justify-between px-4 h-14 container mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/studio">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="font-semibold">Banner Maker</h1>
          </div>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 grid gap-8 lg:grid-cols-2">
        {/* Editor */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Design Your Banner</h2>
            <p className="text-muted-foreground">
              Create eye-catching banners for your website, social media, and more
            </p>
          </div>

          <Card className="p-6 space-y-4">
            <div>
              <Label>Size Preset</Label>
              <Select value={preset} onValueChange={setPreset}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {presets.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} ({p.width}x{p.height})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Background Gradient</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {gradients.map((g) => (
                  <button
                    key={g.name}
                    onClick={() => setGradient(g.value)}
                    className={`h-12 rounded-lg bg-gradient-to-r ${g.value} border-2 transition-all ${
                      gradient === g.value ? "border-foreground scale-105" : "border-transparent"
                    }`}
                    title={g.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="title">Main Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              />
            </div>

            <div>
              <Label>Font Size: {formData.fontSize}px</Label>
              <Slider
                value={[formData.fontSize]}
                onValueChange={([v]) => setFormData({ ...formData, fontSize: v })}
                min={24}
                max={96}
                step={4}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="textColor">Text Color</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="textColor"
                  type="color"
                  value={formData.textColor}
                  onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  value={formData.textColor}
                  onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Preview */}
        <div className="lg:sticky lg:top-20 h-fit">
          <h3 className="font-semibold mb-4">Preview</h3>
          <div className="rounded-lg overflow-hidden shadow-2xl">
            <div
              className={`relative bg-gradient-to-r ${gradient} flex items-center justify-center p-12`}
              style={{
                aspectRatio: `${selectedPreset?.width} / ${selectedPreset?.height}`,
              }}
            >
              <div className="text-center space-y-4 max-w-3xl">
                <h1
                  className="font-bold leading-tight"
                  style={{
                    fontSize: `${formData.fontSize}px`,
                    color: formData.textColor,
                  }}
                >
                  {formData.title}
                </h1>
                <p
                  className="text-xl opacity-90"
                  style={{
                    color: formData.textColor,
                  }}
                >
                  {formData.subtitle}
                </p>
              </div>

              {/* Decorative elements */}
              <div
                className="absolute top-4 left-4 w-16 h-16 border-2 rounded-full opacity-20"
                style={{ borderColor: formData.textColor }}
              />
              <div
                className="absolute bottom-4 right-4 w-24 h-24 border-2 rounded-full opacity-20"
                style={{ borderColor: formData.textColor }}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {selectedPreset?.width} × {selectedPreset?.height} pixels
          </p>
        </div>
      </div>
    </div>
  )
}
