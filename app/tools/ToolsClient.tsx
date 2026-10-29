"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { TOOLS, ToolId } from "@/lib/tools";
import { DeedStamper } from "@/components/tools/DeedStamper";
import { FeeMeter } from "@/components/tools/FeeMeter";
import { TrenchScan } from "@/components/tools/TrenchScan";
import { BagMath } from "@/components/tools/BagMath";
import { MoonMath } from "@/components/tools/MoonMath";
import { CADuel } from "@/components/tools/CADuel";

const MAP: Record<ToolId, (p: { initialCA?: string }) => JSX.Element> = {
  deed: DeedStamper, fees: FeeMeter, scan: TrenchScan, bag: BagMath, moon: MoonMath, duel: CADuel,
};

export default function ToolsClient() {
  const sp = useSearchParams();
  const router = useRouter();
  const t = (sp.get("t") as ToolId) || "deed";
  const active = TOOLS.find((x) => x.id === t) || TOOLS[0];
  const ca = sp.get("ca") || "";
  const Comp = MAP[active.id];

  return (
    <div className="dotgrid">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <div className="chip">Toolbox · {TOOLS.length} tools · free forever</div>
        <h1 className="mt-4 font-display text-4xl font-black italic sm:text-6xl">Try every tool.</h1>
        <p className="mt-3 max-w-xl text-paper/70">Paste any Solana CA. No wallet, no signup, no paywall. Every result has a link you can share.</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
          <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {TOOLS.map((x) => (
              <button key={x.id} onClick={() => router.replace(`/tools?t=${x.id}${ca ? `&ca=${ca}` : ""}`, { scroll: false })}
                className={`flex shrink-0 items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition ${x.id === active.id ? "border-black bg-gold text-ink shadow-chunk" : "border-line bg-ink2 text-paper/80 hover:border-paper/40"}`}>
                <span className="text-xl">{x.emoji}</span>
                <span className="font-bold">{x.name}</span>
              </button>
            ))}
          </nav>
          <section className="card min-w-0 p-5 sm:p-7">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-2xl font-black sm:text-3xl">{active.emoji} {active.name}</h2>
              <span className="chip">{active.tag}</span>
            </div>
            <p className="mb-6 text-sm text-paper/70">{active.blurb}</p>
            <Comp key={active.id} initialCA={ca} />
          </section>
        </div>
      </div>
    </div>
  );
}
