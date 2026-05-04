import { AI_KEY_HELP_BG, completeAssistantText } from "@/lib/ai/llm";
import {
  compatibilitySystem,
  compatibilityUser,
} from "@/lib/ai/prompts";
import { ZODIAC_BG } from "@/lib/zodiac";
import { parseUserTier } from "@/lib/user-tier";

export const runtime = "nodejs";

function normalizeSign(s: string | undefined): string | null {
  if (!s?.trim()) return null;
  const t = s.trim();
  if ((ZODIAC_BG as readonly string[]).includes(t)) return t;
  return null;
}

function maxTokens(tier: ReturnType<typeof parseUserTier>): number {
  return tier === "premium" ? 3200 : 1400;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      tier?: string;
      signA?: string;
      signB?: string;
    };

    const tier = parseUserTier(body.tier);
    const a = normalizeSign(body.signA);
    const b = normalizeSign(body.signB);

    if (!a || !b) {
      return Response.json(
        {
          error: "Избери двете зодии от списъка.",
          code: "BAD_REQUEST",
        },
        { status: 400 },
      );
    }

    const text = await completeAssistantText({
      system: compatibilitySystem(),
      user: compatibilityUser({ a, b, tier }),
      maxTokens: maxTokens(tier),
    });

    return Response.json({ text });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "UNKNOWN";
    if (msg === "MISSING_API_KEY") {
      return Response.json(
        { error: AI_KEY_HELP_BG, code: "MISSING_API_KEY" },
        { status: 503 },
      );
    }
    console.error("[compatibility]", e);
    return Response.json(
      { error: "Неуспешен анализ.", code: "AI_ERROR" },
      { status: 500 },
    );
  }
}
