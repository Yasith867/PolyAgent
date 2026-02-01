import { ethers, Contract, formatUnits } from "ethers";

const POLYGON_RPC_URL = "https://polygon-rpc.com/";

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
];

const POPULAR_POLYGON_TOKENS = [
  { symbol: "MATIC", name: "Polygon", address: "native", decimals: 18 },
  { symbol: "USDC", name: "USD Coin", address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", decimals: 6 },
  { symbol: "USDT", name: "Tether USD", address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", decimals: 6 },
  { symbol: "WETH", name: "Wrapped Ether", address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", decimals: 18 },
  { symbol: "WBTC", name: "Wrapped Bitcoin", address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6", decimals: 8 },
  { symbol: "AAVE", name: "Aave", address: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B", decimals: 18 },
  { symbol: "LINK", name: "Chainlink", address: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39", decimals: 18 },
  { symbol: "UNI", name: "Uniswap", address: "0xb33EaAd8d922B1083446DC23f610c2567fB5180f", decimals: 18 },
  { symbol: "QUICK", name: "QuickSwap", address: "0xB5C064F955D8e7F38fE0460C556a72987494eE17", decimals: 18 },
  { symbol: "DAI", name: "Dai Stablecoin", address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", decimals: 18 },
];

export interface TokenBalance {
  symbol: string;
  name: string;
  address: string;
  balance: string;
  decimals: number;
  valueUsd?: string;
  priceUsd?: string;
}

const COINGECKO_IDS: Record<string, string> = {
  MATIC: "matic-network",
  USDC: "usd-coin",
  USDT: "tether",
  WETH: "weth",
  WBTC: "wrapped-bitcoin",
  AAVE: "aave",
  LINK: "chainlink",
  UNI: "uniswap",
  QUICK: "quickswap",
  DAI: "dai",
};

// Simple in-memory cache for token prices
let priceCache: { prices: Record<string, number>; timestamp: number } | null = null;
const CACHE_TTL_MS = 60000; // 1 minute cache

async function fetchTokenPrices(): Promise<Record<string, number>> {
  // Check cache first
  if (priceCache && Date.now() - priceCache.timestamp < CACHE_TTL_MS) {
    return priceCache.prices;
  }
  try {
    const ids = Object.values(COINGECKO_IDS).join(",");
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
    );
    if (!response.ok) {
      console.error("CoinGecko API error:", response.status);
      return {};
    }
    const data = await response.json();
    
    const prices: Record<string, number> = {};
    for (const [symbol, geckoId] of Object.entries(COINGECKO_IDS)) {
      if (data[geckoId]?.usd) {
        prices[symbol] = data[geckoId].usd;
      }
    }
    
    // Update cache
    priceCache = { prices, timestamp: Date.now() };
    
    return prices;
  } catch (error) {
    console.error("Error fetching token prices:", error);
    // Return cached prices if available, even if stale
    return priceCache?.prices || {};
  }
}

export async function getWalletTokenBalances(walletAddress: string): Promise<TokenBalance[]> {
  const provider = new ethers.JsonRpcProvider(POLYGON_RPC_URL);
  const balances: TokenBalance[] = [];

  const prices = await fetchTokenPrices();

  for (const token of POPULAR_POLYGON_TOKENS) {
    try {
      let balance: bigint;
      
      if (token.address === "native") {
        balance = await provider.getBalance(walletAddress);
      } else {
        const contract = new Contract(token.address, ERC20_ABI, provider);
        balance = await contract.balanceOf(walletAddress);
      }
      
      const formattedBalance = formatUnits(balance, token.decimals);
      const balanceNum = parseFloat(formattedBalance);
      
      if (balanceNum > 0) {
        const price = prices[token.symbol] || 0;
        const valueUsd = (balanceNum * price).toFixed(2);
        
        balances.push({
          symbol: token.symbol,
          name: token.name,
          address: token.address,
          balance: formattedBalance,
          decimals: token.decimals,
          priceUsd: price.toFixed(8),
          valueUsd,
        });
      }
    } catch (error) {
      console.error(`Error fetching balance for ${token.symbol}:`, error);
    }
  }

  return balances.sort((a, b) => parseFloat(b.valueUsd || "0") - parseFloat(a.valueUsd || "0"));
}

export async function getWalletNativeBalance(walletAddress: string): Promise<string> {
  const provider = new ethers.JsonRpcProvider(POLYGON_RPC_URL);
  const balance = await provider.getBalance(walletAddress);
  return formatUnits(balance, 18);
}
