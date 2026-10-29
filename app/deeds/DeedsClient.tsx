"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Deed, loadDeeds, removeDeed } from "@/lib/deeds";
import { getToken, TokenInfo } from "@/lib/token";
import { deedNo, usd, short } from "@/lib/format";
import { SITE, pumpUrl } from "@/site.config";

export default function DeedsClient() {
  const [deeds, setDeeds] = useState<Deed[]>([]);
  const [data, setData] = useState<Record<string, TokenInfo | null>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => { setDeeds(loadDeeds()); setReady(true); }, []);
  useEffect(() => {
    let on = true;
    const run = async () => {
      const entries = await Promise.all(deeds.map(async (d) => [d.ca, await getToken(d.ca)] as const));
      if (on) setData(Object.fromEntries(entries));
    };
    if (deeds.length) run();
    const id = setInterval(() => deeds.length && run(), 30000);
    return () => { on = false; clearInterval(id); };
  }, [deeds]);

  const totalDaily = deeds.reduce((s, d) => s + ((data[d.ca]?.vol24 || 0) * SITE.defaultCreatorFeePct) / 100, 0);

  return (
    <div className="dotgrid">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <div className="chip">My Deeds · stored in this browser</div>
        <h1 className="mt-4 font-display text-4xl font-black italic sm:text-6xl">Your deed vault.</h1>
        <p className="mt-3 max-w-xl text-paper/70">Every coin you launch here, or any deed you stamp and save, lands in your vault with live fee estimates.</p>

        {deeds.length > 0 && (
          <div className="paper mt-8 flex flex-wrap items-end justify-between gap-4 rounded-2xl border-2 border-black p-6 shadow-chunk">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-widest text-[#6b5a33]">Vault est. fees / day</div>
              <div className="font-display text-5xl font-black">{usd(totalDaily)}</div>
            </div>
            <div className="font-mono text-sm text-[#4a3d22]">{deeds.length} deed{deeds.length > 1 ? "s" : ""} · @{SITE.defaultCreatorFeePct}%</div>
          </div>
        )}

        {ready && deeds.length === 0 && (
          <div className="mt-10 grid place-items-center rounded-2xl border-2 border-dashed border-line px-6 py-16 text-center">
            <div className="font-display text-3xl font-black italic">The vault is empty.</div>
            <p className="mt-2 text-mute">Launch a coin or stamp a deed for one you hold.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/launch" className="btn-gold">Launch a coin</Link>
              <Link href="/tools?t=deed" className="btn-paper">Stamp a deed</Link>
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {deeds.map((d) => {
            const t = data[d.ca];
            const img = t?.image || d.image;
            return (
              <div key={d.ca} className="card overflow-hidden">
                <div className="paper relative p-5">
                  {d.launchedHere && <span className="absolute right-3 top-3 rotate-6 rounded border-2 border-seal px-1.5 font-mono text-[10px] font-bold text-seal">LAUNCHED HERE</span>}
                  <div className="font-mono text-[10px] tracking-widest text-[#6b5a33]">DEED No. {deedNo(d.ca)}</div>
                  <div className="mt-3 flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {img ? <img src={img} alt="" className="h-12 w-12 rounded-lg border-2 border-black object-cover" /> : <div className="grid h-12 w-12 place-items-center rounded-lg border-2 border-black bg-gold font-black">{d.symbol.slice(0, 2)}</div>}
                    <div className="min-w-0">
                      <div className="truncate font-display text-xl font-black">{d.name}</div>
                      <div className="font-mono text-xs text-[#b07d0c]">${d.symbol}</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-px bg-line">
                  <div className="bg-ink2 p-3"><div className="label !mb-0.5">Mcap</div><div className="font-mono font-bold">{usd(t?.mcap)}</div></div>
                  <div className="bg-ink2 p-3"><div className="label !mb-0.5">Fees/day</div><div className="font-mono font-bold text-mint">{usd(t?.vol24 ? (t.vol24 * SITE.defaultCreatorFeePct) / 100 : undefined)}</div></div>
                </div>
                <div className="flex items-center gap-2 p-3">
                  <Link href={`/tools?t=deed&ca=${d.ca}`} className="btn-ghost !px-3 !py-1.5 text-xs">Deed card</Link>
                  <Link href={`/tools?t=fees&ca=${d.ca}`} className="btn-ghost !px-3 !py-1.5 text-xs">Fee meter</Link>
                  <a href={pumpUrl(d.ca)} target="_blank" rel="noreferrer" className="btn-ghost !px-3 !py-1.5 text-xs">pump</a>
                  <button onClick={() => { removeDeed(d.ca); setDeeds(loadDeeds()); }} className="ml-auto text-xs text-mute hover:text-seal" title={short(d.ca)}>Remove</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
