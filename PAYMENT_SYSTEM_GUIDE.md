# Payment System Integration Guide

## Overview

The Albash Solutions platform now includes a comprehensive payment system supporting multiple payment methods and processors:

- **Credit/Debit Cards** (via Stripe/Paystack)
- **Bank Transfers** (Direct transfers with escrow protection)
- **Cryptocurrency** (Wallet-based payments)
- **Mobile Money** (via Paystack - Nigeria)
- **Flutterwave Integration** (Multi-currency support)

## Architecture

### Payment Flow

```
User Payment Request
    ↓
API Route (/api/payments/process)
    ↓
Payment Validation
    ↓
Payment Processor Selection (Stripe/Paystack/Flutterwave/Bank)
    ↓
Transaction Record Creation
    ↓
Webhook Confirmation
    ↓
Wallet Balance Update
    ↓
Payment Completion
```

## API Endpoints

### Process Payment
**POST** `/api/payments/process`

```json
{
  "amount": 100.00,
  "payment_method_id": "uuid",
  "transaction_type": "purchase|withdrawal|deposit",
  "description": "Listing purchase",
  "listing_id": "uuid" (optional)
}
```

**Response:**
```json
{
  "success": true,
  "transaction_id": "uuid",
  "status": "processing",
  "reference": "STRIPE_TX_123456",
  "next_action": "confirm"
}
```

### Withdrawal Request
**POST** `/api/payments/withdraw`

```json
{
  "amount": 50.00,
  "payment_method_id": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "withdrawal_id": "uuid",
  "amount": 50.00,
  "status": "pending",
  "message": "Withdrawal request submitted. Processing takes 2-5 business days."
}
```

### Get Withdrawals
**GET** `/api/payments/withdraw`

**Response:**
```json
{
  "success": true,
  "withdrawals": [
    {
      "id": "uuid",
      "amount": 50.00,
      "status": "completed",
      "created_at": "2025-01-01T10:00:00Z"
    }
  ],
  "count": 1
}
```

### Payment Methods
**GET** `/api/payments/methods` - List all payment methods

**POST** `/api/payments/methods` - Create new payment method

**PUT** `/api/payments/methods?id=uuid` - Update payment method

**DELETE** `/api/payments/methods?id=uuid` - Delete payment method

### Transactions
**GET** `/api/payments/transactions?limit=50&status=completed&type=purchase`

**POST** `/api/payments/transactions` - Create transaction record

### Webhook
**POST** `/api/payments/webhook`

```json
{
  "event_type": "payment.success|payment.failed|payment.pending",
  "transaction_id": "uuid",
  "status": "completed|failed|processing",
  "reference": "PROCESSOR_REF_123",
  "error_message": "optional"
}
```

## Database Schema

### transactions Table
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  amount DECIMAL(12, 2),
  currency TEXT DEFAULT 'USD',
  type TEXT CHECK (type IN ('purchase', 'withdrawal', 'deposit', 'refund')),
  status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  payment_method_id UUID REFERENCES payment_methods(id),
  external_reference TEXT,
  metadata JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### payment_methods Table
```sql
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  type TEXT CHECK (type IN ('card', 'bank', 'crypto_wallet')),
  label TEXT,
  last_four TEXT,
  is_default BOOLEAN,
  metadata JSONB,
  created_at TIMESTAMP
);
```

### withdrawal_requests Table
```sql
CREATE TABLE withdrawal_requests (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  amount DECIMAL(12, 2),
  currency TEXT DEFAULT 'USD',
  payment_method_id UUID REFERENCES payment_methods(id),
  status TEXT DEFAULT 'pending',
  processed_at TIMESTAMP,
  created_at TIMESTAMP
);
```

## Payment Processor Configuration

### Stripe Integration

Set up environment variables:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Paystack Integration

Set up environment variables:
```env
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
PAYSTACK_SECRET_KEY=sk_test_...
```

### Flutterwave Integration

Set up environment variables:
```env
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST_...
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST_...
```

### Bank Transfer Configuration

Set up environment variables:
```env
BANK_TRANSFER_ENABLED=true
BANK_ACCOUNT_NAME=Albash Solutions
BANK_ACCOUNT_NUMBER=1234567890
BANK_SORT_CODE=000000
BANK_IBAN=GB00000000001234567890
```

## Transaction Fees

