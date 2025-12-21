import { Metadata } from 'next'
import { PaymentMethodsManager } from '@/components/dashboard/payment-methods-manager'

export const metadata: Metadata = {
  title: 'Payment Methods | Wallet',
  description: 'Manage your payment methods',
}

export default function PaymentMethodsPage() {
  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Wallet</h1>
        <p className="text-muted-foreground">Manage your payment methods and account settings</p>
      </div>

      <PaymentMethodsManager />
    </div>
  )
}
