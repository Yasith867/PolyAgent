import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useWallet, POLYGON_CHAIN_ID } from "@/contexts/wallet-context";
import { Wallet, LogOut, RefreshCw, AlertTriangle, Copy, ExternalLink, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ConnectWalletButton() {
  const { 
    address, 
    balance, 
    chainId, 
    isConnecting, 
    isConnected, 
    error,
    connect, 
    disconnect,
    switchToPolygon 
  } = useWallet();
  const { toast } = useToast();

  const isWrongNetwork = isConnected && chainId !== POLYGON_CHAIN_ID;

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const openExplorer = () => {
    if (address) {
      window.open(`https://polygonscan.com/address/${address}`, "_blank");
    }
  };

  if (error) {
    return (
      <Button 
        variant="destructive" 
        size="sm"
        onClick={connect}
        data-testid="button-wallet-error"
      >
        <AlertTriangle className="w-4 h-4 mr-2" />
        Retry Connection
      </Button>
    );
  }

  if (isConnecting) {
    return (
      <Button variant="outline" size="sm" disabled data-testid="button-wallet-connecting">
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Connecting...
      </Button>
    );
  }

  if (!isConnected) {
    return (
      <Button 
        onClick={connect} 
        size="sm"
        data-testid="button-connect-wallet"
      >
        <Wallet className="w-4 h-4 mr-2" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          data-testid="button-wallet-connected"
        >
          {isWrongNetwork ? (
            <>
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span className="text-destructive">Wrong Network</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-chart-2 animate-pulse" />
              <span className="font-mono">{address && shortenAddress(address)}</span>
              <Badge variant="secondary" className="ml-1 text-xs">
                {balance} MATIC
              </Badge>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">Connected Wallet</p>
            <p className="text-xs text-muted-foreground font-mono">
              {address && shortenAddress(address)}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {isWrongNetwork && (
          <>
            <DropdownMenuItem onClick={switchToPolygon} data-testid="menu-switch-network">
              <RefreshCw className="w-4 h-4 mr-2" />
              Switch to Polygon
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        
        <DropdownMenuItem onClick={copyAddress} data-testid="menu-copy-address">
          <Copy className="w-4 h-4 mr-2" />
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem onClick={openExplorer} data-testid="menu-view-explorer">
          <ExternalLink className="w-4 h-4 mr-2" />
          View on Polygonscan
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={disconnect} 
          className="text-destructive focus:text-destructive"
          data-testid="menu-disconnect"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
