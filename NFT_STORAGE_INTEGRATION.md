# NFT.Storage Integration - Implementation Guide

## Overview

The AlbashSolution platform now fully integrates **nft.storage** for decentralized, permanent NFT metadata and media storage on IPFS. This implementation provides a robust, scalable solution for storing NFT assets and metadata.

**API Token:** `9c9ea98f.441adb3ee06f48baaea3ecd01c116445`

## Features

✅ **Decentralized Storage** - All NFT metadata and media stored on IPFS via nft.storage
✅ **Permanent Archival** - Data backed up by Filecoin for long-term persistence
✅ **ERC-721 Compatible** - Generates standard tokenURI for smart contracts
✅ **Database Integration** - Tracks mint records in Supabase
✅ **Multiple Storage Methods** - Support for files, URLs, and raw metadata
✅ **Web3 Context Integration** - Built into the Web3Provider

## Setup & Configuration

### Environment Variables

The API token is already configured in `.env.local`:

```env
***REDACTED_NFT_STORAGE_TOKEN***
```

### Database Setup

Run the migration to create the NFT mint records table:

```bash
# Supabase Dashboard → SQL Editor → New Query
# Copy and paste contents of: scripts/014-add-nft-storage.sql
```

Or use Supabase CLI:
```bash
supabase db push --file scripts/014-add-nft-storage.sql
```

## Core Components

### 1. NFT Storage Service (`lib/web3/nft-storage.ts`)

Main service for interacting with nft.storage:

```typescript
import {
  storeNFTMetadata,
  storeMetadata,
  uploadFile,
  getIPFSUrl,
  createNFTMetadata,
  createTokenURI,
} from '@/lib/web3/nft-storage'
```

**Key Functions:**

- **`storeNFTMetadata(metadata: NFTMetadata): Promise<string>`**
  - Stores complete NFT metadata and media on IPFS
  - Returns IPFS CID

- **`uploadFile(file: File): Promise<string>`**
  - Upload individual file to IPFS
  - Useful for media-only uploads

- **`createNFTMetadata(...): NFTMetadata`**
  - Helper to create properly formatted NFT metadata

- **`createTokenURI(cid: string): string`**
  - Generates ERC-721 compatible tokenURI from CID

- **`getIPFSUrl(cid: string): string`**
  - Generates full IPFS gateway URL

### 2. Web3 Provider Enhancement (`lib/web3/web3-provider.tsx`)

The Web3Provider now includes NFT minting with nft.storage:

```typescript
const { mintNFTWithMetadata } = useWeb3()

// Mint NFT with automatic metadata storage
const result = await mintNFTWithMetadata(
  {
    name: "My NFT",
    description: "Beautiful artwork",
    image: fileObject,
    attributes: [{ trait_type: "Color", value: "Blue" }]
  },
  "1.0" // price in ETH
)

// Returns:
// {
//   transactionHash: "0x...",
//   ipfsUrl: "bafyreic...",
//   tokenURI: "ipfs://bafyreic.../metadata.json",
//   tx: {...}
// }
```

### 3. API Endpoint (`app/api/nft/mint/route.ts`)

Backend endpoint for NFT minting:

**POST `/api/nft/mint`**

Request:
```json
{
  "name": "NFT Name",
  "description": "NFT Description",
  "image": "file_or_url",
  "attributes": [
    { "trait_type": "Color", "value": "Red" },
    { "trait_type": "Rarity", "value": "Rare" }
  ],
  "listingId": "uuid"
}
```

Response:
```json
{
  "success": true,
  "ipfsUrl": "bafyreic...",
  "tokenURI": "ipfs://bafyreic.../metadata.json",
  "metadata": {...},
  "mintRecordId": "uuid"
}
```

**GET `/api/nft/mint?listingId=uuid`**

Retrieve mint records for authenticated user.

### 4. React Hook (`hooks/use-nft-mint.ts`)

Simple hook for NFT minting in components:

```typescript
import { useNFTMint } from '@/hooks/use-nft-mint'

export function MyComponent() {
  const { mintNFT, isLoading, error } = useNFTMint()

  const handleMint = async () => {
    try {
      const result = await mintNFT({
        name: "My NFT",
        description: "Description",
        image: fileInput.files[0],
        attributes: [{ trait_type: "Type", value: "Art" }],
        listingId: "listing-uuid"
      })
      
      console.log("IPFS URL:", result.ipfsUrl)
      console.log("Token URI:", result.tokenURI)
    } catch (err) {
      console.error("Mint failed:", err)
    }
  }

  return (
    <button onClick={handleMint} disabled={isLoading}>
      {isLoading ? "Minting..." : "Mint NFT"}
    </button>
  )
}
```

## Usage Examples

### Example 1: Basic NFT Minting from Component

