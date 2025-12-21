'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { processPayment, getPaymentMethods } from '@/lib/payments/payment-utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Loader2, ShoppingCart, CreditCard, Banknote, Wallet, AlertCircle } from 'lucide-react'

interface CheckoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  listing: {
    id: string
    title: string
    price: number
    currency?: string
    user_id: string
  }
  onSuccess?: (transactionId: string) => void
}

export function CheckoutDialog({ open, onOpenChange, listing, onSuccess }: CheckoutDialogProps) {
  const [step, setStep] = useState<'method' | 'confirm'>('method')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [selectedProcessor, setSelectedProcessor] = useState<string>('')
  const [selectedChain, setSelectedChain] = useState<string>('')
  const [loadingMethods, setLoadingMethods] = useState(true)
  const [addingTestMethod, setAddingTestMethod] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  // Load payment methods on open
  const loadPaymentMethods = async () => {
    try {
      setLoadingMethods(true)
      const result = await getPaymentMethods()
      console.log('Payment methods result:', result)
      if (result.success) {
        setPaymentMethods(result.methods || [])
        // Auto-select default method
        const defaultMethod = result.methods?.find((m: any) => m.is_default)
        if (defaultMethod) {
          setSelectedMethod(defaultMethod.id)
        }
      } else {
        console.error('Payment methods error:', result.error)
        setError('Failed to load payment methods: ' + (result.error || 'Unknown error'))
      }
    } catch (err) {
      console.error('Failed to load payment methods:', err)
      setError('Error loading payment methods')
    } finally {
      setLoadingMethods(false)
    }
  }

  const handleOpen = async (isOpen: boolean) => {
    onOpenChange(isOpen)
    if (isOpen) {
      setError('')
      setStep('method')
      await loadPaymentMethods()
    }
  }

  const handleAddTestMethod = async () => {
    try {
      setAddingTestMethod(true)
      setError('')
      const res = await fetch('/api/payments/methods/test-add')
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to create test payment method')
      } else {
        // reload methods and auto-select the new one
        await loadPaymentMethods()
        if (data?.method?.id) setSelectedMethod(data.method.id)
      }
    } catch (e) {
      console.error('Add test method error:', e)
      setError('Failed to create test payment method')
    } finally {
      setAddingTestMethod(false)
    }
  }

  const handlePayment = async () => {
    setLoading(true)
    setError('')

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/sign-in')
        return
      }

      // Process payment - use selected method if available
      const paymentMethodId = selectedMethod || null
      
      const result = await processPayment({
        method: 'card',
        amount: listing.price,
        currency: listing.currency || 'USD',
        description: `Purchase: ${listing.title}`,
        metadata: {
          listing_id: listing.id,
          listing_title: listing.title,
          seller_id: listing.user_id,
          payment_method_id: paymentMethodId,
          transaction_type: 'purchase',
          processor: selectedProcessor || undefined,
          crypto_chain: selectedChain || undefined,
        },
      })

      if (result.success) {
        // Create transaction record in database
        const { error: txError } = await supabase.from('transactions').insert({
          user_id: user.id,
          amount: listing.price,
          type: 'purchase',
          status: 'completed',
          payment_method_id: paymentMethodId,
          listing_id: listing.id,
          description: `Purchased: ${listing.title}`,
          external_reference: result.reference,
          metadata: {
            transaction_id: result.transactionId,
            processor: selectedProcessor || (selectedChain ? `crypto_${selectedChain}` : result?.processor || 'stripe'),
          },
        })

        if (!txError) {
          // Show success
          setStep('confirm')
          setTimeout(() => {
            handleOpen(false)
            onSuccess?.(result.transactionId || '')
            // Redirect to receipt or order page
            router.push(`/dashboard/transactions?id=${result.transactionId}`)
          }, 2000)
        }
      } else {
        setError(result.error || 'Payment failed. Please try again.')
      }
    } catch (err) {
      setError('Payment processing error. Please try again.')
      console.error('Checkout error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Purchase Item</DialogTitle>
          <DialogDescription>Complete your purchase of {listing.title}</DialogDescription>
        </DialogHeader>

        {step === 'confirm' && (
          <div className="text-center py-8 space-y-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <ShoppingCart className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Purchase Successful!</h3>
              <p className="text-sm text-muted-foreground">Your order is being processed.</p>
            </div>
          </div>
        )}

        {step === 'method' && (
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="bg-muted/50 border-0">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Order Total</p>
                  <p className="text-2xl font-bold">${listing.price.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{listing.title}</p>
                </div>
              </CardContent>
            </Card>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Payment Methods */}
            {loadingMethods ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
              </div>
            ) : paymentMethods.length > 0 ? (
              <div className="space-y-3">
                <Label>Select Payment Method</Label>
                <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label htmlFor={method.id} className="flex items-center gap-2 flex-1 cursor-pointer">
                        {method.type === 'card' && <CreditCard className="h-4 w-4" />}
                        {method.type === 'bank' && <Banknote className="h-4 w-4" />}
                        {method.type === 'crypto_wallet' && <Wallet className="h-4 w-4" />}
                        <span>
                          {method.label || `${method.type} (${method.last_four})`}
                        </span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                <div className="mt-3">
                  <Button size="sm" variant="ghost" onClick={handleAddTestMethod} disabled={addingTestMethod}>
                    {addingTestMethod ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Adding...
                      </>
                    ) : (
                      'Add Test Method'
                    )}
                  </Button>
                </div>
                {/* Processor / Chain selection based on selected method */}
                {selectedMethod && (
                  (() => {
                    const m = paymentMethods.find((x) => x.id === selectedMethod)
                    if (!m) return null
                    if (m.type === 'card' || m.type === 'bank') {
                      return (
                        <div className="space-y-2">
                          <Label>Processor</Label>
                          <Select onValueChange={(v) => setSelectedProcessor(v)}>
                            <SelectTrigger>
                              <SelectValue>{selectedProcessor || 'Choose processor'}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="stripe">Stripe</SelectItem>
                              <SelectItem value="paystack">Paystack</SelectItem>
                              <SelectItem value="flutterwave">Flutterwave</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )
                    }

                    if (m.type === 'crypto_wallet') {
                      return (
                        <div className="space-y-2">
                          <Label>Network / Chain</Label>
                          <Select onValueChange={(v) => setSelectedChain(v)}>
                            <SelectTrigger>
                              <SelectValue>{selectedChain || 'Choose network'}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ethereum">Ethereum</SelectItem>
                              <SelectItem value="arbitrum">Arbitrum</SelectItem>
                              <SelectItem value="optimism">Optimism</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )
                    }

                    return null
                  })()
                )}
              </div>
            ) : (
              <div className="text-center py-6 space-y-3">
                <p className="text-sm text-muted-foreground">No payment methods saved</p>
                <p className="text-xs text-muted-foreground mb-4">Please add a payment method before proceeding</p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={() => { handleOpen(false); router.push('/dashboard/wallet/methods/add') }}>Add Payment Method</Button>
                  <Button onClick={handleAddTestMethod} disabled={addingTestMethod}>
                    {addingTestMethod ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Adding...
                      </>
                    ) : (
                      'Add Test Method'
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 gap-2"
                onClick={handlePayment}
                disabled={loading || !selectedMethod || (paymentMethods.find(m => m.id === selectedMethod)?.type === 'card' && !selectedProcessor) || (paymentMethods.find(m => m.id === selectedMethod)?.type === 'crypto_wallet' && !selectedChain)}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    Pay ${listing.price.toFixed(2)}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
