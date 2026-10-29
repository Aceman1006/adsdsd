export const usd = (n?: number | null, digits = 2) => {
  if (n === undefined || n === null || !isFinite(n)) return "—";
  const a = Math.abs(n);
  if (a >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (a >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (a >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  if (a > 0 && a < 0.01) return `$${n.toPrecision(3)}`;
  return `$${n.toFixed(digits)}`;
};

export const price = (n?: number | null) => {
  if (n === undefined || n === null || !isFinite(n)) return "—";
  if (n >= 1) return `$${n.toFixed(4)}`;
  // show tiny prices like $0.0₅1234
  const s = n.toFixed(20);
  const m = s.match(/^0\.(0*)(\d{1,4})/);
  if (!m) return `$${n}`;
  const zeros = m[1].length;
  if (zeros < 4) return `$${n.toPrecision(4)}`;
  const sub = String(zeros).split("").map((d) => "₀₁₂₃₄₅₆₇₈₉"[+d]).join("");
  return `$0.0${sub}${m[2]}`;
};

export const short = (s: string, a = 4, b = 4) => (s.length > a + b + 3 ? `${s.slice(0, a)}…${s.slice(-b)}` : s);

export const pct = (n?: number | null) =>
  n === undefined || n === null || !isFinite(n) ? "—" : `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;

export const age = (ms?: number) => {
  if (!ms) return "—";
  const d = Date.now() - ms;
  const m = Math.floor(d / 60000);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 48) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
};

export const isCA = (s: string) => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(s.trim());

/** deterministic "deed number" from a CA */
export const deedNo = (ca: string) => {
  let h = 2166136261;
  for (let i = 0; i < ca.length; i++) {
    h ^= ca.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return String((h >>> 0) % 1000000).padStart(6, "0");
};
