import { ChatInterface } from "@/components/ai-agent/chat-interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles, TrendingUp, Shield, Zap } from "lucide-react";

export default function AgentPage() {
  const capabilities = [
    {
      icon: TrendingUp,
      title: "Market Analysis",
      description: "Real-time analysis of DeFi protocols and token trends on Polygon",
    },
    {
      icon: Shield,
      title: "Risk Assessment",
      description: "Evaluate portfolio risk and suggest diversification strategies",
    },
    {
      icon: Zap,
      title: "Yield Optimization",
      description: "Find the best yield farming and staking opportunities",
    },
    {
      icon: Sparkles,
      title: "Strategy Recommendations",
      description: "AI-powered trading and DeFi strategy suggestions",
    },
  ];

  return (
    <div className="h-full flex flex-col" data-testid="page-agent">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI Agent</h1>
            <p className="text-muted-foreground">
              Your autonomous DeFi assistant powered by advanced AI
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-2 flex flex-col min-h-[600px]">
          <ChatInterface portfolioId={1} />
        </div>
        
        <div className="space-y-4">
          <Card data-testid="card-agent-capabilities">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Agent Capabilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {capabilities.map((capability) => (
                <div key={capability.title} className="flex gap-3 p-2 rounded-md hover-elevate cursor-pointer">
                  <div className="p-2 rounded-md bg-primary/10 shrink-0 h-fit">
                    <capability.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{capability.title}</h4>
                    <p className="text-xs text-muted-foreground">{capability.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card data-testid="card-agent-status">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Agent Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Model</span>
                <Badge variant="secondary">GPT-5.2</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Network</span>
                <Badge variant="secondary">Polygon Mainnet</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="secondary" className="bg-chart-2/10 text-chart-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-chart-2 mr-1.5 animate-pulse" />
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Reasoning</span>
                <Badge variant="secondary">O4-mini</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
