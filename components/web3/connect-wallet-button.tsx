'use client';

import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/lib/web3/web3-provider';
import { Wallet, Loader2 } from 'lucide-react';

export function ConnectWalletButton() {
  const { connectWallet, isConnected, account, isConnecting } = useWeb3();

  return (
    <Button
      onClick={connectWallet}
      disabled={isConnecting}
      className="flex items-center gap-2"
      variant={isConnected ? 'outline' : 'default'}
    >
      {isConnecting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : isConnected ? (
        <>
          <Wallet className="h-4 w-4" />
          {`${account?.slice(0, 6)}...${account?.slice(-4)}`}
        </>
      ) : (
        <>
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </>
      )}
    </Button>
  );
}
