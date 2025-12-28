# 🔗 AlbashSolution Bridge — Developer Quick Reference

**Purpose:** Fast lookup guide for implementation  
**Audience:** Developers, architects, integrators  
**Format:** Copyable code snippets + API definitions

---

## 🚀 Getting Started (5 minutes)

### What Is AlbashSolution?

A **value bridge** connecting:
- 👥 Physical world
- 🌐 Web2 (traditional users)
- ⛓️ Web3 (crypto users)

### Three Core Rules

1. **One Asset, One State**
   - Item cannot be listed in Web2 AND Web3 simultaneously
   - Bridging locks one side, activates the other

2. **Value Parity**
   - $100 in Web2 = $100 equivalent in Web3 (USDC)
   - No inflation, no speculation premiums

3. **Verification is Global**
   - Verify once → access everywhere
   - Unverified users: view-only
   - PENDING users: locked to status page

---

## 📊 Database Schema (Quick Copy)

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  wallet_address VARCHAR(255),
  verification_status VARCHAR(50), -- unverified, pending, verified, suspended
  reputation_score INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Listings Table
```sql
CREATE TABLE listings (
  id UUID PRIMARY KEY,
  owner_id UUID REFERENCES users(id),
  title VARCHAR(255),
  price DECIMAL(18, 2),
  currency VARCHAR(3),
  verified BOOLEAN DEFAULT false,
  status VARCHAR(50), -- active, sold, delisted, bridged_locked
  web3_token_id BIGINT, -- NFT token ID if bridged
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Swaps Table
```sql
CREATE TABLE swaps (
  id UUID PRIMARY KEY,
  initiator_id UUID REFERENCES users(id),
  responder_id UUID REFERENCES users(id),
  initiator_listing_id UUID REFERENCES listings(id),
  responder_listing_id UUID REFERENCES listings(id),
  status VARCHAR(50), -- proposed, accepted, completed, rejected
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '7 days'
);
```

### Verification Requests Table
```sql
CREATE TABLE verification_requests (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  documents TEXT[], -- Array of S3 URLs
  answers JSONB,
  status VARCHAR(50), -- pending, approved, rejected
  reviewed_by_admin UUID,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(50), -- purchase, swap, withdrawal
  amount DECIMAL(18, 2),
  currency VARCHAR(3),
  payment_method VARCHAR(50), -- card, bank, crypto
  status VARCHAR(50), -- pending, completed, failed
  tx_hash VARCHAR(255), -- For Web3 transactions
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔐 Smart Contracts (Quick Copy)

### AlbashVerification.sol (Essential Functions)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AlbashVerification {
    enum Status { UNVERIFIED, PENDING, VERIFIED, SUSPENDED, REVOKED }
    
    mapping(address => Status) public verificationStatus;
    address public admin;
    
    event VerificationApproved(address indexed user);
    event VerificationRevoked(address indexed user);
    
    function requestVerification() external {
        require(verificationStatus[msg.sender] == Status.UNVERIFIED);
        verificationStatus[msg.sender] = Status.PENDING;
    }
    
    function approveVerification(address user) external onlyAdmin {
        verificationStatus[user] = Status.VERIFIED;
        emit VerificationApproved(user);
    }
    
    function isVerified(address user) external view returns (bool) {
        return verificationStatus[user] == Status.VERIFIED;
    }
    
    modifier onlyAdmin() {
        require(msg.sender == admin);
        _;
    }
}
```

### AlbashAssetNFT.sol (Essential Functions)

```solidity
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract AlbashAssetNFT is ERC721, AccessControl {
    struct Asset {
        string assetType; // idea, product, skill, service
        uint256 valueUSD;
        address creator;
    }
    
    mapping(uint256 => Asset) public assets;
    uint256 public tokenIdCounter;
    
    AlbashVerification public verificationContract;
    
    event AssetMinted(uint256 indexed tokenId, address indexed creator, uint256 value);
    event AssetBurned(uint256 indexed tokenId);
    
    function mintAsset(
        string memory assetType,
        uint256 valueUSD,
        string memory metadata
    ) external returns (uint256) {
        require(verificationContract.isVerified(msg.sender), "Not verified");
        require(valueUSD > 0, "Value must be > 0");
        
        uint256 tokenId = tokenIdCounter++;
        _safeMint(msg.sender, tokenId);
        
        assets[tokenId] = Asset({
            assetType: assetType,
            valueUSD: valueUSD,
            creator: msg.sender
        });
        
        emit AssetMinted(tokenId, msg.sender, valueUSD);
        return tokenId;
    }
    
    function burnAsset(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        _burn(tokenId);
        emit AssetBurned(tokenId);
    }
}
```

### AlbashBridge.sol (Essential Functions)

```solidity
pragma solidity ^0.8.20;

