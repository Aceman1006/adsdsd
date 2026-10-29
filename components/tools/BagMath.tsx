"use client";
import { useEffect, useState } from "react";
import { CAInput, TokenHead, Stat } from "./CAInput";
import { useTokenLookup } from "./useToken";
import { usd } from "@/lib/format";

export function BagMath({ initialCA = "" }: { initialCA?: string }) {
  const { token, loading, error, lookup } = useTokenLookup();
  const [entry, setEntry] = useState(20000);
  const [now, setNow] = useState(100000);
  const [inv, setInv] = useState(100);
  useEffect(() => { if (initialCA) lookup(initialCA); }, [initialCA, lookup]);
  useEffect(() => { if (token?.mcap) setNow(Math.round(token.mcap)); }, [token]);

  const x = entry > 0 ? now / entry : 0;
  const val = inv * x;
  const pnl = val - inv;

  return (
    <div className="space-y-5">
      <CAInput onSubmit={lookup} loading={loading} initial={initialCA} cta="Use live mcap" />
      {error && <p className="text-sm text-seal">{error}</p>}
      {token && <TokenHead t={token} />}
      <div className="grid gap-4 md:grid-cols-3">
        <div><span className="label">Entry market cap ($)</span><input type="number" className="input" value={entry} onChange={(e) => setEntry(+e.target.value || 0)} /></div>
        <div><span className="label">Current market cap ($)</span><input type="number" className="input" value={now} onChange={(e) => setNow(+e.target.value || 0)} /></div>
        <div><span className="label">Amount invested ($)</span><input type="number" className="input" value={inv} onChange={(e) => setInv(+e.target.value || 0)} /></div>
      </div>
      <div className="paper flex flex-wrap items-end justify-between gap-4 rounded-2xl border-2 border-black p-6 shadow-chunk">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-widest text-[#6b5a33]">Your bag</div>
          <div className="font-display text-5xl font-black">{x.toFixed(2)}x</div>
        </div>
        <div className="text-right">
          <div className="font-mono text-2xl font-black">{usd(val)}</div>
          <div className={`font-mono text-sm font-bold ${pnl >= 0 ? "text-emerald-700" : "text-red-700"}`}>{pnl >= 0 ? "+" : ""}{usd(pnl)}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[2, 5, 10, 100].map((m) => <Stat key={m} k={`${m}x from entry`} v={`${usd(entry * m)} mc`} />)}
      </div>
    </div>
  );
}
