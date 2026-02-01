import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet, Activity, Zap, Shield } from "lucide-react";
import type { Portfolio } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface PortfolioOverviewProps {
  portfolio?: Portfolio;
  isLoading?: boolean;
  isLive?: boolean;
}

export function PortfolioOverview({ portfolio, isLoading, isLive }: PortfolioOverviewProps) {
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
      title: "24h PnL",
      value: isLive 
        ? "—" 
        : `${isPositive ? "+" : ""}$${(totalValue * (dailyChange / 100)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: isLive ? "Requires historical data" : "vs. yesterday",
      isPositive,
      icon: isPositive ? TrendingUp : TrendingDown,
      disabled: isLive,
    },
    {
      title: "Active Strategies",
      value: isLive ? "—" : "3",
      change: isLive ? "Connect to protocols" : "Optimizing yield",
      isPositive: true,
      icon: Zap,
      disabled: isLive,
    },
    {
      title: "Risk Score",
      value: isLive ? "—" : "Medium",
      change: isLive ? "Requires analysis" : "Well balanced",
      isPositive: true,
      icon: Shield,
      disabled: isLive,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} data-testid={`card-stat-${stat.title.toLowerCase().replace(" ", "-")}`} className={stat.disabled ? "opacity-60" : ""}>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.disabled ? "text-muted-foreground" : stat.isPositive ? "text-chart-2" : "text-chart-5"}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
            <p className={`text-xs flex items-center gap-1 ${stat.disabled ? "text-muted-foreground" : stat.isPositive ? "text-chart-2" : "text-chart-5"}`}>
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
