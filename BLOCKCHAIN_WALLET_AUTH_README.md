# Blockchain Wallet Authentication Integration

This document describes the blockchain wallet authentication system integrated into AlbashSolution.

## Overview

The platform now supports blockchain wallet authentication as an alternative to traditional email/password authentication. Users can connect their Web3 wallets (MetaMask, WalletConnect, etc.) to:
- Sign in to the platform
- Authenticate for swaps
- Enable blockchain-based features

## Features

### 1. Wallet Authentication Components

- **`components/auth/wallet-auth.tsx`**: Full wallet authentication component with connect, sign message, and sign-in flow
- **`components/swap/wallet-swap-auth.tsx`**: Compact wallet connection component for swap operations
- **`components/auth/login-form-with-wallet.tsx`**: Enhanced login form with tabs for email/password and wallet authentication

### 2. Web3 Utilities

- **`lib/web3/wallet.ts`**: Core wallet utilities including:
  - `connectWallet()`: Connect to MetaMask or other Web3 wallets
  - `signMessage()`: Sign authentication messages
  - `getWalletAddress()`: Get connected wallet address
  - `verifyWalletSignature()`: Verify signed messages (requires backend)
  - `switchNetwork()`: Switch blockchain networks

### 3. API Endpoints

- **`/api/auth/wallet-nonce`**: Generate authentication nonce for wallet signing
- **`/api/auth/wallet-signin`**: Verify wallet signature and authenticate user

## Database Schema

The `profiles` table now includes:
- `wallet_address TEXT`: Stores the linked blockchain wallet address (optional)

Run the migration script:
```sql
-- See scripts/013-add-wallet-support.sql
```

## Integration Points

### 1. Login Page

The login page now includes wallet authentication as an alternative:

```tsx
import { LoginFormWithWallet } from "@/components/auth/login-form-with-wallet"

// Replace LoginForm with LoginFormWithWallet
<LoginFormWithWallet />
```

### 2. Swap Section

The swap proposal form includes blockchain wallet integration:

- Users can choose between "Standard Swap" (platform escrow) and "Blockchain Swap" (smart contract)
- Blockchain swaps require wallet connection
- Wallet address is stored in swap metadata for smart contract execution

### 3. Swap Center

The swap center page includes a wallet connection component in the header, allowing users to connect their wallets for blockchain features.

## Authentication Flow

### Standard Email/Password
1. User enters email and password
2. Supabase authenticates
3. Session created

### Blockchain Wallet
1. User clicks "Connect Wallet"
2. Wallet extension (MetaMask, etc.) prompts for connection
3. User signs authentication message (no gas fees)
4. Backend verifies signature
5. Wallet address linked to user account
6. Session created or wallet linked to existing account

## Security Considerations

### Current Implementation
- Signature verification is simplified (basic format validation)
- **Production TODO**: Implement full ECDSA signature verification using `ethers.js` or `web3.js`

### Production Requirements
1. **Install ethers.js**:
   ```bash
   npm install ethers
   ```

2. **Update signature verification** in `app/api/auth/wallet-signin/route.ts`:
   ```typescript
   import { ethers } from "ethers"
   
   function verifySignature(message: string, signature: string, address: string): boolean {
     try {
       const recoveredAddress = ethers.utils.verifyMessage(message, signature)
       return recoveredAddress.toLowerCase() === address.toLowerCase()
     } catch (error) {
       return false
     }
   }
   ```

3. **Nonce Management**: Implement proper nonce storage with expiration (Redis recommended for production)

## Usage Examples

### Connect Wallet in Component
```tsx
import { connectWallet, getWalletAddress } from "@/lib/web3/wallet"

// Connect wallet
const address = await connectWallet()

// Check if wallet is connected
const currentAddress = await getWalletAddress()
```

### Use Wallet Auth Component
```tsx
import { WalletAuth } from "@/components/auth/wallet-auth"

<WalletAuth 
  redirectTo="/dashboard"
  onSuccess={() => console.log("Authenticated!")}
/>
```

### Use Wallet Swap Auth Component
```tsx
import { WalletSwapAuth } from "@/components/swap/wallet-swap-auth"

<WalletSwapAuth 
  onWalletConnected={(address) => {
    console.log("Wallet connected:", address)
  }}
  required={true} // Require wallet for blockchain swaps
/>
```

## Supported Wallets

- MetaMask
- WalletConnect (via WalletConnect provider)
- Coinbase Wallet
- Any wallet that implements the Ethereum Provider API (EIP-1193)

## Blockchain Networks

The system is designed to work with:
- Ethereum Mainnet
- Polygon
- Konet (when supported)
- Any EVM-compatible chain

Network switching can be implemented using the `switchNetwork()` utility.

## Next Steps

1. **Run database migration**: Execute `scripts/013-add-wallet-support.sql` in Supabase
2. **Install ethers.js** (for production signature verification):
   ```bash
   npm install ethers
   ```
3. **Update login page** to use `LoginFormWithWallet` component
4. **Test wallet connection** with MetaMask or other Web3 wallets
5. **Implement smart contract integration** for blockchain swaps

## Troubleshooting

### Wallet Not Detected
- Ensure MetaMask or another Web3 wallet is installed
- Check that `window.ethereum` is available (inspect browser console)

### Signature Verification Fails
- Verify the message format matches between signing and verification
- Check that the address format is correct (0x followed by 40 hex characters)
- Ensure nonce is not expired

### Wallet Connection Rejected
- User may have rejected the connection request
- Check wallet extension permissions

## Files Created/Modified

### New Files
- `lib/web3/wallet.ts`
- `components/auth/wallet-auth.tsx`
- `components/swap/wallet-swap-auth.tsx`
- `components/auth/login-form-with-wallet.tsx`
- `app/api/auth/wallet-nonce/route.ts`
- `app/api/auth/wallet-signin/route.ts`
- `scripts/013-add-wallet-support.sql`

### Modified Files
- `components/swap/swap-proposal-form.tsx` (wallet integration added)
- `components/swap/swap-center-content.tsx` (wallet connection component added)
- `app/api/swaps/route.ts` (wallet address support added)

