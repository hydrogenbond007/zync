import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    camp: {
      url: process.env.CAMP_NETWORK_RPC_URL || "https://rpc.basecamp.t.raas.gelato.cloud",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : ["8e8771332a21e7cc344bfb0bd0ee0146b46520c5dc326951a04eda0ce5702dfc"],
    },
    hardhat: {
      chainId: 31337,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  // etherscan: {
  //   apiKey: process.env.ETHERSCAN_API_KEY || "",
  // },
};

export default config;