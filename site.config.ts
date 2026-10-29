/**
 * ============================================================
 *  FEEDEED — SITE CONFIG
 *  This is the ONLY file you need to edit after launch.
 *  Paste your pump.fun contract address into `ca` and redeploy.
 *  (Or set NEXT_PUBLIC_CA in Vercel env vars — that wins if set.)
 * ============================================================
 */
export const SITE = {
  name: "FEEDEED",
  ticker: "DEED",
  domain: "feedeed.fun",
  tagline: "Own the deed. Take the fees.",

  // 👇 PASTE YOUR CA HERE (leave "" until launch — site shows "CA dropping soon")
  ca: process.env.NEXT_PUBLIC_CA || "",

  links: {
    x: "https://x.com/FEEDEEDFUN",
    telegram: "https://t.me/feedeedfun",
    // pump.fun / dexscreener links are built automatically from the CA
  },

  // Creator-fee rate used by the Fee Calculator + Deeds as a default estimate.
  // Users can change it on the page. 0.05 = 0.05%.
  defaultCreatorFeePct: 0.05,

  // Only used as a fallback if a wallet can't send transactions itself (Phantom/Solflare can).
  // A free Helius RPC URL works great here.
  rpc: process.env.NEXT_PUBLIC_RPC || "https://api.mainnet-beta.solana.com",
};

export const pumpUrl = (ca: string) => `https://pump.fun/coin/${ca}`;
export const dexUrl = (ca: string) => `https://dexscreener.com/solana/${ca}`;
export const solscanUrl = (ca: string) => `https://solscan.io/token/${ca}`;
