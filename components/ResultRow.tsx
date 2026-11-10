"use client";
import { ChevronDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { byId } from "@/lib/docs";
import type { Result } from "@/lib/runner";
import { CATEGORIES, type TestCase } from "@/lib/tests";

export function ResultRow({ test, result }: { test: TestCase; result?: Result }) {
  const [open, setOpen] = useState(false);
  const finished = result?.step === "done" || result?.step === "error";
  const dot = CATEGORIES.find((c) => c.name === test.category)?.dot;

  return (
    <li className="border-b border-line last:border-0">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center gap-4 px-5 py-3.5 text-left hover:bg-page/60">
        <span className="w-5 text-xs tabular-nums text-muted">{test.id}</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm">{test.question}</span>
          <span className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-muted"><span className={`h-1.5 w-1.5 rounded-full ${dot}`} />{test.category}</span>
        </span>
        {result?.ms && <span className="hidden text-xs tabular-nums text-muted sm:inline">{(result.ms / 1000).toFixed(1)}s</span>}
        <Pill result={result} finished={finished} />
        <ChevronDown className={`h-4 w-4 text-muted transition ${open ? "rotate-180" : ""}`} strokeWidth={1.75} />
      </button>
      {open && (
        <div className="grid gap-4 px-5 pb-5 pl-14 text-sm">
          {result?.error && <p className="text-rose-600">{result.error}</p>}
          <Field label="Bot reply">{result?.reply ?? <span className="text-muted">Not run yet.</span>}</Field>
          {result?.judge && <Field label="Judge's reason">{result.judge.reason}</Field>}
          {result?.checks && (
            <div className="flex flex-wrap gap-2">
              {result.checks.map((c) => (
                <span key={c.name} title={c.detail} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-page px-2.5 py-1 text-xs">
                  <span className={`h-1.5 w-1.5 rounded-full ${c.pass ? "bg-emerald-400" : "bg-rose-400"}`} />{c.name}<span className="text-muted">· {c.detail}</span>
                </span>
              ))}
            </div>
          )}
          {result?.sourceIds && (
            <Field label="Retrieved sources">
              <span className="flex flex-wrap gap-1.5">
                {result.sourceIds.map((id) => (
                  <span key={id} title={byId(id)?.text} className="rounded-md bg-page px-2 py-0.5 font-mono text-xs">{id} <span className="font-sans text-muted">{byId(id)?.title}</span></span>
                ))}
                {!result.sourceIds.length && <span className="text-muted">none matched</span>}
              </span>
            </Field>
          )}
          <Field label="Pass rule">{test.rule}</Field>
        </div>
      )}
    </li>
  );
}

function Pill({ result, finished }: { result?: Result; finished: boolean }) {
  if (!result) return <span className="rounded-full bg-page px-2.5 py-0.5 text-xs text-muted">Queued</span>;
  if (!finished) return <span className="inline-flex items-center gap-1 rounded-full bg-page px-2.5 py-0.5 text-xs text-muted"><Loader2 className="h-3 w-3 animate-spin" />{result.step}</span>;
  return result.pass
    ? <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">PASS</span>
    : <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700 ring-1 ring-rose-200">FAIL</span>;
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div><div className="mb-1 text-xs uppercase tracking-wide text-muted">{label}</div><div className="leading-relaxed">{children}</div></div>
);
