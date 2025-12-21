"use client"

import { useState, useEffect } from "react"
import { Wallet, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { connectWallet, getWalletAddress, signMessage, createAuthMessage } from "@/lib/web3/wallet"
import { useToast } from "@/hooks/use-toast"

interface WalletSwapAuthProps {
  onWalletConnected?: (address: string) => void
  required?: boolean
}

export function WalletSwapAuth({ onWalletConnected, required = false }: WalletSwapAuthProps) {
  const { toast } = useToast()
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkWalletConnection()
  }, [])

  const checkWalletConnection = async () => {
    try {
      const address = await getWalletAddress()
      if (address) {
        setConnectedAddress(address)
        if (onWalletConnected) {
          onWalletConnected(address)
        }
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error)
    }
  }

  const handleConnect = async () => {
    setIsConnecting(true)
    setError(null)

    try {
      const address = await connectWallet()
      if (address) {
        setConnectedAddress(address)
        toast({
          title: "Wallet Connected",
          description: `Wallet connected: ${address.slice(0, 6)}...${address.slice(-4)}`,
        })
        if (onWalletConnected) {
          onWalletConnected(address)
        }
      }
    } catch (error: any) {
      setError(error.message || "Failed to connect wallet")
      toast({
        title: "Connection Error",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  if (connectedAddress) {
    return (
      <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <div className="flex-1">
          <p className="text-sm font-medium">Wallet Connected</p>
          <p className="text-xs text-muted-foreground font-mono">
            {connectedAddress.slice(0, 8)}...{connectedAddress.slice(-6)}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {required && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            A blockchain wallet connection is required for this swap operation.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button onClick={handleConnect} disabled={isConnecting} variant="outline" className="w-full gap-2">
        {isConnecting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="h-4 w-4" />
            Connect Wallet for Swap
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground">
        Connect your wallet to enable blockchain-based swaps and tokenization features.
      </p>
    </div>
  )
}

