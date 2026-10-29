export type TokenInfo = {
  ca: string;
  name: string;
  symbol: string;
  image?: string;
  priceUsd?: number;
  mcap?: number;
  liquidity?: number;
  vol24?: number;
  vol1h?: number;
  change5m?: number;
  change1h?: number;
  change24h?: number;
  buys24?: number;
  sells24?: number;
  createdAt?: number;
  dex?: string;
  pairUrl?: string;
  socials: { type: string; url: string }[];
  websites: string[];
  source: "dexscreener" | "pump";
  bondingComplete?: boolean;
};

const cache = new Map<string, { t: number; v: TokenInfo | null }>();

/** Live token data. DexScreener first (free, no key), pump.fun fallback for brand-new coins. */
export async function getToken(ca: string): Promise<TokenInfo | null> {
  ca = ca.trim();
  const hit = cache.get(ca);
  if (hit && Date.now() - hit.t < 10000) return hit.v;

  let v: TokenInfo | null = null;
  try {
    const r = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${ca}`, { cache: "no-store" });
    const j = await r.json();
    const pairs = (j?.pairs || []).filter((p: any) => p.chainId === "solana");
    if (pairs.length) {
      pairs.sort((a: any, b: any) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0) || (b.volume?.h24 || 0) - (a.volume?.h24 || 0));
      const p = pairs[0];
      const base = p.baseToken?.address === ca ? p.baseToken : p.quoteToken;
      const vol24 = pairs.reduce((s: number, x: any) => s + (x.volume?.h24 || 0), 0);
      const vol1h = pairs.reduce((s: number, x: any) => s + (x.volume?.h1 || 0), 0);
      v = {
        ca,
        name: base?.name || "Unknown",
        symbol: base?.symbol || "???",
        image: p.info?.imageUrl,
        priceUsd: p.priceUsd ? +p.priceUsd : undefined,
        mcap: p.marketCap ?? p.fdv,
        liquidity: p.liquidity?.usd,
        vol24,
        vol1h,
        change5m: p.priceChange?.m5,
        change1h: p.priceChange?.h1,
        change24h: p.priceChange?.h24,
        buys24: p.txns?.h24?.buys,
        sells24: p.txns?.h24?.sells,
        createdAt: p.pairCreatedAt,
        dex: p.dexId,
        pairUrl: p.url,
        socials: p.info?.socials || [],
        websites: (p.info?.websites || []).map((w: any) => w.url),
        source: "dexscreener",
      };
    }
  } catch {}

  if (!v) {
    try {
      const r = await fetch(`/api/pump/${ca}`, { cache: "no-store" });
      if (r.ok) {
        const c = await r.json();
        if (c && c.mint) {
          v = {
            ca,
            name: c.name,
            symbol: c.symbol,
            image: c.image_uri,
            mcap: c.usd_market_cap,
            priceUsd: c.usd_market_cap && c.total_supply ? c.usd_market_cap / (c.total_supply / 1e6) : undefined,
            createdAt: c.created_timestamp,
            dex: c.complete ? "pumpswap" : "pump.fun",
            socials: [
              ...(c.twitter ? [{ type: "twitter", url: c.twitter }] : []),
              ...(c.telegram ? [{ type: "telegram", url: c.telegram }] : []),
            ],
            websites: c.website ? [c.website] : [],
            source: "pump",
            bondingComplete: !!c.complete,
          };
        }
      }
    } catch {}
  }

  cache.set(ca, { t: Date.now(), v });
  return v;
}

/** proxied image URL so canvas exports don't get tainted */
export const proxImg = (url?: string) => (url ? `/api/img?url=${encodeURIComponent(url)}` : undefined);
