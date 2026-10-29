"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useWallet } from "@/lib/wallet";
import { saveDeed } from "@/lib/deeds";
import { SITE, pumpUrl } from "@/site.config";
import { short } from "@/lib/format";

const STEPS = ["Upload art + metadata", "Build launch transaction", "Approve in wallet", "Stamp your deed"];

const b64ToBytes = (b64: string) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

export default function LaunchClient() {
  const { address, connect, provider } = useWallet();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [f, setF] = useState({ name: "", symbol: "", description: "", twitter: "", telegram: "", website: "", devBuy: "0.1" });
  const [step, setStep] = useState(-1);
  const [err, setErr] = useState("");
  const [done, setDone] = useState<{ mint: string; sig: string } | null>(null);

  useEffect(() => {
    if (!file) return setPreview("");
    const u = URL.createObjectURL(file);
    setPreview(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });
  const valid = file && f.name.trim() && f.symbol.trim() && +f.devBuy >= 0;
  const busy = step >= 0 && !done && !err;

  const launch = async () => {
    setErr(""); setDone(null);
    let owner = address;
    if (!owner) owner = await connect();
    if (!owner) return;
    if (!valid) return setErr("Add an image, a name and a ticker first.");
    try {
      // dynamic import keeps web3.js out of every other page's bundle
      const { Keypair, VersionedTransaction, Connection } = await import("@solana/web3.js");
      const bs58 = (await import("bs58")).default;

      setStep(0);
      const fd = new FormData();
      fd.append("file", file!);
      fd.append("name", f.name.trim());
      fd.append("symbol", f.symbol.trim().toUpperCase());
      fd.append("description", f.description.trim());
      fd.append("twitter", f.twitter.trim());
      fd.append("telegram", f.telegram.trim());
      fd.append("website", f.website.trim());
      const up = await fetch("/api/ipfs", { method: "POST", body: fd });
      const upJ = await up.json();
      if (!up.ok) throw new Error(upJ.error || "Metadata upload failed");

      setStep(1);
      const mint = Keypair.generate();
      const cr = await fetch("/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicKey: owner, mint: mint.publicKey.toBase58(),
          name: upJ.metadata?.name || f.name.trim(), symbol: upJ.metadata?.symbol || f.symbol.trim().toUpperCase(),
          uri: upJ.metadataUri, devBuySol: +f.devBuy,
        }),
      });
      const crJ = await cr.json();
      if (!cr.ok) throw new Error(crJ.error || "Couldn't build the transaction");
      const tx = VersionedTransaction.deserialize(b64ToBytes(crJ.tx));
      tx.sign([mint]);

      setStep(2);
      const p = provider();
      let sig: string;
      if (p?.signAndSendTransaction) {
        const r = await p.signAndSendTransaction(tx);
        sig = typeof r === "string" ? r : r.signature;
      } else {
        const signed = await p.signTransaction(tx);
        const conn = new Connection(SITE.rpc, "confirmed");
        sig = await conn.sendRawTransaction(signed.serialize());
      }
      if (typeof sig !== "string") sig = bs58.encode(sig as any);

      setStep(3);
      const ca = mint.publicKey.toBase58();
      saveDeed({ ca, name: f.name.trim(), symbol: f.symbol.trim().toUpperCase(), image: upJ.metadata?.image, createdAt: Date.now(), owner, sig, launchedHere: true });
      setDone({ mint: ca, sig });
    } catch (e: any) {
      const m = e?.message || String(e);
      setErr(/reject|cancel|denied/i.test(m) ? "You cancelled in your wallet — nothing was sent." : m);
    }
  };

  return (
    <div className="dotgrid">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:py-14 lg:grid-cols-[1.1fr_.9fr]">
        <div className="min-w-0">
          <div className="chip">Launch · pump.fun · your wallet, your coin</div>
          <h1 className="mt-4 font-display text-4xl font-black italic sm:text-6xl">Launch a coin.<br />Stamp the deed.</h1>
          <p className="mt-3 max-w-lg text-paper/70">
            Your coin goes live on pump.fun from your own wallet, so you're the creator and the creator fees go to you. FEEDEED never holds your keys or takes a cut.
          </p>

          <div className="card mt-8 space-y-5 p-5 sm:p-7">
            <div className="flex gap-4">
              <button onClick={() => fileRef.current?.click()} type="button"
                className="grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-2xl border-2 border-dashed border-line bg-ink text-center text-xs text-mute hover:border-gold">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {preview ? <img src={preview} alt="" className="h-full w-full object-cover" /> : <span>+ Image<br />png/jpg/gif</span>}
              </button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => setFile(e.target.files?.[0] || null)} />
              <div className="flex-1 space-y-3">
                <div><span className="label">Coin name</span><input className="input" maxLength={32} placeholder="Deed Dog" value={f.name} onChange={set("name")} /></div>
                <div><span className="label">Ticker</span><input className="input uppercase" maxLength={10} placeholder="DOGDEED" value={f.symbol} onChange={set("symbol")} /></div>
              </div>
            </div>
            <div><span className="label">Description</span><textarea className="input min-h-[90px]" maxLength={500} placeholder="What's the story?" value={f.description} onChange={set("description")} /></div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div><span className="label">X link</span><input className="input" placeholder="https://x.com/…" value={f.twitter} onChange={set("twitter")} /></div>
              <div><span className="label">Telegram</span><input className="input" placeholder="https://t.me/…" value={f.telegram} onChange={set("telegram")} /></div>
              <div><span className="label">Website</span><input className="input" placeholder="https://…" value={f.website} onChange={set("website")} /></div>
            </div>
            <div>
              <span className="label">Dev buy (SOL), optional</span>
              <div className="flex gap-2">
                <input type="number" step="0.01" min="0" className="input" value={f.devBuy} onChange={set("devBuy")} />
                {["0", "0.1", "0.5", "1"].map((v) => (
                  <button key={v} type="button" onClick={() => setF({ ...f, devBuy: v })} className={`chip shrink-0 ${f.devBuy === v ? "!border-gold !text-gold" : ""}`}>{v}</button>
                ))}
              </div>
              <p className="mt-1.5 text-xs text-mute">You also pay pump.fun's creation fee and Solana network fees, shown in your wallet before you approve.</p>
            </div>
            <button onClick={launch} disabled={busy} className="btn-gold w-full !py-4 text-lg">
              {!address ? "Connect wallet to launch" : busy ? STEPS[step] + "…" : "Launch coin 🚀"}
            </button>
            {err && <p className="rounded-xl border border-seal/40 bg-seal/10 px-4 py-3 text-sm text-seal">{err}</p>}
          </div>
        </div>

        <div className="space-y-5 lg:pt-24">
          <div className="card p-5">
            <div className="label">Launch progress</div>
            <ol className="mt-2 space-y-3">
              {STEPS.map((s, i) => {
                const state = done || step > i ? "done" : step === i && !err ? "now" : "todo";
                return (
                  <li key={s} className="flex items-center gap-3">
                    <span className={`grid h-7 w-7 place-items-center rounded-full border-2 border-black text-xs font-black ${state === "done" ? "bg-mint text-ink" : state === "now" ? "animate-pulse bg-gold text-ink" : "bg-ink3 text-mute"}`}>
                      {state === "done" ? "✓" : i + 1}
                    </span>
                    <span className={state === "todo" ? "text-mute" : "font-semibold"}>{s}</span>
                  </li>
                );
              })}
            </ol>
          </div>

          {done ? (
            <div className="paper relative overflow-hidden rounded-2xl border-2 border-black p-6 shadow-chunk">
              <div className="absolute right-4 top-4 animate-stamp rounded-md border-4 border-seal px-2 py-0.5 font-display text-xl font-black italic text-seal">LIVE</div>
              <div className="font-mono text-[11px] uppercase tracking-widest text-[#6b5a33]">Deed issued</div>
              <div className="mt-1 font-display text-3xl font-black">${f.symbol.toUpperCase()}</div>
              <div className="mt-3 break-all font-mono text-xs">{done.mint}</div>
              <div className="mt-5 flex flex-wrap gap-2">
                <a href={pumpUrl(done.mint)} target="_blank" rel="noreferrer" className="btn-gold !py-2 text-sm">View on pump.fun</a>
                <Link href={`/tools?t=deed&ca=${done.mint}`} className="btn-paper !py-2 text-sm">Stamp &amp; share deed</Link>
                <a href={`https://solscan.io/tx/${done.sig}`} target="_blank" rel="noreferrer" className="btn !border-black/30 !py-2 text-sm">Tx {short(done.sig)}</a>
              </div>
            </div>
          ) : (
            <div className="card p-5 text-sm text-paper/75">
              <div className="label">What you get</div>
              <ul className="mt-2 space-y-2">
                <li>✓ A real pump.fun coin, created by <b>your</b> wallet</li>
                <li>✓ Creator fees paid to <b>you</b>, claimable on pump.fun</li>
                <li>✓ A wax-sealed Deed of Fees card to post at launch</li>
                <li>✓ Saved in My Deeds with a live fee meter</li>
                <li>✓ 0% FEEDEED fee. Keys never leave your wallet</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
