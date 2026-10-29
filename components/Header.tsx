"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { useWallet } from "@/lib/wallet";
import { short } from "@/lib/format";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/launch", label: "Launch" },
  { href: "/tools", label: "Toolbox" },
  { href: "/deeds", label: "My Deeds" },
];

export function WalletButton({ className = "" }: { className?: string }) {
  const { address, connect, disconnect, connecting } = useWallet();
  return address ? (
    <button onClick={disconnect} className={`btn-ghost font-mono text-sm ${className}`} title="Disconnect">
      <span className="h-2 w-2 rounded-full bg-mint" /> {short(address)}
    </button>
  ) : (
    <button onClick={connect} className={`btn-paper !py-2 text-sm ${className}`} disabled={connecting}>
      {connecting ? "Connecting…" : "Connect"}
    </button>
  );
}

export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-ink/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" onClick={() => setOpen(false)}><Logo /></Link>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${path === n.href ? "text-gold" : "text-paper/70 hover:text-paper"}`}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/launch" className="btn-gold hidden !py-2 text-sm sm:inline-flex">Launch a coin</Link>
          <WalletButton />
          <button className="ml-1 rounded-lg border border-line p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"} /></svg>
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-line bg-ink px-4 py-3 md:hidden">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
              className={`block rounded-lg px-3 py-3 font-semibold ${path === n.href ? "text-gold" : "text-paper/80"}`}>{n.label}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}
