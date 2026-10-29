import { NextResponse } from "next/server";
export const runtime = "nodejs";
export const revalidate = 0;

/** Fallback data for brand-new pump.fun coins that DexScreener hasn't indexed yet. */
export async function GET(_: Request, { params }: { params: { ca: string } }) {
  const ca = params.ca;
  if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(ca)) return NextResponse.json({ error: "bad ca" }, { status: 400 });
  for (const host of ["https://frontend-api-v3.pump.fun", "https://frontend-api.pump.fun"]) {
    try {
      const r = await fetch(`${host}/coins/${ca}`, { headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0" }, cache: "no-store" });
      if (r.ok) return NextResponse.json(await r.json(), { headers: { "Cache-Control": "s-maxage=10" } });
    } catch {}
  }
  return NextResponse.json({ error: "not found" }, { status: 404 });
}
