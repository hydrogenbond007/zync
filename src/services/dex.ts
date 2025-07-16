// ABIs for the SummitX (Uniswap V3 fork) contracts
export const SUMMIT_X_ROUTER_ABI = [
  {
    "type": "function",
    "name": "exactInputSingle",
    "inputs": [
      {
        "type": "tuple",
        "name": "params",
        "components": [
          { "type": "address", "name": "tokenIn" },
          { "type": "address", "name": "tokenOut" },
          { "type": "uint24", "name": "fee" },
          { "type": "address", "name": "recipient" },
          { "type": "uint256", "name": "deadline" },
          { "type": "uint256", "name": "amountIn" },
          { "type": "uint256", "name": "amountOutMinimum" },
          { "type": "uint160", "name": "sqrtPriceLimitX96" }
        ]
      }
    ],
    "outputs": [{ "type": "uint256", "name": "amountOut" }],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "exactOutputSingle",
    "inputs": [
      {
        "type": "tuple",
        "name": "params",
        "components": [
          { "type": "address", "name": "tokenIn" },
          { "type": "address", "name": "tokenOut" },
          { "type": "uint24", "name": "fee" },
          { "type": "address", "name": "recipient" },
          { "type": "uint256", "name": "deadline" },
          { "type": "uint256", "name": "amountOut" },
          { "type": "uint256", "name": "amountInMaximum" },
          { "type": "uint160", "name": "sqrtPriceLimitX96" }
        ]
      }
    ],
    "outputs": [{ "type": "uint256", "name": "amountIn" }],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "multicall",
    "inputs": [{ "type": "bytes[]", "name": "data" }],
    "outputs": [{ "type": "bytes[]", "name": "results" }],
    "stateMutability": "payable"
  }
];

export const ERC20_ABI = [
  {
    "type": "function",
    "name": "approve",
    "inputs": [
      { "type": "address", "name": "spender" },
      { "type": "uint256", "name": "amount" }
    ],
    "outputs": [{ "type": "bool", "name": "" }],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [{ "type": "address", "name": "account" }],
    "outputs": [{ "type": "uint256", "name": "" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "allowance",
    "inputs": [
      { "type": "address", "name": "owner" },
      { "type": "address", "name": "spender" }
    ],
    "outputs": [{ "type": "uint256", "name": "" }],
    "stateMutability": "view"
  }
];

export const POSITION_MANAGER_ABI = [
  {
    "type": "function",
    "name": "mint",
    "inputs": [
      {
        "type": "tuple",
        "name": "params",
        "components": [
          { "type": "address", "name": "token0" },
          { "type": "address", "name": "token1" },
          { "type": "uint24", "name": "fee" },
          { "type": "int24", "name": "tickLower" },
          { "type": "int24", "name": "tickUpper" },
          { "type": "uint256", "name": "amount0Desired" },
          { "type": "uint256", "name": "amount1Desired" },
          { "type": "uint256", "name": "amount0Min" },
          { "type": "uint256", "name": "amount1Min" },
          { "type": "address", "name": "recipient" },
          { "type": "uint256", "name": "deadline" }
        ]
      }
    ],
    "outputs": [
      { "type": "uint256", "name": "tokenId" },
      { "type": "uint128", "name": "liquidity" },
      { "type": "uint256", "name": "amount0" },
      { "type": "uint256", "name": "amount1" }
    ],
    "stateMutability": "payable"
  }
];

export const FACTORY_V3_ABI = [
  {
    "type": "function",
    "name": "createPool",
    "inputs": [
      { "type": "address", "name": "tokenA" },
      { "type": "address", "name": "tokenB" },
      { "type": "uint24", "name": "fee" }
    ],
    "outputs": [{ "type": "address", "name": "pool" }],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getPool",
    "inputs": [
      { "type": "address", "name": "tokenA" },
      { "type": "address", "name": "tokenB" },
      { "type": "uint24", "name": "fee" }
    ],
    "outputs": [{ "type": "address", "name": "pool" }],
    "stateMutability": "view"
  }
];

export const POOL_ABI = [
  {
    "type": "function",
    "name": "initialize",
    "inputs": [{ "type": "uint160", "name": "sqrtPriceX96" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "slot0",
    "inputs": [],
    "outputs": [
      { "type": "uint160", "name": "sqrtPriceX96" },
      { "type": "int24", "name": "tick" },
      { "type": "uint16", "name": "observationIndex" },
      { "type": "uint16", "name": "observationCardinality" },
      { "type": "uint16", "name": "observationCardinalityNext" },
      { "type": "uint8", "name": "feeProtocol" },
      { "type": "bool", "name": "unlocked" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "fee",
    "inputs": [],
    "outputs": [{ "type": "uint24", "name": "" }],
    "stateMutability": "view"
  }
];

// Contract addresses for the SummitX AMM on Camp testnet
export const AMM_ADDRESSES = {
  WNATIVE: '0x1aE9c40eCd2DD6ad5858E5430A556d7aff28A44b',
  FACTORY_V3: '0xa2d92bE77cbA947D81860aB123e5dfC94DD0A10A',
  ROUTER: '0xBCFF1D4737EA9E16C1D96F4B8949229Eb5ED1362',
  POSITION_MANAGER: '0x509DeC0A801CBed9D2F5668A35fFBB469436761A',
  QUOTER_V2: '0xfb3Da70495ffF2DdB7854df2aC083d7CAD58eA18',
  // Default pool fee tiers
  FEE_TIERS: {
    LOW: 500,      // 0.05%
    MEDIUM: 3000,   // 0.3%
    HIGH: 10000     // 1%
  }
};

// Utility constants
export const TICK_SPACING = {
  [AMM_ADDRESSES.FEE_TIERS.LOW]: 10,
  [AMM_ADDRESSES.FEE_TIERS.MEDIUM]: 60,
  [AMM_ADDRESSES.FEE_TIERS.HIGH]: 200
};

// Helper to calculate sqrt price from token price
export function calculateSqrtPriceX96(price: number): bigint {
  // Calculate sqrt(price) * 2^96
  return BigInt(Math.floor(Math.sqrt(price) * 2 ** 96));
}

// Helper to encode price range for liquidity provision
export function calculateTickRange(price: number, priceRange: number, fee: number): { tickLower: number, tickUpper: number } {
  const spacing = TICK_SPACING[fee];
  
  // Calculate the ticks based on price and range
  const baseTickLower = Math.floor(Math.log(price * (1 - priceRange)) / Math.log(1.0001));
  const baseTickUpper = Math.floor(Math.log(price * (1 + priceRange)) / Math.log(1.0001));
  
  // Round to the nearest valid tick based on spacing
  const tickLower = Math.floor(baseTickLower / spacing) * spacing;
  const tickUpper = Math.ceil(baseTickUpper / spacing) * spacing;
  
  return { tickLower, tickUpper };
} 