"use client";

import { Settings } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUser, type UserTier } from "@/contexts/user-context";
import { cn } from "@/lib/utils";

const TIERS: { id: UserTier; label: string; hint: string }[] = [
  {
    id: "guest",
    label: "Гост",
    hint: "Локално съхранение, ограничен хороскоп.",
  },
  {
    id: "free",
    label: "Безплатен",
    hint: "Firebase профил (скоро) — дневен хороскоп и дневник.",
  },
  {
    id: "premium",
    label: "Премиум",
    hint: "Пълен достъп, AI чат и интерпретации.",
  },
];

type HealthPayload = {
  ready?: boolean;
  provider?: "gemini" | "anthropic" | null;
  gemini?: boolean;
  anthropic?: boolean;
  model?: string;
};

export default function SettingsPage() {
  const { tier, setTier } = useUser();
  const [health, setHealth] = useState<HealthPayload | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/ai/health");
        const data = (await res.json()) as HealthPayload;
        if (!cancelled) setHealth(data);
      } catch {
        if (!cancelled) setHealth({ ready: false });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 pb-2">
      <Card className="border-[#D4AF37]/25 bg-[#12101f]/72 backdrop-blur-md">
        <CardContent className="space-y-2 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-[#D4AF37]/90">
            AI (Gemini / Claude)
          </p>
          {health === null ? (
            <p className="text-sm text-white/45">Проверка на API…</p>
          ) : health.ready ? (
            <div className="space-y-1 text-sm text-emerald-200/90">
              <p>
                Активен провайдър:{" "}
                <strong className="text-emerald-100">
                  {health.provider === "gemini" ? "Google Gemini" : "Anthropic Claude"}
                </strong>
                {health.model ? (
                  <>
                    {" "}
                    · модел <code className="rounded bg-white/10 px-1 text-xs">{health.model}</code>
                  </>
                ) : null}
              </p>
              <p className="text-xs text-white/45">
                Ключове: Gemini {health.gemini ? "✓" : "—"} · Anthropic{" "}
                {health.anthropic ? "✓" : "—"}
              </p>
            </div>
          ) : (
            <p className="text-sm text-amber-200/90">
              Няма конфигуриран LLM. Добави{" "}
              <code className="rounded bg-white/10 px-1">GEMINI_API_KEY</code> и/или{" "}
              <code className="rounded bg-white/10 px-1">ANTHROPIC_API_KEY</code> в{" "}
              <code className="rounded bg-white/10 px-1">.env.local</code>. При два ключа задай{" "}
              <code className="rounded bg-white/10 px-1">AI_PROVIDER=gemini</code> или{" "}
              <code className="rounded bg-white/10 px-1">anthropic</code>. Виж{" "}
              <code className="rounded bg-white/10 px-1">.env.example</code>.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="border-[#D4AF37]/25 bg-[#12101f]/72 backdrop-blur-md">
        <CardContent className="space-y-4 p-4">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl border border-[#D4AF37]/35 bg-[#D4AF37]/10 text-[#D4AF37]">
              <Settings className="size-5" strokeWidth={1.75} />
            </span>
            <div>
              <h1 className="text-base font-semibold text-white">Настройки</h1>
              <p className="text-xs text-white/50">
                Демо нива за UI (Firebase идва в следваща стъпка).
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wider text-[#D4AF37]/90">
              Твоето ниво
            </p>
            <div className="flex flex-col gap-2">
              {TIERS.map((t) => (
                <Button
                  key={t.id}
                  type="button"
                  variant="outline"
                  onClick={() => setTier(t.id)}
                  className={cn(
                    "h-auto flex-col items-start gap-1 rounded-xl border-white/10 py-3 text-left hover:bg-white/5",
                    tier === t.id &&
                      "border-[#D4AF37]/55 bg-[#D4AF37]/10 text-white",
                  )}
                >
                  <span className="text-sm font-semibold">{t.label}</span>
                  <span className="text-xs font-normal text-white/55">
                    {t.hint}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
