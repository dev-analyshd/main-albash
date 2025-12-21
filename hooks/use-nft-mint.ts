import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'

export interface MintNFTOptions {
  name: string
  description: string
  image: File | string
  attributes?: Array<{ trait_type: string; value: string | number }>
  listingId?: string
}

export function useNFTMint() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const mintNFT = async (options: MintNFTOptions) => {
    setIsLoading(true)
    setError(null)

    try {
      // Prepare form data for upload
      const formData = new FormData()
      formData.append('name', options.name)
      formData.append('description', options.description)
      
      // Handle image file
      if (options.image instanceof File) {
        formData.append('image', options.image)
      } else if (typeof options.image === 'string') {
        formData.append('imageUrl', options.image)
      }

      if (options.attributes) {
        formData.append('attributes', JSON.stringify(options.attributes))
      }

      if (options.listingId) {
        formData.append('listingId', options.listingId)
      }

      // Call API endpoint to mint NFT
      const response = await fetch('/api/nft/mint', {
        method: 'POST',
        body: JSON.stringify({
          name: options.name,
          description: options.description,
          image: typeof options.image === 'string' ? options.image : undefined,
          attributes: options.attributes,
          listingId: options.listingId,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to mint NFT')
      }

      const data = await response.json()

      toast({
        title: 'Success',
        description: 'NFT metadata stored successfully! Ready for minting.',
      })

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })

      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    mintNFT,
    isLoading,
    error,
  }
}
