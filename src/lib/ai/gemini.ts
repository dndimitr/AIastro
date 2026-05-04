import { GoogleGenerativeAI } from "@google/generative-ai";

export function getGeminiModelId(): string {
  return process.env.GEMINI_MODEL?.trim() || "gemini-2.0-flash";
}

export function getGeminiClient(): GoogleGenerativeAI | null {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) return null;
  return new GoogleGenerativeAI(key);
}

export async function geminiCompleteText(input: {
  system: string;
  user: string;
  maxTokens: number;
}): Promise<string> {
  const genAI = getGeminiClient();
  if (!genAI) {
    throw new Error("MISSING_API_KEY");
  }

  const model = genAI.getGenerativeModel({
    model: getGeminiModelId(),
    systemInstruction: input.system,
    generationConfig: {
      maxOutputTokens: input.maxTokens,
      temperature: 0.7,
    },
  });

  const result = await model.generateContent(input.user);
  const text = result.response.text();
  if (!text?.trim()) {
    throw new Error("INVALID_RESPONSE");
  }
  return text.trim();
}

export async function geminiContinueChat(input: {
  system: string;
  messages: { role: "user" | "assistant"; content: string }[];
  maxTokens: number;
}): Promise<string> {
  const genAI = getGeminiClient();
  if (!genAI) {
    throw new Error("MISSING_API_KEY");
  }

  const model = genAI.getGenerativeModel({
    model: getGeminiModelId(),
    systemInstruction: input.system,
    generationConfig: {
      maxOutputTokens: input.maxTokens,
      temperature: 0.7,
    },
  });

  const msgs = input.messages;
  const last = msgs[msgs.length - 1];
  if (!last || last.role !== "user") {
    throw new Error("BAD_REQUEST");
  }

  const history = msgs.slice(0, -1).map((m) => ({
    role: m.role === "user" ? ("user" as const) : ("model" as const),
    parts: [{ text: m.content }],
  }));

  const chat = model.startChat({ history });
  const result = await chat.sendMessage(last.content);
  const text = result.response.text();
  if (!text?.trim()) {
    throw new Error("INVALID_RESPONSE");
  }
  return text.trim();
}
