import type { Result } from "@/lib/runner";

export function Summary({ results, total }: { results: Result[]; total: number }) {
  const done = results.filter((r) => r.step === "done" || r.step === "error");
  const passed = done.filter((r) => r.pass).length;
  const rate = done.length ? Math.round((passed / done.length) * 100) : 0;
  const codeOk = done.filter((r) => r.checks?.every((c) => c.pass)).length;
  const judgeOk = done.filter((r) => r.judge?.pass).length;
  const times = results.flatMap((r) => (r.ms ? [r.ms] : []));
  const avg = times.length ? (times.reduce((a, b) => a + b, 0) / times.length / 1000).toFixed(1) : "–";

  return (
    <section className="card p-6">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="text-sm text-muted">Pass rate</div>
          <div className="text-6xl font-semibold tracking-tight tabular-nums">{done.length ? `${rate}%` : "–"}</div>
          <div className="mt-1 text-sm text-muted">{passed} of {done.length} passed{done.length < total ? ` · ${total - done.length} to go` : ""}</div>
        </div>
        <dl className="grid grid-cols-3 gap-8 text-sm">
          <Stat label="Code checks" value={`${codeOk}/${done.length}`} />
          <Stat label="Judge" value={`${judgeOk}/${done.length}`} />
          <Stat label="Avg reply" value={`${avg}s`} />
        </dl>
      </div>
      <div className="mt-6 flex h-2 overflow-hidden rounded-full bg-page">
        <div className="bg-emerald-400 transition-all duration-500" style={{ width: `${(passed / total) * 100}%` }} />
        <div className="bg-rose-300 transition-all duration-500" style={{ width: `${((done.length - passed) / total) * 100}%` }} />
      </div>
      <div className="mt-2 flex gap-4 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Passed {passed}</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-rose-300" />Failed {done.length - passed}</span>
      </div>
    </section>
  );
}

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div><dt className="text-muted">{label}</dt><dd className="mt-0.5 text-xl font-medium tabular-nums">{value}</dd></div>
);
