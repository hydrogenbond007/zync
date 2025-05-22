import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());
  
  // Deploy the ZyncFactory
  console.log("Deploying ZyncFactory...");
  const ZyncFactory = await ethers.getContractFactory("ZyncFactory");
  const zyncFactory = await ZyncFactory.deploy();
  await zyncFactory.waitForDeployment();
  
  console.log("ZyncFactory deployed to:", await zyncFactory.getAddress());
  
  // The factory has already deployed VideoNFT and RoyaltyVault implementation in its constructor
  console.log("VideoNFT deployed to:", await zyncFactory.videoNFT());
  console.log("RoyaltyVault implementation deployed to:", await zyncFactory.royaltyVaultImplementation());
  
  console.log("Default token price set to:", ethers.formatEther(await zyncFactory.defaultTokenPrice()), "ETH");
  
  // Register a test video
  console.log("Registering test video...");
  const tx = await zyncFactory.registerVideo(
    "ipfs://test-video-uri",
    "Test Video Title",
    "This is a test video description",
    "Test Video Token",
    "TVT"
  );
  await tx.wait();
  console.log("Test video registered");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 