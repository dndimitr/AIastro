import { AI_KEY_HELP_BG, completeAssistantText } from "@/lib/ai/llm";
import {
  horoscopeSystem,
  horoscopeUserPrompt,
} from "@/lib/ai/prompts";
import { getTransitSummaryForPrompt } from "@/lib/astrology/transits";
import { parseUserTier } from "@/lib/user-tier";

export const runtime = "nodejs";

const PERIOD_BG: Record<string, string> = {
  daily: "днес",
  weekly: "за текущата седмица",
  monthly: "за текущия месец",
  yearly: "за текущата година",
};

function maxTokensForTier(tier: ReturnType<typeof parseUserTier>): number {
  if (tier === "guest") return 400;
  if (tier === "free") return 1200;
  return 2800;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      period?: string;
      tier?: string;
      sunSign?: string;
    };

    const period = body.period ?? "daily";
    const periodBg = PERIOD_BG[period] ?? PERIOD_BG.daily;
    const tier = parseUserTier(body.tier);
    const sunSign = (body.sunSign ?? "Лъв").trim() || "Лъв";

    const transits = getTransitSummaryForPrompt(new Date());

    const text = await completeAssistantText({
      system: horoscopeSystem(),
      user: horoscopeUserPrompt({
        periodBg,
        sunSign,
        transits,
        tier,
      }),
      maxTokens: maxTokensForTier(tier),
    });

    return Response.json({ text, period, tier });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "UNKNOWN";
    if (msg === "MISSING_API_KEY") {
      return Response.json(
        { error: AI_KEY_HELP_BG, code: "MISSING_API_KEY" },
        { status: 503 },
      );
    }
    console.error("[horoscope]", e);
    return Response.json(
      { error: "Неуспешно генериране на хороскоп.", code: "AI_ERROR" },
      { status: 500 },
    );
  }
}
