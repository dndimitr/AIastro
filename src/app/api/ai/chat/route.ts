import { AI_KEY_HELP_BG, continueChat } from "@/lib/ai/llm";
import { chatSystem } from "@/lib/ai/prompts";
import { parseUserTier } from "@/lib/user-tier";

export const runtime = "nodejs";

function maxTokensForTier(tier: ReturnType<typeof parseUserTier>): number {
  if (tier === "guest") return 700;
  if (tier === "free") return 1400;
  return 2200;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      tier?: string;
      messages?: { role: string; content: string }[];
    };

    const tier = parseUserTier(body.tier);
    if (tier === "guest") {
      return Response.json(
        {
          error:
            "Чатът с AI е достъпен от ниво „Безплатен“ нагоре. Отвори Настройки и смени нивото (демо).",
          code: "TIER_GUEST",
        },
        { status: 403 },
      );
    }

    const raw = body.messages ?? [];
    const messages = raw
      .filter(
        (m): m is { role: "user" | "assistant"; content: string } =>
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.trim().length > 0,
      )
      .map((m) => ({ role: m.role, content: m.content.trim() }));

    if (messages.length === 0 || messages[messages.length - 1]?.role !== "user") {
      return Response.json(
        { error: "Очаква се поне едно съобщение от потребителя.", code: "BAD_REQUEST" },
        { status: 400 },
      );
    }

    if (messages[0].role !== "user") {
      return Response.json(
        {
          error: "Първото съобщение трябва да е от потребителя.",
          code: "BAD_REQUEST",
        },
        { status: 400 },
      );
    }

    for (let i = 1; i < messages.length; i++) {
      if (messages[i].role === messages[i - 1].role) {
        return Response.json(
          { error: "Съобщенията трябва да се редуват user/assistant.", code: "BAD_REQUEST" },
          { status: 400 },
        );
      }
    }

    const reply = await continueChat({
      system: chatSystem(),
      messages,
      maxTokens: maxTokensForTier(tier),
    });

    return Response.json({ reply });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "UNKNOWN";
    if (msg === "MISSING_API_KEY") {
      return Response.json(
        { error: AI_KEY_HELP_BG, code: "MISSING_API_KEY" },
        { status: 503 },
      );
    }
    console.error("[chat]", e);
    return Response.json(
      { error: "Неуспешен отговор от AI.", code: "AI_ERROR" },
      { status: 500 },
    );
  }
}
