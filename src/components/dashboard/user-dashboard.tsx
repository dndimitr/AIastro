"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Heart,
  LayoutDashboard,
  MessageCircle,
  Settings,
  Sparkles,
  Star,
} from "lucide-react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@/contexts/user-context";
import type { UserTier } from "@/lib/user-tier";
import { cn } from "@/lib/utils";

const LINKS: {
  href: string;
  label: string;
  hint: string;
  Icon: typeof Star;
}[] = [
  {
    href: "/horoscope",
    label: "Хороскоп",
    hint: "Дневен и периодичен преглед",
    Icon: Star,
  },
  {
    href: "/journal",
    label: "Дневник",
    hint: "Емоджи и бележки",
    Icon: BookOpen,
  },
  {
    href: "/chat",
    label: "AI чат",
    hint: "Въпроси към астролога",
    Icon: MessageCircle,
  },
  {
    href: "/compatibility",
    label: "Съвместимост",
    hint: "Две Слънчеви зодии",
    Icon: Heart,
  },
  {
    href: "/settings",
    label: "Настройки",
    hint: "Ниво и AI ключове",
    Icon: Settings,
  },
];

function tierLabel(t: UserTier): string {
  if (t === "premium") return "Премиум";
  if (t === "free") return "Безплатен";
  return "Гост";
}

function tierHint(t: UserTier): string {
  if (t === "premium") {
    return "Пълен достъп: дълги хороскопи, AI чат, интерпретация в дневника.";
  }
  if (t === "free") {
    return "Хороскоп без замъгляване и AI чат. За дневник AI — надгради.";
  }
  return "Кратък хороскоп с преглед. Смени нивото в Настройки.";
}

export function UserDashboard() {
  const { tier } = useUser();

  return (
    <div className="flex flex-col gap-6 pb-2">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Card className="overflow-hidden border-[#D4AF37]/25 bg-[#12101f]/75 backdrop-blur-md">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-[#D4AF37]/35 bg-[#D4AF37]/12 text-[#D4AF37]">
                <LayoutDashboard className="size-7" strokeWidth={1.5} />
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]/90">
                  Твоето табло
                </p>
                <h1 className="mt-1 text-xl font-semibold text-white">
                  Добре дошъл в AstroAI
                </h1>
                <p className="mt-1 text-sm text-white/55">{tierHint(tier)}</p>
              </div>
            </div>
            <div
              className={cn(
                "rounded-xl border px-4 py-3 text-center sm:text-left",
                tier === "premium" && "border-[#D4AF37]/45 bg-[#D4AF37]/10",
                tier === "free" && "border-sky-500/35 bg-sky-950/25",
                tier === "guest" && "border-white/15 bg-white/5",
              )}
            >
              <p className="text-xs text-white/45">Текущо ниво</p>
              <p className="text-lg font-semibold text-[#D4AF37]">
                {tierLabel(tier)}
              </p>
              <Link
                href="/settings"
                className="mt-1 inline-block text-xs text-white/55 underline-offset-2 hover:text-white hover:underline"
              >
                Промени в Настройки
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/90">
          <Sparkles className="size-4 text-[#D4AF37]" />
          Бърз достъп
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LINKS.map(({ href, label, hint, Icon }, i) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link href={href}>
                <Card className="h-full border-white/10 bg-[#0e0c18]/65 transition-colors hover:border-[#D4AF37]/35 hover:bg-[#12101f]/8">
                  <CardContent className="flex items-start gap-3 p-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/12 text-[#D4AF37]">
                      <Icon className="size-5" strokeWidth={1.5} />
                    </span>
                    <div>
                      <p className="font-medium text-white">{label}</p>
                      <p className="text-xs text-white/45">{hint}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <Card className="border-white/10 bg-[#0e0c18]/5">
        <CardContent className="p-4 text-sm text-white/55">
          <p>
            Администраторско табло:{" "}
            <Link
              href="/admin/login"
              className="text-[#D4AF37]/90 underline-offset-2 hover:underline"
            >
              /admin/login
            </Link>{" "}
            (отделна парола).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
