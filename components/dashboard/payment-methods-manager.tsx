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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Plus, MoreVertical, CreditCard, Banknote, Wallet, AlertCircle, Trash2, Check } from 'lucide-react'

interface PaymentMethod {
  id: string
  type: 'card' | 'bank' | 'crypto' | 'crypto_wallet'
  label?: string
  last_four?: string
  is_default: boolean
  created_at: string
}

export function PaymentMethodsManager() {
  const [methods, setMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openAdd, setOpenAdd] = useState(false)
  const [adding, setAdding] = useState(false)
  const [formData, setFormData] = useState({
    type: 'card' as 'card' | 'bank' | 'crypto' | 'crypto_wallet',
    label: '',
    cardNumber: '',
    accountNumber: '',
    accountName: '',
    walletAddress: '',
  })

  // Load payment methods
  const loadMethods = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/payments/methods', {
        method: 'GET',
      })

      if (!response.ok) throw new Error('Failed to load payment methods')

      const data = await response.json()
      setMethods(data.methods || [])
    } catch (err) {
      setError('Failed to load payment methods')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMethods()
  }, [])

  // Add payment method
  const handleAddMethod = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.label) {
      setError('Please enter a label for this payment method')
      return
    }

    setAdding(true)
    setError('')

    try {
      const payload: any = {
        type: formData.type,
        label: formData.label,
      }

      if (formData.type === 'card' && formData.cardNumber) {
        payload.last_four = formData.cardNumber.slice(-4)
      } else if ((formData.type === 'bank') && formData.accountNumber) {
        payload.last_four = formData.accountNumber.slice(-4)
        payload.metadata = {
          account_name: formData.accountName,
        }
      } else if ((formData.type === 'crypto_wallet' || formData.type === 'crypto') && formData.walletAddress) {
        payload.last_four = formData.walletAddress.slice(-4)
      }

      const response = await fetch('/api/payments/methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Failed to add payment method')

      await loadMethods()
      setOpenAdd(false)
      setFormData({
        type: 'card',
        label: '',
        cardNumber: '',
        accountNumber: '',
        accountName: '',
        walletAddress: '',
      })
    } catch (err) {
      setError('Failed to add payment method')
      console.error(err)
    } finally {
      setAdding(false)
    }
  }

  // Delete payment method
  const handleDeleteMethod = async (methodId: string) => {
    if (!confirm('Are you sure you want to delete this payment method?')) return

    try {
      const response = await fetch(`/api/payments/methods?id=${methodId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete payment method')

      await loadMethods()
    } catch (err) {
      setError('Failed to delete payment method')
      console.error(err)
    }
  }

  // Set as default
  const handleSetDefault = async (methodId: string) => {
    try {
      const response = await fetch('/api/payments/methods', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: methodId, is_default: true }),
      })

      if (!response.ok) throw new Error('Failed to set default payment method')

      await loadMethods()
    } catch (err) {
      setError('Failed to set default payment method')
      console.error(err)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'card':
        return <CreditCard className="h-4 w-4" />
      case 'bank':
        return <Banknote className="h-4 w-4" />
      case 'crypto_wallet':
        return <Wallet className="h-4 w-4" />
      default:
        return null
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'card':
        return 'Credit/Debit Card'
      case 'bank':
        return 'Bank Transfer'
      case 'crypto_wallet':
        return 'Crypto Wallet'
      default:
        return type
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

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Payment Methods</h2>
          <p className="text-sm text-muted-foreground">Manage your payment methods</p>
        </div>
        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Payment Method
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
              <DialogDescription>Add a new payment method to your account</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddMethod} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="method-type">Payment Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger id="method-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="crypto_wallet">Crypto Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="label">Label (e.g., My Visa)</Label>
                <Input
                  id="label"
                  placeholder="Enter a label for this payment method"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                />
              </div>

              {(formData.type === 'card') && (
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input
                    id="card-number"
                    placeholder="4111 1111 1111 1111"
                    value={formData.cardNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, cardNumber: e.target.value })
                    }
                  />
                </div>
              )}

              {(formData.type === 'bank') && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="account-name">Account Name</Label>
                    <Input
                      id="account-name"
                      placeholder="Enter account name"
                      value={formData.accountName}
                      onChange={(e) =>
                        setFormData({ ...formData, accountName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account-number">Account Number</Label>
                    <Input
                      id="account-number"
                      placeholder="Enter account number"
                      value={formData.accountNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, accountNumber: e.target.value })
                      }
                    />
                  </div>
                </>
              )}

              {(formData.type === 'crypto_wallet' || formData.type === 'crypto') && (
                <div className="space-y-2">
                  <Label htmlFor="wallet-address">Wallet Address</Label>
                  <Input
                    id="wallet-address"
                    placeholder="0x..."
                    value={formData.walletAddress}
                    onChange={(e) =>
                      setFormData({ ...formData, walletAddress: e.target.value })
                    }
                  />
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setOpenAdd(false)}
                  disabled={adding}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={adding}>
                  {adding ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Adding...
                    </>
                  ) : (
                    'Add Method'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
        </div>
      ) : methods.length > 0 ? (
        <div className="grid gap-4">
          {methods.map((method) => (
            <Card key={method.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 bg-muted rounded-lg">{getIcon(method.type)}</div>
                  <div className="flex-1">
                    <p className="font-medium">{method.label || getTypeLabel(method.type)}</p>
                    <p className="text-sm text-muted-foreground">
                      {getTypeLabel(method.type)}
                      {method.last_four && ` ending in ${method.last_four}`}
                    </p>
                  </div>
                  {method.is_default && (
                    <Badge variant="secondary" className="gap-1">
                      <Check className="h-3 w-3" />
                      Default
                    </Badge>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {!method.is_default && (
                      <DropdownMenuItem onClick={() => handleSetDefault(method.id)}>
                        <Check className="h-4 w-4 mr-2" />
                        Set as Default
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => handleDeleteMethod(method.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground">No payment methods added yet</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setOpenAdd(true)}
            >
              Add Your First Payment Method
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
