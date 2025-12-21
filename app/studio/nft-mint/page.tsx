"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, CheckCircle, Loader2, ImageIcon } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function NFTMintPage() {
  const [step, setStep] = useState(1)
  const [uploading, setUploading] = useState(false)
  const [minting, setMinting] = useState(false)
  const [minted, setMinted] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "art",
    royalty: "5",
    supply: "1",
    blockchain: "konet",
    price: "",
  })

  const router = useRouter()
  const supabase = createClient()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploading(true)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        setUploading(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleMint = async () => {
    setMinting(true)
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Store NFT metadata in database
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      await supabase.from("listings").insert({
        seller_id: user.id,
        title: formData.name,
        description: formData.description,
        listing_type: "nft",
        price: Number.parseFloat(formData.price) || 0,
        is_verified: false,
        status: "pending",
        metadata: {
          blockchain: formData.blockchain,
          royalty: formData.royalty,
          supply: formData.supply,
          category: formData.category,
          image_url: imagePreview,
        },
      })
    }

    setMinting(false)
    setMinted(true)
  }

  if (minted) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full text-center">
          <CardContent className="pt-12 pb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">NFT Minted Successfully!</h2>
            <p className="text-muted-foreground mb-6">
              Your NFT has been created and is now pending verification before it appears in the marketplace.
            </p>
            <div className="bg-muted rounded-lg p-6 mb-6">
              {imagePreview && (
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt={formData.name}
                  className="w-48 h-48 object-cover rounded-lg mx-auto mb-4"
                />
              )}
              <h3 className="font-semibold text-lg">{formData.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{formData.description}</p>
              <div className="flex items-center justify-center gap-4 mt-4">
                <Badge>{formData.blockchain.toUpperCase()}</Badge>
                <Badge variant="secondary">{formData.supply} Edition(s)</Badge>
                <Badge variant="secondary">{formData.royalty}% Royalty</Badge>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => router.push("/dashboard/listings")}>View in Dashboard</Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Mint Another
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
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
            <h1 className="font-semibold">NFT Minting Studio</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Step {step} of 3</Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1">
                <div className={`h-2 rounded-full ${s <= step ? "bg-primary" : "bg-muted"} transition-colors`} />
              </div>
            ))}
          </div>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Upload Your Asset</CardTitle>
              <CardDescription>Upload the image or media file you want to tokenize as an NFT</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed rounded-lg p-12 text-center">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="max-w-md max-h-96 mx-auto rounded-lg shadow-lg"
                    />
                    <Button variant="outline" onClick={() => setImagePreview(null)}>
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">Drag and drop your file here, or click to browse</p>
                      <p className="text-sm text-muted-foreground">
                        Supported formats: JPG, PNG, GIF, SVG, MP4 (Max 50MB)
                      </p>
                    </div>
                    <Input
                      type="file"
                      className="max-w-xs mx-auto"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setStep(2)} disabled={!imagePreview}>
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>NFT Details</CardTitle>
              <CardDescription>Provide information about your NFT</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="name">NFT Name *</Label>
                <Input
                  id="name"
                  placeholder="My Awesome NFT"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your NFT..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="art">Art</SelectItem>
                      <SelectItem value="photography">Photography</SelectItem>
                      <SelectItem value="music">Music</SelectItem>
                      <SelectItem value="collectible">Collectible</SelectItem>
                      <SelectItem value="utility">Utility</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="supply">Supply / Editions</Label>
                  <Input
                    id="supply"
                    type="number"
                    min="1"
                    value={formData.supply}
                    onChange={(e) => setFormData({ ...formData, supply: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-4 justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setStep(3)} disabled={!formData.name || !formData.description}>
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Minting Configuration</CardTitle>
              <CardDescription>Set pricing and blockchain details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="blockchain">Blockchain</Label>
                  <Select
                    value={formData.blockchain}
                    onValueChange={(v) => setFormData({ ...formData, blockchain: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="konet">Konet Chain</SelectItem>
                      <SelectItem value="polygon">Polygon</SelectItem>
                      <SelectItem value="ethereum">Ethereum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="royalty">Royalty Percentage</Label>
                  <Select value={formData.royalty} onValueChange={(v) => setFormData({ ...formData, royalty: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0%</SelectItem>
                      <SelectItem value="2.5">2.5%</SelectItem>
                      <SelectItem value="5">5%</SelectItem>
                      <SelectItem value="10">10%</SelectItem>
                      <SelectItem value="15">15%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="price">Initial Price (USD)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">Leave empty to list as not for sale</p>
              </div>
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <h4 className="font-medium">Minting Fee Estimate</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Gas Fee</span>
                  <span>~$2.50</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform Fee</span>
                  <span>$1.00</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span>~$3.50</span>
                </div>
              </div>
              <div className="flex gap-4 justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button onClick={handleMint} disabled={minting}>
                  {minting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {minting ? "Minting..." : "Mint NFT"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
