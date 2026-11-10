import { ClipboardCheck } from "lucide-react";
import { BOT_MODELS } from "@/lib/models";

export function Header({ model, onModel, disabled }: { model: string; onModel: (m: string) => void; disabled: boolean }) {
  return (
    <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-3 flex items-center gap-2 text-sm text-muted">
          <ClipboardCheck className="h-4 w-4" strokeWidth={1.75} /> RAG Report Card
        </div>
        <h1 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">Is your RAG agent actually right?</h1>
        <p className="mt-2 max-w-xl text-muted">
          Twenty questions from your Day 4 documents, a pass rate, and a judge that checks every answer sticks to the source.
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1 rounded-full border border-line bg-white p-1 shadow-sm">
        {BOT_MODELS.map((m) => (
          <button key={m.id} disabled={disabled} onClick={() => onModel(m.id)}
            className={`rounded-full px-3.5 py-1.5 text-sm transition disabled:opacity-60 ${model === m.id ? "bg-ink text-white" : "text-muted hover:text-ink"}`}>
            {m.label} <span className="opacity-60">· {m.note}</span>
          </button>
        ))}
      </div>
    </header>
  );
}
