# Payment System Quick Reference

## Getting Started

### 1. Environment Setup
```env
# .env.local - Add payment provider keys
STRIPE_SECRET_KEY=sk_test_...
PAYSTACK_SECRET_KEY=sk_test_...
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST_...
BANK_ACCOUNT_NUMBER=1234567890
```

### 2. Database Migration
```bash
# Apply database schema
supabase db push --file scripts/016-add-transactions-table.sql
```

### 3. Start Dev Server
```bash
npm run dev
```

## API Endpoints

### Payment Processing
```bash
# Process a payment
POST /api/payments/process
Content-Type: application/json

{
  "amount": 100.00,
  "payment_method_id": "uuid",
  "transaction_type": "purchase",
  "description": "Listing purchase"
}

# Response
{
  "success": true,
  "transaction_id": "uuid",
  "status": "processing",
  "reference": "TX_123456"
}
```

### Payment Methods
```bash
# Get all payment methods
GET /api/payments/methods

# Create payment method
POST /api/payments/methods
{
  "type": "card",
  "label": "My Visa",
  "last_four": "4242",
  "is_default": true,
  "metadata": { /* card data */ }
}

# Update payment method
PUT /api/payments/methods?id=uuid
{ "label": "Updated Label", "is_default": true }

# Delete payment method
DELETE /api/payments/methods?id=uuid
```

### Withdrawals
```bash
# Create withdrawal request
POST /api/payments/withdraw
{
  "amount": 50.00,
  "payment_method_id": "uuid"
}

# Get withdrawal history
GET /api/payments/withdraw

# Response
{
  "success": true,
  "withdrawal_id": "uuid",
  "amount": 50.00,
  "status": "pending"
}
```

### Transactions
```bash
# Get transactions
GET /api/payments/transactions?limit=50&status=completed&type=purchase

# Create transaction
POST /api/payments/transactions
{
  "amount": 99.99,
  "type": "purchase",
  "payment_method_id": "uuid",
  "listing_id": "uuid"
}

# Response
{
  "success": true,
  "transactions": [
    {
      "id": "uuid",
      "amount": 99.99,
      "type": "purchase",
      "status": "completed",
      "created_at": "2025-01-01T10:00:00Z"
    }
  ]
}
```

### Webhooks
```bash
# Receive payment status updates
POST /api/payments/webhook
{
  "event_type": "payment.success",
  "transaction_id": "uuid",
  "status": "completed",
  "reference": "TX_123456"
}
```

## Code Examples

### Client Component - Payment
```tsx
'use client'

import { processPayment } from '@/lib/payments/payment-utils'

export function CheckoutButton() {
  const handlePayment = async () => {
    const result = await processPayment({
      method: 'card',
      amount: 99.99,
      currency: 'USD',
      description: 'Purchase item'
    })
    
    if (result.success) {
      console.log('Payment successful:', result.transactionId)
    }
  }

  return <button onClick={handlePayment}>Pay $99.99</button>
}
```

### Server Component - Get Transactions
```tsx
import { createClient } from '@/lib/supabase/server'

export async function TransactionList() {
  const supabase = await createClient()
  
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div>
      {transactions?.map((tx) => (
        <div key={tx.id}>
          ${tx.amount} - {tx.status}
        </div>
      ))}
    </div>
  )
}
```

### Utility Functions
```tsx
import {
  validateCardNumber,
  formatCurrency,
  calculateFee,
  maskCardNumber,
  detectCardType
} from '@/lib/payments/payment-utils'

// Validate card
const isValid = validateCardNumber('4242424242424242')

// Format amount
const display = formatCurrency(100, 'USD') // "$100.00"

// Calculate fees
const { fee, total } = calculateFee(100, 'card', 'USD')

// Mask card for display
const masked = maskCardNumber('4242424242424242')

// Detect card type
const type = detectCardType('4242424242424242') // "Visa"
```

## Payment Methods

### Card Payment
- Supports: Visa, Mastercard, Amex, Discover
- Processor: Stripe or Paystack
- Fee: 2.9% + $0.30
- Time: Instant

### Bank Transfer
- Direct account transfer
- Fee: No fee (escrow protected)
- Time: 2-5 business days
- Currencies: USD, NGN, GBP

### Mobile Money
- Paystack support
- Currencies: NGN (Nigeria)
- Fee: 1%
- Time: Instant

### Crypto
- ETH, USDT, MATIC support
- Fee: Network gas fees
- Time: Blockchain dependent

## Database Tables

### transactions
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  user_id UUID,
  amount DECIMAL(12, 2),
  type TEXT, -- 'purchase', 'withdrawal', 'deposit'
  status TEXT, -- 'pending', 'processing', 'completed'
  payment_method_id UUID,
  created_at TIMESTAMP
);
```

### payment_methods
```sql
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY,
  user_id UUID,
  type TEXT, -- 'card', 'bank', 'crypto_wallet'
  label TEXT,
  last_four TEXT,
  is_default BOOLEAN,
  created_at TIMESTAMP
);
```

### withdrawal_requests
```sql
CREATE TABLE withdrawal_requests (
  id UUID PRIMARY KEY,
  user_id UUID,
  amount DECIMAL(12, 2),
  payment_method_id UUID,
  status TEXT, -- 'pending', 'processing', 'completed'
  created_at TIMESTAMP
);
```

## Testing

### Test Card Numbers (Stripe)
- Visa: `4242 4242 4242 4242`
- Mastercard: `5555 5555 5555 4444`
- Amex: `3782 822463 10005`

### Test with Postman
1. Create POST request to `http://localhost:3000/api/payments/process`
2. Add body:
```json
{
  "amount": 100,
  "payment_method_id": "uuid",
  "transaction_type": "purchase"
}
```
3. Run request

### Run Automated Tests
```bash
node scripts/test-payment-system.mjs
```

## Common Tasks

### Add Payment Method
```bash
curl -X POST http://localhost:3000/api/payments/methods \
  -H "Content-Type: application/json" \
  -d '{
    "type": "card",
    "label": "My Visa",
    "last_four": "4242"
  }'
```

### Process Payment
```bash
curl -X POST http://localhost:3000/api/payments/process \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 99.99,
    "payment_method_id": "uuid",
    "transaction_type": "purchase"
  }'
```

### Get User Balance
```sql
SELECT wallet_balance FROM profiles WHERE id = 'user-uuid';
```

### Update Balance
```sql
UPDATE profiles 
SET wallet_balance = wallet_balance + 100 
WHERE id = 'user-uuid';
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Payment fails with 401 | Check user is authenticated |
| Method not found | Verify payment_method_id exists for user |
| Balance not updating | Check transaction status is 'completed' |
| Webhook not received | Verify webhook URL is publicly accessible |
| Card validation fails | Use test card numbers for testing |

## Documentation

- Full Guide: `PAYMENT_SYSTEM_GUIDE.md`
- Implementation Details: `PAYMENT_SYSTEM_COMPLETE.md`
- Stripe Docs: https://stripe.com/docs
- Paystack Docs: https://paystack.com/docs
- Flutterwave Docs: https://developer.flutterwave.com

## Support

For issues or questions:
1. Check documentation in `PAYMENT_SYSTEM_GUIDE.md`
2. Review test cases in `scripts/test-payment-system.mjs`
3. Check error logs in browser console
4. Review database queries with Supabase dashboard

