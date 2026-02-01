import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, Lightbulb, Info, Sparkles } from "lucide-react";
import type { AiInsight } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

interface AiInsightsPanelProps {
  insights?: AiInsight[];
  isLoading?: boolean;
}

const severityConfig = {
  info: { icon: Info, color: "text-chart-3", bg: "bg-chart-3/10" },
  warning: { icon: AlertTriangle, color: "text-chart-4", bg: "bg-chart-4/10" },
  critical: { icon: AlertTriangle, color: "text-chart-5", bg: "bg-chart-5/10" },
  opportunity: { icon: TrendingUp, color: "text-chart-2", bg: "bg-chart-2/10" },
};

const typeLabels: Record<string, string> = {
  market_analysis: "Market",
  strategy: "Strategy",
  risk_alert: "Risk",
  opportunity: "Opportunity",
};

export function AiInsightsPanel({ insights, isLoading }: AiInsightsPanelProps) {
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between gap-1">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-3 rounded-md border space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayInsights = insights || [];

  return (
    <Card className="h-full" data-testid="card-ai-insights">
      <CardHeader className="flex flex-row items-center justify-between gap-1 pb-3">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          AI Insights
        </CardTitle>
        <Badge variant="secondary">{displayInsights.length} new</Badge>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] px-6">
          <div className="space-y-3 pb-6">
            {displayInsights.map((insight) => {
              const config = severityConfig[insight.severity as keyof typeof severityConfig] || severityConfig.info;
              const Icon = config.icon;
              
              return (
                <div
                  key={insight.id}
                  className={`p-3 rounded-md border ${config.bg} border-transparent hover-elevate cursor-pointer transition-colors`}
                  data-testid={`insight-${insight.id}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-1.5 rounded ${config.bg}`}>
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm truncate">{insight.title}</span>
                        <Badge variant="outline" className="text-xs shrink-0">
                          {typeLabels[insight.type] || insight.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {insight.content}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {insight.createdAt && formatDistanceToNow(new Date(insight.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            {displayInsights.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No insights yet. The AI agent is analyzing your portfolio.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
