import Link from "next/link";
import { SITE, pumpUrl, dexUrl } from "@/site.config";
import { Logo } from "./Logo";

export function Footer() {
  const ca = SITE.ca;
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-mute">
            Launch a coin, stamp its deed, and track every fee it earns. A free toolbox for the trenches on Solana.
          </p>
        </div>
        <div>
          <div className="label">Site</div>
          <ul className="space-y-2 text-sm text-paper/80">
            <li><Link href="/launch" className="hover:text-gold">Launch a coin</Link></li>
            <li><Link href="/tools" className="hover:text-gold">Toolbox</Link></li>
            <li><Link href="/deeds" className="hover:text-gold">My Deeds</Link></li>
            <li><Link href="/#how" className="hover:text-gold">How it works</Link></li>
          </ul>
        </div>
        <div>
          <div className="label">${SITE.ticker}</div>
          <ul className="space-y-2 text-sm text-paper/80">
            <li><a href={SITE.links.x} target="_blank" rel="noreferrer" className="hover:text-gold">X / Twitter</a></li>
            <li><a href={SITE.links.telegram} target="_blank" rel="noreferrer" className="hover:text-gold">Telegram</a></li>
            {ca && <li><a href={pumpUrl(ca)} target="_blank" rel="noreferrer" className="hover:text-gold">pump.fun</a></li>}
            {ca && <li><a href={dexUrl(ca)} target="_blank" rel="noreferrer" className="hover:text-gold">DexScreener</a></li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 font-mono text-[11px] uppercase tracking-widest text-mute sm:flex-row">
          <span>© {new Date().getFullYear()} {SITE.name} · {SITE.domain}</span>
          <span>Not financial advice · memecoins are risky · DYOR</span>
        </div>
      </div>
    </footer>
  );
}