```typescript
'use client'

import { useNFTMint } from '@/hooks/use-nft-mint'
import { useWeb3 } from '@/lib/web3/web3-provider'
import { useState } from 'react'

export function MintComponent() {
  const { mintNFT, isLoading } = useNFTMint()
  const { account } = useWeb3()
  const [file, setFile] = useState<File | null>(null)

  const handleMint = async () => {
    if (!account || !file) return

    const result = await mintNFT({
      name: "My Artwork",
      description: "Beautiful digital artwork",
      image: file,
      attributes: [
        { trait_type: "Artist", value: account },
        { trait_type: "Year", value: "2025" }
      ]
    })

    // Now use result.tokenURI with web3 to mint on-chain
  }

  return (
    <>
      <input 
        type="file" 
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={handleMint} disabled={isLoading}>
        {isLoading ? "Uploading to IPFS..." : "Mint NFT"}
      </button>
    </>
  )
}
```

### Example 2: Listing Tokenization

```typescript
import { storeNFTMetadata, createTokenURI } from '@/lib/web3/nft-storage'

async function tokenizeListing(listing: Listing, coverImage: File) {
  // Store listing as NFT metadata
  const ipfsUrl = await storeNFTMetadata({
    name: listing.title,
    description: listing.description,
    image: coverImage,
    attributes: [
      { trait_type: "Type", value: listing.listing_type },
      { trait_type: "Price", value: listing.price?.toString() || "0" },
      { trait_type: "Category", value: listing.category_id || "uncategorized" }
    ]
  })

  const tokenURI = createTokenURI(ipfsUrl)
  
  // Save to database
  await supabase
    .from('listings')
    .update({
      is_tokenized: true,
      token_id: ipfsUrl,
      metadata: { token_uri: tokenURI }
    })
    .eq('id', listing.id)

  return tokenURI
}
```

### Example 3: Batch File Upload

```typescript
import { uploadFile } from '@/lib/web3/nft-storage'

async function uploadMultipleFiles(files: File[]) {
  const uploadPromises = files.map(file => uploadFile(file))
  const cids = await Promise.all(uploadPromises)
  
  return cids.map(cid => `https://nft.storage/${cid}`)
}
```

## NFT Metadata Standard

All metadata stored follows the ERC-721 metadata standard:

```json
{
  "name": "NFT Name",
  "description": "NFT Description",
  "image": "ipfs://...",
  "external_url": "https://albashsolutions.com/nft/...",
  "attributes": [
    {
      "trait_type": "Trait Name",
      "value": "Trait Value"
    },
    {
      "trait_type": "Rarity",
      "value": "Rare"
    }
  ]
}
```

## Database Schema

### nft_mint_records Table

Stores all NFT minting operations:

```sql
CREATE TABLE nft_mint_records (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id),
  listing_id UUID REFERENCES listings(id),
  ipfs_url TEXT NOT NULL,           -- IPFS CID
  token_uri TEXT NOT NULL,          -- ERC-721 tokenURI
  metadata JSONB,                   -- Full metadata JSON
  status TEXT DEFAULT 'pending',    -- pending, minted, failed
  transaction_hash TEXT,            -- Blockchain tx hash
  contract_address TEXT,            -- NFT contract address
  token_id TEXT,                    -- On-chain token ID
  error_message TEXT,               -- Error if failed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Error Handling

All functions include proper error handling:

```typescript
try {
  const ipfsUrl = await storeNFTMetadata(metadata)
} catch (error) {
  console.error('Failed to store NFT:', error.message)
  // Error messages include details about what failed
}
```

## Security & Best Practices

✅ **Private API Token** - Stored in environment variables only
✅ **Authentication Required** - All API endpoints require user auth
✅ **RLS Policies** - Database records protected by row-level security
✅ **File Validation** - Validate file types and sizes before upload
✅ **Error Messages** - Clear, user-friendly error feedback

## Limitations & Considerations

- **File Size**: nft.storage supports files up to several GB
- **Rate Limiting**: No rate limits for free tier, but monitor usage
- **Permanence**: Data is permanent via Filecoin backing
- **Privacy**: All data on IPFS is public by design
- **Gas Costs**: Smart contract minting incurs gas fees on blockchain

## Troubleshooting

### "NFT_STORAGE_TOKEN environment variable is not set"
- Ensure `.env.local` contains the API token
- Restart development server after adding env vars

### "Failed to store metadata"
- Check IPFS network connectivity
- Verify file sizes are reasonable
- Check nft.storage service status

### "Transaction failed on blockchain"
- Verify contract address is correct
- Ensure user has wallet connected
- Check network is correct (testnet vs mainnet)
- Verify sufficient gas/balance

## Next Steps

1. ✅ **Setup**: Run the database migration (scripts/014-add-nft-storage.sql)
2. ✅ **Testing**: Test NFT minting through `/studio/nft-mint` or custom component
3. ✅ **Integration**: Integrate minting into listing creation workflows
4. ✅ **Monitoring**: Track NFT mint records in admin dashboard

## Resources

- [nft.storage Documentation](https://nft.storage/docs/)
- [IPFS Documentation](https://docs.ipfs.io/)
- [ERC-721 Standard](https://eips.ethereum.org/EIPS/eip-721)
- [Filecoin](https://filecoin.io/)

## API Token Details

**Current Token:** `9c9ea98f.441adb3ee06f48baaea3ecd01c116445`

To regenerate or manage tokens:
1. Visit https://nft.storage/login
2. Go to API Tokens section
3. Create new or revoke existing tokens

Keep this token secure and never commit it to version control!
