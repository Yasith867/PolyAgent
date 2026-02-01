import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { BrowserProvider, formatEther, type Eip1193Provider } from "ethers";

declare global {
  interface Window {
    ethereum?: Eip1193Provider & {
      isMetaMask?: boolean;
      on?: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}

interface WalletState {
  address: string | null;
  balance: string | null;
  chainId: number | null;
  isConnecting: boolean;
  isConnected: boolean;
  error: string | null;
}

interface WalletContextType extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToPolygon: () => Promise<void>;
}

const POLYGON_CHAIN_ID = 137;
const POLYGON_CHAIN_CONFIG = {
  chainId: "0x89",
  chainName: "Polygon Mainnet",
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18,
  },
  rpcUrls: ["https://polygon-rpc.com/"],
  blockExplorerUrls: ["https://polygonscan.com/"],
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>({
    address: null,
    balance: null,
    chainId: null,
    isConnecting: false,
    isConnected: false,
    error: null,
  });

  // Rehydrate wallet state on mount
  useEffect(() => {
    const rehydrateWallet = async () => {
      if (!window.ethereum) return;
      
      try {
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_accounts", []);
        
        if (accounts.length > 0) {
          const address = accounts[0];
          const network = await provider.getNetwork();
          const balance = await provider.getBalance(address);
          
          setState({
            address,
            balance: parseFloat(formatEther(balance)).toFixed(4),
            chainId: Number(network.chainId),
            isConnecting: false,
            isConnected: true,
            error: null,
          });
        }
      } catch (error) {
        console.error("Error rehydrating wallet:", error);
      }
    };

    rehydrateWallet();
  }, []);

  const updateBalance = useCallback(async (address: string) => {
    if (!window.ethereum) return;
    try {
      const provider = new BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(address);
      setState((prev) => ({
        ...prev,
        balance: parseFloat(formatEther(balance)).toFixed(4),
      }));
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  }, []);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setState((prev) => ({
        ...prev,
        error: "Please install MetaMask to connect your wallet",
      }));
      return;
    }

    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);
      
      if (accounts.length > 0) {
        const address = accounts[0];
        const balance = await provider.getBalance(address);
        
        setState({
          address,
          balance: parseFloat(formatEther(balance)).toFixed(4),
          chainId,
          isConnecting: false,
          isConnected: true,
          error: null,
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to connect wallet";
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: errorMessage,
      }));
    }
  }, []);

  const disconnect = useCallback(() => {
    setState({
      address: null,
      balance: null,
      chainId: null,
      isConnecting: false,
      isConnected: false,
      error: null,
    });
  }, []);

  const switchToPolygon = useCallback(async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request?.({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: POLYGON_CHAIN_CONFIG.chainId }],
      });
    } catch (error: unknown) {
      const switchError = error as { code?: number };
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request?.({
            method: "wallet_addEthereumChain",
            params: [POLYGON_CHAIN_CONFIG],
          });
        } catch (addError) {
          console.error("Error adding Polygon network:", addError);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!window.ethereum?.on) return;

    const handleAccountsChanged = (accounts: unknown) => {
      const accountsArray = accounts as string[];
      if (accountsArray.length === 0) {
        disconnect();
      } else if (accountsArray[0] !== state.address) {
        setState((prev) => ({
          ...prev,
          address: accountsArray[0],
        }));
        updateBalance(accountsArray[0]);
      }
    };

    const handleChainChanged = (chainId: unknown) => {
      setState((prev) => ({
        ...prev,
        chainId: parseInt(chainId as string, 16),
      }));
      if (state.address) {
        updateBalance(state.address);
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener?.("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener?.("chainChanged", handleChainChanged);
    };
  }, [state.address, disconnect, updateBalance]);

  return (
    <WalletContext.Provider
      value={{
        ...state,
        connect,
        disconnect,
        switchToPolygon,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}

export { POLYGON_CHAIN_ID };
