import { NextRequest } from "next/server";
export const runtime = "nodejs";

/** Same-origin image proxy so Deed cards can be exported as PNG without a tainted canvas. */
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url") || "";
  if (!/^https:\/\//.test(url)) return new Response("bad url", { status: 400 });
  try {
    let target = url;
    if (target.startsWith("https://ipfs.io/ipfs/")) target = target.replace("https://ipfs.io/ipfs/", "https://cf-ipfs.com/ipfs/");
    const r = await fetch(target, { headers: { "User-Agent": "Mozilla/5.0 feedeed" } });
    const type = r.headers.get("content-type") || "";
    if (!r.ok || !type.startsWith("image/")) {
      const r2 = target !== url ? await fetch(url) : null;
      if (!r2 || !r2.ok) return new Response("not an image", { status: 404 });
      return new Response(r2.body, { headers: { "Content-Type": r2.headers.get("content-type") || "image/png", "Cache-Control": "public, max-age=86400" } });
    }
    return new Response(r.body, { headers: { "Content-Type": type, "Cache-Control": "public, max-age=86400" } });
  } catch {
    return new Response("fetch failed", { status: 502 });
  }
}
