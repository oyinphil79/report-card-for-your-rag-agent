import { Bot, Code2, Scale, Search } from "lucide-react";
import type { Result, Step } from "@/lib/runner";

const STEPS: { id: Step; label: string; sub: string; Icon: typeof Bot }[] = [
  { id: "retrieve", label: "Retrieve", sub: "top 4 sections", Icon: Search },
  { id: "answer", label: "Answer", sub: "bot call", Icon: Bot },
  { id: "checks", label: "Code checks", sub: "length · numbers · citations", Icon: Code2 },
  { id: "judge", label: "Judge", sub: "grounded + rule", Icon: Scale },
];

export function Pipeline({ results, total }: { results: Result[]; total: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {STEPS.map(({ id, label, sub, Icon }, i) => {
        const active = results.some((r) => r.step === id);
        const passed = results.filter((r) => r.step === "done" || STEPS.findIndex((s) => s.id === r.step) > i).length;
        return (
          <div key={id} className={`card flex items-center gap-3 px-4 py-3 transition ${active ? "ring-2 ring-emerald-300/70" : ""}`}>
            <span className={`grid h-8 w-8 place-items-center rounded-full transition ${active ? "bg-ink text-white" : "bg-page text-muted"}`}>
              <Icon className={`h-4 w-4 ${active ? "animate-pulse" : ""}`} strokeWidth={1.75} />
            </span>
            <div className="min-w-0">
              <div className="text-sm font-medium">{label} <span className="font-normal text-muted">{results.length ? `${passed}/${total}` : ""}</span></div>
              <div className="truncate text-xs text-muted">{sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
