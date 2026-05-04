import { getAnthropicClient } from "@/lib/ai/anthropic";
import { getGeminiClient } from "@/lib/ai/gemini";
import {
  getActiveModelLabel,
  resolveAiProvider,
  type AiProviderId,
} from "@/lib/ai/llm";

export const runtime = "nodejs";

export async function GET() {
  const gemini = Boolean(getGeminiClient());
  const anthropic = Boolean(getAnthropicClient());
  const provider = resolveAiProvider() as AiProviderId | null;
  const ready = Boolean(provider);

  return Response.json({
    ok: true,
    ready,
    provider,
    gemini,
    anthropic,
    model: getActiveModelLabel(),
  });
}
