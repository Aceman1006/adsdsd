"use client";
import { useEffect, useMemo, useState } from "react";
import { CAInput, TokenHead, Stat } from "./CAInput";
import { useTokenLookup } from "./useToken";
import { usd } from "@/lib/format";
import { SITE } from "@/site.config";

const PRESETS = [
  { label: "0.05%", v: 0.05 },
  { label: "0.30%", v: 0.3 },
  { label: "0.95%", v: 0.95 },
];

export function FeeMeter({ initialCA = "" }: { initialCA?: string }) {
  const { token, loading, error, lookup } = useTokenLookup();
  const [fee, setFee] = useState(SITE.defaultCreatorFeePct);
  const [vol, setVol] = useState<number>(250000);
  const [live, setLive] = useState(0);

  useEffect(() => { if (initialCA) lookup(initialCA); }, [initialCA, lookup]);
  useEffect(() => { if (token?.vol24) setVol(Math.round(token.vol24)); }, [token]);

  const perDay = (vol * fee) / 100;
  const perSec = perDay / 86400;

  // ticking "fees earned since you opened this page"
  useEffect(() => {
    setLive(0);
    const start = Date.now();
    const id = setInterval(() => setLive(((Date.now() - start) / 1000) * perSec), 100);
    return () => clearInterval(id);
  }, [perSec]);

  const rows = useMemo(() => [
    ["Per hour", perDay / 24], ["Per day", perDay], ["Per week", perDay * 7], ["Per month", perDay * 30],
  ] as const, [perDay]);

  return (
    <div className="space-y-5">
      <CAInput onSubmit={lookup} loading={loading} initial={initialCA} cta="Load volume" />
      {error && <p className="text-sm text-seal">{error}</p>}
      {token && <TokenHead t={token} />}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <span className="label">24h volume (USD)</span>
          <input type="number" className="input" value={vol} min={0} onChange={(e) => setVol(Math.max(0, +e.target.value || 0))} />
          <input type="range" min={0} max={10000000} step={10000} value={Math.min(vol, 10000000)} onChange={(e) => setVol(+e.target.value)} className="mt-3 w-full accent-[#f2b632]" />
        </div>
        <div>
          <span className="label">Creator fee rate (%)</span>
          <input type="number" step="0.01" className="input" value={fee} min={0} max={5} onChange={(e) => setFee(Math.max(0, +e.target.value || 0))} />
          <div className="mt-3 flex gap-2">
            {PRESETS.map((p) => (
              <button key={p.v} onClick={() => setFee(p.v)} className={`chip ${fee === p.v ? "!border-gold !text-gold" : ""}`}>{p.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="paper rounded-2xl border-2 border-black p-6 shadow-chunk">
        <div className="font-mono text-[11px] uppercase tracking-widest text-[#6b5a33]">Fees earned since you opened this page</div>
        <div className="mt-1 font-mono text-4xl font-black tabular-nums sm:text-5xl">${live.toFixed(live < 1 ? 4 : 2)}</div>
        <div className="mt-1 text-sm text-[#4a3d22]">at {usd(vol)} daily volume × {fee}%</div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {rows.map(([k, v]) => <Stat key={k} k={k} v={usd(v)} tone="good" />)}
      </div>
      <p className="text-xs text-mute">Estimates only. Creator-fee rates vary by platform, pool and market cap — set the rate that matches your coin.</p>
    </div>
  );
}
