"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Wallet, Building2, CheckCircle, Plus, Trash2, ExternalLink } from "lucide-react"

interface PaymentMethodsProps {
  walletAddress?: string | null
  onWalletConnect: () => void
  onWalletDisconnect: () => void
}

export function PaymentMethods({ walletAddress, onWalletConnect, onWalletDisconnect }: PaymentMethodsProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("crypto")
  const [showAddBank, setShowAddBank] = useState(false)

  const paymentOptions = [
    {
      id: "crypto",
      name: "Cryptocurrency",
      description: "Pay with crypto wallets (Konet, Ethereum, Polygon)",
      icon: Wallet,
      supported: ["Konet", "ETH", "MATIC", "USDT"],
      color: "bg-orange-100 text-orange-600",
    },
    {
      id: "paystack",
      name: "Paystack",
      description: "Pay with cards, bank transfer, or USSD (NGN)",
      icon: CreditCard,
      supported: ["Card", "Bank Transfer", "USSD"],
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: "flutterwave",
      name: "Flutterwave",
      description: "Pay with cards, mobile money (NGN, USD, GHS)",
      icon: CreditCard,
      supported: ["Card", "Mobile Money", "Bank"],
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      id: "bank",
      name: "Direct Bank Transfer",
      description: "Transfer directly to seller's bank account",
      icon: Building2,
      supported: ["NGN", "USD"],
      color: "bg-green-100 text-green-600",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Methods
        </CardTitle>
        <CardDescription>
          Configure your preferred payment methods for buying and selling on the marketplace
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Options */}
        <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod} className="space-y-4">
          {paymentOptions.map((option) => (
            <div key={option.id} className="relative">
              <RadioGroupItem value={option.id} id={option.id} className="peer sr-only" />
              <Label
                htmlFor={option.id}
                className="flex items-start gap-4 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer transition-all"
              >
                <div className={`p-2 rounded-lg ${option.color}`}>
                  <option.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{option.name}</span>
                    {selectedMethod === option.id && <CheckCircle className="h-5 w-5 text-primary" />}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{option.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {option.supported.map((method) => (
                      <Badge key={method} variant="secondary" className="text-xs">
                        {method}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>

        {/* Crypto Wallet Section */}
        {selectedMethod === "crypto" && (
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium">Connected Wallet</h4>
            {walletAddress ? (
              <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50 border-green-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Wallet className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800 text-sm">Wallet Connected</p>
                    <p className="text-xs font-mono text-green-600">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={onWalletDisconnect}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button onClick={onWalletConnect} className="w-full gap-2">
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </Button>
            )}
            <p className="text-xs text-muted-foreground">
              Supported: MetaMask, WalletConnect, Coinbase Wallet, Trust Wallet
            </p>
          </div>
        )}

        {/* Bank Account Section */}
        {selectedMethod === "bank" && (
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Bank Accounts</h4>
              <Button variant="outline" size="sm" onClick={() => setShowAddBank(!showAddBank)} className="gap-1">
                <Plus className="h-3 w-3" />
                Add Bank
              </Button>
            </div>

            {showAddBank && (
              <div className="space-y-3 p-3 border rounded-lg bg-background">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="bank-name">Bank Name</Label>
                    <Input id="bank-name" placeholder="e.g., First Bank" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account-number">Account Number</Label>
                    <Input id="account-number" placeholder="10 digits" maxLength={10} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-name">Account Name</Label>
                  <Input id="account-name" placeholder="Account holder name" />
                </div>
                <div className="flex gap-2">
                  <Button size="sm">Save Account</Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowAddBank(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              Bank transfers are held in escrow until the buyer confirms receipt
            </p>
          </div>
        )}

        {/* Fiat Payment Providers */}
        {(selectedMethod === "paystack" || selectedMethod === "flutterwave") && (
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium">{selectedMethod === "paystack" ? "Paystack" : "Flutterwave"} Integration</h4>
            <p className="text-sm text-muted-foreground">
              Payments through {selectedMethod === "paystack" ? "Paystack" : "Flutterwave"} are automatically processed
              when you make a purchase. A small transaction fee applies.
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Ready to use
              </Badge>
              <Button variant="link" size="sm" className="gap-1 p-0 h-auto">
                Learn more <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Fee Information */}
        <div className="p-4 border rounded-lg bg-muted/30">
          <h4 className="font-medium mb-2">Transaction Fees</h4>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>Crypto: Network gas fees only</p>
            <p>Paystack: 1.5% + NGN 100 (capped at NGN 2,000)</p>
            <p>Flutterwave: 1.4% (local) / 3.8% (international)</p>
            <p>Bank Transfer: Free (escrow protection)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
