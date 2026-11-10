export const BOT_MODELS = [
  { id: "gpt-5.4-mini", label: "GPT-5.4 mini", note: "fast" },
  { id: "gpt-5.5", label: "GPT-5.5", note: "compare" },
] as const;
export const DEFAULT_BOT = BOT_MODELS[0].id;
export const JUDGE_MODEL = "gpt-5.4-nano"; // cheap judge, never changes
export const MAX_WORDS = 80;
export const REFUSAL = "I can't find that in the Day 4 documents.";
