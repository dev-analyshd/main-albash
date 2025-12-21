'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Plus, ArrowDown, AlertCircle } from 'lucide-react'

interface Withdrawal {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  payment_method_id: string
  created_at: string
  updated_at: string
}

interface PaymentMethod {
  id: string
  type: string
  label?: string
  last_four?: string
}

export function WithdrawalManager() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [methods, setMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openRequest, setOpenRequest] = useState(false)
  const [requesting, setRequesting] = useState(false)
  const [balance, setBalance] = useState(0)
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethodId: '',
  })

  // Load data
  const loadData = async () => {
    try {
      setLoading(true)

      // Load withdrawals
      const withdrawalRes = await fetch('/api/payments/withdraw')
      if (withdrawalRes.ok) {
        const data = await withdrawalRes.json()
        setWithdrawals(data.withdrawals || [])
      }

      // Load payment methods
      const methodsRes = await fetch('/api/payments/methods')
      if (methodsRes.ok) {
        const data = await methodsRes.json()
        setMethods(data.methods || [])
      }

      // Load balance from profile
      const profileRes = await fetch('/api/profile')
      if (profileRes.ok) {
        const data = await profileRes.json()
        setBalance(data.wallet_balance || 0)
      }
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Request withdrawal
  const handleRequestWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault()

    const amount = parseFloat(formData.amount)
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (amount > balance) {
      setError('Insufficient balance')
      return
    }

    if (!formData.paymentMethodId) {
      setError('Please select a payment method')
      return
    }

    setRequesting(true)
    setError('')

    try {
      const response = await fetch('/api/payments/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          payment_method_id: formData.paymentMethodId,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to request withdrawal')
      }

      await loadData()
      setOpenRequest(false)
      setFormData({ amount: '', paymentMethodId: '' })
    } catch (err: any) {
      setError(err.message || 'Failed to request withdrawal')
      console.error(err)
    } finally {
      setRequesting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-600">Completed</Badge>
      case 'processing':
        return <Badge className="bg-blue-600">Processing</Badge>
      case 'pending':
        return <Badge className="bg-yellow-600">Pending</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Balance Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
              <p className="text-4xl font-bold">${balance.toFixed(2)}</p>
            </div>
            <Dialog open={openRequest} onOpenChange={setOpenRequest}>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2">
                  <ArrowDown className="h-4 w-4" />
                  Request Withdrawal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Withdrawal</DialogTitle>
                  <DialogDescription>
                    Withdraw funds from your account to your payment method
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleRequestWithdrawal} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        max={balance}
                        value={formData.amount}
                        onChange={(e) =>
                          setFormData({ ...formData, amount: e.target.value })
                        }
                        className="pl-7"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Max: ${balance.toFixed(2)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="method">Payment Method</Label>
                    <Select
                      value={formData.paymentMethodId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, paymentMethodId: value })
                      }
                    >
                      <SelectTrigger id="method">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        {methods.map((method) => (
                          <SelectItem key={method.id} value={method.id}>
                            {method.label || method.type} {method.last_four && `(****${method.last_four})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setOpenRequest(false)}
                      disabled={requesting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={requesting || methods.length === 0}
                    >
                      {requesting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Requesting...
                        </>
                      ) : (
                        'Request Withdrawal'
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawal History */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Withdrawal History</h3>
        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          </div>
        ) : withdrawals.length > 0 ? (
          <div className="grid gap-4">
            {withdrawals.map((withdrawal) => (
              <Card key={withdrawal.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-muted rounded-lg">
                      <ArrowDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        ${withdrawal.amount.toFixed(2)} {withdrawal.currency}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(withdrawal.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(withdrawal.status)}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No withdrawals yet
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
