import { Suspense } from "react";
import ToolsClient from "./ToolsClient";

export const metadata = { title: "Toolbox — FEEDEED", description: "Six free Solana trench tools: Deed Stamper, Fee Meter, Trench Scan, Bag Math, Moon Math, CA Duel." };

export default function Page() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-16 text-mute">Loading toolbox…</div>}>
      <ToolsClient />
    </Suspense>
  );
}
