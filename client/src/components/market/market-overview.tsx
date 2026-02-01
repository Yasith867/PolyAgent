import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import type { MarketData } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MarketOverviewProps {
  marketData?: MarketData[];
  isLoading?: boolean;
}

export function MarketOverview({ marketData, isLoading }: MarketOverviewProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Market Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayData = marketData || [];

  return (
    <Card data-testid="card-market-overview">
      <CardHeader className="flex flex-row items-center justify-between gap-1">
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Market Overview
        </CardTitle>
        <Badge variant="secondary">Polygon Network</Badge>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Token</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">24h</TableHead>
              <TableHead className="text-right">7d</TableHead>
              <TableHead className="text-right">Market Cap</TableHead>
              <TableHead className="text-right">Volume 24h</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.map((token) => {
              const change24h = token.change24h ? parseFloat(token.change24h) : 0;
              const change7d = token.change7d ? parseFloat(token.change7d) : 0;
              const is24hPositive = change24h >= 0;
              const is7dPositive = change7d >= 0;
              
              return (
                <TableRow key={token.id} data-testid={`row-market-${token.symbol}`}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-primary/5 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">
                          {token.symbol.slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{token.symbol}</div>
                        <div className="text-xs text-muted-foreground">{token.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    ${parseFloat(token.priceUsd).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className={`flex items-center justify-end gap-1 ${is24hPositive ? "text-chart-2" : "text-chart-5"}`}>
                      {is24hPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span className="text-sm font-medium">
                        {is24hPositive ? "+" : ""}{change24h.toFixed(2)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`text-sm font-medium ${is7dPositive ? "text-chart-2" : "text-chart-5"}`}>
                      {is7dPositive ? "+" : ""}{change7d.toFixed(2)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-muted-foreground">
                    ${token.marketCap ? (parseFloat(token.marketCap) / 1e9).toFixed(2) + "B" : "N/A"}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-muted-foreground">
                    ${token.volume24h ? (parseFloat(token.volume24h) / 1e6).toFixed(2) + "M" : "N/A"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {displayData.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Loading market data...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
