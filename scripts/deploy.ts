import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy VideoTokenFactory
  const VideoTokenFactory = await ethers.getContractFactory("VideoTokenFactory");
  const factory = await VideoTokenFactory.deploy(deployer.address);
  await factory.waitForDeployment();

  console.log("VideoTokenFactory deployed to:", await factory.getAddress());

  // For testing, create a sample video token
  const createTx = await factory.createVideoToken(
    "Sample Video Token",
    "SVT",
    "ipfs://QmSampleVideoHash",
    ethers.parseEther("0.1") // 0.1 ETH per token
  );

  await createTx.wait();
  console.log("Sample video token created");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 