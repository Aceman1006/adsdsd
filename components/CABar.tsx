"use client";
import { useState } from "react";
import { SITE, pumpUrl, dexUrl } from "@/site.config";

export function CABar() {
  const ca = SITE.ca;
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    if (!ca) return;
    try { await navigator.clipboard.writeText(ca); } catch {
      const t = document.createElement("textarea"); t.value = ca; document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="flex items-stretch overflow-hidden rounded-2xl border-2 border-black bg-paper text-ink shadow-chunk">
        <span className="flex items-center bg-ink px-3 font-mono text-xs font-bold text-gold sm:px-4">CA</span>
        <button onClick={copy} disabled={!ca}
          className="min-w-0 flex-1 truncate px-3 py-3.5 text-left font-mono text-[13px] font-semibold sm:px-4 sm:text-sm">
          {ca || "CA dropping soon — follow X for the launch"}
        </button>
        {ca ? (
          <button onClick={copy} className="border-l-2 border-black bg-gold px-4 font-bold">
            {copied ? "Copied!" : "Copy"}
          </button>
        ) : (
          <a href={SITE.links.x} target="_blank" rel="noreferrer" className="flex items-center border-l-2 border-black bg-gold px-4 font-bold">Follow</a>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {ca && (
          <>
            <a href={pumpUrl(ca)} target="_blank" rel="noreferrer" className="btn-gold !py-2.5 text-sm">Buy ${SITE.ticker} on pump.fun</a>
            <a href={dexUrl(ca)} target="_blank" rel="noreferrer" className="btn-ghost text-sm">Chart</a>
          </>
        )}
        <a href={SITE.links.x} target="_blank" rel="noreferrer" className="btn-ghost text-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7.5 8.6L23 22h-6.8l-5.3-6.9L4.8 22H1.7l8-9.2L1 2h7l4.8 6.3zM17.7 20h1.7L7.4 3.9H5.6z" /></svg> X
        </a>
        <a href={SITE.links.telegram} target="_blank" rel="noreferrer" className="btn-ghost text-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21.9 4.6l-3.1 14.7c-.2 1-.9 1.3-1.7.8l-4.7-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.8 8.8-7.9c.4-.3-.1-.5-.6-.2L6.7 13.2 2 11.7c-1-.3-1-1 .2-1.5L20.6 3.2c.9-.3 1.6.2 1.3 1.4z" /></svg> Telegram
        </a>
      </div>
    </div>
  );
}
