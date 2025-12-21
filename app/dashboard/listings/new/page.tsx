"use client"

import type React from "react"
import { useState } from "react"
import { useWeb3 } from '@/lib/web3/web3-provider'
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Upload, X, Loader2, Shield, CreditCard, Wallet, Banknote, ArrowLeftRight } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const listingTypes = [
  { value: "physical", label: "Physical Product", description: "Tangible goods like crafts, food, clothing" },
  { value: "digital", label: "Digital Product", description: "Software, designs, documents, courses" },
  { value: "service", label: "Service", description: "Professional services, consulting, freelance work" },
  { value: "idea", label: "Idea / Innovation", description: "Business ideas, patents, concepts" },
  { value: "talent", label: "Talent / Skill", description: "Offer your skills and expertise" },
  { value: "tokenized", label: "Tokenized Asset", description: "NFT or blockchain-verified asset" },
]

const paymentMethods = [
  { id: "card", label: "Card Payment", icon: CreditCard, description: "Visa, Mastercard (via Paystack/Stripe)" },
  { id: "bank", label: "Bank Transfer", icon: Banknote, description: "Direct bank transfer (NGN/USD)" },
  { id: "crypto", label: "Cryptocurrency", icon: Wallet, description: "ETH, USDT, and other tokens" },
]

