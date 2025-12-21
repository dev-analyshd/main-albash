'use client';

import React, { createContext, useContext } from 'react';

// Lightweight stubbed Web3 provider for non-crypto mode.
// This avoids importing ethers, contract factories, or nft.storage
// so the app can build and run while crypto features are disabled.

type Web3ContextType = {
  provider: any | null;
  signer: any | null;
  account: string | null;
  connectWallet: () => Promise<void>;
  nftContract: any | null;
  tokenContract: any | null;
  mintNFT: (tokenURI: string, price: string) => Promise<any>;
  mintNFTWithMetadata: (metadata: any, price: string) => Promise<any>;
  isConnected: boolean;
  isConnecting: boolean;
};

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const noopAsync = async () => {};
  const throwDisabled = async () => {
    throw new Error('Web3 features are disabled in this environment');
  };

  const value: Web3ContextType = {
    provider: null,
    signer: null,
    account: null,
    connectWallet: noopAsync,
    nftContract: null,
    tokenContract: null,
    mintNFT: throwDisabled,
    mintNFTWithMetadata: throwDisabled,
    isConnected: false,
    isConnecting: false,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    // Return a safe no-op fallback so components can call useWeb3
    // even when the app hasn't mounted a Web3Provider (dev mode).
    return {
      provider: null,
      signer: null,
      account: null,
      connectWallet: async () => {},
      nftContract: null,
      tokenContract: null,
      mintNFT: async () => {
        throw new Error('Web3 features are disabled in this environment');
      },
      mintNFTWithMetadata: async () => {
        throw new Error('Web3 features are disabled in this environment');
      },
      isConnected: false,
      isConnecting: false,
    } as Web3ContextType;
  }
  return context;
}
