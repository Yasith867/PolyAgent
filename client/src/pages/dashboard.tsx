import { useQuery } from "@tanstack/react-query";
import { PortfolioOverview } from "@/components/dashboard/portfolio-overview";
import { PortfolioChart } from "@/components/dashboard/portfolio-chart";
import { TokenHoldingsTable } from "@/components/dashboard/token-holdings-table";
import { AiInsightsPanel } from "@/components/dashboard/ai-insights-panel";
import { StrategyCards } from "@/components/dashboard/strategy-cards";
import type { Portfolio, TokenHolding, AiInsight, Strategy } from "@shared/schema";
import { useWallet, POLYGON_CHAIN_ID } from "@/contexts/wallet-context";
import { useWalletBalances, type TokenBalance } from "@/hooks/use-wallet-balances";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function walletBalancesToHoldings(balances: TokenBalance[]): TokenHolding[] {
  return balances.map((balance, index) => ({
    id: index + 1,
    portfolioId: 1,
    symbol: balance.symbol,
    name: balance.name,
    amount: balance.balance,
    valueUsd: balance.valueUsd || "0",
    priceUsd: balance.priceUsd || "0",
    change24h: "0",
    logoUrl: null,
    contractAddress: balance.address,
    protocol: null,
    createdAt: new Date(),
  }));
}

export default function Dashboard() {
  const { address, isConnected, chainId, connect, switchToPolygon } = useWallet();
  const { data: walletBalances = [], isLoading: walletLoading } = useWalletBalances();
  
  const { data: portfolio, isLoading: portfolioLoading } = useQuery<Portfolio>({
    queryKey: ["/api/portfolios", 1],
  });

  const { data: holdings, isLoading: holdingsLoading } = useQuery<TokenHolding[]>({
    queryKey: ["/api/portfolios", 1, "holdings"],
  });

  const { data: insights, isLoading: insightsLoading } = useQuery<AiInsight[]>({
    queryKey: ["/api/portfolios", 1, "insights"],
  });

  const { data: strategies, isLoading: strategiesLoading } = useQuery<Strategy[]>({
    queryKey: ["/api/portfolios", 1, "strategies"],
  });

  const isWrongNetwork = isConnected && chainId !== POLYGON_CHAIN_ID;
  
  const totalWalletValue = walletBalances.reduce(
    (sum, token) => sum + parseFloat(token.valueUsd || "0"),
    0
  );

  const walletHoldings = walletBalancesToHoldings(walletBalances);
  
  const walletPortfolio: Portfolio | undefined = isConnected && !isWrongNetwork ? {
    id: 1,
    name: "Connected Wallet",
    walletAddress: address || "",
    totalValueUsd: totalWalletValue.toFixed(2),
    dailyChange: "0",
    createdAt: new Date(),
  } : portfolio;

  const displayHoldings = isConnected && !isWrongNetwork ? walletHoldings : holdings;
  const displayLoading = isConnected && !isWrongNetwork ? walletLoading : holdingsLoading;

  return (
    <div className="space-y-6" data-testid="page-dashboard">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            {isConnected && !isWrongNetwork 
              ? "Live portfolio data from your connected wallet"
              : "Your AI-powered DeFi portfolio overview on Polygon"}
          </p>
        </div>
        {isConnected && !isWrongNetwork && (
          <Badge variant="secondary" className="bg-chart-2/10 text-chart-2">
            <div className="w-1.5 h-1.5 rounded-full bg-chart-2 mr-1.5 animate-pulse" />
            Live Data
          </Badge>
        )}
      </div>

      {!isConnected && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="py-4">
            <div className="flex items-center gap-4 flex-wrap">
              <Wallet className="w-8 h-8 text-primary" />
              <div className="flex-1 min-w-[200px]">
                <h3 className="font-semibold">Connect Your Wallet</h3>
                <p className="text-sm text-muted-foreground">
                  Connect your wallet to see your real token balances and portfolio value.
                </p>
              </div>
              <Button onClick={connect} data-testid="button-connect-dashboard">
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isWrongNetwork && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="py-4">
            <div className="flex items-center gap-4 flex-wrap">
              <AlertCircle className="w-8 h-8 text-destructive" />
              <div className="flex-1 min-w-[200px]">
                <h3 className="font-semibold">Wrong Network</h3>
                <p className="text-sm text-muted-foreground">
                  Please switch to Polygon network to view your real balances.
                </p>
              </div>
              <Button onClick={switchToPolygon} data-testid="button-switch-network-dashboard">
                Switch to Polygon
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <PortfolioOverview 
        portfolio={walletPortfolio} 
        isLoading={isConnected && !isWrongNetwork ? walletLoading : portfolioLoading}
        isLive={isConnected && !isWrongNetwork}
        holdings={displayHoldings}
      />

      <PortfolioChart 
        isLoading={displayLoading} 
        holdings={displayHoldings}
        totalValue={isConnected && !isWrongNetwork ? totalWalletValue : undefined}
        isLive={isConnected && !isWrongNetwork}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TokenHoldingsTable 
            holdings={displayHoldings} 
            isLoading={displayLoading}
            isLive={isConnected && !isWrongNetwork}
          />
        </div>
        <div className="lg:col-span-1">
          <AiInsightsPanel 
            insights={insights} 
            isLoading={insightsLoading}
            isDemo={isConnected && !isWrongNetwork}
          />
        </div>
      </div>

      <StrategyCards 
        strategies={strategies} 
        isLoading={strategiesLoading}
        isDemo={isConnected && !isWrongNetwork}
      />
    </div>
  );
}