contract AlbashBridge {
    AlbashVerification public verificationContract;
    AlbashAssetNFT public nftContract;
    
    event BridgedToWeb3(
        uint256 indexed web2AssetId,
        uint256 indexed tokenId,
        address indexed owner,
        uint256 value
    );
    
    event BridgedToWeb2(
        uint256 indexed tokenId,
        uint256 indexed web2AssetId,
        address indexed owner
    );
    
    // Bridge from Web2 database to Web3 blockchain
    function bridgeToWeb3(
        uint256 web2AssetId,
        string memory assetType,
        uint256 valueUSD
    ) external returns (uint256) {
        require(verificationContract.isVerified(msg.sender), "Not verified");
        
        // Mint NFT on this side
        uint256 tokenId = nftContract.mintAsset(assetType, valueUSD, "");
        
        // Emit event for backend to lock Web2 listing
        emit BridgedToWeb3(web2AssetId, tokenId, msg.sender, valueUSD);
        
        return tokenId;
    }
    
    // Bridge from Web3 blockchain to Web2 database
    function bridgeToWeb2(uint256 tokenId) external returns (uint256) {
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not owner");
        
        // Get asset info before burning
        AlbashAssetNFT.Asset memory asset = nftContract.getAsset(tokenId);
        
        // Burn NFT on this side
        nftContract.burnAsset(tokenId);
        
        // Emit event for backend to restore Web2 listing
        emit BridgedToWeb2(tokenId, 0, msg.sender); // 0 = new listing ID to be assigned by backend
        
        return 0; // Backend will update with actual listing ID
    }
}
```

### AlbashSwap.sol (Essential Functions)

```solidity
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract AlbashSwap is ReentrancyGuard {
    struct SwapProposal {
        uint256 tokenAId;
        uint256 tokenBId;
        address proposer;
        address acceptor;
        uint256 balancingPayment;
        uint256 createdAt;
        bool completed;
    }
    
    mapping(uint256 => SwapProposal) public swaps;
    uint256 public swapIdCounter;
    
    AlbashAssetNFT public nftContract;
    
    event SwapProposed(uint256 indexed swapId, address indexed proposer, address indexed acceptor);
    event SwapCompleted(uint256 indexed swapId);
    event SwapExpired(uint256 indexed swapId);
    
    function proposeSwap(
        uint256 tokenAId,
        uint256 tokenBId,
        address acceptor,
        uint256 balancingPayment
    ) external returns (uint256) {
        require(nftContract.ownerOf(tokenAId) == msg.sender, "Not owner of A");
        
        uint256 swapId = swapIdCounter++;
        swaps[swapId] = SwapProposal({
            tokenAId: tokenAId,
            tokenBId: tokenBId,
            proposer: msg.sender,
            acceptor: acceptor,
            balancingPayment: balancingPayment,
            createdAt: block.timestamp,
            completed: false
        });
        
        emit SwapProposed(swapId, msg.sender, acceptor);
        return swapId;
    }
    
    function acceptSwap(uint256 swapId) external nonReentrant {
        SwapProposal storage swap = swaps[swapId];
        
        require(swap.acceptor == msg.sender, "Not acceptor");
        require(!swap.completed, "Already completed");
        require(block.timestamp < swap.createdAt + 7 days, "Expired");
        require(nftContract.ownerOf(swap.tokenBId) == msg.sender, "Not owner of B");
        
        // Transfer NFTs
        nftContract.transferFrom(swap.proposer, msg.sender, swap.tokenAId);
        nftContract.transferFrom(msg.sender, swap.proposer, swap.tokenBId);
        
        // Handle balancing payment if needed
        if (swap.balancingPayment > 0) {
            (bool success, ) = swap.proposer.call{value: swap.balancingPayment}("");
            require(success, "Payment failed");
        }
        
        swap.completed = true;
        emit SwapCompleted(swapId);
    }
}
```

---

## 🔌 API Endpoints (Quick Reference)

### Authentication

```http
POST /api/auth/google
Content-Type: application/json
{
  "code": "google_auth_code"
}
→ { "user": {...}, "token": "jwt_token" }

