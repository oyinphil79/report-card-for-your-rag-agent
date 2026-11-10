import { NextResponse } from "next/server";
import { byId } from "@/lib/docs";
import { errorMessage, judge } from "@/lib/openai";
import { TESTS } from "@/lib/tests";

export async function POST(req: Request) {
  const key = req.headers.get("x-openai-key");
  if (!key) return NextResponse.json({ error: "Missing API key." }, { status: 401 });
  const { testId, reply, sourceIds } = await req.json();
  const test = TESTS.find((t) => t.id === testId);
  if (!test || typeof reply !== "string") return NextResponse.json({ error: "Bad request." }, { status: 400 });
  // Sources are looked up server-side from ids, so the client cannot feed the judge fake context.
  const sources = (Array.isArray(sourceIds) ? sourceIds : []).map(byId).filter((s) => s !== undefined);

  try {
    return NextResponse.json(await judge(key, { question: test.question, rule: test.rule, reply, sources }));
  } catch (e) {
    const { status, message } = errorMessage(e);
    return NextResponse.json({ error: message }, { status });
  }
}
