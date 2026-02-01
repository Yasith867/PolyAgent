import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@/contexts/wallet-context";

export interface TokenBalance {
  symbol: string;
  name: string;
  address: string;
  balance: string;
  decimals: number;
  priceUsd?: string;
  valueUsd?: string;
}

export function useWalletBalances() {
  const { address, isConnected } = useWallet();

  return useQuery<TokenBalance[]>({
    queryKey: ["/api/wallet", address, "balances"],
    queryFn: async () => {
      if (!address) return [];
      const response = await fetch(`/api/wallet/${address}/balances`);
      if (!response.ok) throw new Error("Failed to fetch balances");
      return response.json();
    },
    enabled: isConnected && !!address,
    staleTime: 30000,
    refetchInterval: 60000,
  });
}
