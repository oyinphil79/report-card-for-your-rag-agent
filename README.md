# RAG Report Card

Twenty questions from your Day 4 documents, a pass rate, and a judge that checks every answer sticks to the source.

A small Next.js (App Router) + TypeScript + Tailwind app that grades a RAG agent with OpenAI. No database, no login.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000, paste your OpenAI API key and click **Run**. The key stays in `sessionStorage` (`openai-key`) and goes to the API routes only as the `x-openai-key` header. It is never saved or logged.

## How a question is graded

1. **Retrieve.** A keyword retriever (`lib/retrieve.ts`) picks the top 4 document sections.
2. **Answer** (`POST /api/answer`). One bot call. The bot must cite every claim as `[section-id]`, answer only from the sources, and give the exact refusal line when the answer isn't in them.
3. **Code checks** (`lib/checks.ts`), in plain code:
   - the reply is under 80 words
   - every number in the reply appears in the retrieved sources (or in the test's `allowNumbers`)
   - answer tests cite at least one source, and only sources that were retrieved; refusal tests give the refusal line and cite nothing
4. **Judge** (`POST /api/judge`). One call to a cheaper model with strict JSON output (`reason`, then `pass`). It sees the question, the retrieved sources, the pass rule and the reply, and is told to treat all of them as data.

A question **passes only if all three checks and the judge pass**.

## Files

| Path | What |
| --- | --- |
| `lib/docs.ts` | The Day 4 documents, split into sections. **Swap in your own here.** |
| `lib/tests.ts` | The 20 test cases: question, category, expected behaviour, written pass rule |
| `lib/prompt.ts` | The bot's system prompt |
| `lib/models.ts` | Bot models (default plus a comparison model), judge model, word limit, refusal line |
| `lib/openai.ts` | Bot and judge calls (server only) |
| `lib/checks.ts`, `lib/retrieve.ts`, `lib/runner.ts` | Code checks, retriever, client pipeline |
| `components/` | Header, key bar, test set, 4-step pipeline, results |

The sample documents are a fictional company handbook. One section contains a planted prompt injection, which tests 19 and 20 use.
