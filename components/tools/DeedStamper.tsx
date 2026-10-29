"use client";
import { useEffect, useRef, useState } from "react";
import { CAInput } from "./CAInput";
import { useTokenLookup } from "./useToken";
import { drawDeed } from "@/lib/deedCanvas";
import { proxImg } from "@/lib/token";
import { saveDeed } from "@/lib/deeds";
import { SITE } from "@/site.config";
import { useWallet } from "@/lib/wallet";

export function DeedStamper({ initialCA = "" }: { initialCA?: string }) {
  const { token, loading, error, lookup } = useTokenLookup();
  const { address } = useWallet();
  const canvas = useRef<HTMLCanvasElement>(null);
  const [fee, setFee] = useState(SITE.defaultCreatorFeePct);
  const [drawn, setDrawn] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (initialCA) lookup(initialCA); }, [initialCA, lookup]);

  useEffect(() => {
    if (!token || !canvas.current) return;
    setDrawn(false); setSaved(false);
    drawDeed(canvas.current, {
      ca: token.ca, name: token.name, symbol: token.symbol, imageSrc: proxImg(token.image),
      mcap: token.mcap, vol24: token.vol24, feePct: fee, owner: address || undefined,
    }).then(() => setDrawn(true));
  }, [token, fee, address]);

  const download = () => {
    if (!canvas.current || !token) return;
    try {
      const a = document.createElement("a");
      a.download = `deed-${token.symbol}.png`;
      a.href = canvas.current.toDataURL("image/png");
      a.click();
    } catch { alert("Couldn't export this image — try again."); }
  };
  const share = () => {
    if (!token) return;
    const url = `https://${SITE.domain}/tools?t=deed&ca=${token.ca}`;
    const text = `Just stamped the Deed of Fees for $${token.symbol} 📜🔴\n\nEvery trade = fees. Stamp yours 👇`;
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
  };
  const keep = () => {
    if (!token) return;
    saveDeed({ ca: token.ca, name: token.name, symbol: token.symbol, image: token.image, createdAt: Date.now(), owner: address || undefined });
    setSaved(true);
  };

  return (
    <div className="space-y-5">
      <CAInput onSubmit={lookup} loading={loading} initial={initialCA} cta="Stamp deed" />
      {error && <p className="text-sm text-seal">{error}</p>}
      <div className={`overflow-hidden rounded-2xl border-2 border-black bg-ink shadow-chunkgold ${token ? "" : "hidden"}`}>
        <canvas ref={canvas} className="block h-auto w-full" />
      </div>
      {!token && (
        <div className="grid aspect-[16/9] place-items-center rounded-2xl border-2 border-dashed border-line text-center text-mute">
          <div><div className="font-display text-3xl font-black italic text-paper/80">Your deed appears here</div><p className="mt-2 text-sm">Paste any CA — yours, a runner, your bag.</p></div>
        </div>
      )}
      {token && (
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={download} className="btn-gold" disabled={!drawn}>Download PNG</button>
          <button onClick={share} className="btn-paper">Share on X</button>
          <button onClick={keep} className="btn-ghost">{saved ? "Saved to My Deeds ✓" : "Save to My Deeds"}</button>
          <label className="ml-auto flex items-center gap-2 font-mono text-xs text-mute">
            fee rate %
            <input type="number" step="0.01" min="0" max="5" value={fee} onChange={(e) => setFee(Math.max(0, +e.target.value || 0))} className="input !w-24 !py-2" />
          </label>
        </div>
      )}
    </div>
  );
}
