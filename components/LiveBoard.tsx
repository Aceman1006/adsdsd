"use client";
import { useEffect, useState } from "react";
import { SITE, defaultFee } from "@/lib/site-helpers";
import { getToken, TokenInfo } from "@/lib/token";
import { usd, price, pct } from "@/lib/format";

/** Live $TICKER stats. Shows a pre-launch state until a CA is set. */
export function LiveBoard() {
  const ca = SITE.ca;
  const [t, setT] = useState<TokenInfo | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!ca) return;
    let on = true;
    const run = async () => {
      const v = await getToken(ca);
      if (on) { setT(v); setLoaded(true); }
    };
    run();
    const id = setInterval(run, 15000);
    return () => { on = false; clearInterval(id); };
  }, [ca]);

  const fees = t?.vol24 ? (t.vol24 * defaultFee) / 100 : undefined;
  const cells: [string, string, string?][] = [
    ["Price", price(t?.priceUsd), t?.change24h !== undefined ? pct(t?.change24h) : undefined],
    ["Market cap", usd(t?.mcap)],
    ["24h volume", usd(t?.vol24)],
    ["Fees earned / 24h (est.)", usd(fees)],
  ];

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-mute">
          <span className={`h-2 w-2 rounded-full ${ca ? "bg-mint animate-pulse" : "bg-gold"}`} />
          {ca ? `$${SITE.ticker} live` : `$${SITE.ticker} · pre-launch`}
        </div>
        {t?.dex && <span className="chip">{t.dex}</span>}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4">
        {cells.map(([k, v, sub], i) => (
          <div key={k} className={`px-5 py-5 ${i % 2 ? "" : "border-r"} border-line md:border-r ${i < 2 ? "border-b md:border-b-0" : ""} ${i === 3 ? "md:border-r-0" : ""}`}>
            <div className="label">{k}</div>
            <div className="font-mono text-xl font-bold text-paper sm:text-2xl">
              {ca ? (loaded ? v : <span className="inline-block h-6 w-20 animate-pulse rounded bg-ink3" />) : "—"}
            </div>
            {sub && <div className={`mt-1 font-mono text-xs ${(t?.change24h || 0) >= 0 ? "text-mint" : "text-seal"}`}>{sub} 24h</div>}
          </div>
        ))}
      </div>
      {ca && loaded && !t && (
        <div className="border-t border-line px-5 py-3 text-sm text-mute">Waiting for first trades to index… refreshes every 15s.</div>
      )}
    </div>
  );
}
