import { Chain } from 'viem';
import { mainnet, sepolia, hardhat } from 'viem/chains';

// Camp testnet configuration
export const campNetwork: Chain = {
  ...hardhat,
  id: 123420001114, // Camp testnet chain ID
  name: 'Camp Testnet',
  rpcUrls: {
    default: {
      http: ['https://rpc.basecamp.t.raas.gelato.cloud'],
    },
    public: {
      http: ['https://rpc.basecamp.t.raas.gelato.cloud'],
    },
  },
};

// For production, we can use these networks
export const supportedNetworks = {
  camp: campNetwork,
  mainnet: mainnet,
  sepolia: sepolia,
}

// Contract addresses - deployed on Camp testnet
export const CONTRACTS = {
  ZyncFactory: '0x1bB1C756286021D5919742adF1CB5476d1584720',
  VideoNFT: '0x636956810ba9d46f1Fd23541bE7CD58c4CBcF88F',
  RoyaltyVaultImpl: '0x7759Cf8E659Dc47cEA1d059Ce5115549E5854Bc4',
} as const;

// Contract ABIs
export const ABIS = {
  ipRegistry: [], // TODO: Add ABI
  royaltyManager: [], // TODO: Add ABI
  licenseManager: [], // TODO: Add ABI
} as const; 