'use client'

import { WithdrawalManager } from '@/components/dashboard/withdrawal-manager'

export default function WithdrawalPage() {
  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Request Withdrawal</h1>
        <p className="text-muted-foreground">
          Withdraw your earnings to your registered payment method
        </p>
      </div>

      <WithdrawalManager />
    </div>
  )
}

