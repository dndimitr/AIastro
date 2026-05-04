import { anthropicCompleteText, anthropicContinueChat } from "@/lib/ai/anthropic";
import { geminiCompleteText, geminiContinueChat } from "@/lib/ai/gemini";

export type AiProviderId = "gemini" | "anthropic";

/** Съобщение за UI при липса на ключове. */
export const AI_KEY_HELP_BG =
  "Задай GEMINI_API_KEY или ANTHROPIC_API_KEY в .env.local. При налични два ключа използвай AI_PROVIDER=gemini или anthropic. Рестартирай npm run dev.";

/**
 * Избор на LLM: AI_PROVIDER=gemini|anthropic.
 * Ако липсва: при два ключа по подразбиране е anthropic; при един — този провайдър.
 */
export function resolveAiProvider(): AiProviderId | null {
  const explicit = process.env.AI_PROVIDER?.trim().toLowerCase();
  if (explicit === "gemini" || explicit === "anthropic") {
    return explicit;
  }

  const hasGemini = Boolean(process.env.GEMINI_API_KEY?.trim());
  const hasAnthropic = Boolean(process.env.ANTHROPIC_API_KEY?.trim());

  if (hasAnthropic && hasGemini) return "anthropic";
  if (hasAnthropic) return "anthropic";
  if (hasGemini) return "gemini";
  return null;
}

export function getActiveModelLabel(): string {
  const p = resolveAiProvider();
  if (p === "gemini") {
    return process.env.GEMINI_MODEL?.trim() || "gemini-2.0-flash";
  }
  if (p === "anthropic") {
    return (
      process.env.ANTHROPIC_MODEL?.trim() || "claude-3-5-sonnet-20241022"
    );
  }
  return "—";
}

export async function completeAssistantText(input: {
  system: string;
  user: string;
  maxTokens: number;
}): Promise<string> {
  const provider = resolveAiProvider();
  if (!provider) {
    throw new Error("MISSING_API_KEY");
  }
  if (provider === "gemini") {
    return geminiCompleteText(input);
  }
  return anthropicCompleteText(input);
}

export async function continueChat(input: {
  system: string;
  messages: { role: "user" | "assistant"; content: string }[];
  maxTokens: number;
}): Promise<string> {
  const provider = resolveAiProvider();
  if (!provider) {
    throw new Error("MISSING_API_KEY");
  }
  if (provider === "gemini") {
    return geminiContinueChat(input);
  }
  return anthropicContinueChat(input);
}
