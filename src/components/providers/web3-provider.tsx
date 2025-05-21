'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { http } from 'wagmi';
import { campNetwork } from '@/config/web3';

// Create a query client
const queryClient = new QueryClient();

// Create wagmi config with the getDefaultConfig utility
const config = getDefaultConfig({
  appName: 'Zync',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [campNetwork],
  transports: {
    [campNetwork.id]: http('http://127.0.0.1:8545'), // Ensure this is the URL of your Anvil node
  },
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
} 