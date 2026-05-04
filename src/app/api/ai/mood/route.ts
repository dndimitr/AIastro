import { AI_KEY_HELP_BG, completeAssistantText } from "@/lib/ai/llm";
import { moodSystem, moodUserPrompt } from "@/lib/ai/prompts";
import {
  getMoonSignBg,
  getTransitSummaryForPrompt,
} from "@/lib/astrology/transits";
import { parseUserTier } from "@/lib/user-tier";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      tier?: string;
      emoji?: string;
      dayNote?: string;
    };

    const tier = parseUserTier(body.tier);
    if (tier !== "premium") {
      return Response.json(
        {
          error:
            "AI интерпретацията на настроението е само за Премиум. Настройки → Премиум (демо).",
          code: "TIER_PREMIUM_ONLY",
        },
        { status: 403 },
      );
    }

    const emoji = (body.emoji ?? "😐").trim() || "😐";
    const moon = getMoonSignBg(new Date());
    const transits = getTransitSummaryForPrompt(new Date());

    const text = await completeAssistantText({
      system: moodSystem(),
      user: moodUserPrompt({
        emoji,
        moonSign: moon,
        transits,
        dayNote: body.dayNote,
      }),
      maxTokens: 600,
    });

    return Response.json({ text, moonSign: moon });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "UNKNOWN";
    if (msg === "MISSING_API_KEY") {
      return Response.json(
        { error: AI_KEY_HELP_BG, code: "MISSING_API_KEY" },
        { status: 503 },
      );
    }
    console.error("[mood]", e);
    return Response.json(
      { error: "Неуспешна интерпретация.", code: "AI_ERROR" },
      { status: 500 },
    );
  }
}
