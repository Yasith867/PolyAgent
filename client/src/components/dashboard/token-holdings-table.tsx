import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { TokenHolding } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TokenHoldingsTableProps {
  holdings?: TokenHolding[];
  isLoading?: boolean;
  isLive?: boolean;
}

export function TokenHoldingsTable({ holdings, isLoading, isLive }: TokenHoldingsTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Token Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayHoldings = holdings || [];

  return (
    <Card data-testid="card-token-holdings">
      <CardHeader className="flex flex-row items-center justify-between gap-1">
        <CardTitle className="flex items-center gap-2">
          Token Holdings
          {isLive && (
            <Badge variant="secondary" className="bg-chart-2/10 text-chart-2 text-xs">
              <div className="w-1 h-1 rounded-full bg-chart-2 mr-1 animate-pulse" />
              Live
            </Badge>
          )}
        </CardTitle>
        <Badge variant="secondary">{displayHoldings.length} tokens</Badge>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Token</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Value</TableHead>
              {!isLive && <TableHead className="text-right">24h</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayHoldings.map((holding) => {
              const change = holding.change24h ? parseFloat(holding.change24h) : 0;
              const isPositive = change >= 0;
              
              return (
                <TableRow key={holding.id} data-testid={`row-token-${holding.symbol}`}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary">
                          {holding.symbol.slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{holding.symbol}</div>
                        <div className="text-xs text-muted-foreground">{holding.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {parseFloat(holding.amount).toLocaleString("en-US", { maximumFractionDigits: 6 })}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    ${holding.priceUsd ? parseFloat(holding.priceUsd).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 6 }) : "0.00"}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm font-medium">
                    ${holding.valueUsd ? parseFloat(holding.valueUsd).toLocaleString("en-US", { minimumFractionDigits: 2 }) : "0.00"}
                  </TableCell>
                  {!isLive && (
                    <TableCell className="text-right">
                      <div className={`flex items-center justify-end gap-1 ${isPositive ? "text-chart-2" : "text-chart-5"}`}>
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span className="text-sm font-medium">
                          {isPositive ? "+" : ""}{change.toFixed(2)}%
                        </span>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {displayHoldings.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {isLive 
              ? "No tokens found in your wallet. Connect to Polygon network to see your holdings."
              : "No token holdings yet. Add tokens to your portfolio to get started."}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
