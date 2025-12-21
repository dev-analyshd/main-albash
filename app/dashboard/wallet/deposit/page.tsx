"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Plus, CreditCard, Building, Bitcoin, Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const paymentOptions = [
  { id: "card", label: "Credit/Debit Card", icon: CreditCard, description: "Visa, Mastercard, etc." },
  { id: "bank", label: "Bank Transfer", icon: Building, description: "Direct bank transfer" },
  { id: "crypto", label: "Cryptocurrency", icon: Bitcoin, description: "BTC, ETH, USDT" },
]

const presetAmounts = [10, 25, 50, 100, 250, 500]

export default function DepositPage() {
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    amount: "",
    method: "card",
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

    // Get current balance
    const { data: profile } = await supabase.from("profiles").select("wallet_balance").eq("id", user.id).single()

    const currentBalance = profile?.wallet_balance || 0
    const depositAmount = Number.parseFloat(formData.amount)

    // Update balance (in production, this would go through a payment processor)
    const { error } = await supabase
      .from("profiles")
      .update({ wallet_balance: currentBalance + depositAmount })
      .eq("id", user.id)

    if (!error) {
      // Create transaction record
      await supabase.from("transactions").insert({
        buyer_id: user.id,
        amount: depositAmount,
        type: "deposit",
        status: "completed",
      })

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
            <h2 className="text-2xl font-bold mb-2">Funds Added!</h2>
            <p className="text-muted-foreground">Your wallet has been topped up. Redirecting...</p>
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
            <Plus className="h-5 w-5" />
            Add Funds
          </CardTitle>
          <CardDescription>Top up your wallet to make purchases</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Amount (USD)</Label>
              <div className="grid grid-cols-3 gap-2 mt-2 mb-3">
                {presetAmounts.map((amount) => (
                  <Button
                    key={amount}
                    type="button"
                    variant={formData.amount === String(amount) ? "default" : "outline"}
                    onClick={() => setFormData({ ...formData, amount: String(amount) })}
                    className={formData.amount !== String(amount) ? "bg-transparent" : ""}
                  >
                    ${amount}
                  </Button>
                ))}
              </div>
              <Input
                type="number"
                min="1"
                step="0.01"
                placeholder="Or enter custom amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>

            <div>
              <Label>Payment Method</Label>
              <RadioGroup
                value={formData.method}
                onValueChange={(v) => setFormData({ ...formData, method: v })}
                className="mt-2 space-y-3"
              >
                {paymentOptions.map((option) => (
                  <div key={option.id}>
                    <RadioGroupItem value={option.id} id={option.id} className="peer sr-only" />
                    <Label
                      htmlFor={option.id}
                      className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                    >
                      <div className="p-2 bg-muted rounded-lg">
                        <option.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{option.label}</p>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {formData.amount && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Deposit Amount</span>
                  <span>${formData.amount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Processing Fee</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span>${formData.amount}</span>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={submitting || !formData.amount}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitting ? "Processing..." : `Add $${formData.amount || "0"} to Wallet`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
