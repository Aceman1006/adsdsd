"use client";
import { useEffect, useState } from "react";
import { CAInput, TokenHead } from "./CAInput";
import { useTokenLookup } from "./useToken";
import { usd, price } from "@/lib/format";

const LADDER = [100e3, 1e6, 10e6, 50e6, 100e6, 1e9];

export function MoonMath({ initialCA = "" }: { initialCA?: string }) {
  const { token, loading, error, lookup } = useTokenLookup();
  const [supply, setSupply] = useState(1_000_000_000);
  const [hold, setHold] = useState(5_000_000);
  useEffect(() => { if (initialCA) lookup(initialCA); }, [initialCA, lookup]);
  useEffect(() => {
    if (token?.mcap && token.priceUsd) setSupply(Math.round(token.mcap / token.priceUsd));
  }, [token]);
  const curMc = token?.mcap;

  return (
    <div className="space-y-5">
      <CAInput onSubmit={lookup} loading={loading} initial={initialCA} cta="Load coin" />
      {error && <p className="text-sm text-seal">{error}</p>}
      {token && <TokenHead t={token} />}
      <div className="grid gap-4 md:grid-cols-2">
        <div><span className="label">Total supply</span><input type="number" className="input" value={supply} onChange={(e) => setSupply(+e.target.value || 0)} /><p className="mt-1 text-xs text-mute">pump.fun coins = 1,000,000,000</p></div>
        <div><span className="label">Tokens you hold</span><input type="number" className="input" value={hold} onChange={(e) => setHold(+e.target.value || 0)} /><p className="mt-1 text-xs text-mute">{supply ? ((hold / supply) * 100).toFixed(3) : 0}% of supply</p></div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink3 font-mono text-[11px] uppercase tracking-widest text-mute">
            <tr><th className="px-4 py-3">Market cap</th><th className="px-4 py-3">Price</th><th className="px-4 py-3 text-right">Your bag</th>{curMc ? <th className="hidden px-4 py-3 text-right sm:table-cell">From now</th> : null}</tr>
          </thead>
          <tbody className="divide-y divide-line font-mono">
            {LADDER.map((mc) => (
              <tr key={mc} className="bg-ink">
                <td className="px-4 py-3 font-bold">{usd(mc)}</td>
                <td className="px-4 py-3 text-mute">{price(supply ? mc / supply : 0)}</td>
                <td className="px-4 py-3 text-right font-bold text-mint">{usd(supply ? (hold / supply) * mc : 0)}</td>
                {curMc ? <td className="hidden px-4 py-3 text-right text-gold sm:table-cell">{(mc / curMc).toFixed(1)}x</td> : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
