export type UserTier = "guest" | "free" | "premium";

export function parseUserTier(raw: unknown): UserTier {
  if (raw === "free" || raw === "premium" || raw === "guest") return raw;
  return "guest";
}
