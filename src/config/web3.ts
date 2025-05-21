import { Chain } from 'viem';
import { mainnet, sepolia, hardhat } from 'viem/chains';

// Using local hardhat network for development
export const campNetwork: Chain = {
  ...hardhat,
  id: 31337, // Hardhat's default chain ID
  name: 'Local Network',
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'], // Local Hardhat/Anvil node
    },
    public: {
      http: ['http://127.0.0.1:8545'],
    },
  },
};

// For production, we can use these networks
export const supportedNetworks = {
  localhost: campNetwork,
  mainnet: mainnet,
  sepolia: sepolia,
}

// Contract addresses - deployed locally during development
export const CONTRACTS = {
  ZyncFactory: '0xde2Bd2ffEA002b8E84ADeA96e5976aF664115E2c',
  VideoNFT: '0xD778E110C66d2E3A8A92cE9D64924DB2b8B24C60',
  PlatformToken: '0x986aaa537b8cc170761FDAC6aC4fc7F9d8a20A8C',
} as const;

// Contract ABIs
export const ABIS = {
  ipRegistry: [], // TODO: Add ABI
  royaltyManager: [], // TODO: Add ABI
  licenseManager: [], // TODO: Add ABI
} as const; 