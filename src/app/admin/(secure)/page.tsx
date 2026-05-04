import { Activity, Cpu, Database, Users } from "lucide-react";

import { AdminLogoutButton } from "@/components/admin/admin-logout-button";
import { Card, CardContent } from "@/components/ui/card";
import { getAnthropicClient } from "@/lib/ai/anthropic";
import { getGeminiClient } from "@/lib/ai/gemini";
import {
  getActiveModelLabel,
  resolveAiProvider,
} from "@/lib/ai/llm";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const provider = resolveAiProvider();
  const model = getActiveModelLabel();
  const gemini = Boolean(getGeminiClient());
  const anthropic = Boolean(getAnthropicClient());

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Администраторско табло</h1>
          <p className="mt-1 text-sm text-white/55">
            Преглед на конфигурацията и бързи действия. Потребителските данни ще
            се появят след Firebase.
          </p>
        </div>
        <AdminLogoutButton />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-[#D4AF37]/25 bg-[#12101f]/72">
          <CardContent className="flex items-start gap-3 p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/15 text-[#D4AF37]">
              <Cpu className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-white/45">
                LLM
              </p>
              <p className="truncate text-sm font-semibold text-white">
                {provider === "gemini"
                  ? "Google Gemini"
                  : provider === "anthropic"
                    ? "Anthropic Claude"
                    : "Не е конфигуриран"}
              </p>
              <p className="truncate text-xs text-white/45">{model}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D4AF37]/25 bg-[#12101f]/72">
          <CardContent className="flex items-start gap-3 p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-200">
              <Activity className="size-5" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-white/45">
                Ключове
              </p>
              <p className="text-sm text-white/85">
                Gemini: {gemini ? "да" : "не"} · Anthropic: {anthropic ? "да" : "не"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D4AF37]/25 bg-[#12101f]/72">
          <CardContent className="flex items-start gap-3 p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-sky-200">
              <Users className="size-5" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-white/45">
                Потребители
              </p>
              <p className="text-sm text-white/85">Firebase Auth — предстои</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D4AF37]/25 bg-[#12101f]/72">
          <CardContent className="flex items-start gap-3 p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-200">
              <Database className="size-5" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-white/45">
                База данни
              </p>
              <p className="text-sm text-white/85">Firestore — предстои</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#D4AF37]/20 bg-[#0e0c18]/65">
        <CardContent className="space-y-3 p-5 text-sm text-white/75">
          <h2 className="text-base font-semibold text-[#D4AF37]">Следващи стъпки</h2>
          <ul className="list-inside list-disc space-y-1 text-white/65">
            <li>Вържи Firebase за реални потребители и нива (гост / безплатен / премиум).</li>
            <li>Защити AI маршрутите със сесия вместо само client tier.</li>
            <li>Добави метрики (Vercel Analytics, Logfire) при нужда.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
