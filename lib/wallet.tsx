"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Provider = any;
type Ctx = {
  address: string | null;
  connecting: boolean;
  connect: () => Promise<string | null>;
  disconnect: () => void;
  provider: () => Provider | null;
};

const WalletCtx = createContext<Ctx>({} as Ctx);

function getProvider(): Provider | null {
  if (typeof window === "undefined") return null;
  const w = window as any;
  if (w.phantom?.solana?.isPhantom) return w.phantom.solana;
  if (w.solflare?.isSolflare) return w.solflare;
  if (w.backpack?.solana) return w.backpack.solana;
  if (w.solana) return w.solana;
  return null;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const p = getProvider();
    if (!p) return;
    // silent reconnect if previously trusted
    p.connect?.({ onlyIfTrusted: true })
      .then((r: any) => setAddress((r?.publicKey || p.publicKey)?.toString() || null))
      .catch(() => {});
    const onAcc = (pk: any) => setAddress(pk ? pk.toString() : null);
    p.on?.("accountChanged", onAcc);
    p.on?.("disconnect", () => setAddress(null));
    return () => p.removeListener?.("accountChanged", onAcc);
  }, []);

  const connect = useCallback(async () => {
    const p = getProvider();
    if (!p) {
      const isMobile = /iphone|ipad|android/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = `https://phantom.app/ul/browse/${encodeURIComponent(location.href)}?ref=${encodeURIComponent(location.origin)}`;
      } else {
        window.open("https://phantom.app/download", "_blank");
      }
      return null;
    }
    setConnecting(true);
    try {
      const r = await p.connect();
      const a = (r?.publicKey || p.publicKey)?.toString() || null;
      setAddress(a);
      return a;
    } catch {
      return null;
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    getProvider()?.disconnect?.();
    setAddress(null);
  }, []);

  return (
    <WalletCtx.Provider value={{ address, connecting, connect, disconnect, provider: getProvider }}>
      {children}
    </WalletCtx.Provider>
  );
}

export const useWallet = () => useContext(WalletCtx);
