// Client-side pipeline for one test: retrieve → answer → code checks → judge.
import { byId } from "./docs";
import { runChecks, type Check } from "./checks";
import { retrieve } from "./retrieve";
import type { TestCase } from "./tests";

export type Step = "retrieve" | "answer" | "checks" | "judge";
export type Result = {
  id: number; step: Step | "done" | "error";
  reply?: string; ms?: number; sourceIds?: string[];
  checks?: Check[]; judge?: { reason: string; pass: boolean };
  pass?: boolean; error?: string;
};

async function post<T>(url: string, key: string, body: unknown): Promise<T> {
  const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json", "x-openai-key": key }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`);
  return data as T;
}

export async function runTest(test: TestCase, key: string, model: string, update: (r: Result) => void) {
  let r: Result = { id: test.id, step: "retrieve" };
  const set = (patch: Partial<Result>) => update((r = { ...r, ...patch }));
  try {
    set({ step: "retrieve", sourceIds: retrieve(test.question).map((s) => s.id) }); // preview; server retrieves the same way
    set({ step: "answer" });
    const a = await post<{ reply: string; ms: number; sourceIds: string[] }>("/api/answer", key, { question: test.question, model });
    set({ step: "checks", reply: a.reply, ms: a.ms, sourceIds: a.sourceIds });
    const checks = runChecks(a.reply, test, a.sourceIds.map(byId).filter((s) => s !== undefined));
    set({ step: "judge", checks });
    const judge = await post<{ reason: string; pass: boolean }>("/api/judge", key, { testId: test.id, reply: a.reply, sourceIds: a.sourceIds });
    set({ step: "done", judge, pass: judge.pass && checks.every((c) => c.pass) });
  } catch (e) {
    set({ step: "error", pass: false, error: e instanceof Error ? e.message : "Failed" });
  }
}

export async function runAll(tests: TestCase[], key: string, model: string, update: (r: Result) => void, concurrency = 3) {
  const queue = [...tests];
  await Promise.all(Array.from({ length: concurrency }, async () => {
    for (let t = queue.shift(); t; t = queue.shift()) await runTest(t, key, model, update);
  }));
}
