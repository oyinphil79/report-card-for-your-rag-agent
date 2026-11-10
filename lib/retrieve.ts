// Tiny keyword retriever (BM25-lite). Plain code, deterministic, runs on client and server.
import { DOCS, type Section } from "./docs";

const STOP = new Set("a an the is are do does did i we our my you your of to in on for and or can what how many much when who with at be it this that from per get by any".split(" "));
const tokens = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((t) => t && !STOP.has(t)).map((t) => t.replace(/s$/, ""));

const docTokens = DOCS.map((s) => tokens(`${s.doc} ${s.title} ${s.text}`));
const df = new Map<string, number>();
docTokens.forEach((ts) => new Set(ts).forEach((t) => df.set(t, (df.get(t) ?? 0) + 1)));
const idf = (t: string) => Math.log(1 + DOCS.length / (df.get(t) ?? DOCS.length));

export function retrieve(question: string, k = 4): Section[] {
  const q = new Set(tokens(question));
  return DOCS.map((s, i) => ({ s, score: docTokens[i].filter((t) => q.has(t)).reduce((a, t) => a + idf(t), 0) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((r) => r.s);
}
