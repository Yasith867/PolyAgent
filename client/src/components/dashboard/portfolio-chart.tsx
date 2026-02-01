import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface PortfolioChartProps {
  isLoading?: boolean;
}

const performanceData = [
  { date: "Jan 1", value: 10000 },
  { date: "Jan 7", value: 10500 },
  { date: "Jan 14", value: 10200 },
  { date: "Jan 21", value: 11000 },
  { date: "Jan 28", value: 11800 },
  { date: "Feb 4", value: 11500 },
  { date: "Feb 11", value: 12200 },
  { date: "Feb 18", value: 13100 },
  { date: "Feb 25", value: 12800 },
  { date: "Mar 4", value: 14000 },
  { date: "Mar 11", value: 14500 },
  { date: "Mar 18", value: 15247 },
];

const allocationData = [
  { name: "MATIC", value: 35, color: "hsl(268 75% 55%)" },
  { name: "WETH", value: 25, color: "hsl(200 80% 50%)" },
  { name: "USDC", value: 20, color: "hsl(142 70% 45%)" },
  { name: "AAVE", value: 12, color: "hsl(38 95% 55%)" },
  { name: "Others", value: 8, color: "hsl(250 15% 60%)" },
];

export function PortfolioChart({ isLoading }: PortfolioChartProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-2" data-testid="card-performance-chart">
        <CardHeader className="flex flex-row items-center justify-between gap-1">
          <CardTitle>Portfolio Performance</CardTitle>
          <div className="flex gap-1">
            <Badge variant="secondary" className="cursor-pointer">1W</Badge>
            <Badge variant="outline" className="cursor-pointer">1M</Badge>
            <Badge variant="outline" className="cursor-pointer">3M</Badge>
            <Badge variant="outline" className="cursor-pointer">1Y</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={performanceData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
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
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card data-testid="card-allocation-chart">
        <CardHeader>
          <CardTitle>Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    fontSize: 12,
                  }}
                  formatter={(value: number) => [`${value}%`, ""]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {allocationData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-muted-foreground">{item.name}</span>
                <span className="text-xs font-medium ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
