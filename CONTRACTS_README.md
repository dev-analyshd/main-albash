# AlbashSolution Smart Contracts

This directory contains the smart contracts for the AlbashSolution platform.

## Contracts Overview

### 1. AlbashAccessControl.sol
Core access control and verification registry contract.
- Manages admin and verifier roles
- Handles user verification status on-chain
- Events for verification tracking

### 2. AlbashReputation.sol
Non-transferable reputation scoring system.
- Tracks user reputation scores
- Admin-controlled increases/decreases
- Integration with access control

### 3. AlbashNFT.sol
ERC-721 NFT contract for tokenizing assets.
- Supports multiple asset types (Ideas, Talents, Products, Assets, Certificates, etc.)
- Links to off-chain listings
- Marketplace integration

### 4. AlbashMarketplace.sol
Verification-gated marketplace contract.
- Only verified users can list
- Platform fee system (default 5%)
- NFT trading functionality

### 5. AlbashSwapEscrow.sol
Escrow contract for value swaps.
- Supports idea ↔ idea, skill ↔ product swaps
- Handles disputes
- Payment escrow for value differences

### 6. AlbashToken.sol
Platform utility token (ERC-20).
- Initial supply: 1 billion tokens
- Used for fees, reputation boosts, governance

## Deployment

### Prerequisites
1. Install dependencies:
```bash
cd contracts
npm install
```

2. Configure network (update `hardhat.config.js`)

### Deploy Contracts

```bash
# Deploy to local network
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost

# Deploy to testnet/mainnet
# Update hardhat.config.js with network details first
npx hardhat run scripts/deploy.js --network <network-name>
```

Deployment addresses will be saved to `deployment-addresses.json`.

## Contract Addresses (After Deployment)

Update your `.env.local` with contract addresses:
```
NEXT_PUBLIC_ACCESS_CONTROL_ADDRESS=<address>
NEXT_PUBLIC_REPUTATION_ADDRESS=<address>
NEXT_PUBLIC_NFT_ADDRESS=<address>
NEXT_PUBLIC_MARKETPLACE_ADDRESS=<address>
NEXT_PUBLIC_SWAP_ESCROW_ADDRESS=<address>
NEXT_PUBLIC_TOKEN_ADDRESS=<address>
```

## Integration

The contracts are designed to work with the AlbashSolution backend:
- Verification status synced from database to blockchain
- NFT minting triggered from marketplace listings
- Swap contracts execute on-chain when completed
- Reputation updates can be tracked on-chain

## Security Notes

- All contracts include access control
- Admin functions should be secured (multi-sig recommended for production)
- Contracts are upgradeable-ready (can be wrapped in proxies)
- Test thoroughly before mainnet deployment