POST /api/auth/wallet
{
  "address": "0x...",
  "signature": "0x...",
  "message": "Sign this to verify ownership"
}
→ { "user": {...}, "token": "jwt_token" }
```

### Verification

```http
POST /api/verification/request
Authorization: Bearer {token}
Content-Type: application/json
{
  "entity_type": "builder",
  "documents": ["s3_url_1", "s3_url_2"],
  "answers": { "question_1": "answer" }
}
→ { "request_id": "uuid", "status": "pending" }

GET /api/verification/status/{userId}
→ { "status": "pending|verified|rejected", "details": {...} }

POST /api/admin/verification/{requestId}/approve
Authorization: Bearer {admin_token}
{
  "review_notes": "Approved"
}
→ { "status": "approved" }
```

### Listings

```http
POST /api/listings/create
Authorization: Bearer {token}
{
  "title": "Used Laptop",
  "description": "...",
  "price": 500,
  "currency": "USD",
  "category": "electronics",
  "asset_type": "product",
  "images": ["url1", "url2"]
}
→ { "id": "uuid", "status": "active", "verified": true }

GET /api/listings/{id}
→ { "id": "uuid", "title": "...", "price": 500, ... }

GET /api/listings/search?q=laptop&category=electronics&min_price=100&max_price=1000
→ { "listings": [...], "total": 50, "page": 1 }

PUT /api/listings/{id}
Authorization: Bearer {token}
{ "price": 450 }
→ { "id": "uuid", "price": 450, ... }

DELETE /api/listings/{id}
Authorization: Bearer {token}
→ { "status": "deleted" }
```

### Swaps

```http
POST /api/swaps/propose
Authorization: Bearer {token}
{
  "initiator_listing_id": "uuid",
  "responder_listing_id": "uuid",
  "message": "Want to trade?"
}
→ { "swap_id": "uuid", "status": "proposed" }

GET /api/swaps/{id}
→ { "id": "uuid", "status": "proposed", "initiator": {...}, "responder": {...} }

POST /api/swaps/{id}/accept
Authorization: Bearer {token}
→ { "status": "completed" }

POST /api/swaps/{id}/reject
Authorization: Bearer {token}
→ { "status": "rejected" }
```

### Bridging

```http
POST /api/bridge/to-web3
Authorization: Bearer {token}
{
  "listing_id": "uuid",
  "asset_type": "product",
  "value_usd": 500
}
→ {
  "tx_hash": "0x...",
  "token_id": 12345,
  "status": "minting"
}

POST /api/bridge/to-web2
Authorization: Bearer {token}
{
  "token_id": 12345,
  "nft_address": "0x..."
}
→ {
  "listing_id": "uuid",
  "status": "restoring"
}

GET /api/bridge/status/{bridgeId}
→ { "status": "pending|completed|failed" }
```

### Payments

```http
POST /api/payments/process
Authorization: Bearer {token}
{
  "listing_id": "uuid",
  "payment_method": "card",
  "amount": 500,
  "currency": "USD"
}
→ {
  "redirect_url": "https://stripe.com/...",
  "transaction_id": "uuid"
}

