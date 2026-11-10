"use client";
import { Eye, EyeOff, KeyRound, X } from "lucide-react";
import { useState } from "react";

export function KeyBar({ value, onChange }: { value: string; onChange: (k: string) => void }) {
  const [show, setShow] = useState(false);
  return (
    <div className="card flex items-center gap-3 px-4 py-3">
      <KeyRound className="h-4 w-4 shrink-0 text-muted" strokeWidth={1.75} />
      <input
        type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value.trim())}
        placeholder="Paste your OpenAI API key (sk-...)" autoComplete="off" spellCheck={false}
        className="min-w-0 flex-1 bg-transparent font-mono text-sm outline-none placeholder:font-sans placeholder:text-muted/70"
      />
      <span className="hidden text-xs text-muted sm:inline">Kept in this tab only</span>
      <button onClick={() => setShow(!show)} className="text-muted hover:text-ink" aria-label={show ? "Hide key" : "Show key"}>
        {show ? <EyeOff className="h-4 w-4" strokeWidth={1.75} /> : <Eye className="h-4 w-4" strokeWidth={1.75} />}
      </button>
      {value && (
        <button onClick={() => onChange("")} className="text-muted hover:text-ink" aria-label="Clear key">
          <X className="h-4 w-4" strokeWidth={1.75} />
        </button>
      )}
    </div>
  );
}
