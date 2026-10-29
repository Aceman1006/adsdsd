"use client";
import { useState } from "react";
import { getToken, TokenInfo } from "@/lib/token";
import { usd, pct, isCA, age } from "@/lib/format";
import { TokenHead } from "./CAInput";
import { SITE } from "@/site.config";

type Row = { k: string; f: (t: TokenInfo) => number | undefined; fmt: (n?: number) => string; lowerWins?: boolean };
const ROWS: Row[] = [
  { k: "Market cap", f: (t) => t.mcap, fmt: usd },
  { k: "24h volume", f: (t) => t.vol24, fmt: usd },
  { k: "Liquidity", f: (t) => t.liquidity, fmt: usd },
  { k: "24h change", f: (t) => t.change24h, fmt: pct },
  { k: "1h change", f: (t) => t.change1h, fmt: pct },
  { k: "Buys (24h)", f: (t) => t.buys24, fmt: (n) => (n === undefined ? "—" : n.toLocaleString()) },
  { k: `Est. fees/day @${SITE.defaultCreatorFeePct}%`, f: (t) => (t.vol24 ? (t.vol24 * SITE.defaultCreatorFeePct) / 100 : undefined), fmt: usd },
];

export function CADuel({ initialCA = "" }: { initialCA?: string }) {
  const [a, setA] = useState(initialCA);
  const [b, setB] = useState("");
  const [ta, setTa] = useState<TokenInfo | null>(null);
  const [tb, setTb] = useState<TokenInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const go = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!isCA(a) || !isCA(b)) return setErr("Paste two valid Solana CAs.");
    setLoading(true);
    const [x, y] = await Promise.all([getToken(a), getToken(b)]);
    setLoading(false);
    if (!x || !y) setErr("Couldn't load market data for one of those coins.");
    setTa(x); setTb(y);
  };

  let wa = 0, wb = 0;
  const results = ta && tb ? ROWS.map((r) => {
    const va = r.f(ta), vb = r.f(tb);
    let w: "a" | "b" | null = null;
    if (va !== undefined && vb !== undefined && va !== vb) w = (r.lowerWins ? va < vb : va > vb) ? "a" : "b";
    if (w === "a") wa++; if (w === "b") wb++;
    return { r, va, vb, w };
  }) : [];

  const share = () => {
    if (!ta || !tb) return;
    const winner = wa >= wb ? ta : tb;
    const text = `CA DUEL ⚔️ $${ta.symbol} vs $${tb.symbol}\n\nWinner: $${winner.symbol} (${Math.max(wa, wb)}-${Math.min(wa, wb)})\n\nRun your own duel 👇`;
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(`https://${SITE.domain}/tools?t=duel`)}`, "_blank");
  };

  return (
    <div className="space-y-5">
      <form onSubmit={go} className="grid gap-2 md:grid-cols-[1fr_auto_1fr_auto] md:items-center">
        <input className="input" placeholder="Coin A CA" value={a} onChange={(e) => setA(e.target.value.trim())} spellCheck={false} />
        <span className="text-center font-display text-xl font-black italic text-gold">vs</span>
        <input className="input" placeholder="Coin B CA" value={b} onChange={(e) => setB(e.target.value.trim())} spellCheck={false} />
        <button className="btn-gold !py-3" disabled={loading}>{loading ? "…" : "Duel"}</button>
      </form>
      {err && <p className="text-sm text-seal">{err}</p>}
      {ta && tb && (
        <>
          <div className="grid grid-cols-2 gap-4">
            {[ta, tb].map((t, i) => (
              <div key={t.ca} className={`rounded-2xl border-2 p-4 ${(i === 0 ? wa >= wb : wb > wa) ? "border-gold bg-gold/5" : "border-line"}`}>
                <TokenHead t={t} />
                <div className="mt-3 font-mono text-3xl font-black">{i === 0 ? wa : wb}<span className="text-sm text-mute"> wins</span></div>
                <div className="font-mono text-xs text-mute">age {age(t.createdAt)}</div>
              </div>
            ))}
          </div>
          <div className="overflow-hidden rounded-2xl border border-line">
            {results.map(({ r, va, vb, w }) => (
              <div key={r.k} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-line bg-ink px-4 py-3 last:border-0">
                <span className={`font-mono text-sm font-bold ${w === "a" ? "text-mint" : "text-paper/70"}`}>{r.fmt(va)}</span>
                <span className="text-center font-mono text-[10px] uppercase tracking-widest text-mute">{r.k}</span>
                <span className={`text-right font-mono text-sm font-bold ${w === "b" ? "text-mint" : "text-paper/70"}`}>{r.fmt(vb)}</span>
              </div>
            ))}
          </div>
          <button onClick={share} className="btn-paper">Share the result on X</button>
        </>
      )}
    </div>
  );
}
