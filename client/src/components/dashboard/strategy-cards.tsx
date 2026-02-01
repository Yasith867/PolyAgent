import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Shield, TrendingUp, ArrowRight, CheckCircle2 } from "lucide-react";
import type { Strategy } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface StrategyCardsProps {
  strategies?: Strategy[];
  isLoading?: boolean;
}

const riskColors = {
  low: { badge: "bg-chart-2/10 text-chart-2 border-chart-2/20", icon: "text-chart-2" },
  medium: { badge: "bg-chart-4/10 text-chart-4 border-chart-4/20", icon: "text-chart-4" },
  high: { badge: "bg-chart-5/10 text-chart-5 border-chart-5/20", icon: "text-chart-5" },
};

const typeIcons: Record<string, typeof Zap> = {
  yield_farming: Zap,
  lending: TrendingUp,
  trading: TrendingUp,
  liquidity_provision: Zap,
  staking: Shield,
};

export function StrategyCards({ strategies, isLoading }: StrategyCardsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="border">
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayStrategies = strategies || [];

  return (
    <Card data-testid="card-strategies">
      <CardHeader className="flex flex-row items-center justify-between gap-1">
        <CardTitle>Recommended Strategies</CardTitle>
        <Button variant="ghost" size="sm" data-testid="button-view-all-strategies">
          View All <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayStrategies.map((strategy) => {
            const risk = riskColors[strategy.riskLevel as keyof typeof riskColors] || riskColors.medium;
            const Icon = typeIcons[strategy.type] || Zap;
            
            return (
              <Card
                key={strategy.id}
                className="border hover-elevate cursor-pointer group"
                data-testid={`strategy-card-${strategy.id}`}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 rounded-md bg-primary/10">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    {strategy.isActive && (
                      <Badge variant="secondary" className="bg-chart-2/10 text-chart-2">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Active
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold mb-1">{strategy.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {strategy.description}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <Badge variant="outline" className="text-xs">
                      {strategy.protocol}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${risk.badge}`}>
                      <Shield className={`w-3 h-3 mr-1 ${risk.icon}`} />
                      {strategy.riskLevel}
                    </Badge>
                  </div>
                  {strategy.expectedApy && (
                    <div className="flex items-center justify-between pt-3 border-t">
                      <span className="text-xs text-muted-foreground">Expected APY</span>
                      <span className="text-lg font-bold text-chart-2">
                        {parseFloat(strategy.expectedApy).toFixed(1)}%
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
          {displayStrategies.length === 0 && (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No strategies available yet. The AI is analyzing optimal opportunities.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
