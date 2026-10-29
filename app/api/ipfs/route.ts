import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";

/** Proxies metadata + image upload to pump.fun IPFS (their endpoint blocks browser CORS). */
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof Blob)) return NextResponse.json({ error: "Image required" }, { status: 400 });
    if (file.size > 4.5 * 1024 * 1024) return NextResponse.json({ error: "Image must be under 4.5MB" }, { status: 400 });

    const out = new FormData();
    out.append("file", file, (file as any).name || "image.png");
    for (const k of ["name", "symbol", "description", "twitter", "telegram", "website"]) {
      out.append(k, String(form.get(k) || ""));
    }
    out.append("showName", "true");

    const r = await fetch("https://pump.fun/api/ipfs", { method: "POST", body: out });
    const text = await r.text();
    if (!r.ok) return NextResponse.json({ error: `IPFS upload failed (${r.status})`, detail: text.slice(0, 300) }, { status: 502 });
    const j = JSON.parse(text);
    return NextResponse.json({ metadataUri: j.metadataUri, metadata: j.metadata });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Upload failed" }, { status: 500 });
  }
}
