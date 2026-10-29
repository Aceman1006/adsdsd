import { deedNo, short, usd } from "./format";

export type DeedArt = {
  ca: string;
  name: string;
  symbol: string;
  imageSrc?: string; // same-origin (proxied) url
  mcap?: number;
  vol24?: number;
  feePct: number;
  owner?: string;
};

const loadImg = (src: string) =>
  new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.crossOrigin = "anonymous";
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });

/** Draws a 1200x675 (X-card ratio) Deed certificate. */
export async function drawDeed(canvas: HTMLCanvasElement, d: DeedArt) {
  const W = 1200, H = 675;
  canvas.width = W;
  canvas.height = H;
  const c = canvas.getContext("2d")!;
  await (document as any).fonts?.ready;

  // backdrop
  c.fillStyle = "#0b0b0e";
  c.fillRect(0, 0, W, H);

  // paper
  const px = 40, py = 36, pw = W - 80, ph = H - 72;
  c.fillStyle = "#000";
  c.fillRect(px + 10, py + 10, pw, ph);
  const g = c.createLinearGradient(0, py, 0, py + ph);
  g.addColorStop(0, "#f7eed9");
  g.addColorStop(1, "#ead9b2");
  c.fillStyle = g;
  c.fillRect(px, py, pw, ph);

  // paper grain
  for (let i = 0; i < 2600; i++) {
    c.fillStyle = `rgba(120,90,40,${Math.random() * 0.06})`;
    c.fillRect(px + Math.random() * pw, py + Math.random() * ph, 2, 2);
  }

  // double border
  c.strokeStyle = "#1a1408";
  c.lineWidth = 4;
  c.strokeRect(px + 18, py + 18, pw - 36, ph - 36);
  c.lineWidth = 1.5;
  c.strokeRect(px + 28, py + 28, pw - 56, ph - 56);

  // guilloche corners
  c.strokeStyle = "rgba(170,120,20,.55)";
  c.lineWidth = 1;
  for (const [cx, cy] of [[px + 28, py + 28], [px + pw - 28, py + 28], [px + 28, py + ph - 28], [px + pw - 28, py + ph - 28]]) {
    for (let r = 10; r < 70; r += 7) {
      c.beginPath();
      c.arc(cx, cy, r, 0, Math.PI * 2);
      c.stroke();
    }
  }

  const ink = "#1a1408";
  c.fillStyle = ink;
  c.textAlign = "center";
  c.font = "600 22px 'JetBrains Mono', monospace";
  c.fillText(`DEED No. ${deedNo(d.ca)}  ·  FEEDEED.FUN`, W / 2, py + 78);

  c.font = "italic 900 64px Fraunces, Georgia, serif";
  c.fillText("Deed of Fees", W / 2, py + 148);

  c.font = "500 22px 'Space Grotesk', sans-serif";
  c.fillStyle = "#4a3d22";
  c.fillText("Be it known that the coin below earns creator fees on", W / 2, py + 190);
  c.fillText("every single trade — and this deed keeps the receipts.", W / 2, py + 218);

  // token block
  const ix = px + 110, iy = py + 262, isz = 170;
  c.fillStyle = "#000";
  c.fillRect(ix + 6, iy + 6, isz, isz);
  c.fillStyle = "#1d1d26";
  c.fillRect(ix, iy, isz, isz);
  if (d.imageSrc) {
    try {
      const img = await loadImg(d.imageSrc);
      c.drawImage(img, ix, iy, isz, isz);
    } catch {}
  } else {
    c.fillStyle = "#f2b632";
    c.font = "900 80px Fraunces, serif";
    c.fillText(d.symbol.slice(0, 2).toUpperCase(), ix + isz / 2, iy + isz / 2 + 28);
  }
  c.strokeStyle = ink;
  c.lineWidth = 4;
  c.strokeRect(ix, iy, isz, isz);

  c.textAlign = "left";
  const tx = ix + isz + 40;
  c.fillStyle = ink;
  c.font = "900 54px Fraunces, serif";
  const nm = d.name.length > 18 ? d.name.slice(0, 17) + "…" : d.name;
  c.fillText(nm, tx, iy + 52);
  c.font = "700 30px 'JetBrains Mono', monospace";
  c.fillStyle = "#b07d0c";
  c.fillText(`$${d.symbol.toUpperCase()}`, tx, iy + 94);

  const daily = d.vol24 ? (d.vol24 * d.feePct) / 100 : undefined;
  const stats: [string, string][] = [
    ["MARKET CAP", usd(d.mcap)],
    ["24H VOLUME", usd(d.vol24)],
    ["EST. FEES / DAY", usd(daily)],
  ];
  stats.forEach(([k, v], i) => {
    const sx = tx + i * 205;
    c.fillStyle = "#6b5a33";
    c.font = "600 15px 'JetBrains Mono', monospace";
    c.fillText(k, sx, iy + 140);
    c.fillStyle = ink;
    c.font = "800 30px 'Space Grotesk', sans-serif";
    c.fillText(v, sx, iy + 174);
  });

  // signature line
  c.strokeStyle = ink;
  c.lineWidth = 1.5;
  c.beginPath();
  c.moveTo(px + 110, py + ph - 70);
  c.lineTo(px + 520, py + ph - 70);
  c.stroke();
  c.font = "500 16px 'JetBrains Mono', monospace";
  c.fillStyle = "#4a3d22";
  c.fillText(`CA ${short(d.ca, 8, 8)}`, px + 110, py + ph - 46);
  if (d.owner) c.fillText(`KEEPER ${short(d.owner, 6, 6)}`, px + 110, py + ph - 88);

  // wax seal
  const sx = px + pw - 150, sy = py + ph - 118;
  c.save();
  c.translate(sx, sy);
  c.rotate(-0.2);
  c.fillStyle = "#000";
  c.beginPath();
  c.arc(5, 5, 78, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = "#e5484d";
  c.beginPath();
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 12) {
    const r = a % (Math.PI / 6) === 0 ? 80 : 72;
    c.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  c.closePath();
  c.fill();
  c.strokeStyle = "#7d1418";
  c.lineWidth = 3;
  c.beginPath();
  c.arc(0, 0, 56, 0, Math.PI * 2);
  c.stroke();
  c.fillStyle = "#fff1e6";
  c.textAlign = "center";
  c.font = "900 54px Fraunces, serif";
  c.fillText("D", 0, 18);
  c.font = "700 11px 'JetBrains Mono', monospace";
  c.fillText("SEALED", 0, 44);
  c.restore();

  c.textAlign = "right";
  c.font = "500 14px 'JetBrains Mono', monospace";
  c.fillStyle = "#6b5a33";
  c.fillText(`Issued ${new Date().toISOString().slice(0, 10)} · fee rate ${d.feePct}% (est.)`, px + pw - 50, py + ph - 46);
}
