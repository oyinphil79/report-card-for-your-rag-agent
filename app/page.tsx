"use client";
import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { KeyBar } from "@/components/KeyBar";
import { Pipeline } from "@/components/Pipeline";
import { Results } from "@/components/Results";
import { TestSet } from "@/components/TestSet";
import { DEFAULT_BOT } from "@/lib/models";
import { runAll, type Result } from "@/lib/runner";
import { CATEGORIES, TESTS, type Category } from "@/lib/tests";

const KEY = "openai-key";

export default function Page() {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState<string>(DEFAULT_BOT);
  const [cats, setCats] = useState(() => new Set<Category>(CATEGORIES.map((c) => c.name)));
  const [results, setResults] = useState(new Map<number, Result>());
  const [running, setRunning] = useState(false);

  useEffect(() => { try { setApiKey(sessionStorage.getItem(KEY) ?? ""); } catch {} }, []);
  const saveKey = (k: string) => { setApiKey(k); try { k ? sessionStorage.setItem(KEY, k) : sessionStorage.removeItem(KEY); } catch {} };

  const tests = useMemo(() => TESTS.filter((t) => cats.has(t.category)), [cats]);
  const toggle = (c: Category) => setCats((s) => { const n = new Set(s); n.has(c) ? n.delete(c) : n.add(c); return n; });

  async function run() {
    setRunning(true);
    setResults(new Map());
    await runAll(tests, apiKey, model, (r) => setResults((m) => new Map(m).set(r.id, r)));
    setRunning(false);
  }

  return (
    <main className="mx-auto grid max-w-4xl gap-5 px-4 py-12 sm:px-6 sm:py-16">
      <Header model={model} onModel={setModel} disabled={running} />
      <KeyBar value={apiKey} onChange={saveKey} />
      <TestSet selected={cats} onToggle={toggle} onRun={run} running={running} canRun={!!apiKey && tests.length > 0} count={tests.length} />
      <Pipeline results={[...results.values()]} total={tests.length} />
      <Results tests={tests} results={results} />
    </main>
  );
}
