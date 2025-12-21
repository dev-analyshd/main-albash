/**
 * Web3 Wallet Utilities for AlbashSolution
 * Supports MetaMask, WalletConnect, and other Web3 wallets
 */

export interface WalletConnection {
  address: string
  chainId: number
  provider: any
}

export interface WalletSignature {
  address: string
  signature: string
  message: string
}

/**
 * Get the wallet address from the authenticated user
 */
export async function getWalletAddress(): Promise<string | null> {
  if (typeof window === "undefined") return null
  
  if (!window.ethereum) {
    return null
  }

  try {
    const accounts = await window.ethereum.request({ method: "eth_accounts" })
    return accounts[0] || null
  } catch (error) {
    console.error("Error getting wallet address:", error)
    return null
  }
}

/**
 * Connect to MetaMask or other Web3 wallet
 */
export async function connectWallet(): Promise<string | null> {
  if (typeof window === "undefined") {
    throw new Error("Wallet connection requires browser environment")
  }

  if (!window.ethereum) {
    throw new Error("No Web3 wallet found. Please install MetaMask or another Web3 wallet.")
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    })
    return accounts[0] || null
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error("Wallet connection rejected by user")
    }
    throw new Error(error.message || "Failed to connect wallet")
  }
}

/**
 * Sign a message with the connected wallet
 */
export async function signMessage(message: string, address: string): Promise<string> {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("Web3 wallet not available")
  }

  try {
    const signature = await window.ethereum.request({
      method: "personal_sign",
      params: [message, address],
    })
    return signature
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error("Signature rejected by user")
    }
    throw new Error(error.message || "Failed to sign message")
  }
}

/**
 * Create authentication message for wallet sign-in
 */
export function createAuthMessage(address: string, nonce: string): string {
  return `Welcome to AlbashSolution!

Please sign this message to authenticate your wallet.

Wallet Address: ${address}
Nonce: ${nonce}
Timestamp: ${new Date().toISOString()}

This request will not trigger a blockchain transaction or cost any gas fees.`
}

/**
 * Verify wallet signature on the backend
 */
export async function verifyWalletSignature(
  address: string,
  signature: string,
  message: string
): Promise<boolean> {
  // This should be done on the backend using a library like ethers.js or web3.js
  // For now, we'll just send it to the API
  try {
    const response = await fetch("/api/auth/verify-wallet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, signature, message }),
    })
    const result = await response.json()
    return result.valid === true
  } catch (error) {
    console.error("Error verifying wallet signature:", error)
    return false
  }
}

/**
 * Check if wallet is connected
 */
export async function isWalletConnected(): Promise<boolean> {
  const address = await getWalletAddress()
  return address !== null
}

/**
 * Disconnect wallet
 */
export async function disconnectWallet(): Promise<void> {
  // Clear any stored wallet connection data
  if (typeof window !== "undefined") {
    localStorage.removeItem("wallet_address")
    localStorage.removeItem("wallet_chain_id")
  }
}

/**
 * Switch network to a specific chain
 */
export async function switchNetwork(chainId: number): Promise<void> {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("Web3 wallet not available")
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    })
  } catch (error: any) {
    if (error.code === 4902) {
      throw new Error(`Network ${chainId} not found. Please add it to your wallet.`)
    }
    throw new Error(error.message || "Failed to switch network")
  }
}

// Type declarations for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, handler: (...args: any[]) => void) => void
      removeListener: (event: string, handler: (...args: any[]) => void) => void
      isMetaMask?: boolean
    }
  }
}

