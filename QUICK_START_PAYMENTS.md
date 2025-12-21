# 🚀 Quick Start: Payment System Integration

## What's New

✅ **Marketplace "Buy Now"** → Real checkout dialog with payment processing
✅ **Payment Methods** → Manage cards, bank accounts, crypto wallets  
✅ **Withdrawals** → Request fund transfers with real validation
✅ **Transaction Tracking** → Full history with status updates

---

## 🎯 User Flows

### Buying from Marketplace
```
1. Browse marketplace → Find item
2. Click "Buy Now" button
3. Select payment method
4. Confirm purchase
5. Payment processed
6. Transaction recorded
```

### Managing Payment Methods
```
1. Go to Dashboard → Wallet → Payment Methods
2. Click "Add Payment Method"
3. Select type (Card/Bank/Crypto)
4. Enter details
5. Save method
```

### Withdrawing Funds
```
1. Go to Dashboard → Wallet → Withdrawals
2. Enter amount
3. Select payment method
4. Request withdrawal
5. Track status
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `components/marketplace/checkout-dialog.tsx` | Real checkout UI |
| `components/dashboard/payment-methods-manager.tsx` | Payment method management |
| `components/dashboard/withdrawal-manager.tsx` | Withdrawal requests |
| `app/api/payments/process/route.ts` | Payment processing |
| `app/api/payments/methods/route.ts` | Payment method CRUD |
| `app/api/payments/withdraw/route.ts` | Withdrawal handling |

---

## 🔌 API Endpoints

### Process Payment
```bash
POST /api/payments/process
{
  "method": "card",
  "amount": 99.99,
  "currency": "USD",
  "description": "Purchase: Item Name",
  "metadata": { "listing_id": "..." }
}
```

### Payment Methods
```bash
GET    /api/payments/methods              # List
POST   /api/payments/methods              # Add
PUT    /api/payments/methods              # Update
DELETE /api/payments/methods?id=<id>      # Delete
```

### Withdrawals
```bash
POST /api/payments/withdraw
{
  "amount": 50.00,
  "payment_method_id": "..."
}

GET /api/payments/withdraw                # History
```

### Transactions
```bash
GET /api/payments/transactions?status=completed&limit=20
```

---

## 🧪 Test Cards

| Card | Number | CVV | Date |
|------|--------|-----|------|
| Visa | 4111 1111 1111 1111 | 123 | 12/25 |
| Mastercard | 5555 5555 5555 4444 | 123 | 12/25 |
| Amex | 378282246310005 | 1234 | 12/25 |

---

## ⚙️ Environment Variables

```env
# Add these to .env.local
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
PAYSTACK_SECRET_KEY=sk_test_...

BANK_ACCOUNT_NAME=Your Account
BANK_ACCOUNT_NUMBER=1234567890
```

---

## 🚀 Getting Started

### 1. Database Setup
```sql
-- Run in Supabase
-- See: scripts/016-add-transactions-table.sql
```

### 2. Add Environment Keys
```bash
# Update .env.local with payment provider credentials
```

### 3. Test Flows
- [ ] Test "Buy Now" on marketplace
- [ ] Add payment method
- [ ] Request withdrawal
- [ ] Check transaction history

---

## 🐛 Common Issues

### Payment Method Not Loading
- Verify user is authenticated
- Check if `/api/payments/methods` returns data
- See browser console for errors

### Checkout Dialog Won't Open
- Ensure listing has `id`, `title`, `price`, `user_id`
- Check if CheckoutDialog component imported correctly

### Withdrawal Failed
- Verify balance is sufficient
- Check if payment method exists
- Ensure amount is greater than $10

---

## 📞 Support

- **Full Docs:** See `PAYMENT_SYSTEM_INTEGRATION.md`
- **API Reference:** See `PAYMENT_QUICK_REFERENCE.md`
- **Setup Guide:** See `PAYMENT_IMPLEMENTATION_COMPLETE.md`

---

## ✅ Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Payment provider accounts created
- [ ] Test cards working
- [ ] Marketplace checkout tested
- [ ] Payment methods management tested
- [ ] Withdrawals tested
- [ ] Transaction history verified
- [ ] Webhooks configured (optional)
- [ ] Production credentials added

---

**Ready to accept payments! 🎉**
