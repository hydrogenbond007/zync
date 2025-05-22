// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../contracts/ZyncFactory.sol";

contract DeployZync is Script {
    function run() external {
        // Use the hardcoded private key from the user query
        uint256 deployerPrivateKey = 0x8e8771332a21e7cc344bfb0bd0ee0146b46520c5dc326951a04eda0ce5702dfc;
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy the ZyncFactory
        ZyncFactory factory = new ZyncFactory();
        console.log("ZyncFactory deployed at:", address(factory));
        
        // Log addresses for main components
        address videoNFT = address(factory.videoNFT());
        address royaltyVaultImpl = factory.royaltyVaultImplementation();
        console.log("VideoNFT deployed at:", videoNFT);
        console.log("RoyaltyVault implementation deployed at:", royaltyVaultImpl);
        
        // Register a test video
        string memory videoURI = "ipfs://QmTestVideoHash";
        string memory videoTitle = "Test Video";
        string memory videoDescription = "This is a test video for Zync platform";
        string memory tokenName = "Test Video Token";
        string memory tokenSymbol = "TVT";
        
        (uint256 tokenId, address vaultAddress) = factory.registerVideo(
            videoURI,
            videoTitle,
            videoDescription,
            tokenName,
            tokenSymbol
        );
        
        console.log("Test Video NFT created with ID:", tokenId);
        console.log("Test Video RoyaltyVault deployed at:", vaultAddress);
        
        vm.stopBroadcast();
    }
} 