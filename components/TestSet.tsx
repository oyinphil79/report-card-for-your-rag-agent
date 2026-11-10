import { Loader2, Play } from "lucide-react";
import { CATEGORIES, TESTS, type Category } from "@/lib/tests";

type Props = { selected: Set<Category>; onToggle: (c: Category) => void; onRun: () => void; running: boolean; canRun: boolean; count: number };

export function TestSet({ selected, onToggle, onRun, running, canRun, count }: Props) {
  return (
    <section className="card p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-medium">Test set</h2>
          <p className="text-sm text-muted">{count} of {TESTS.length} questions selected · 16 sections across 5 Day 4 documents</p>
        </div>
        <button onClick={onRun} disabled={!canRun || running}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-40">
          {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" strokeWidth={1.75} />}
          {running ? "Running" : "Run"}
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => {
          const on = selected.has(c.name);
          const n = TESTS.filter((t) => t.category === c.name).length;
          return (
            <button key={c.name} onClick={() => onToggle(c.name)} disabled={running}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${on ? "border-ink/15 bg-white text-ink shadow-sm" : "border-line bg-transparent text-muted/70"}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${c.dot} ${on ? "" : "opacity-30"}`} />
              {c.name} <span className="text-muted">{n}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
