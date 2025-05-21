import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  // First, deploy a simple ERC20 token to use as the platform token for royalties
  // In a real deployment, you might want to use an existing token
  const ERC20 = await ethers.getContractFactory("ERC20"); // Replace with your actual ERC20 contract
  const platformToken = await ERC20.deploy("Zync Platform Token", "ZYNC");
  await platformToken.waitForDeployment();
  
  console.log("Platform Token deployed to:", await platformToken.getAddress());
  
  // Deploy the ZyncFactory
  const ZyncFactory = await ethers.getContractFactory("ZyncFactory");
  const zyncFactory = await ZyncFactory.deploy(await platformToken.getAddress());
  await zyncFactory.waitForDeployment();
  
  console.log("ZyncFactory deployed to:", await zyncFactory.getAddress());
  
  // The factory has already deployed VideoNFT and RoyaltyVault implementation in its constructor
  console.log("VideoNFT deployed to:", await zyncFactory.videoNFT());
  console.log("RoyaltyVault implementation deployed to:", await zyncFactory.royaltyVaultImplementation());
  
  console.log("Default token price set to:", ethers.formatEther(await zyncFactory.defaultTokenPrice()), "ETH");
  
  // If you want to register a test video, uncomment the following:
  /*
  const tx = await zyncFactory.registerVideo(
    "ipfs://test-video-uri",
    "Test Video Title",
    "This is a test video description",
    "Test Video Token",
    "TVT"
  );
  await tx.wait();
  console.log("Test video registered");
  */
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 