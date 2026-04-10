"use client";

import { useState } from "react";
import { useConnect, useAccount } from "wagmi";
import { IoClose, IoWallet, IoFlash, IoShieldCheckmark, IoReload } from "react-icons/io5";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Direct EIP-1193 Provider Resolver
function getProvider(walletId: string): any | null {
  if (typeof window === 'undefined') return null;
  const w = window as any;
  const providers: any[] = w.ethereum?.providers || [];

  if (walletId === 'kortana') {
    // Priority 1: Dedicated window.kortana injection point
    if (w.kortana) return w.kortana;

    // Priority 2: EIP-5164 providers[] array — Kortana flagged entries
    const k = providers.find((p: any) => p.isKortana || p.isKortanaWallet || p.kortana);
    if (k) return k;

    // Priority 3: window.ethereum itself is the Kortana wallet
    if (w.ethereum?.isKortana || w.ethereum?.isKortanaWallet) return w.ethereum;

    return null;
  }

  if (walletId === 'metamask') {
    // EIP-5164: Find MetaMask specifically
    if (providers.length) {
      const mm = providers.find((p: any) => p.isMetaMask && !p.isKortana && !p.isKortanaWallet);
      if (mm) return mm;
    }
    // Fallback: if only MetaMask is installed
    if (w.ethereum?.isMetaMask && !w.ethereum?.isKortana) return w.ethereum;
    return null;
  }

  // Generic injected
  return w.ethereum || null;
}

const WALLET_OPTIONS = [
  {
    id: "kortana",
    name: "Kortana Wallet",
    subtitle: "Native Kortana Network Wallet",
    icon: "kortana",
  },
  {
    id: "metamask",
    name: "MetaMask",
    subtitle: "Universal EVM Wallet",
    icon: "metamask",
  },
  {
    id: "injected",
    name: "Other Wallet",
    subtitle: "Any browser wallet",
    icon: "shield",
  },
];

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const [connecting, setConnecting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { connectors, connect } = useConnect();
  const { isConnected } = useAccount();

  const handleConnect = async (walletOption: typeof WALLET_OPTIONS[0]) => {
    setConnecting(walletOption.id);
    setError(null);

    try {
      // Get the raw EIP-1193 wallet provider
      const provider = getProvider(walletOption.id);

      if (!provider) {
        setError(`${walletOption.name} not detected. Please install the extension.`);
        setConnecting(null);
        return;
      }

      // Find the appropriate connector
      let connector;
      if (walletOption.id === 'kortana') {
        connector = connectors.find(c => c.id === 'kortana' || c.name === 'Kortana Wallet');
      } else if (walletOption.id === 'metamask') {
        connector = connectors.find(c => c.id === 'metaMask' || c.name === 'MetaMask');
      } else {
        connector = connectors.find(c => c.id === 'injected');
      }

      if (!connector) {
        setError("Connector not found");
        setConnecting(null);
        return;
      }

      // Connect using wagmi
      await connect({ connector });
      
      onClose();
    } catch (e: any) {
      console.error("Connection failed:", e);
      const msg: string = e?.message || '';
      if (e?.code === 4001 || msg.includes("User rejected") || msg.includes("user rejected")) {
        setError("Connection rejected by user");
      } else {
        setError(msg || "Connection failed");
      }
    } finally {
      setConnecting(null);
    }
  };

  const WalletIcon = ({ type }: { type: string }) => {
    if (type === "metamask") return <IoFlash className="w-8 h-8" />;
    if (type === "kortana") return <IoWallet className="w-8 h-8" />;
    return <IoShieldCheckmark className="w-8 h-8" />;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-60">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Connect Wallet
            </h2>
            <p className="text-sm text-gray-600">
              Choose your preferred wallet to continue
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <IoClose className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Wallet Options */}
        <div className="space-y-3">
          {WALLET_OPTIONS.map((wallet) => {
            const isConnecting = connecting === wallet.id;
            const isOtherConnecting = connecting !== null && !isConnecting;

            return (
              <button
                key={wallet.id}
                onClick={() => handleConnect(wallet)}
                disabled={connecting !== null}
                className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                  wallet.id === "kortana"
                    ? "border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300"
                    : "border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300"
                } ${isOtherConnecting ? "opacity-30 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      wallet.id === "kortana"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {isConnecting ? (
                      <IoReload className="w-6 h-6 animate-spin" />
                    ) : (
                      <WalletIcon type={wallet.icon} />
                    )}
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-gray-900 flex items-center gap-2">
                      {wallet.name}
                      {wallet.id === "kortana" && (
                        <span className="text-xs text-blue-600 font-semibold px-2 py-0.5 bg-blue-100 rounded-full">
                          NATIVE
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {isConnecting ? "Connecting..." : wallet.subtitle}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By connecting, you agree to HealthFriend's terms of service
          </p>
        </div>
      </div>
    </div>
  );
}
