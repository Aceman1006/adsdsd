import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";

/**
 * Builds an unsigned pump.fun "create" transaction via PumpPortal's free local-transaction API.
 * Nothing is signed server-side: the browser signs with the mint keypair + the user's wallet.
 */
export async function POST(req: NextRequest) {
  try {
    const b = await req.json();
    const { publicKey, mint, name, symbol, uri, devBuySol } = b || {};
    if (!publicKey || !mint || !name || !symbol || !uri) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const amount = Math.max(0, Math.min(100, Number(devBuySol) || 0));
    const r = await fetch("https://pumpportal.fun/api/trade-local", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        publicKey,
        action: "create",
        tokenMetadata: { name, symbol, uri },
        mint,
        denominatedInSol: "true",
        amount,
        slippage: 10,
        priorityFee: 0.0005,
        pool: "pump",
      }),
    });
    if (r.status !== 200) {
      const t = await r.text();
      return NextResponse.json({ error: `PumpPortal error (${r.status})`, detail: t.slice(0, 300) }, { status: 502 });
    }
    const buf = Buffer.from(await r.arrayBuffer());
    return NextResponse.json({ tx: buf.toString("base64") });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Create failed" }, { status: 500 });
  }
}
