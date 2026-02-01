import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Shield, TrendingUp, CheckCircle2, Play, Pause, Info } from "lucide-react";
import type { Strategy } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function StrategiesPage() {
  const { data: strategies, isLoading } = useQuery<Strategy[]>({
    queryKey: ["/api/strategies"],
  });

  const riskColors = {
    low: { badge: "bg-chart-2/10 text-chart-2 border-chart-2/20", icon: "text-chart-2" },
    medium: { badge: "bg-chart-4/10 text-chart-4 border-chart-4/20", icon: "text-chart-4" },
    high: { badge: "bg-chart-5/10 text-chart-5 border-chart-5/20", icon: "text-chart-5" },
  };

  const typeLabels: Record<string, string> = {
    yield_farming: "Yield Farming",
    lending: "Lending",
    trading: "Trading",
    liquidity_provision: "Liquidity",
    staking: "Staking",
  };

  const displayStrategies = strategies || [];
  const activeStrategies = displayStrategies.filter((s) => s.isActive);
  const availableStrategies = displayStrategies.filter((s) => !s.isActive);

  return (
    <div className="space-y-6" data-testid="page-strategies">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">DeFi Strategies</h1>
        <p className="text-muted-foreground">
          AI-recommended strategies optimized for your risk profile
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card data-testid="card-active-count">
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Strategies
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">{activeStrategies.length}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>
        <Card data-testid="card-avg-apy">
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average APY
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-chart-2">
              {displayStrategies.length > 0
                ? (
                    displayStrategies
                      .filter((s) => s.expectedApy)
                      .reduce((sum, s) => sum + parseFloat(s.expectedApy || "0"), 0) /
                    displayStrategies.filter((s) => s.expectedApy).length
                  ).toFixed(1)
                : "0"}%
            </div>
            <p className="text-xs text-muted-foreground">Expected return</p>
          </CardContent>
        </Card>
        <Card data-testid="card-risk-score">
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Risk Score
            </CardTitle>
            <Shield className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">Medium</div>
            <p className="text-xs text-muted-foreground">Well balanced</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all">All ({displayStrategies.length})</TabsTrigger>
          <TabsTrigger value="active" data-testid="tab-active">Active ({activeStrategies.length})</TabsTrigger>
          <TabsTrigger value="available" data-testid="tab-available">Available ({availableStrategies.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <StrategyGrid strategies={displayStrategies} isLoading={isLoading} riskColors={riskColors} typeLabels={typeLabels} />
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <StrategyGrid strategies={activeStrategies} isLoading={isLoading} riskColors={riskColors} typeLabels={typeLabels} />
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          <StrategyGrid strategies={availableStrategies} isLoading={isLoading} riskColors={riskColors} typeLabels={typeLabels} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StrategyGrid({
  strategies,
  isLoading,
  riskColors,
  typeLabels,
}: {
  strategies: Strategy[];
  isLoading: boolean;
  riskColors: Record<string, { badge: string; icon: string }>;
  typeLabels: Record<string, string>;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-md" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (strategies.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Zap className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="font-semibold mb-2">No strategies found</h3>
          <p className="text-sm text-muted-foreground">
            The AI is analyzing the market for new opportunities.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {strategies.map((strategy) => {
        const risk = riskColors[strategy.riskLevel as keyof typeof riskColors] || riskColors.medium;
        
        return (
          <Card key={strategy.id} className="hover-elevate" data-testid={`card-strategy-${strategy.id}`}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-md bg-primary/10">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{strategy.name}</h3>
                    <Badge variant="outline" className="text-xs mt-1">
                      {typeLabels[strategy.type] || strategy.type}
                    </Badge>
                  </div>
                </div>
                {strategy.isActive && (
                  <Badge className="bg-chart-2/10 text-chart-2 border-0">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                )}
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {strategy.description}
              </p>

              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline">{strategy.protocol}</Badge>
                <Badge variant="outline" className={risk.badge}>
                  <Shield className={`w-3 h-3 mr-1 ${risk.icon}`} />
                  {strategy.riskLevel}
                </Badge>
              </div>

              {strategy.expectedApy && (
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md mb-4">
                  <span className="text-sm text-muted-foreground">Expected APY</span>
                  <span className="text-xl font-bold text-chart-2">
                    {parseFloat(strategy.expectedApy).toFixed(1)}%
                  </span>
                </div>
              )}

              <div className="flex gap-2">
                {strategy.isActive ? (
                  <Button variant="outline" className="flex-1" data-testid={`btn-pause-${strategy.id}`}>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </Button>
                ) : (
                  <Button className="flex-1" data-testid={`btn-activate-${strategy.id}`}>
                    <Play className="w-4 h-4 mr-2" />
                    Activate
                  </Button>
                )}
                <Button variant="outline" size="icon" data-testid={`btn-info-${strategy.id}`}>
                  <Info className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
