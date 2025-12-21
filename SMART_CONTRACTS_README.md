# AlbashSolution Smart Contracts

This directory contains the production-ready smart contract suite for AlbashSolution platform.

## Contracts Overview

### 1. AlbashAccessControl.sol
**Purpose:** Core access control and verification registry  
**Features:**
- Admin and verifier role management
- User verification on-chain
- Verification status checking

**Deployment:**
```solidity
constructor() // Sets deployer as admin
```

**Key Functions:**
- `verifyUser(address)` - Verify a user (verifier only)
- `revokeUser(address)` - Revoke verification (verifier only)
- `isVerified(address)` - Check if user is verified
- `addVerifier(address)` - Add verifier (admin only)
- `removeVerifier(address)` - Remove verifier (admin only)

### 2. AlbashReputation.sol
**Purpose:** Non-transferable reputation scoring system  
**Features:**
- Reputation points tracking
- Increase/decrease reputation
- Integration with access control

**Key Functions:**
- `increaseReputation(address, amount, reason)` - Add reputation points
- `decreaseReputation(address, amount, reason)` - Remove reputation points
- `setReputation(address, score, reason)` - Set reputation directly (admin)

### 3. AlbashNFT.sol
**Purpose:** ERC-721 NFT contract for tokenizing assets  
**Used for:**
- Ideas
- Talents
- Physical assets
- Certificates
- Experiences
- Reputation snapshots

**Key Functions:**
- `mintNFT(address, tokenURI, tokenType, metadata)` - Mint single NFT
- `batchMintNFT(...)` - Mint multiple NFTs
- `updateTokenType(tokenId, type)` - Update token type
- `updateMetadata(tokenId, metadata)` - Update metadata

### 4. AlbashMarketplace.sol
**Purpose:** Verification-gated marketplace  
**Features:**
- Only verified users can list
- Platform fee collection
- Escrow functionality

**Key Functions:**
- `listItem(tokenId, price)` - List NFT for sale (verified only)
- `buyItem(tokenId)` - Purchase listed NFT
- `cancelListing(tokenId)` - Cancel listing
- `updatePrice(tokenId, newPrice)` - Update listing price

### 5. AlbashSwapEscrow.sol
**Purpose:** Escrow contract for value swaps  
**Features:**
- **NO VERIFICATION REQUIRED** - Open to everyone
- Supports all swap types (idea ↔ idea, skill ↔ product, etc.)
- Escrow locking and release
- Platform fee collection

**Key Functions:**
- `createSwap(partyB, valueA, valueB, swapType)` - Create swap (no verification needed)
- `acceptSwap(swapId)` - Accept swap proposal
- `completeSwap(swapId)` - Complete swap and release escrow
- `cancelSwap(swapId)` - Cancel pending swap

**Swap Status Flow:**
1. Pending → Created by party A
2. Accepted → Accepted by party B
3. Completed → Swap executed
4. Cancelled → Cancelled by either party
5. Disputed → In dispute resolution

### 6. AlbashToken.sol
**Purpose:** Platform utility token (ERC-20)  
**Features:**
- Initial supply: 1,000,000 tokens
- Burnable
- Mintable (owner only)

**Used for:**
- Platform fees
- Reputation boosts
- DAO governance (future)
- Incentives

## Deployment Order

1. **AlbashAccessControl** - Deploy first, needed by other contracts
2. **AlbashReputation** - Can integrate with AccessControl
3. **AlbashNFT** - Standalone
4. **AlbashMarketplace** - Requires AccessControl address
5. **AlbashSwapEscrow** - Standalone (no verification required)
6. **AlbashToken** - Standalone

## Dependencies

- OpenZeppelin Contracts v5.x
  - @openzeppelin/contracts/token/ERC721/ERC721.sol
  - @openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol
  - @openzeppelin/contracts/token/ERC20/ERC20.sol
  - @openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol
  - @openzeppelin/contracts/access/Ownable.sol
  - @openzeppelin/contracts/utils/Counters.sol

## Network Support

- **Primary:** Konet Blockchain
- **Fallback:** Polygon / Ethereum

## Integration Notes

### Swap System (NO VERIFICATION REQUIRED)
The swap system is designed to be accessible to **all users**, including unverified ones. This aligns with AlbashSolution's philosophy of open value exchange.

### Marketplace (VERIFICATION REQUIRED)
The marketplace requires verification to ensure quality and trust. Only verified users can list items.

### Reputation System
Reputation is stored on-chain but can be synced with off-chain database. The system allows admin and verifiers to adjust reputation scores.

## Testing

Before deploying to mainnet:
1. Test on testnet (Konet testnet or Polygon Mumbai)
2. Verify all access controls
3. Test swap escrow functionality
4. Verify marketplace fee calculations
5. Test NFT minting and transfers

## Security Considerations

- All contracts use OpenZeppelin's battle-tested libraries
- Access control enforced with modifiers
- Reentrancy protection (where applicable)
- Input validation on all functions
- Safe math operations (Solidity 0.8.20+ has built-in overflow protection)

## Upgradeability

Current contracts are not upgradeable. For production, consider using:
- UUPS (Universal Upgradeable Proxy Standard)
- Transparent Proxy Pattern

## License

MIT License - See SPDX-License-Identifier in each contract file.