| Method | Fee Structure |
|--------|---------------|
| Card (Stripe) | 2.9% + $0.30 |
| Card (Paystack NGN) | 1.5% + ₦100 |
| Card (Paystack USD) | 3.5% |
| Paystack Mobile Money | 1% |
| Flutterwave (Local) | 1.4% |
| Flutterwave (International) | 3.8% |
| Bank Transfer | No fee |
| Cryptocurrency | Network gas fees |

## Usage Examples

### Client Component - Process Payment

```tsx
'use client'

import { processPayment } from '@/lib/payments/payment-utils'
import { useState } from 'react'

export function PaymentButton() {
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    setLoading(true)
    const result = await processPayment({
      method: 'card',
      amount: 99.99,
      currency: 'USD',
      description: 'Purchase listing #123',
      metadata: {
        listing_id: 'uuid',
        listing_title: 'Sample Product'
      }
    })
    
    if (result.success) {
      console.log('Payment successful:', result.transactionId)
    } else {
      console.error('Payment failed:', result.error)
    }
    setLoading(false)
  }

  return (
    <button onClick={handlePayment} disabled={loading}>
      {loading ? 'Processing...' : 'Pay Now'}
    </button>
  )
}
```

### Server Component - Create Transaction

```tsx
import { createClient } from '@/lib/supabase/server'

export async function createTransaction(
  userId: string,
  amount: number,
  type: 'purchase' | 'withdrawal' | 'deposit'
) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      amount,
      type,
      status: 'pending'
    })
    .select()
    .single()

  return { data, error }
}
```

### Withdrawal Request

```tsx
'use client'

import { createWithdrawal } from '@/lib/payments/payment-utils'
import { useState } from 'react'

export function WithdrawalForm() {
  const [amount, setAmount] = useState('')
  const [methodId, setMethodId] = useState('')

  const handleWithdraw = async () => {
    const result = await createWithdrawal(
      parseFloat(amount),
      methodId
    )
    
    if (result.success) {
      alert('Withdrawal requested! Processing in 2-5 business days.')
    }
  }

  return (
    <div>
      <input 
        type="number" 
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />
      <button onClick={handleWithdraw}>Withdraw</button>
    </div>
  )
}
```

## Security Considerations

✅ **Row-Level Security (RLS)** - All database tables protected with RLS policies
✅ **User Isolation** - Users can only access their own transactions
✅ **Payment Validation** - All inputs validated before processing
✅ **Secure Storage** - Sensitive data encrypted in metadata
✅ **Audit Trail** - All transactions logged with timestamps
✅ **Webhook Verification** - Webhook authenticity verified

## Error Handling

All payment operations include comprehensive error handling:

```tsx
try {
  const result = await processPayment(config)
  if (!result.success) {
    console.error('Payment Error:', result.error)
    // Show user-friendly error message
  }
} catch (error) {
  console.error('Unexpected error:', error)
}
```

## Testing

### Local Development

1. Use test API keys from payment providers:
   - Stripe: `pk_test_*` / `sk_test_*`
   - Paystack: `pk_test_*` / `sk_test_*`
   - Flutterwave: `FLWPUBK_TEST_*` / `FLWSECK_TEST_*`

2. Test with mock payment methods:
   - Card: 4242 4242 4242 4242 (Visa)
   - Bank: Test account in your bank

3. Use webhook testing tools:
   - Stripe: Use Stripe CLI
   - Paystack: Use Postman
   - Flutterwave: Use webhook tester

### Production Deployment

1. Replace test keys with production keys
2. Enable webhook signature verification
3. Configure allowed IP addresses
4. Set up proper error logging
5. Enable PCI compliance measures

## Troubleshooting

### Payment Processing Failed
- Check payment provider API keys in environment
- Verify payment method is valid and not expired
- Check user has sufficient balance
- Verify transaction amount meets minimum requirements

### Withdrawal Stuck in Pending
- Check withdrawal request status in database
- Verify payment method is still valid
- Contact payment processor support

### Webhook Not Processing
- Verify webhook secret is correct
- Check webhook URL is publicly accessible
- Review webhook logs for errors
- Ensure database connection is stable

## Roadmap

- [ ] Add payment analytics dashboard
- [ ] Implement recurring payments
- [ ] Add subscription support
- [ ] Multi-currency conversion
- [ ] Advanced fraud detection
- [ ] Split payments support
- [ ] Marketplace commission system

## Support

For payment integration issues or questions, contact:
- Email: support@albashsolutions.com
- Documentation: https://docs.albashsolutions.com/payments
- API Status: https://status.albashsolutions.com

