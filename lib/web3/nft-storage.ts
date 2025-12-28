/**
 * NFT.Storage Integration
 * Handles metadata and media storage for NFT minting
 * Lazily loaded to avoid initialization errors during build
 */

import { NFTStorage } from 'nft.storage'

let client: NFTStorage | null = null

function getNFTStorageClient(): NFTStorage {
  if (!client) {
    const token = process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN
    if (!token) {
      throw new Error('NEXT_PUBLIC_NFT_STORAGE_TOKEN environment variable is not set')
    }
    client = new NFTStorage({ token })
  }
  return client
}

export interface NFTMetadata {
  name: string
  description: string
  image: File | Blob | string
  external_url?: string
  attributes?: Array<{
    trait_type: string
    value: string | number
  }>
}

/**
 * Store NFT metadata and media on IPFS via NFT.Storage
 * @param metadata - The NFT metadata object
 * @returns IPFS CID for the metadata
 */
export async function storeNFTMetadata(metadata: NFTMetadata): Promise<string> {
  try {
    const client = getNFTStorageClient()

      // Store using NFT.Storage which handles both metadata and media
    // Cast to any to satisfy nft.storage client types when image may be a string URL
    const stored = await (client as any).store(metadata as any)

    // nft.storage may return an object; normalize to string when possible
    if (typeof stored === 'string') return stored
    if (stored?.url) return String(stored.url)
    if (stored?.cid) return String(stored.cid?.toString?.() ?? stored.cid)
    return JSON.stringify(stored)

  } catch (error) {
    console.error('Error storing NFT metadata:', error)
    throw new Error(`Failed to store NFT metadata: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Store raw metadata JSON on IPFS
 * @param metadata - JSON metadata object
 * @returns IPFS CID
 */
export async function storeMetadata(metadata: Record<string, any>): Promise<string> {
  try {
    const client = getNFTStorageClient()

    // Store raw JSON blob
    const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' })
    // If metadata.image is a string URL, leave it; cast to any for client
    const stored = await (client as any).store({
      name: metadata.name || 'metadata',
      description: metadata.description || '',
      image: (metadata.image && typeof metadata.image !== 'string') ? metadata.image : new File([blob], 'metadata.json'),
      ...metadata,
    } as any)

    if (typeof stored === 'string') return stored
    if (stored?.url) return String(stored.url)
    if (stored?.cid) return String(stored.cid?.toString?.() ?? stored.cid)
    return JSON.stringify(stored)
  } catch (error) {
    console.error('Error storing metadata:', error)
    throw new Error(`Failed to store metadata: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Upload a file to IPFS via NFT.Storage
 * @param file - File to upload
 * @returns IPFS CID
 */
export async function uploadFile(file: File): Promise<string> {
  try {
    const client = getNFTStorageClient()

    const stored = await (client as any).store({
      name: file.name,
      description: `Uploaded file: ${file.name}`,
      image: file,
    } as any)

    if (typeof stored === 'string') return stored
    if (stored?.url) return String(stored.url)
    if (stored?.cid) return String(stored.cid?.toString?.() ?? stored.cid)
    return JSON.stringify(stored)
  } catch (error) {
    console.error('Error uploading file:', error)
    throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Generate IPFS gateway URL from CID
 * @param cid - IPFS Content Identifier
 * @returns Full IPFS gateway URL
 */
export function getIPFSUrl(cid: string): string {
  // Use nft.storage gateway
  return `https://nft.storage/${cid}`
}

/**
 * Generate NFT metadata for minting
 * @param name - NFT name
 * @param description - NFT description
 * @param imageFile - Image file
 * @param attributes - Optional metadata attributes
 * @returns Metadata object
 */
export function createNFTMetadata(
  name: string,
  description: string,
  imageFile: File | string,
  attributes?: Array<{ trait_type: string; value: string | number }>
): NFTMetadata {
  return {
    name,
    description,
    image: imageFile as any,
    external_url: typeof window !== 'undefined' ? window.location.origin : undefined,
    attributes: attributes || [],
  }
}

/**
 * Create a tokenURI compatible with ERC-721 standards
 * @param cid - IPFS CID from nft.storage
 * @returns Full tokenURI
 */
export function createTokenURI(cid: string): string {
  return `ipfs://${cid}/metadata.json`
}

export { NFTStorage }
