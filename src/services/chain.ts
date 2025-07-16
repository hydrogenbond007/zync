import { defineChain } from 'viem';

// Define the custom chain for Camp Testnet
export const campTestnet = defineChain({
  id: 123420001114,
  name: 'Camp Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.basecamp.t.raas.gelato.cloud'],
    },
  },
  blockExplorers: {
    default: { name: 'Blockscout', url: 'https://basecamp.cloud.blockscout.com' },
  },
  testnet: true,
});

// Function to get the currently configured chain
export function getChain() {
    // For now, we are hardcoding to Camp Testnet.
    // This could be extended to support multiple networks in the future.
    return campTestnet;
} 