# Zync - IP Ownership Markets for Video Content

Zync is a decentralized platform that enables video content creators to tokenize their content and participate in IP ownership markets. Think of it as a Web3-native YouTube where creators can generate revenue through token-powered mechanisms either from the trading fee or the just revenue share of IP consumption. 

## Features

- Content tokenization: Create tokens for video content
- Revenue sharing: Share future video revenue with token holders
- Token-powered advertising: Enable advertisers to bid using tokens
- Content clipping rights: Allow token holders to clip content (with legal wrappers)
- Searchable content: Discover and engage with crypto-native video content
- **NFT Creation**: Mint NFTs for video content with metadata
- **Token Markets**: Each video has an associated ERC20 token for fractional ownership
- **Royalty Distribution**: Automatically distribute royalties to token holders
- **AMM Integration**: Automatic liquidity pool creation on SummitX AMM

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Web3 Integration:
  - wagmi
  - viem
  - RainbowKit
  - Web3Modal
- Smart Contracts:
  - Solidity
  - Camp Network

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License

MIT License

## Contracts

The platform consists of the following contracts:

- **ZyncFactory**: Main entry point for the platform
- **VideoNFT**: ERC721 token for video content
- **RoyaltyVault**: ERC20 token and royalty distribution for each video

## Automated Market Maker (AMM) Integration

When a new video NFT is minted, Zync automatically:

1. Creates an ERC20 token for the video (RoyaltyVault)
2. Mints 1 billion tokens (70% to creator, 30% reserved for public sale)
3. Creates a liquidity pool on SummitX AMM with 1 CAMP
4. Adds initial liquidity to the pool at a 0.0001 CAMP per token price

This allows users to immediately trade the video tokens on the SummitX DEX without requiring manual setup by the creator.

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`

## Deployment

The contracts are currently deployed on the Camp testnet.

- ZyncFactory: `0x1bB1C756286021D5919742adF1CB5476d1584720`
- VideoNFT: `0x636956810ba9d46f1Fd23541bE7CD58c4CBcF88F`
- RoyaltyVault Implementation: `0x7759Cf8E659Dc47cEA1d059Ce5115549E5854Bc4`

## AMM Contracts (SummitX on Camp Testnet)

- WNATIVE: `0x1aE9c40eCd2DD6ad5858E5430A556d7aff28A44b`
- SummitXV3Factory: `0xa2d92bE77cbA947D81860aB123e5dfC94DD0A10A`
- SummitXRouter: `0xBCFF1D4737EA9E16C1D96F4B8949229Eb5ED1362`
- NonfungiblePositionManager: `0x509DeC0A801CBed9D2F5668A35fFBB469436761A`
