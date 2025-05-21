// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./VideoNFT.sol";
import "./RoyaltyVault.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ZyncFactory is Ownable {
    using Clones for address;
    
    VideoNFT public videoNFT;
    address public royaltyVaultImplementation;
    address public platformToken; // ERC20 token for royalty distribution
    
    // Default token price in ETH 
    uint256 public defaultTokenPrice = 0.0001 ether; // Can be updated by owner
    
    event VideoRegistered(
        uint256 indexed tokenId, 
        address indexed creator,
        address vaultAddress,
        string videoURI,
        string tokenName,
        string tokenSymbol
    );
    
    constructor(address _platformToken) Ownable(msg.sender) {
        videoNFT = new VideoNFT();
        royaltyVaultImplementation = address(new RoyaltyVault());
        platformToken = _platformToken;
    }
    
    /**
     * @notice Register a new video and create associated RoyaltyVault
     * @param videoURI IPFS URI for the video content
     * @param videoTitle Title of the video
     * @param videoDescription Description of the video
     * @param tokenName Name for the ERC20 token
     * @param tokenSymbol Symbol for the ERC20 token
     * @return tokenId NFT token ID
     * @return vaultAddress Address of the RoyaltyVault for this video
     */
    function registerVideo(
        string calldata videoURI,
        string calldata videoTitle,
        string calldata videoDescription,
        string calldata tokenName,
        string calldata tokenSymbol
    ) external returns (uint256 tokenId, address vaultAddress) {
        // Clone the RoyaltyVault implementation
        vaultAddress = royaltyVaultImplementation.clone();
        
        // Mint NFT for the video
        tokenId = videoNFT.mintVideo(
            msg.sender,
            videoURI,
            videoTitle,
            videoDescription,
            vaultAddress
        );
        
        // Initialize the RoyaltyVault
        RoyaltyVault(vaultAddress).initialize(
            tokenName,
            tokenSymbol,
            platformToken,
            msg.sender,
            tokenId,
            videoURI
        );
        
        emit VideoRegistered(
            tokenId,
            msg.sender,
            vaultAddress,
            videoURI,
            tokenName,
            tokenSymbol
        );
        
        return (tokenId, vaultAddress);
    }
    
    /**
     * @notice Buy tokens for a specific video
     * @param vaultAddress Address of the RoyaltyVault
     * @param amount Amount of tokens to buy
     */
    function buyVideoTokens(address vaultAddress, uint256 amount) external payable {
        RoyaltyVault(vaultAddress).buyTokens(amount, defaultTokenPrice);
    }
    
    /**
     * @notice Update the default token price
     * @param newPrice New price in wei
     */
    function updateDefaultTokenPrice(uint256 newPrice) external onlyOwner {
        defaultTokenPrice = newPrice;
    }
    
    /**
     * @notice Get all videos by a specific creator
     * @param creator Creator address
     * @return Video token IDs
     */
    function getCreatorVideos(address creator) external view returns (uint256[] memory) {
        return videoNFT.getCreatorVideos(creator);
    }
    
    /**
     * @notice Get all videos
     * @return All video token IDs
     */
    function getAllVideos() external view returns (uint256[] memory) {
        return videoNFT.getAllVideos();
    }
} 