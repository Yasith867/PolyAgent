import { useQuery } from "@tanstack/react-query";
import { TokenHoldingsTable } from "@/components/dashboard/token-holdings-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wallet, Plus, ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { TokenHolding, Portfolio } from "@shared/schema";

export default function HoldingsPage() {
  const { data: portfolio, isLoading: portfolioLoading } = useQuery<Portfolio>({
    queryKey: ["/api/portfolios", 1],
  });

  const { data: holdings, isLoading: holdingsLoading } = useQuery<TokenHolding[]>({
    queryKey: ["/api/portfolios", 1, "holdings"],
  });

  const totalValue = portfolio?.totalValueUsd ? parseFloat(portfolio.totalValueUsd) : 0;
  const dailyChange = portfolio?.dailyChange ? parseFloat(portfolio.dailyChange) : 0;
  const isPositive = dailyChange >= 0;

  return (
    <div className="space-y-6" data-testid="page-holdings">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Token Holdings</h1>
          <p className="text-muted-foreground">
            Manage your portfolio holdings on Polygon
          </p>
        </div>
        <Button data-testid="button-add-token">
          <Plus className="w-4 h-4 mr-2" />
          Add Token
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card data-testid="card-total-value">
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Portfolio Value
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className={`flex items-center gap-1 text-sm ${isPositive ? "text-chart-2" : "text-chart-5"}`}>
              {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{isPositive ? "+" : ""}{dailyChange.toFixed(2)}% (24h)</span>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-token-count">
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Tokens
            </CardTitle>
            <Badge variant="secondary">{holdings?.length || 0}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{holdings?.length || 0}</div>
            <p className="text-sm text-muted-foreground">Different assets</p>
          </CardContent>
        </Card>

        <Card data-testid="card-wallet-address">
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Wallet
            </CardTitle>
            <Badge variant="secondary" className="bg-chart-2/10 text-chart-2">Connected</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-mono truncate">
              {portfolio?.walletAddress || "0x742d...4a2E"}
            </div>
            <p className="text-sm text-muted-foreground">Polygon Network</p>
          </CardContent>
        </Card>
      </div>

      <TokenHoldingsTable holdings={holdings} isLoading={holdingsLoading} />
    </div>
  );
}
