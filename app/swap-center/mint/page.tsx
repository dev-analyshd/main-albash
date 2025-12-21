'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Upload, Image as ImageIcon } from 'lucide-react';
import { useWeb3 } from '@/lib/web3/web3-provider';

export default function MintNFTPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { account, mintNFT } = useWeb3();
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    price: z.string().regex(/^\d+(\.\d{1,18})?$/, 'Invalid price'),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '0',
    },
  });

  const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2 MB

  const onDrop = (acceptedFiles: File[], fileRejections: any[]) => {
    if (fileRejections && fileRejections.length > 0) {
      // Show first rejection reason
      const reason = fileRejections[0]?.errors?.[0]
      toast({
        title: 'Invalid file',
        description: reason?.message || 'File not accepted',
        variant: 'destructive',
      })
      return
    }

    const file = acceptedFiles[0]
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: 'File too large',
          description: 'Please upload images smaller than 2 MB',
          variant: 'destructive',
        })
        return
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Only image files (jpg, png, webp, gif) are allowed',
          variant: 'destructive',
        })
        return
      }

      setFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!file) {
      toast({
        title: 'Error',
        description: 'Please upload a file',
        variant: 'destructive',
      });
      return;
    }

    if (!account) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsUploading(true);
      setStatusMessage('Uploading to IPFS via server...')

      // Build FormData for server upload
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('attributes', JSON.stringify([
        { trait_type: 'Creator', value: account },
        { trait_type: 'Price', value: values.price },
      ]));
      if (file) formData.append('image', file);

      // Upload via XHR so we can monitor progress
      const uploadResult = await new Promise<any>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', '/api/nft/mint')
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100)
            setUploadProgress(pct)
          }
        }
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              resolve(JSON.parse(xhr.responseText))
            } catch (err) {
              resolve({ success: true })
            }
          } else {
            reject(new Error(`Upload failed: ${xhr.statusText}`))
          }
        }
        xhr.onerror = () => reject(new Error('Network error during upload'))
        xhr.send(formData)
      })

      if (!uploadResult || !uploadResult.tokenURI) {
        throw new Error('Server did not return tokenURI')
      }

      setStatusMessage('Minting on-chain...')

      // Call the mint function from web3 provider with tokenURI
      const tx = await mintNFT(uploadResult.tokenURI, values.price)
      const receipt = await tx.wait()

      // Confirm the mint record with server (transaction details)
      try {
        await fetch('/api/nft/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mintRecordId: uploadResult.mintRecordId,
            transactionHash: receipt.transactionHash || tx.hash,
            contractAddress: receipt.to || uploadResult.contractAddress || null,
            tokenId: receipt.events?.[0]?.args?.tokenId?.toString?.() || null,
            status: 'minted',
          }),
        })
      } catch (err) {
        console.warn('Failed to confirm mint record:', err)
      }

      toast({ title: 'Success', description: 'NFT minted successfully!' })

      // Redirect to the swap center
      router.push('/swap-center');
    } catch (error) {
      console.error('Error minting NFT:', error)
      toast({ title: 'Error', description: (error as Error).message || 'Failed to mint NFT', variant: 'destructive' })
    } finally {
      setIsUploading(false)
      setStatusMessage(null)
      setUploadProgress(0)
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Mint New NFT</CardTitle>
            <CardDescription>
              Create a new NFT to trade in the swap center
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                        isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:border-primary/50'
                      }`}
                    >
                      <input {...getInputProps()} />
                      {preview ? (
                        <div className="relative aspect-square w-full">
                          <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <Upload className="h-12 w-12 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            {isDragActive
                              ? 'Drop the file here'
                              : 'Drag and drop a file here, or click to select'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Supports images, audio, video, and PDFs
                          </p>
                        </div>
                      )}
                    </div>
                    {file && (
                      <p className="text-sm text-muted-foreground text-center">
                        Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="My Awesome NFT" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your NFT"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (ETH)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.000000000000000001" placeholder="0.01" {...field} />
                          </FormControl>
                          <FormDescription>
                            Set the price for your NFT in ETH
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {statusMessage && (
                      <div className="w-full">
                        <div className="text-sm mb-2">{statusMessage}</div>
                        <div className="w-full bg-muted h-2 rounded">
                          <div
                            className="bg-primary h-2 rounded"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <Button type="submit" className="w-full" disabled={isUploading}>
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {statusMessage || 'Processing...'}
                        </>
                      ) : (
                        'Mint NFT'
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
