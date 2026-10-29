"use client";
import { useEffect, useState } from "react";

export function CAInput({ onSubmit, loading, initial = "", cta = "Look up" }: { onSubmit: (ca: string) => void; loading?: boolean; initial?: string; cta?: string }) {
  const [v, setV] = useState(initial);
  useEffect(() => { if (initial) setV(initial); }, [initial]);
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(v); }} className="flex flex-col gap-2 sm:flex-row">
      <input className="input" placeholder="Paste any Solana CA…" value={v} onChange={(e) => setV(e.target.value)}
        onPaste={(e) => { const t = e.clipboardData.getData("text").trim(); if (t) { e.preventDefault(); setV(t); setTimeout(() => onSubmit(t), 0); } }} spellCheck={false} />
      <button className="btn-gold shrink-0 !py-3" disabled={loading}>{loading ? "Loading…" : cta}</button>
    </form>
  );
}

export function TokenHead({ t }: { t: { name: string; symbol: string; image?: string; ca: string } }) {
  return (
    <div className="flex items-center gap-3">
      {t.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={t.image} alt="" className="h-12 w-12 rounded-xl border-2 border-black object-cover" />
      ) : (
        <div className="grid h-12 w-12 place-items-center rounded-xl border-2 border-black bg-gold font-display font-black text-ink">{t.symbol.slice(0, 2)}</div>
      )}
      <div className="min-w-0">
        <div className="truncate font-display text-xl font-black">{t.name}</div>
        <div className="font-mono text-xs text-gold">${t.symbol}</div>
      </div>
    </div>
  );
}

export function Stat({ k, v, tone }: { k: string; v: React.ReactNode; tone?: "good" | "bad" }) {
  return (
    <div className="rounded-xl border border-line bg-ink p-3">
      <div className="label !mb-1">{k}</div>
      <div className={`font-mono text-lg font-bold ${tone === "good" ? "text-mint" : tone === "bad" ? "text-seal" : "text-paper"}`}>{v}</div>
    </div>
  );
}
