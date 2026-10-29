"use client";
import { useEffect } from "react";
import { CAInput, TokenHead, Stat } from "./CAInput";
import { useTokenLookup } from "./useToken";
import { usd, price, pct, age } from "@/lib/format";
import { TokenInfo } from "@/lib/token";
import { dexUrl, pumpUrl, solscanUrl } from "@/site.config";

type Check = { label: string; pass: boolean | null; note: string; w: number };

function checks(t: TokenInfo): Check[] {
  const liqRatio = t.liquidity && t.mcap ? t.liquidity / t.mcap : null;
  const bs = t.buys24 !== undefined && t.sells24 ? t.buys24 / t.sells24 : null;
  const ageH = t.createdAt ? (Date.now() - t.createdAt) / 3.6e6 : null;
  const hasX = t.socials.some((s) => /twitter|x/i.test(s.type));
  const hasTG = t.socials.some((s) => /telegram/i.test(s.type));
  return [
    { label: "Liquidity depth", pass: liqRatio === null ? null : liqRatio >= 0.08, note: liqRatio === null ? "No pool liquidity yet (bonding curve)" : `${(liqRatio * 100).toFixed(1)}% of mcap`, w: 20 },
    { label: "Buy pressure", pass: bs === null ? null : bs >= 1, note: bs === null ? "Not enough trades" : `${t.buys24} buys / ${t.sells24} sells (24h)`, w: 20 },
    { label: "Volume vs mcap", pass: t.vol24 && t.mcap ? t.vol24 / t.mcap >= 0.3 : null, note: t.vol24 && t.mcap ? `${((t.vol24 / t.mcap) * 100).toFixed(0)}% turnover` : "—", w: 15 },
    { label: "1h momentum", pass: t.change1h === undefined ? null : t.change1h > 0, note: pct(t.change1h), w: 15 },
    { label: "Survived 24h+", pass: ageH === null ? null : ageH >= 24, note: ageH === null ? "—" : `${age(t.createdAt)} old`, w: 10 },
    { label: "Has X / Twitter", pass: hasX, note: hasX ? "Linked" : "None listed", w: 10 },
    { label: "Has Telegram or site", pass: hasTG || t.websites.length > 0, note: hasTG || t.websites.length ? "Linked" : "None listed", w: 10 },
  ];
}

export function TrenchScan({ initialCA = "" }: { initialCA?: string }) {
  const { token, loading, error, lookup } = useTokenLookup();
  useEffect(() => { if (initialCA) lookup(initialCA); }, [initialCA, lookup]);

  const cs = token ? checks(token) : [];
  const scored = cs.filter((c) => c.pass !== null);
  const total = scored.reduce((s, c) => s + c.w, 0);
  const score = total ? Math.round((scored.reduce((s, c) => s + (c.pass ? c.w : 0), 0) / total) * 100) : 0;
  const grade = score >= 80 ? ["STRONG", "text-mint"] : score >= 55 ? ["MID", "text-gold"] : ["SKETCHY", "text-seal"];

  return (
    <div className="space-y-5">
      <CAInput onSubmit={lookup} loading={loading} initial={initialCA} cta="Scan" />
      {error && <p className="text-sm text-seal">{error}</p>}
      {token && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <TokenHead t={token} />
            <div className="text-right">
              <div className="label !mb-0">Trench score</div>
              <div className={`font-mono text-4xl font-black ${grade[1]}`}>{score}<span className="text-lg text-mute">/100</span></div>
              <div className={`font-mono text-xs font-bold ${grade[1]}`}>{grade[0]}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat k="Price" v={price(token.priceUsd)} />
            <Stat k="Market cap" v={usd(token.mcap)} />
            <Stat k="Liquidity" v={usd(token.liquidity)} />
            <Stat k="24h volume" v={usd(token.vol24)} />
          </div>
          <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
            {cs.map((c) => (
              <li key={c.label} className="flex items-center justify-between gap-3 bg-ink px-4 py-3">
                <span className="flex items-center gap-3">
                  <span className={`grid h-6 w-6 place-items-center rounded-full text-xs font-black ${c.pass === null ? "bg-ink3 text-mute" : c.pass ? "bg-mint text-ink" : "bg-seal text-white"}`}>
                    {c.pass === null ? "?" : c.pass ? "✓" : "✕"}
                  </span>
                  <span className="font-semibold">{c.label}</span>
                </span>
                <span className="text-right font-mono text-xs text-mute">{c.note}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            <a className="btn-ghost text-sm" href={pumpUrl(token.ca)} target="_blank" rel="noreferrer">pump.fun</a>
            <a className="btn-ghost text-sm" href={dexUrl(token.ca)} target="_blank" rel="noreferrer">DexScreener</a>
            <a className="btn-ghost text-sm" href={solscanUrl(token.ca)} target="_blank" rel="noreferrer">Solscan</a>
          </div>
          <p className="text-xs text-mute">A fast vibe check from public market data — not a security audit. Always DYOR.</p>
        </>
      )}
    </div>
  );
}
