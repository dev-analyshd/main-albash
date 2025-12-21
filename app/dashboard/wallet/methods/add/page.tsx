"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, CreditCard, Building, Bitcoin, Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function AddPaymentMethodPage() {
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [methodType, setMethodType] = useState("card")
  const [isDefault, setIsDefault] = useState(false)
  const [formData, setFormData] = useState({
    label: "",
    card_number: "",
    expiry: "",
    cvv: "",
    bank_name: "",
    account_number: "",
    routing_number: "",
    wallet_address: "",
  })

  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push("/auth/sign-in")
      return
    }

    let lastFour = ""
    let metadata: Record<string, any> = {}

    if (methodType === "card") {
      lastFour = formData.card_number.slice(-4)
      metadata = { expiry: formData.expiry }
    } else if (methodType === "bank") {
      lastFour = formData.account_number.slice(-4)
      metadata = { bank_name: formData.bank_name, routing: formData.routing_number }
    } else {
      lastFour = formData.wallet_address.slice(-4)
      metadata = { full_address: formData.wallet_address }
    }

    // If setting as default, unset other defaults first
    if (isDefault) {
      await supabase.from("payment_methods").update({ is_default: false }).eq("user_id", user.id)
    }

    const { error } = await supabase.from("payment_methods").insert({
      user_id: user.id,
      type: methodType === "crypto" ? "crypto_wallet" : methodType,
      label: formData.label || null,
      last_four: lastFour,
      is_default: isDefault,
      metadata,
    })

    if (!error) {
      setSuccess(true)
      setTimeout(() => router.push("/dashboard/wallet"), 2000)
    }

    setSubmitting(false)
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-12 pb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Payment Method Added!</h2>
            <p className="text-muted-foreground">Redirecting to wallet...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard/wallet"
          className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Wallet
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Add Payment Method
          </CardTitle>
          <CardDescription>Add a new way to receive your earnings</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Method Type</Label>
              <RadioGroup value={methodType} onValueChange={setMethodType} className="mt-2 grid grid-cols-3 gap-3">
                <div>
                  <RadioGroupItem value="card" id="card" className="peer sr-only" />
                  <Label
                    htmlFor="card"
                    className="flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                  >
                    <CreditCard className="h-6 w-6" />
                    <span className="text-sm">Card</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="bank" id="bank" className="peer sr-only" />
                  <Label
                    htmlFor="bank"
                    className="flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                  >
                    <Building className="h-6 w-6" />
                    <span className="text-sm">Bank</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="crypto" id="crypto" className="peer sr-only" />
                  <Label
                    htmlFor="crypto"
                    className="flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                  >
                    <Bitcoin className="h-6 w-6" />
                    <span className="text-sm">Crypto</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="label">Label (Optional)</Label>
              <Input
                id="label"
                placeholder="e.g., Personal Card"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              />
            </div>

            {methodType === "card" && (
              <>
                <div>
                  <Label htmlFor="card_number">Card Number</Label>
                  <Input
                    id="card_number"
                    placeholder="1234 5678 9012 3456"
                    value={formData.card_number}
                    onChange={(e) => setFormData({ ...formData, card_number: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={formData.expiry}
                      onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      type="password"
                      placeholder="123"
                      maxLength={4}
                      value={formData.cvv}
                      onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {methodType === "bank" && (
              <>
                <div>
                  <Label htmlFor="bank_name">Bank Name</Label>
                  <Input
                    id="bank_name"
                    placeholder="Bank of America"
                    value={formData.bank_name}
                    onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="account_number">Account Number</Label>
                  <Input
                    id="account_number"
                    placeholder="123456789012"
                    value={formData.account_number}
                    onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="routing_number">Routing Number</Label>
                  <Input
                    id="routing_number"
                    placeholder="123456789"
                    value={formData.routing_number}
                    onChange={(e) => setFormData({ ...formData, routing_number: e.target.value })}
                    required
                  />
                </div>
              </>
            )}

            {methodType === "crypto" && (
              <div>
                <Label htmlFor="wallet_address">Wallet Address</Label>
                <Input
                  id="wallet_address"
                  placeholder="0x..."
                  value={formData.wallet_address}
                  onChange={(e) => setFormData({ ...formData, wallet_address: e.target.value })}
                  required
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <Label>Set as Default</Label>
                <p className="text-sm text-muted-foreground">Use this method for withdrawals by default</p>
              </div>
              <Switch checked={isDefault} onCheckedChange={setIsDefault} />
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitting ? "Adding..." : "Add Payment Method"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
