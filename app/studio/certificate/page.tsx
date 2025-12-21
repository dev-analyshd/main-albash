"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Download, Award, Calendar } from "lucide-react"
import Link from "next/link"

const templates = [
  { id: "classic", name: "Classic", color: "from-blue-500 to-blue-600" },
  { id: "elegant", name: "Elegant", color: "from-purple-500 to-purple-600" },
  { id: "modern", name: "Modern", color: "from-green-500 to-green-600" },
  { id: "professional", name: "Professional", color: "from-gray-600 to-gray-800" },
]

export default function CertificateMakerPage() {
  const [template, setTemplate] = useState("classic")
  const [formData, setFormData] = useState({
    recipientName: "",
    title: "Certificate of Achievement",
    description: "This certificate is presented to",
    achievement: "Outstanding Performance",
    issuer: "AlbashSolution",
    date: new Date().toISOString().split("T")[0],
  })

  const selectedTemplate = templates.find((t) => t.id === template)

  const handleDownload = () => {
    alert("Certificate download feature - integrate html2canvas for production")
  }

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
            <h1 className="font-semibold">Certificate Generator</h1>
          </div>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 grid gap-8 lg:grid-cols-2">
        {/* Editor */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Design Your Certificate</h2>
            <p className="text-muted-foreground">
              Create professional certificates for achievements, courses, and more
            </p>
          </div>

          <Card className="p-6 space-y-4">
            <div>
              <Label>Template</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTemplate(t.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      template === t.id ? "border-primary" : "border-transparent bg-muted"
                    }`}
                  >
                    <div className={`w-full h-12 rounded bg-gradient-to-r ${t.color} mb-2`} />
                    <p className="text-sm font-medium">{t.name}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="title">Certificate Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="recipientName">Recipient Name</Label>
              <Input
                id="recipientName"
                placeholder="John Doe"
                value={formData.recipientName}
                onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="achievement">Achievement / Course Name</Label>
              <Input
                id="achievement"
                placeholder="Web Development Bootcamp"
                value={formData.achievement}
                onChange={(e) => setFormData({ ...formData, achievement: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="description">Description Text</Label>
              <Textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="issuer">Issued By</Label>
                <Input
                  id="issuer"
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Preview */}
        <div className="lg:sticky lg:top-20 h-fit">
          <h3 className="font-semibold mb-4">Preview</h3>
          <div
            className={`relative aspect-[1.414/1] bg-gradient-to-br ${selectedTemplate?.color} rounded-lg shadow-2xl p-12 flex flex-col items-center justify-center text-white overflow-hidden`}
          >
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 border-4 border-white rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-32 h-32 border-4 border-white rounded-full translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="relative z-10 text-center space-y-6 w-full">
              <Award className="h-16 w-16 mx-auto opacity-80" />
              <h2 className="text-4xl font-bold">{formData.title}</h2>
              <p className="text-lg opacity-90">{formData.description}</p>
              <div className="py-4">
                <p className="text-5xl font-bold mb-2">{formData.recipientName || "[Recipient Name]"}</p>
              </div>
              <p className="text-xl">For {formData.achievement || "[Achievement]"}</p>
              <div className="pt-8 border-t border-white/30 flex items-center justify-between text-sm">
                <div>
                  <p className="opacity-80 mb-1">Issued by</p>
                  <p className="font-semibold">{formData.issuer}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 opacity-80" />
                  <span>{new Date(formData.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
