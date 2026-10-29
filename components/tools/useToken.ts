"use client";
import { useCallback, useState } from "react";
import { getToken, TokenInfo } from "@/lib/token";
import { isCA } from "@/lib/format";

export function useTokenLookup() {
  const [token, setToken] = useState<TokenInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const lookup = useCallback(async (ca: string) => {
    ca = ca.trim();
    setError("");
    if (!isCA(ca)) { setError("That doesn't look like a Solana contract address."); setToken(null); return null; }
    setLoading(true);
    const t = await getToken(ca);
    setLoading(false);
    if (!t) setError("No market data yet for this CA. If it just launched, try again in a minute.");
    setToken(t);
    return t;
  }, []);
  return { token, loading, error, lookup, setToken };
}
