import { useQuery } from "@tanstack/react-query";
import { MarketOverview } from "@/components/market/market-overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Activity, Zap, Globe } from "lucide-react";
import type { MarketData } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function MarketPage() {
  const { data: marketData, isLoading } = useQuery<MarketData[]>({
    queryKey: ["/api/market"],
  });

  const stats = [
    {
      title: "Total Market Cap",
      value: "$2.1T",
      change: "+2.4%",
      isPositive: true,
      icon: Globe,
    },
    {
      title: "24h Volume",
      value: "$89.2B",
      change: "+12.1%",
      isPositive: true,
      icon: Activity,
    },
    {
      title: "Polygon TVL",
      value: "$1.2B",
      change: "+5.7%",
      isPositive: true,
      icon: Zap,
    },
    {
      title: "Gas Price",
      value: "32 gwei",
      change: "Low",
      isPositive: true,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6" data-testid="page-market">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Market Analysis</h1>
        <p className="text-muted-foreground">
          Real-time market data and AI-powered analysis for Polygon ecosystem
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} data-testid={`card-market-stat-${stat.title.toLowerCase().replace(/\s/g, "-")}`}>
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
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

      <MarketOverview marketData={marketData} isLoading={isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card data-testid="card-trending-protocols">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Trending Protocols
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-5 w-16" />
                </div>
              ))
            ) : (
              [
                { name: "Uniswap V3", category: "DEX", tvl: "$420M", change: "+8.2%" },
                { name: "Aave V3", category: "Lending", tvl: "$380M", change: "+5.1%" },
                { name: "QuickSwap", category: "DEX", tvl: "$180M", change: "+12.4%" },
                { name: "Curve", category: "DEX", tvl: "$150M", change: "+3.8%" },
              ].map((protocol) => (
                <div key={protocol.name} className="flex items-center gap-4 p-2 rounded-md hover-elevate cursor-pointer">
                  <div className="w-10 h-10 rounded-md bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{protocol.name}</div>
                    <div className="text-xs text-muted-foreground">{protocol.category}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{protocol.tvl}</div>
                    <div className="text-xs text-chart-2">{protocol.change}</div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-defi-opportunities">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              DeFi Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-5 w-12" />
                </div>
              ))
            ) : (
              [
                { pair: "USDC-USDT", protocol: "Uniswap V3", apy: "8.2%", risk: "Low" },
                { pair: "MATIC-WETH", protocol: "QuickSwap", apy: "24.5%", risk: "Medium" },
                { pair: "wstETH Staking", protocol: "Lido", apy: "4.2%", risk: "Low" },
                { pair: "AAVE Lending", protocol: "Aave V3", apy: "6.8%", risk: "Low" },
              ].map((opportunity) => (
                <div key={opportunity.pair} className="flex items-center gap-4 p-2 rounded-md hover-elevate cursor-pointer">
                  <div className="w-10 h-10 rounded-md bg-gradient-to-br from-chart-2/20 to-chart-2/5 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-chart-2" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{opportunity.pair}</div>
                    <div className="text-xs text-muted-foreground">{opportunity.protocol}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-chart-2">{opportunity.apy}</div>
                    <Badge variant="outline" className="text-xs">
                      {opportunity.risk}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
