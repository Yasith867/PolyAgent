import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet, Activity, Zap, Shield } from "lucide-react";
import type { Portfolio } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface PortfolioOverviewProps {
  portfolio?: Portfolio;
  isLoading?: boolean;
}

export function PortfolioOverview({ portfolio, isLoading }: PortfolioOverviewProps) {
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
      title: "Total Value",
      value: `$${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: `${isPositive ? "+" : ""}${dailyChange.toFixed(2)}%`,
      isPositive,
      icon: Wallet,
    },
    {
      title: "24h PnL",
      value: `${isPositive ? "+" : ""}$${(totalValue * (dailyChange / 100)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: "vs. yesterday",
      isPositive,
      icon: isPositive ? TrendingUp : TrendingDown,
    },
    {
      title: "Active Strategies",
      value: "3",
      change: "Optimizing yield",
      isPositive: true,
      icon: Zap,
    },
    {
      title: "Risk Score",
      value: "Medium",
      change: "Well balanced",
      isPositive: true,
      icon: Shield,
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
            <stat.icon className={`h-4 w-4 ${stat.isPositive ? "text-chart-2" : "text-chart-5"}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
            <p className={`text-xs ${stat.isPositive ? "text-chart-2" : "text-chart-5"}`}>
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
