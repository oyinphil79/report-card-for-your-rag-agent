// Plain-code checks that run before the judge. All three must pass.
import type { Section } from "./docs";
import type { TestCase } from "./tests";
import { MAX_WORDS } from "./models";

export type Check = { name: string; pass: boolean; detail: string };

const CITE = /\[([a-z]+-\d+)\]/g;
const NUM = /\d+(?:[.,:]\d+)*/g;
const nums = (s: string) => (s.match(NUM) ?? []).map((n) => n.replace(/,/g, ""));
// Matches REFUSAL, tolerating curly or missing apostrophes.
const REFUSAL_RE = /can[’']?t find that in the day 4 documents/gi;
const isRefusal = (r: string) => r.search(REFUSAL_RE) !== -1;

export function runChecks(reply: string, test: TestCase, sources: Section[]): Check[] {
  const words = reply.trim().split(/\s+/).filter(Boolean).length;
  const cited = [...reply.matchAll(CITE)].map((m) => m[1]);
  const prose = reply.replace(CITE, "").replace(REFUSAL_RE, ""); // "Day 4" is not a claim
  const allowed = new Set([...sources.flatMap((s) => nums(s.text)), ...(test.allowNumbers ?? [])]);
  const stray = nums(prose).filter((n) => !allowed.has(n));
  const ids = new Set(sources.map((s) => s.id));
  const badCites = cited.filter((c) => !ids.has(c));

  let cite: Check;
  if (test.expect === "refuse") {
    const ok = isRefusal(reply) && cited.length === 0;
    cite = { name: "Refuses", pass: ok, detail: ok ? "gave the refusal line" : "expected the refusal line with no citations" };
  } else {
    const ok = cited.length > 0 && badCites.length === 0 && !isRefusal(reply);
    cite = { name: "Cites sources", pass: ok, detail: ok ? `cites ${[...new Set(cited)].join(", ")}` : badCites.length ? `cites unretrieved ${badCites.join(", ")}` : "no valid citation" };
  }

  return [
    { name: `Under ${MAX_WORDS} words`, pass: words < MAX_WORDS, detail: `${words} words` },
    { name: "Numbers in source", pass: stray.length === 0, detail: stray.length ? `not in sources: ${stray.join(", ")}` : "all numbers grounded" },
    cite,
  ];
}
