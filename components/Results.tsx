import type { Result } from "@/lib/runner";
import type { TestCase } from "@/lib/tests";
import { ResultRow } from "./ResultRow";
import { Summary } from "./Summary";

export function Results({ tests, results }: { tests: TestCase[]; results: Map<number, Result> }) {
  return (
    <div className="grid gap-4">
      <Summary results={[...results.values()]} total={tests.length} />
      <ul className="card overflow-hidden">
        {tests.map((t) => <ResultRow key={t.id} test={t} result={results.get(t.id)} />)}
      </ul>
    </div>
  );
}
