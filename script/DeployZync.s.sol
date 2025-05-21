// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../contracts/ZyncFactory.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PlatformToken is ERC20 {
    constructor() ERC20("Zync Platform Token", "ZYNC") {
        _mint(msg.sender, 1_000_000_000 * 10**decimals());
    }
}

contract DeployZync is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // 1. Deploy the platform token
        PlatformToken platformToken = new PlatformToken();
        console.log("Platform Token deployed at:", address(platformToken));
        
        // 2. Deploy the ZyncFactory
        ZyncFactory factory = new ZyncFactory(address(platformToken));
        console.log("ZyncFactory deployed at:", address(factory));
        
        // 3. Log addresses for main components
        address videoNFT = address(factory.videoNFT());
        address royaltyVaultImpl = factory.royaltyVaultImplementation();
        console.log("VideoNFT deployed at:", videoNFT);
        console.log("RoyaltyVault implementation deployed at:", royaltyVaultImpl);
        
        // 4. Register a test video
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