export default function NewListingPage() {
  const router = useRouter()
  const supabase = createClient()
  const { account, connectWallet, mintNFT, isConnected } = useWeb3()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [selectedPayments, setSelectedPayments] = useState<string[]>(["card", "bank"])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    currency: "NGN",
    category_id: "",
    listing_type: "physical",
    is_tokenized: false,
    swap_enabled: false,
    accepted_swap_types: [] as string[],
    valuation_method: "fixed" as "contract" | "fixed" | "hybrid",
    minimum_reputation: 0,
    swap_verification_required: true,
  })

  const { data: categories } = useSWR("/api/categories", fetcher)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const fileArray = Array.from(files).slice(0, 5)

    // Create object URLs for preview and save File objects for later upload
    const urls = fileArray.map((file) => URL.createObjectURL(file))
    setImages((prev) => [...prev, ...urls].slice(0, 5))
    setImageFiles((prev) => [...prev, ...fileArray].slice(0, 5))
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const uploadImagesToStorage = async (userId: string): Promise<string[]> => {
    const imageUrls: string[] = []
    
    for (const file of imageFiles) {
      try {
        const fileExt = file.name.split(".").pop()
        const fileName = `${userId}/listings/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("listings")
          .upload(fileName, file, { upsert: true })
        
        if (uploadError) {
          console.warn("Image upload error:", uploadError)
          continue
        }
        
        const { data: { publicUrl } } = supabase.storage.from("listings").getPublicUrl(fileName)
        imageUrls.push(publicUrl)
      } catch (err) {
        console.warn("Image upload failed:", err)
        continue
      }
    }
    
    return imageUrls
  }

  const togglePayment = (id: string) => {
    setSelectedPayments((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // Upload images to storage
      let imageUrls: string[] = []
      if (imageFiles.length > 0) {
        imageUrls = await uploadImagesToStorage(user.id)
      }

      // Prepare listing data
      const listingData = {
        title: formData.title,
        description: formData.description,
        price: formData.price ? Number.parseFloat(formData.price) : null,
        category_id: formData.category_id || null,
        listing_type: formData.listing_type,
        is_tokenized: formData.is_tokenized,
        images: imageUrls.length > 0 ? imageUrls : [],
        payment_methods: selectedPayments,
        currency: formData.currency,
        swap_enabled: formData.swap_enabled,
        accepted_swap_types: formData.accepted_swap_types.length > 0 ? formData.accepted_swap_types : null,
        valuation_method: formData.swap_enabled ? formData.valuation_method : null,
        minimum_reputation: formData.minimum_reputation || 0,
        swap_verification_required: formData.swap_verification_required,
      }

      // Create listing via API
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listingData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create listing')
      }

      const { data: listing } = await response.json()

      // If tokenization enabled, upload metadata and mint automatically
      if (formData.is_tokenized && imageFiles.length > 0) {
        try {
          // Ensure wallet connected
          if (!isConnected) await connectWallet()

          const file = imageFiles[0]
          const form = new FormData()
          form.append('name', formData.title || listing.title || 'Listing NFT')
          form.append('description', formData.description || listing.description || '')
          form.append('attributes', JSON.stringify([
            { trait_type: 'Creator', value: account || listing.user_id },
            { trait_type: 'Price', value: String(listing.price || formData.price || '0') },
          ]))
          form.append('listingId', listing.id)
          form.append('image', file)

          // Upload metadata to server
          const uploadResult = await new Promise<any>((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.open('POST', '/api/nft/mint')
            xhr.onload = () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                try {
                  resolve(JSON.parse(xhr.responseText))
                } catch (err) {
                  resolve({ success: true })
                }
              } else {
                reject(new Error(`Upload failed: ${xhr.statusText}`))
              }
            }
            xhr.onerror = () => reject(new Error('Network error during upload'))
            xhr.send(form)
          })

          if (uploadResult && uploadResult.tokenURI) {
            const priceStr = formData.price || String(listing.price || '0')
            const tx = await mintNFT(uploadResult.tokenURI, priceStr)
            const receipt = await tx.wait()

            // Confirm mint with backend
            try {
              await fetch('/api/nft/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  mintRecordId: uploadResult.mintRecordId,
                  transactionHash: receipt.transactionHash || tx.hash,
                  contractAddress: receipt.to || uploadResult.contractAddress || null,
                  tokenId: receipt.events?.[0]?.args?.tokenId?.toString?.() || null,
                  status: 'minted',
                }),
              })
            } catch (err) {
              console.warn('Failed to confirm mint record:', err)
            }

            // Update listing with token details
            try {
              await supabase
                .from('listings')
                .update({ token_uri: uploadResult.tokenURI, token_id: receipt.events?.[0]?.args?.tokenId?.toString?.() || null, token_contract_address: receipt.to || uploadResult.contractAddress || null })
                .eq('id', listing.id)
            } catch (err) {
              console.warn('Failed to update listing with token info:', err)
            }
          }
        } catch (err) {
          console.error('Automatic tokenization failed:', err)
        }
      }

      // Show success message
      router.push("/dashboard/listings?created=true")
      router.refresh()
    } catch (error: any) {
      // Extract meaningful error message from Supabase error or standard Error
      let errorMessage = "An error occurred while creating your listing"
      
      // Try to extract error message from various error formats
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage
      } else if (error?.message) {
        errorMessage = error.message
      } else if (error?.error_description) {
        errorMessage = error.error_description
      } else if (error?.details) {
        errorMessage = typeof error.details === 'string' ? error.details : JSON.stringify(error.details)
      } else if (error?.hint) {
        errorMessage = error.hint
      } else if (typeof error === 'string') {
        errorMessage = error
      } else if (error && typeof error === 'object') {
        // Try to stringify the error object to see what's in it
        try {
          const errorStr = JSON.stringify(error)
          if (errorStr && errorStr !== '{}') {
            errorMessage = `Error: ${errorStr}`
          }
        } catch {
          // If stringify fails, use default message
        }
      }
      
      // Log error details for debugging with structured information
      const errorDetails: any = {
        message: errorMessage,
      }
      
      if (error?.code) errorDetails.code = error.code
      if (error?.details && typeof error.details === 'string') errorDetails.details = error.details
      if (error?.hint) errorDetails.hint = error.hint
      if (error?.name) errorDetails.name = error.name
      
      console.error("Error creating listing:", errorDetails)
      
      // Show error to user via alert (can be replaced with toast notification)
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/listings">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create New Listing</h1>
          <p className="text-muted-foreground mt-1">Add a product, service, or asset to the marketplace</p>
        </div>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertTitle>Verification Required</AlertTitle>
        <AlertDescription>
          All listings go through our verification process before becoming public. This ensures quality and trust for
          all users.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
              <CardDescription>Add up to 5 images for your listing (first image is the cover)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                {images.map((url, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <img src={url || "/placeholder.svg"} alt="" className="object-cover w-full h-full" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-background/80 hover:bg-background"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-1 left-1 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
                {images.length < 5 && (
                  <label className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground mt-1">Upload</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Listing Type</CardTitle>
              <CardDescription>What are you listing?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {listingTypes.map((type) => (
                  <div
                    key={type.value}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      formData.listing_type === type.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setFormData({ ...formData, listing_type: type.value })}
                  >
                    <p className="font-medium">{type.label}</p>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter a clear, descriptive title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your listing in detail. Include features, specifications, and any relevant information..."
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <div className="flex gap-2">
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => setFormData({ ...formData, currency: value })}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NGN">NGN</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((cat: any) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Select which payment methods you accept</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedPayments.includes(method.id) ? "border-primary bg-primary/5" : "border-border"
                    }`}
                    onClick={() => togglePayment(method.id)}
                  >
                    <Checkbox checked={selectedPayments.includes(method.id)} />
                    <method.icon className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">{method.label}</p>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tokenization */}
          <Card>
            <CardHeader>
              <CardTitle>Blockchain Options</CardTitle>
              <CardDescription>Mint your listing as an NFT for additional security and ownership proof</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable NFT Tokenization</p>
                  <p className="text-sm text-muted-foreground">
                    Your listing will be minted as an NFT on the blockchain
                  </p>
                </div>
                <Switch
                  checked={formData.is_tokenized}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_tokenized: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Swap Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowLeftRight className="h-5 w-5" />
                Swap Options
              </CardTitle>
              <CardDescription>Allow users to swap value instead of just buying</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable Swaps</p>
                  <p className="text-sm text-muted-foreground">
                    Allow users to propose swaps for this listing
                  </p>
                </div>
                <Switch
                  checked={formData.swap_enabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, swap_enabled: checked })}
                />
              </div>

              {formData.swap_enabled && (
                <>
                  <div className="space-y-2 pt-4 border-t">
                    <Label>Accepted Swap Types</Label>
                    <p className="text-sm text-muted-foreground mb-2">Select what types of items you'll accept in swaps</p>
                    <div className="grid grid-cols-2 gap-2">
                      {["idea", "talent", "skill", "product", "service", "asset", "nft", "equity"].map((type) => (
                        <div key={type} className="flex items-center gap-2">
                          <Checkbox
                            checked={formData.accepted_swap_types.includes(type)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFormData({
                                  ...formData,
                                  accepted_swap_types: [...formData.accepted_swap_types, type],
                                })
                              } else {
                                setFormData({
                                  ...formData,
                                  accepted_swap_types: formData.accepted_swap_types.filter((t) => t !== type),
                                })
                              }
                            }}
                          />
                          <Label className="text-sm font-normal capitalize">{type}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Valuation Method</Label>
                    <Select
                      value={formData.valuation_method}
                      onValueChange={(value: "contract" | "fixed" | "hybrid") =>
                        setFormData({ ...formData, valuation_method: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed Price</SelectItem>
                        <SelectItem value="contract">Contract Based</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Minimum Reputation (Optional)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.minimum_reputation}
                      onChange={(e) =>
                        setFormData({ ...formData, minimum_reputation: parseInt(e.target.value) || 0 })
                      }
                      placeholder="0"
                    />
                    <p className="text-xs text-muted-foreground">
                      Minimum reputation score required to propose swaps (leave 0 for no requirement)
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div>
                      <p className="font-medium">Require Verification</p>
                      <p className="text-sm text-muted-foreground">
                        Only verified users can propose swaps
                      </p>
                    </div>
                    <Switch
                      checked={formData.swap_verification_required}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, swap_verification_required: checked })
                      }
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <Link href="/dashboard/listings">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit for Verification
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
