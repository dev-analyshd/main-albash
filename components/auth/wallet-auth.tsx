"use client"

import { useState, useEffect } from "react"
import { Wallet, Loader2, CheckCircle, AlertCircle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { connectWallet, signMessage, createAuthMessage, getWalletAddress, isWalletConnected } from "@/lib/web3/wallet"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface WalletAuthProps {
  onSuccess?: () => void
  redirectTo?: string
}

export function WalletAuth({ onSuccess, redirectTo }: WalletAuthProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSigning, setIsSigning] = useState(false)
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
          description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
        })
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

  const handleSignIn = async () => {
    if (!connectedAddress) {
      setError("Please connect your wallet first")
      return
    }

    setIsSigning(true)
    setError(null)

    try {
      // Get nonce from server
      const nonceResponse = await fetch("/api/auth/wallet-nonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: connectedAddress }),
      })

      if (!nonceResponse.ok) {
        throw new Error("Failed to get authentication nonce")
      }

      const { nonce } = await nonceResponse.json()
      const message = createAuthMessage(connectedAddress, nonce)

      // Sign the message
      const signature = await signMessage(message, connectedAddress)

      // Authenticate with the server
      const authResponse = await fetch("/api/auth/wallet-signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: connectedAddress,
          signature,
          message,
          nonce,
        }),
      })

      const result = await authResponse.json()

      if (!authResponse.ok) {
        throw new Error(result.error || "Authentication failed")
      }

      toast({
        title: "Authentication Successful",
        description: "You have been signed in with your wallet",
      })

      if (onSuccess) {
        onSuccess()
      }

      if (redirectTo) {
        router.push(redirectTo)
      } else {
        router.push("/dashboard")
      }

      router.refresh()
    } catch (error: any) {
      setError(error.message || "Authentication failed")
      toast({
        title: "Authentication Error",
        description: error.message || "Failed to authenticate with wallet",
        variant: "destructive",
      })
    } finally {
      setIsSigning(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Blockchain Wallet Authentication
        </CardTitle>
        <CardDescription>
          Connect your Web3 wallet (MetaMask, WalletConnect, etc.) to sign in or use platform features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!connectedAddress ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Connect your wallet to use blockchain features like swaps, tokenization, and more.
            </p>
            <Button onClick={handleConnect} disabled={isConnecting} className="w-full gap-2" size="lg">
              {isConnecting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4" />
                  Connect Wallet
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Supported wallets: MetaMask, WalletConnect, Coinbase Wallet, and more
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Connected Wallet</p>
                <p className="text-sm text-muted-foreground font-mono">
                  {connectedAddress.slice(0, 6)}...{connectedAddress.slice(-4)}
                </p>
              </div>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>

            <Button onClick={handleSignIn} disabled={isSigning} className="w-full gap-2" size="lg">
              {isSigning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4" />
                  Sign In with Wallet
                </>
              )}
            </Button>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Signing a message does not cost any gas fees</p>
              <p>• This proves you own the wallet address</p>
              <p>• Your wallet never leaves your device</p>
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Don't have a wallet?{" "}
            <a
              href="https://metamask.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              Install MetaMask <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
