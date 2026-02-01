import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet, Activity, Zap, Shield, Coins } from "lucide-react";
import type { Portfolio, TokenHolding } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface PortfolioOverviewProps {
  portfolio?: Portfolio;
  isLoading?: boolean;
  isLive?: boolean;
  holdings?: TokenHolding[];
}

function calculateRiskScore(holdings?: TokenHolding[]): { score: string; level: string } {
  if (!holdings || holdings.length === 0) return { score: "N/A", level: "unknown" };
  
  const total = holdings.reduce((sum, h) => sum + parseFloat(h.valueUsd || "0"), 0);
  if (total === 0) return { score: "N/A", level: "unknown" };
  
  // Calculate concentration risk (largest holding percentage)
  const largestHolding = Math.max(...holdings.map(h => parseFloat(h.valueUsd || "0")));
  const concentration = (largestHolding / total) * 100;
  
  // Calculate diversification score
  const tokenCount = holdings.filter(h => parseFloat(h.valueUsd || "0") > 0).length;
  
  // Stablecoin percentage (lower risk)
  const stablecoins = ["USDC", "USDT", "DAI"];
  const stablecoinValue = holdings
    .filter(h => stablecoins.includes(h.symbol))
    .reduce((sum, h) => sum + parseFloat(h.valueUsd || "0"), 0);
  const stablecoinPct = (stablecoinValue / total) * 100;
  
  // Risk calculation
  let riskPoints = 0;
  
  // Concentration risk
  if (concentration > 80) riskPoints += 3;
  else if (concentration > 50) riskPoints += 2;
  else riskPoints += 1;
  
  // Diversification
  if (tokenCount <= 2) riskPoints += 2;
  else if (tokenCount <= 4) riskPoints += 1;
  
  // Stablecoin safety
  if (stablecoinPct > 50) riskPoints -= 1;
  
  if (riskPoints <= 1) return { score: "Low", level: "low" };
  if (riskPoints <= 3) return { score: "Medium", level: "medium" };
  return { score: "High", level: "high" };
}

export function PortfolioOverview({ portfolio, isLoading, isLive, holdings }: PortfolioOverviewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-1" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalValue = portfolio?.totalValueUsd ? parseFloat(portfolio.totalValueUsd) : 0;
  const dailyChange = portfolio?.dailyChange ? parseFloat(portfolio.dailyChange) : 0;
  const isPositive = dailyChange >= 0;
  
  // Calculate live stats from holdings
  const tokenCount = holdings?.filter(h => parseFloat(h.valueUsd || "0") > 0).length || 0;
  const riskData = calculateRiskScore(holdings);
  const riskColors: Record<string, string> = {
    low: "text-chart-2",
    medium: "text-chart-4", 
    high: "text-chart-5",
    unknown: "text-muted-foreground"
  };

  const stats = [
    {
      title: isLive ? "Wallet Value" : "Total Value",
      value: `$${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: isLive ? "Live from blockchain" : `${isPositive ? "+" : ""}${dailyChange.toFixed(2)}%`,
      isPositive: true,
      icon: Wallet,
      isLiveIndicator: isLive,
    },
    {
      title: "Tokens Held",
      value: isLive 
        ? `${tokenCount}` 
        : `${isPositive ? "+" : ""}$${(totalValue * (dailyChange / 100)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: isLive ? "Different assets" : "24h PnL",
      isPositive: true,
      icon: Coins,
    },
    {
      title: "Network",
      value: isLive ? "Polygon" : "3",
      change: isLive ? "PoS Mainnet" : "Active Strategies",
      isPositive: true,
      icon: Zap,
    },
    {
      title: "Risk Score",
      value: isLive ? riskData.score : "Medium",
      change: isLive 
        ? riskData.level === "low" ? "Well diversified" 
          : riskData.level === "high" ? "Concentrated" 
          : "Balanced portfolio"
        : "Well balanced",
      isPositive: riskData.level !== "high",
      icon: Shield,
      customColor: isLive ? riskColors[riskData.level] : undefined,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} data-testid={`card-stat-${stat.title.toLowerCase().replace(" ", "-")}`}>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.customColor || (stat.isPositive ? "text-chart-2" : "text-chart-5")}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold tracking-tight ${stat.customColor || ""}`}>{stat.value}</div>
            <p className={`text-xs flex items-center gap-1 ${stat.customColor || (stat.isPositive ? "text-chart-2" : "text-chart-5")}`}>
              {stat.isLiveIndicator && (
                <span className="w-1.5 h-1.5 rounded-full bg-chart-2 animate-pulse" />
              )}
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
