import Anthropic from "@anthropic-ai/sdk";

export function getAnthropicModel(): string {
  return (
    process.env.ANTHROPIC_MODEL?.trim() || "claude-3-5-sonnet-20241022"
  );
}

export function getAnthropicClient(): Anthropic | null {
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  if (!key) return null;
  return new Anthropic({ apiKey: key });
}

export async function anthropicCompleteText(input: {
  system: string;
  user: string;
  maxTokens: number;
}): Promise<string> {
  const client = getAnthropicClient();
  if (!client) {
    throw new Error("MISSING_API_KEY");
  }

  const msg = await client.messages.create({
    model: getAnthropicModel(),
    max_tokens: input.maxTokens,
    system: input.system,
    messages: [{ role: "user", content: input.user }],
  });

  const first = msg.content[0];
  if (!first || first.type !== "text") {
    throw new Error("INVALID_RESPONSE");
  }
  return first.text.trim();
}

export async function anthropicContinueChat(input: {
  system: string;
  messages: { role: "user" | "assistant"; content: string }[];
  maxTokens: number;
}): Promise<string> {
  const client = getAnthropicClient();
  if (!client) {
    throw new Error("MISSING_API_KEY");
  }

  const msg = await client.messages.create({
    model: getAnthropicModel(),
    max_tokens: input.maxTokens,
    system: input.system,
    messages: input.messages,
  });

  const first = msg.content[0];
  if (!first || first.type !== "text") {
    throw new Error("INVALID_RESPONSE");
  }
  return first.text.trim();
}
