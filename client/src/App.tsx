import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { WalletProvider } from "@/contexts/wallet-context";
import { ConnectWalletButton } from "@/components/wallet/connect-wallet-button";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import AgentPage from "@/pages/agent";
import MarketPage from "@/pages/market";
import StrategiesPage from "@/pages/strategies";
import HoldingsPage from "@/pages/holdings";
import PerformancePage from "@/pages/performance";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/agent" component={AgentPage} />
      <Route path="/market" component={MarketPage} />
      <Route path="/strategies" component={StrategiesPage} />
      <Route path="/holdings" component={HoldingsPage} />
      <Route path="/performance" component={PerformancePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3.5rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <WalletProvider>
          <TooltipProvider>
            <SidebarProvider style={style as React.CSSProperties}>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1 overflow-hidden">
                  <header className="flex items-center justify-between gap-2 px-4 py-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex items-center gap-2">
                      <SidebarTrigger data-testid="button-sidebar-toggle" />
                    </div>
                    <div className="flex items-center gap-2">
                      <ConnectWalletButton />
                      <ThemeToggle />
                    </div>
                  </header>
                  <main className="flex-1 overflow-auto p-6">
                    <Router />
                  </main>
                </div>
              </div>
            </SidebarProvider>
            <Toaster />
          </TooltipProvider>
        </WalletProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
