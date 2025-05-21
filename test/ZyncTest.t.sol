// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../contracts/ZyncFactory.sol";
import "../contracts/VideoNFT.sol";
import "../contracts/RoyaltyVault.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PlatformToken is ERC20 {
    constructor() ERC20("Test Platform Token", "TPT") {
        _mint(msg.sender, 1_000_000_000 * 10**decimals());
    }
}

contract ZyncTest is Test {
    ZyncFactory public factory;
    PlatformToken public platformToken;
    address public creator;

    function setUp() public {
        // Set up test accounts
        creator = makeAddr("creator");
        vm.deal(creator, 100 ether);
        
        // Deploy platform token
        platformToken = new PlatformToken();
        
        // Transfer some platform tokens to creator for testing
        platformToken.transfer(creator, 1_000_000 * 10**18);
        
        // Deploy ZyncFactory
        factory = new ZyncFactory(address(platformToken));
    }
    
    function testRegisterVideo() public {
        // Switch to creator account
        vm.startPrank(creator);
        
        // Register a test video
        string memory videoURI = "ipfs://QmTestVideoHash";
        string memory videoTitle = "Test Video";
        string memory videoDescription = "This is a test video";
        string memory tokenName = "Test Video Token";
        string memory tokenSymbol = "TVT";
        
        (uint256 tokenId, address vaultAddress) = factory.registerVideo(
            videoURI,
            videoTitle,
            videoDescription,
            tokenName,
            tokenSymbol
        );
        
        // Get the VideoNFT contract
        VideoNFT videoNFT = factory.videoNFT();
        
        // Verify NFT ownership
        assertEq(videoNFT.ownerOf(tokenId), creator);
        
        // Verify metadata
        (string memory title, string memory description, address videoCreator, , address royaltyVault) = videoNFT.videos(tokenId);
        assertEq(title, videoTitle);
        assertEq(description, videoDescription);
        assertEq(videoCreator, creator);
        assertEq(royaltyVault, vaultAddress);
        
        // Check token balance in RoyaltyVault
        RoyaltyVault vault = RoyaltyVault(vaultAddress);
        uint256 creatorBalance = vault.balanceOf(creator);
        uint256 expectedBalance = 700_000_000 * 10**18; // 70% of 1 billion
        assertEq(creatorBalance, expectedBalance);
        
        vm.stopPrank();
        
        console.log("Test passed: Video registered successfully");
        console.log("Token ID:", tokenId);
        console.log("RoyaltyVault address:", vaultAddress);
        console.log("Creator token balance:", creatorBalance);
    }
} 