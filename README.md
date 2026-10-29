# FEEDEED — feedeed.fun · $DEED

> **Launch a coin. Own the deed. Take the fees.**

Next.js 14 + TypeScript + Tailwind. Deploys to Vercel as-is. There's no database and no API keys to set up.

---

## 1. Put your CA on the site (the only thing you need to do)

Open **`site.config.ts`** and paste your pump.fun CA:

```ts
ca: process.env.NEXT_PUBLIC_CA || "PASTE_YOUR_CA_HERE",
```

**Or, with no code change:** in Vercel → Project → Settings → Environment Variables, add
`NEXT_PUBLIC_CA = <your CA>`, then **Redeploy**.

Once the CA is set, the site automatically shows:
- the copy-CA bar, the "Buy $DEED on pump.fun" button and the Chart button
- live price, market cap, 24h volume and estimated fees (refreshes every 15s)
- pump.fun and DexScreener links in the footer

Before a CA is set, it shows "CA dropping soon" with a Follow button.

Also update the X and Telegram links in `site.config.ts` if your handles differ.

## 2. Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

## 3. Deploy

1. Push this folder to a GitHub repo.
2. In Vercel, import the repo. The defaults are fine.
3. Add the domain `feedeed.fun` under Settings → Domains.
4. Optional env vars: `NEXT_PUBLIC_CA` and `NEXT_PUBLIC_RPC` (a free Helius RPC URL, used only as a fallback).

---

## Pages

| Route | What it does |
|---|---|
| `/` | Hero, CA bar, live $DEED board, how it works, toolbox, why FEEDEED, roadmap |
| `/launch` | Launches a real pump.fun coin from the user's Phantom/Solflare/Backpack wallet |
| `/tools` | The 6-tool toolbox. Deep links work: `/tools?t=scan&ca=<CA>` |
| `/deeds` | Deed Vault: saved/launched coins with live fee estimates (stored in the browser) |

## How the launch works (non-custodial)
1. The image and metadata go to pump.fun IPFS via `/api/ipfs`.
2. `/api/create` asks PumpPortal's free `trade-local` API for an **unsigned** create transaction.
3. The browser generates the mint keypair and signs with it. The user's wallet signs and sends.
4. The coin is saved to the Deed Vault and the user gets a "Stamp & share deed" button.

The user's wallet is the on-chain creator, so creator fees go to them. FEEDEED takes 0%.

## Data sources (free, no keys)
- DexScreener API for live market data
- pump.fun frontend API (proxied) as a fallback for brand-new coins that DexScreener hasn't indexed yet

## Notes
- Fee figures are **estimates**: 24h volume × the fee rate. The default rate is set by `defaultCreatorFeePct` in the config, and users can change it in every tool.
- The Deed Vault is stored per browser (localStorage). A public registry and leaderboard needs a database. It's listed as Roadmap Phase 2 and Supabase would work well for it.
