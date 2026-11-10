import { NextResponse } from "next/server";
import { BOT_MODELS, DEFAULT_BOT } from "@/lib/models";
import { askBot, errorMessage } from "@/lib/openai";
import { retrieve } from "@/lib/retrieve";

export async function POST(req: Request) {
  const key = req.headers.get("x-openai-key");
  if (!key) return NextResponse.json({ error: "Missing API key." }, { status: 401 });
  const { question, model } = await req.json();
  if (typeof question !== "string" || !question.trim()) return NextResponse.json({ error: "Missing question." }, { status: 400 });
  const bot = BOT_MODELS.some((m) => m.id === model) ? model : DEFAULT_BOT;

  const sources = retrieve(question);
  const started = Date.now();
  try {
    const reply = await askBot(key, bot, question, sources);
    return NextResponse.json({ reply, ms: Date.now() - started, sourceIds: sources.map((s) => s.id) });
  } catch (e) {
    const { status, message } = errorMessage(e);
    return NextResponse.json({ error: message }, { status });
  }
}
