import { ethers } from 'ethers';
import { parseEther } from 'viem';

// ABIs
const ZYNC_FACTORY_ABI = [
  // Events
  "event VideoRegistered(uint256 indexed tokenId, address indexed creator, address vaultAddress, string videoURI, string tokenName, string tokenSymbol)",
  
  // View functions
  "function getCreatorVideos(address creator) external view returns (uint256[] memory)",
  "function getAllVideos() external view returns (uint256[] memory)",
  "function videoNFT() external view returns (address)",
  "function royaltyVaultImplementation() external view returns (address)",
  "function platformToken() external view returns (address)",
  "function defaultTokenPrice() external view returns (uint256)",
  
  // Write functions
  "function registerVideo(string calldata videoURI, string calldata videoTitle, string calldata videoDescription, string calldata tokenName, string calldata tokenSymbol) external returns (uint256 tokenId, address vaultAddress)",
  "function buyVideoTokens(address vaultAddress, uint256 amount) external payable",
  "function updateDefaultTokenPrice(uint256 newPrice) external"
];

const VIDEO_NFT_ABI = [
  // Events
  "event VideoCreated(uint256 indexed tokenId, address indexed creator, string uri, address royaltyVault)",
  
  // View functions
  "function videos(uint256 tokenId) external view returns (string memory title, string memory description, address creator, uint256 timestamp, address royaltyVault)",
  "function getCreatorVideos(address creator) external view returns (uint256[] memory)",
  "function getAllVideos() external view returns (uint256[] memory)",
  "function tokenURI(uint256 tokenId) external view returns (string memory)",
  "function getRoyaltyVault(uint256 tokenId) external view returns (address)",
  
  // Write functions
  "function mintVideo(address creator, string memory uri, string memory title, string memory description, address royaltyVault) public returns (uint256)"
];

const ROYALTY_VAULT_ABI = [
  // Events
  "event RoyaltiesRecorded(uint256 amount)",
  "event DividendsClaimed(address indexed holder, uint256 amount)",
  
  // View functions
  "function videoNftId() external view returns (uint256)",
  "function videoUri() external view returns (string memory)",
  "function dividendToken() external view returns (address)",
  "function totalDividendsDistributed() external view returns (uint256)",
  "function withdrawableDividendOf(address acct) external view returns (uint256)",
  "function accumulativeDividendOf(address acct) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  
  // Write functions
  "function recordRoyalties(uint256 amount) external",
  "function claimDividends() external",
  "function buyTokens(uint256 amount, uint256 pricePerToken) external payable",
  "function transfer(address to, uint256 amount) external returns (bool)"
];

// Contract addresses
const ZYNC_FACTORY_ADDRESS = '0xde2Bd2ffEA002b8E84ADeA96e5976aF664115E2c';
const VIDEO_NFT_ADDRESS = '0xD778E110C66d2E3A8A92cE9D64924DB2b8B24C60';
const PLATFORM_TOKEN_ADDRESS = '0x986aaa537b8cc170761FDAC6aC4fc7F9d8a20A8C';

// Helper function to format video data from the blockchain
export function formatVideoData(data: any) {
  return {
    id: data.id.toString(),
    title: data.title,
    description: data.description,
    creator: data.creator,
    timestamp: Number(data.timestamp) * 1000, // Convert to JS timestamp
    vaultAddress: data.royaltyVault,
    videoURI: data.videoURI,
  };
}

// Helper function to format token data
export function formatTokenData(data: any) {
  return {
    balance: ethers.formatUnits(data.balance || '0', 18),
    dividendsAvailable: ethers.formatUnits(data.dividendsAvailable || '0', 18),
    totalDividends: ethers.formatUnits(data.totalDividends || '0', 18),
    symbol: data.symbol,
    name: data.name,
  };
}

export {
  ZYNC_FACTORY_ABI,
  VIDEO_NFT_ABI,
  ROYALTY_VAULT_ABI,
  ZYNC_FACTORY_ADDRESS,
  VIDEO_NFT_ADDRESS,
  PLATFORM_TOKEN_ADDRESS
}; 