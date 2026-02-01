import { useQuery } from "@tanstack/react-query";
import { PortfolioOverview } from "@/components/dashboard/portfolio-overview";
import { PortfolioChart } from "@/components/dashboard/portfolio-chart";
import { TokenHoldingsTable } from "@/components/dashboard/token-holdings-table";
import { AiInsightsPanel } from "@/components/dashboard/ai-insights-panel";
import { StrategyCards } from "@/components/dashboard/strategy-cards";
import type { Portfolio, TokenHolding, AiInsight, Strategy } from "@shared/schema";

export default function Dashboard() {
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

  return (
    <div className="space-y-6" data-testid="page-dashboard">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Your AI-powered DeFi portfolio overview on Polygon
          </p>
        </div>
      </div>

      <PortfolioOverview portfolio={portfolio} isLoading={portfolioLoading} />

      <PortfolioChart isLoading={portfolioLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TokenHoldingsTable holdings={holdings} isLoading={holdingsLoading} />
        </div>
        <div className="lg:col-span-1">
          <AiInsightsPanel insights={insights} isLoading={insightsLoading} />
        </div>
      </div>

      <StrategyCards strategies={strategies} isLoading={strategiesLoading} />
    </div>
  );
}
