import { db } from "./db";
import {
  portfolios,
  tokenHoldings,
  aiInsights,
  strategies,
  marketData,
} from "@shared/schema";
import { eq } from "drizzle-orm";

export async function seedDatabase() {
  try {
    // Check if we already have data
    const existingPortfolios = await db.select().from(portfolios);
    if (existingPortfolios.length > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }

    console.log("Seeding database...");

    // Create main portfolio
    const [portfolio] = await db
      .insert(portfolios)
      .values({
        name: "Main Portfolio",
        walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f4a2E",
        totalValueUsd: "15247.83",
        dailyChange: "3.24",
      })
      .returning();

    // Add token holdings
    await db.insert(tokenHoldings).values([
      {
        portfolioId: portfolio.id,
        symbol: "MATIC",
        name: "Polygon",
        amount: "5000",
        valueUsd: "5337.50",
        priceUsd: "1.0675",
        change24h: "4.52",
        protocol: "Native",
      },
      {
        portfolioId: portfolio.id,
        symbol: "WETH",
        name: "Wrapped Ether",
        amount: "1.25",
        valueUsd: "3811.96",
        priceUsd: "3049.57",
        change24h: "2.18",
        protocol: "Wrapped",
      },
      {
        portfolioId: portfolio.id,
        symbol: "USDC",
        name: "USD Coin",
        amount: "3050",
        valueUsd: "3050.00",
        priceUsd: "1.00",
        change24h: "0.01",
        protocol: "Circle",
      },
      {
        portfolioId: portfolio.id,
        symbol: "AAVE",
        name: "Aave",
        amount: "12.5",
        valueUsd: "1830.00",
        priceUsd: "146.40",
        change24h: "5.72",
        protocol: "Aave",
      },
      {
        portfolioId: portfolio.id,
        symbol: "LINK",
        name: "Chainlink",
        amount: "85",
        valueUsd: "1218.37",
        priceUsd: "14.33",
        change24h: "-1.24",
        protocol: "Oracle",
      },
    ]);

    // Add AI insights
    await db.insert(aiInsights).values([
      {
        portfolioId: portfolio.id,
        type: "opportunity",
        title: "High Yield Opportunity Detected",
        content: "MATIC-USDC pool on QuickSwap is offering 18.5% APY with low impermanent loss risk. Consider allocating 10-15% of your portfolio.",
        severity: "opportunity",
      },
      {
        portfolioId: portfolio.id,
        type: "market_analysis",
        title: "MATIC Momentum Building",
        content: "Technical indicators show bullish momentum for MATIC. RSI at 58, MACD crossing above signal line. Consider holding current position.",
        severity: "info",
      },
      {
        portfolioId: portfolio.id,
        type: "risk_alert",
        title: "Portfolio Concentration Warning",
        content: "35% of your portfolio is in MATIC. Consider diversifying into stablecoins or other blue-chip assets to reduce volatility risk.",
        severity: "warning",
      },
      {
        portfolioId: portfolio.id,
        type: "strategy",
        title: "Aave V3 Lending Strategy",
        content: "Your USDC holdings could earn 6.2% APY on Aave V3 Polygon with minimal risk. This is higher than current USDC yields on other protocols.",
        severity: "opportunity",
      },
    ]);

    // Add strategies
    await db.insert(strategies).values([
      {
        portfolioId: portfolio.id,
        name: "USDC Lending on Aave V3",
        description: "Deposit USDC into Aave V3 on Polygon to earn lending interest with minimal risk. Funds remain liquid and can be withdrawn anytime.",
        type: "lending",
        expectedApy: "6.20",
        riskLevel: "low",
        protocol: "Aave V3",
        isActive: true,
        steps: JSON.stringify([
          "Connect wallet to Aave V3",
          "Navigate to Supply section",
          "Select USDC and enter amount",
          "Confirm transaction",
        ]),
      },
      {
        portfolioId: portfolio.id,
        name: "MATIC-USDC LP on QuickSwap",
        description: "Provide liquidity to the MATIC-USDC pool on QuickSwap V3. Earn trading fees and liquidity mining rewards.",
        type: "liquidity_provision",
        expectedApy: "18.50",
        riskLevel: "medium",
        protocol: "QuickSwap",
        isActive: true,
        steps: JSON.stringify([
          "Go to QuickSwap pools",
          "Select MATIC-USDC pair",
          "Choose price range",
          "Add liquidity",
        ]),
      },
      {
        portfolioId: portfolio.id,
        name: "wstETH Staking via Lido",
        description: "Stake ETH through Lido to receive wstETH and earn staking rewards. wstETH can be used in other DeFi protocols.",
        type: "staking",
        expectedApy: "4.20",
        riskLevel: "low",
        protocol: "Lido",
        isActive: false,
        steps: JSON.stringify([
          "Bridge ETH to Polygon",
          "Visit Lido on Polygon",
          "Stake ETH for wstETH",
          "Use wstETH in DeFi",
        ]),
      },
      {
        portfolioId: portfolio.id,
        name: "WETH-MATIC Concentrated LP",
        description: "Provide concentrated liquidity on Uniswap V3 for higher capital efficiency and potentially higher returns.",
        type: "liquidity_provision",
        expectedApy: "32.40",
        riskLevel: "high",
        protocol: "Uniswap V3",
        isActive: false,
        steps: JSON.stringify([
          "Access Uniswap V3 on Polygon",
          "Select WETH-MATIC pool",
          "Set tight price range",
          "Monitor and rebalance regularly",
        ]),
      },
      {
        portfolioId: portfolio.id,
        name: "Curve stablecoin yield",
        description: "Deposit stablecoins into Curve's aave pool to earn trading fees and CRV rewards with very low impermanent loss.",
        type: "yield_farming",
        expectedApy: "8.50",
        riskLevel: "low",
        protocol: "Curve",
        isActive: false,
        steps: JSON.stringify([
          "Go to Curve Finance",
          "Select aave pool on Polygon",
          "Deposit USDC/DAI/USDT",
          "Stake LP tokens for CRV",
        ]),
      },
    ]);

    // Add market data
    await db.insert(marketData).values([
      {
        symbol: "MATIC",
        name: "Polygon",
        priceUsd: "1.0675",
        marketCap: "9870000000",
        volume24h: "456000000",
        change24h: "4.52",
        change7d: "12.34",
      },
      {
        symbol: "WETH",
        name: "Wrapped Ether",
        priceUsd: "3049.57",
        marketCap: "366000000000",
        volume24h: "12500000000",
        change24h: "2.18",
        change7d: "8.45",
      },
      {
        symbol: "USDC",
        name: "USD Coin",
        priceUsd: "1.00",
        marketCap: "25000000000",
        volume24h: "5200000000",
        change24h: "0.01",
        change7d: "0.02",
      },
      {
        symbol: "AAVE",
        name: "Aave",
        priceUsd: "146.40",
        marketCap: "2180000000",
        volume24h: "198000000",
        change24h: "5.72",
        change7d: "15.23",
      },
      {
        symbol: "LINK",
        name: "Chainlink",
        priceUsd: "14.33",
        marketCap: "8420000000",
        volume24h: "423000000",
        change24h: "-1.24",
        change7d: "3.56",
      },
      {
        symbol: "UNI",
        name: "Uniswap",
        priceUsd: "9.82",
        marketCap: "5870000000",
        volume24h: "156000000",
        change24h: "3.45",
        change7d: "7.89",
      },
      {
        symbol: "CRV",
        name: "Curve DAO",
        priceUsd: "0.78",
        marketCap: "720000000",
        volume24h: "89000000",
        change24h: "2.34",
        change7d: "-4.21",
      },
      {
        symbol: "QI",
        name: "Qi Dao",
        priceUsd: "0.0234",
        marketCap: "12000000",
        volume24h: "890000",
        change24h: "8.92",
        change7d: "22.45",
      },
    ]);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}
