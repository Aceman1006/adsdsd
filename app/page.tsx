import Link from "next/link";
import { HeroArt } from "@/components/HeroArt";
import { CABar } from "@/components/CABar";
import { LiveBoard } from "@/components/LiveBoard";
import { TOOLS } from "@/lib/tools";
import { SITE } from "@/site.config";

const MARQUEE = ["Launch in 60s", "0% platform fee", "Your wallet = creator", "Wax-sealed deed cards", "Live fee meter", "6 free trench tools", "No signup", `$${SITE.ticker}`];

const STEPS = [
  { n: "01", t: "Launch", d: "Name it, drop the art, hit launch. The coin goes live on pump.fun from your wallet, so you're the creator on-chain." },
  { n: "02", t: "Stamp", d: "Your coin gets a numbered, wax-sealed Deed of Fees with live mcap, volume and fee stats. Post it at launch." },
  { n: "03", t: "Collect", d: "Every trade earns creator fees. Track them in your Deed Vault and claim them on pump.fun whenever you want." },
];

const WHY = [
  { t: "0% platform fee", d: "We don't skim your launch or your fees. pump.fun's standard costs only." },
  { t: "Non-custodial", d: "Transactions are built for your wallet to sign. Your keys never touch our servers." },
  { t: "Made to be posted", d: "Deed cards, CA duels and fee meters are designed as screenshots for the timeline." },
  { t: "Works on any coin", d: "Every tool takes any Solana CA, not just coins launched here." },
  { t: "Share links", d: "Every tool result has a link. Send someone straight to your coin's deed or scan." },
  { t: "Live, free data", d: "Real-time market data. Results are never cached for longer than seconds." },
];

const ROADMAP = [
  { p: "Phase 1", s: "Live", items: ["Launch from your wallet", "Deed Stamper + Vault", "6-tool toolbox", `$${SITE.ticker} launch`] },
  { p: "Phase 2", s: "Next", items: ["Public Deed Registry", "Top-earning deeds leaderboard", "Deed of the Day on X"] },
  { p: "Phase 3", s: "Planned", items: ["Transferable on-chain deeds", "Deed marketplace", `$${SITE.ticker} holder perks`] },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="dotgrid relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-12 pt-10 sm:pt-16 lg:grid-cols-[1.05fr_.95fr]">
          <div className="min-w-0">
            <div className="chip"><span className="h-1.5 w-1.5 rounded-full bg-gold" /> ${SITE.ticker} · Solana · {SITE.domain}</div>
            <h1 className="mt-5 font-display text-5xl font-black leading-[.95] tracking-tight sm:text-7xl">
              Launch a coin.<br />
              <span className="italic text-gold">Own the deed.</span><br />
              Take the fees.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-paper/75">
              FEEDEED launches your pump.fun coin from your own wallet in 60 seconds, stamps it with a wax-sealed{" "}
              <b className="text-paper">Deed of Fees</b>, and gives you a free toolbox for the trenches.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/launch" className="btn-gold text-lg">Launch a coin</Link>
              <Link href="/tools" className="btn-paper text-lg">Try every tool</Link>
              <Link href="/#how" className="btn-ghost">How it works</Link>
            </div>
            <div className="mt-8"><CABar /></div>
          </div>
          <HeroArt />
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-14"><LiveBoard /></div>
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden border-y-2 border-black bg-gold py-3 text-ink">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-xl font-black italic">
          {[...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE].map((m, i) => (
            <span key={i} className="flex items-center gap-10">{m}<span className="text-seal">✦</span></span>
          ))}
        </div>
      </div>

      {/* HOW */}
      <section id="how" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20">
        <div className="chip">How it works</div>
        <h2 className="mt-4 max-w-2xl font-display text-4xl font-black sm:text-5xl">Three steps from idea to a coin that pays you.</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.n} className={`paper rounded-2xl border-2 border-black p-6 shadow-chunk ${i === 1 ? "md:-rotate-1" : i === 2 ? "md:rotate-1" : ""}`}>
              <div className="font-mono text-sm font-bold text-[#b07d0c]">{s.n}</div>
              <div className="mt-2 font-display text-3xl font-black italic">{s.t}</div>
              <p className="mt-3 text-[15px] text-[#3d321b]">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TOOLBOX */}
      <section className="border-y border-line bg-ink2/60">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="chip">Toolbox · free forever</div>
              <h2 className="mt-4 font-display text-4xl font-black sm:text-5xl">Try every tool.</h2>
              <p className="mt-3 max-w-lg text-paper/70">Six tools for the trenches. Paste any CA, no wallet needed.</p>
            </div>
            <Link href="/tools" className="btn-paper">Open toolbox →</Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((t) => (
              <Link key={t.id} href={`/tools?t=${t.id}`} className="group card relative p-6 transition hover:-translate-y-1 hover:border-gold">
                <div className="flex items-start justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-xl border-2 border-black bg-paper text-2xl shadow-chunk">{t.emoji}</span>
                  <span className="chip">{t.tag}</span>
                </div>
                <div className="mt-5 font-display text-2xl font-black group-hover:text-gold">{t.name}</div>
                <p className="mt-2 text-sm text-paper/70">{t.blurb}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <div className="chip">Why {SITE.name}</div>
            <h2 className="mt-4 font-display text-4xl font-black sm:text-5xl">A launchpad that doesn&apos;t take a cut.</h2>
            <p className="mt-4 text-paper/70">Most launchpads take a share of your coin or its fees. FEEDEED takes none. You get the launch, the deed and the tools for free.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {WHY.map((w) => (
              <div key={w.t} className="card p-5">
                <div className="flex items-center gap-2 font-bold"><span className="text-seal">✦</span>{w.t}</div>
                <p className="mt-2 text-sm text-paper/70">{w.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="mx-auto max-w-7xl px-4 pb-8">
        <div className="chip">Roadmap</div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {ROADMAP.map((r) => (
            <div key={r.p} className={`rounded-2xl border-2 p-6 ${r.s === "Live" ? "border-gold bg-gold/5" : "border-line bg-ink2"}`}>
              <div className="flex items-center justify-between">
                <div className="font-display text-2xl font-black italic">{r.p}</div>
                <span className={`chip ${r.s === "Live" ? "!border-mint !text-mint" : ""}`}>{r.s}</span>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-paper/80">
                {r.items.map((i) => <li key={i} className="flex gap-2"><span className={r.s === "Live" ? "text-mint" : "text-mute"}>{r.s === "Live" ? "✓" : "○"}</span>{i}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="paper relative overflow-hidden rounded-3xl border-2 border-black p-8 shadow-chunkgold sm:p-14">
          <div className="absolute -right-6 -top-6 hidden h-40 w-40 rotate-12 place-items-center rounded-full border-4 border-black bg-seal font-display text-6xl font-black text-white shadow-chunk sm:grid">D</div>
          <h2 className="max-w-2xl font-display text-4xl font-black italic sm:text-6xl">Every coin deserves a deed.</h2>
          <p className="mt-4 max-w-lg text-[#3d321b]">Launch yours in under a minute, or stamp a deed for the coin you&apos;re already holding.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/launch" className="btn bg-ink text-paper shadow-chunk">Launch a coin</Link>
            <Link href="/tools?t=deed" className="btn-gold">Stamp a deed</Link>
          </div>
        </div>
      </section>
    </>
  );
}
