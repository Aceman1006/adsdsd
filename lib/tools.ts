export const TOOLS = [
  { id: "deed", name: "Deed Stamper", emoji: "📜", blurb: "Paste any CA, get a wax-sealed Deed of Fees card with live stats. Download it or post it.", tag: "Shareable" },
  { id: "fees", name: "Fee Meter", emoji: "💸", blurb: "Watch fees tick up in real time and project hourly, daily and monthly creator earnings.", tag: "Live" },
  { id: "scan", name: "Trench Scan", emoji: "🔎", blurb: "A 0–100 score from liquidity, buy pressure, momentum, age and socials, in one second.", tag: "Free" },
  { id: "bag", name: "Bag Math", emoji: "💰", blurb: "Entry mcap → now. See your multiple, PnL and the next 2x, 5x and 10x levels.", tag: "Free" },
  { id: "moon", name: "Moon Math", emoji: "🌕", blurb: "What your bag is worth at $1M, $10M, $100M and $1B, using the coin's real supply.", tag: "Free" },
  { id: "duel", name: "CA Duel", emoji: "⚔️", blurb: "Two coins, seven stats, one winner. Built to be screenshotted and posted.", tag: "Shareable" },
] as const;
export type ToolId = (typeof TOOLS)[number]["id"];
