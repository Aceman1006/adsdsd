export type Deed = {
  ca: string;
  name: string;
  symbol: string;
  image?: string;
  createdAt: number;
  owner?: string;
  sig?: string;
  launchedHere?: boolean;
};

const KEY = "feedeed.deeds.v1";

export function loadDeeds(): Deed[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
export function saveDeed(d: Deed) {
  try {
    const all = loadDeeds().filter((x) => x.ca !== d.ca);
    all.unshift(d);
    localStorage.setItem(KEY, JSON.stringify(all.slice(0, 100)));
  } catch {}
}
export function removeDeed(ca: string) {
  try {
    localStorage.setItem(KEY, JSON.stringify(loadDeeds().filter((x) => x.ca !== ca)));
  } catch {}
}
