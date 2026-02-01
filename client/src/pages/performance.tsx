import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Calendar, BarChart3 } from "lucide-react";
import type { Portfolio } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const performanceData = [
  { date: "Week 1", value: 10000, pnl: 0 },
  { date: "Week 2", value: 10500, pnl: 500 },
  { date: "Week 3", value: 10200, pnl: -300 },
  { date: "Week 4", value: 11000, pnl: 800 },
  { date: "Week 5", value: 11800, pnl: 800 },
  { date: "Week 6", value: 11500, pnl: -300 },
  { date: "Week 7", value: 12200, pnl: 700 },
  { date: "Week 8", value: 13100, pnl: 900 },
  { date: "Week 9", value: 12800, pnl: -300 },
  { date: "Week 10", value: 14000, pnl: 1200 },
  { date: "Week 11", value: 14500, pnl: 500 },
  { date: "Week 12", value: 15247, pnl: 747 },
];

const monthlyReturns = [
  { month: "Jan", return: 5.2 },
  { month: "Feb", return: 8.4 },
  { month: "Mar", return: -2.1 },
  { month: "Apr", return: 12.3 },
  { month: "May", return: 6.7 },
  { month: "Jun", return: -4.2 },
  { month: "Jul", return: 9.8 },
  { month: "Aug", return: 15.4 },
  { month: "Sep", return: -1.5 },
  { month: "Oct", return: 7.2 },
  { month: "Nov", return: 11.8 },
  { month: "Dec", return: 4.6 },
];

export default function PerformancePage() {
  const { data: portfolio, isLoading } = useQuery<Portfolio>({
    queryKey: ["/api/portfolios", 1],
  });

  const totalValue = portfolio?.totalValueUsd ? parseFloat(portfolio.totalValueUsd) : 15247.83;
  const initialValue = 10000;
  const totalReturn = ((totalValue - initialValue) / initialValue) * 100;
  const totalPnL = totalValue - initialValue;

  return (
    <div className="space-y-6" data-testid="page-performance">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Performance</h1>
        <p className="text-muted-foreground">
          Track your portfolio performance and returns over time
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card data-testid="card-total-return">
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Return
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-chart-2">
              +{totalReturn.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card data-testid="card-total-pnl">
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total P&L
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-chart-2">
              +${totalPnL.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">Since inception</p>
          </CardContent>
        </Card>

        <Card data-testid="card-best-day">
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Best Day
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-chart-2">+12.4%</div>
            <p className="text-xs text-muted-foreground">Jan 28, 2026</p>
          </CardContent>
        </Card>

        <Card data-testid="card-worst-day">
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Worst Day
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-chart-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-chart-5">-5.2%</div>
            <p className="text-xs text-muted-foreground">Feb 12, 2026</p>
          </CardContent>
        </Card>
      </div>

      <Card data-testid="card-performance-chart">
        <CardHeader className="flex flex-row items-center justify-between gap-1">
          <CardTitle>Portfolio Value Over Time</CardTitle>
          <Tabs defaultValue="3m">
            <TabsList>
              <TabsTrigger value="1m">1M</TabsTrigger>
              <TabsTrigger value="3m">3M</TabsTrigger>
              <TabsTrigger value="6m">6M</TabsTrigger>
              <TabsTrigger value="1y">1Y</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[350px] w-full" />
          ) : (
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={performanceData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(268 75% 55%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(268 75% 55%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    tickLine={false}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      fontSize: 12,
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, "Value"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(268 75% 55%)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorPerf)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card data-testid="card-monthly-returns">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Monthly Returns
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[250px] w-full" />
          ) : (
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyReturns} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    tickLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      fontSize: 12,
                    }}
                    formatter={(value: number) => [`${value.toFixed(1)}%`, "Return"]}
                  />
                  <Bar
                    dataKey="return"
                    fill="hsl(268 75% 55%)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