GET /api/payments/transactions/{userId}
→ { "transactions": [...] }
```

### Reputation

```http
GET /api/reputation/{userId}
→ {
  "score": 87,
  "successful_trades": 15,
  "listings": 8,
  "badges": ["verified", "top_trader"]
}
```

---

## 🧠 Implementation Patterns

### Pattern 1: Verification Guard

```typescript
// Before any transaction, check verification
const isVerified = await verificationContract.isVerified(userAddress);
if (!isVerified) {
  throw new Error("User must be verified");
}
```

### Pattern 2: Value Parity Enforcement

```typescript
// When bridging, validate value matches exactly
const web2Value = listing.price; // $500
const web3Value = await nftContract.getAssetValue(tokenId); // $500 USDC

if (web2Value !== web3Value) {
  throw new Error("Value parity violation");
}
```

### Pattern 3: State Lock/Unlock

```typescript
// Web2 → Web3
await db.listings.update(listing.id, { status: "bridged_locked" });
await nftContract.mintAsset(...);

// Web3 → Web2
await nftContract.burnAsset(tokenId);
await db.listings.update(listing.id, { status: "active" });
```

### Pattern 4: Escrow for Swaps

```solidity
// Hold funds until both parties confirm
require(msg.value >= swapProposal.totalValue);
// ... after acceptance ...
(bool success, ) = recipient.call{value: swapProposal.totalValue}("");
require(success, "Payment failed");
```

### Pattern 5: Reputation Updates

```typescript
// After successful transaction
await reputationContract.updateScore(user.address, +5);
await db.users.update(user.id, {
  reputation_score: user.reputation_score + 5
});
```

---

## ⚙️ Configuration Checklist

### Environment Variables

```bash
# Blockchain
ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc
ARBITRUM_CHAIN_ID=42161
PRIVATE_KEY=0x... # For contract deployment

# Smart Contracts
VERIFICATION_CONTRACT=0x... # Arbitrum address
ASSET_NFT_CONTRACT=0x...
MARKETPLACE_CONTRACT=0x...
BRIDGE_CONTRACT=0x...
SWAP_CONTRACT=0x...
REPUTATION_CONTRACT=0x...

# Database
DATABASE_URL=postgresql://user:pass@host/db

# Payment Processors
STRIPE_SECRET_KEY=sk_...
STRIPE_PUBLISHABLE_KEY=pk_...
PAYSTACK_SECRET_KEY=...
FLUTTERWAVE_SECRET_KEY=...

# File Storage
AWS_S3_BUCKET=bucket-name
AWS_ACCESS_KEY=...
AWS_SECRET_KEY=...

# OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
X_API_KEY=...
X_API_SECRET=...

# CORS
ALLOWED_ORIGINS=https://yourdomain.com

# JWT
JWT_SECRET=your-secret-key
```

---

## 🚨 Error Codes (Quick Reference)

| Code | Meaning | Action |
|------|---------|--------|
| 401 | Not authenticated | Log in first |
| 403 | Not verified | Complete verification |
| 404 | Not found | Check ID |
| 422 | Validation error | Check input fields |
| 429 | Rate limited | Wait 60 seconds |
| 500 | Server error | Check logs |

---

## 📞 Getting Help

**Smart Contract Questions:**
- Check AlbashAssetNFT.sol comments
- Review OpenZeppelin docs

**API Questions:**
- Check API_REFERENCE.md
- Review example requests

**Database Questions:**
- Check DATABASE_SCHEMA.md
- Review migration files

**Deployment Questions:**
- Check DEPLOYMENT_GUIDE.md
- Review checklist

---

## 🎯 Success Checklist

Before deploying to production:

- [ ] All smart contracts audited
- [ ] All API endpoints tested
- [ ] Database backups configured
- [ ] Monitoring alerts set up
- [ ] Error tracking enabled
- [ ] CORS configured correctly
- [ ] SSL/TLS enabled
- [ ] Rate limiting enabled
- [ ] Documentation complete
- [ ] Admin panel accessible

---

**Last Updated:** December 2025  
**Questions?** Check ALBASH_BRIDGE_ARCHITECTURE.md for detailed explanations
