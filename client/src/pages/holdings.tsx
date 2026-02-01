import { useQuery } from "@tanstack/react-query";
import { TokenHoldingsTable } from "@/components/dashboard/token-holdings-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wallet, Plus, ArrowUpRight, ArrowDownRight, RefreshCw, AlertCircle } from "lucide-react";
import type { TokenHolding, Portfolio } from "@shared/schema";
import { useWallet, POLYGON_CHAIN_ID } from "@/contexts/wallet-context";
import { useWalletBalances, type TokenBalance } from "@/hooks/use-wallet-balances";
import { Skeleton } from "@/components/ui/skeleton";

function WalletHoldingsTable({ balances, isLoading }: { balances: TokenBalance[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card data-testid="card-wallet-holdings">
        <CardHeader>
          <CardTitle>Live Token Balances</CardTitle>
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

  if (balances.length === 0) {
    return (
      <Card data-testid="card-wallet-holdings-empty">
        <CardContent className="py-12 text-center">
          <Wallet className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="font-semibold mb-2">No tokens found</h3>
          <p className="text-sm text-muted-foreground">
            This wallet doesn't have any of the tracked tokens on Polygon.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="card-wallet-holdings">
      <CardHeader className="flex flex-row items-center justify-between gap-1">
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-chart-2 animate-pulse" />
          Live Token Balances
        </CardTitle>
        <Badge variant="secondary">{balances.length} tokens</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {balances.map((token) => {
            const balance = parseFloat(token.balance);
            const value = parseFloat(token.valueUsd || "0");
            const price = parseFloat(token.priceUsd || "0");
            
            return (
              <div
                key={token.symbol}
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover-elevate"
                data-testid={`row-wallet-token-${token.symbol}`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">
                    {token.symbol.slice(0, 2)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="font-medium">{token.symbol}</div>
                  <div className="text-xs text-muted-foreground">{token.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm">
                    {balance.toLocaleString("en-US", { maximumFractionDigits: 6 })}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                  </div>
                </div>
                <div className="text-right min-w-[100px]">
                  <div className="font-semibold">
                    ${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function HoldingsPage() {
  const { address, isConnected, chainId, balance: maticBalance, connect, switchToPolygon } = useWallet();
  const { data: walletBalances = [], isLoading: walletLoading, refetch } = useWalletBalances();
  
  const { data: portfolio, isLoading: portfolioLoading } = useQuery<Portfolio>({
    queryKey: ["/api/portfolios", 1],
  });

  const { data: holdings, isLoading: holdingsLoading } = useQuery<TokenHolding[]>({
    queryKey: ["/api/portfolios", 1, "holdings"],
  });

  const isWrongNetwork = isConnected && chainId !== POLYGON_CHAIN_ID;
  
  const totalWalletValue = walletBalances.reduce(
    (sum, token) => sum + parseFloat(token.valueUsd || "0"),
    0
  );

  const totalValue = isConnected ? totalWalletValue : (portfolio?.totalValueUsd ? parseFloat(portfolio.totalValueUsd) : 0);
  const dailyChange = portfolio?.dailyChange ? parseFloat(portfolio.dailyChange) : 0;
  const isPositive = dailyChange >= 0;

  return (
    <div className="space-y-6" data-testid="page-holdings">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Token Holdings</h1>
          <p className="text-muted-foreground">
            {isConnected 
              ? "Live token balances from your connected wallet" 
              : "Connect your wallet to see real-time balances"}
          </p>
        </div>
        <div className="flex gap-2">
          {isConnected && (
            <Button variant="outline" onClick={() => refetch()} data-testid="button-refresh-balances">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          )}
          {!isConnected && (
            <Button onClick={connect} data-testid="button-connect-holdings">
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
          )}
        </div>
      </div>

      {isWrongNetwork && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
              <div className="flex-1">
                <h3 className="font-semibold">Wrong Network</h3>
                <p className="text-sm text-muted-foreground">
                  Please switch to Polygon network to view your balances.
                </p>
              </div>
              <Button onClick={switchToPolygon} data-testid="button-switch-network">
                Switch to Polygon
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card data-testid="card-total-value">
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {isConnected ? "Wallet Value" : "Portfolio Value"}
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            {isConnected ? (
              <div className="flex items-center gap-1 text-sm text-chart-2">
                <div className="w-2 h-2 rounded-full bg-chart-2 animate-pulse" />
                <span>Live from blockchain</span>
              </div>
            ) : (
              <div className={`flex items-center gap-1 text-sm ${isPositive ? "text-chart-2" : "text-chart-5"}`}>
                {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                <span>{isPositive ? "+" : ""}{dailyChange.toFixed(2)}% (24h)</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-token-count">
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Tokens
            </CardTitle>
            <Badge variant="secondary">
              {isConnected ? walletBalances.length : (holdings?.length || 0)}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {isConnected ? walletBalances.length : (holdings?.length || 0)}
            </div>
            <p className="text-sm text-muted-foreground">Different assets</p>
          </CardContent>
        </Card>

        <Card data-testid="card-wallet-address">
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Wallet
            </CardTitle>
            {isConnected ? (
              <Badge variant="secondary" className="bg-chart-2/10 text-chart-2">Connected</Badge>
            ) : (
              <Badge variant="secondary">Demo</Badge>
            )}
          </CardHeader>
          <CardContent>
            <div className="text-sm font-mono truncate">
              {isConnected 
                ? `${address?.slice(0, 6)}...${address?.slice(-4)}`
                : portfolio?.walletAddress || "0x742d...4a2E"}
            </div>
            <p className="text-sm text-muted-foreground">
              {isConnected ? `${maticBalance} MATIC` : "Polygon Network"}
            </p>
          </CardContent>
        </Card>
      </div>

      {isConnected && !isWrongNetwork ? (
        <WalletHoldingsTable balances={walletBalances} isLoading={walletLoading} />
      ) : (
        <TokenHoldingsTable holdings={holdings} isLoading={holdingsLoading} />
      )}
    </div>
  );
}
