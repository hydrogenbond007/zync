// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VideoNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;
    
    // Metadata for each video
    struct VideoMetadata {
        string title;
        string description;
        address creator;
        uint256 timestamp;
        address royaltyVault; // Address of the associated RoyaltyVault
    }
    
    // Mapping from tokenId to VideoMetadata
    mapping(uint256 => VideoMetadata) public videos;
    
    // Creator address to their token IDs
    mapping(address => uint256[]) public creatorToTokens;
    
    // All token IDs
    uint256[] public allTokenIds;
    
    event VideoCreated(
        uint256 indexed tokenId, 
        address indexed creator, 
        string uri,
        address royaltyVault
    );
    
    constructor() ERC721("ZyncVideo", "ZYNCV") Ownable(msg.sender) {}
    
    function mintVideo(
        address creator,
        string memory uri,
        string memory title,
        string memory description,
        address royaltyVault
    ) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _mint(creator, tokenId);
        _setTokenURI(tokenId, uri);
        
        // Store metadata
        videos[tokenId] = VideoMetadata({
            title: title,
            description: description,
            creator: creator,
            timestamp: block.timestamp,
            royaltyVault: royaltyVault
        });
        
        // Update mappings
        creatorToTokens[creator].push(tokenId);
        allTokenIds.push(tokenId);
        
        emit VideoCreated(tokenId, creator, uri, royaltyVault);
        
        return tokenId;
    }
    
    // Helper function to get a creator's videos
    function getCreatorVideos(address creator) external view returns (uint256[] memory) {
        return creatorToTokens[creator];
    }
    
    // Helper function to get all videos
    function getAllVideos() external view returns (uint256[] memory) {
        return allTokenIds;
    }
    
    // Helper function to get royalty vault address for a video
    function getRoyaltyVault(uint256 tokenId) external view returns (address) {
        return videos[tokenId].royaltyVault;
    }
} 