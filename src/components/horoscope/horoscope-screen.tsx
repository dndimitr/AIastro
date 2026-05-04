"use client";

import { motion } from "framer-motion";
import { Loader2, Share2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/contexts/user-context";
import { cn } from "@/lib/utils";

type Period = "daily" | "weekly" | "monthly" | "yearly";

const TAB_LABELS: [Period, string][] = [
  ["daily", "Дневен"],
  ["weekly", "Седмичен"],
  ["monthly", "Месечен"],
  ["yearly", "Годишен"],
];

export function HoroscopeScreen() {
  const { tier } = useUser();
  const isGuest = tier === "guest";
  const [period, setPeriod] = useState<Period>("daily");
  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/ai/horoscope", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            period,
            tier,
            sunSign: "Лъв",
          }),
        });
        const data = (await res.json()) as { text?: string; error?: string };
        if (!res.ok) {
          throw new Error(data.error ?? "Грешка при заявката");
        }
        if (!cancelled) setText(data.text ?? "");
      } catch (e) {
        if (!cancelled) {
          setText(null);
          setError(e instanceof Error ? e.message : "Неизвестна грешка");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [period, tier]);

  const share = useCallback(async () => {
    if (!text?.trim()) return;
    try {
      if (navigator.share) {
        await navigator.share({ title: "AstroAI — хороскоп", text });
      } else {
        await navigator.clipboard.writeText(text);
      }
    } catch {
      /* ignore */
    }
  }, [text]);

  const headline =
    tier === "premium"
      ? "Премиум хороскоп: твоята зодия и днешните транзити"
      : tier === "free"
        ? "Хороскоп за твоята зодия"
        : "Кратък хороскоп (преглед)";

  return (
    <div className="flex flex-col gap-5 pb-2">
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Card className="overflow-hidden border-[#D4AF37]/25 bg-[#12101f]/75 shadow-[0_0_0_1px_rgba(212,175,55,0.08)] backdrop-blur-md">
          <CardContent className="relative flex items-center gap-4 p-4">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]/90">
                Хороскоп
              </p>
              <h1 className="text-xl font-semibold tracking-tight text-white">
                Зодия Лъв
              </h1>
              <p className="text-sm text-white/60">24 ЮЛИ — 23 АВГУСТ</p>
            </div>
            <div
              className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-2xl border border-[#D4AF37]/35 bg-gradient-to-br from-[#D4AF37]/25 to-transparent text-5xl shadow-[inset_0_0_24px_rgba(212,175,55,0.15)]"
              aria-hidden
            >
              ♌
            </div>
          </CardContent>
        </Card>
      </motion.header>

      <Tabs
        value={period}
        onValueChange={(v) => setPeriod(v as Period)}
        className="flex flex-col gap-4"
      >
        <TabsList
          variant="line"
          className="h-auto w-full justify-between gap-1 overflow-x-auto rounded-none border-0 bg-transparent p-0 text-white/50"
        >
          {TAB_LABELS.map(([value, label]) => (
            <TabsTrigger
              key={value}
              value={value}
              className={cn(
                "shrink-0 rounded-none border-0 bg-transparent px-2 py-2 text-xs font-medium tracking-wide data-[state=active]:text-[#D4AF37]",
                "after:bg-[#D4AF37] data-[state=active]:after:opacity-100",
              )}
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TAB_LABELS.map(([p]) => (
          <TabsContent key={p} value={p} className="mt-0">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28 }}
            >
              <Card className="relative overflow-hidden border-[#D4AF37]/30 bg-[#0e0c18]/80 backdrop-blur-md">
                <CardContent className="space-y-4 p-4 pr-28">
                  <h2 className="text-base font-semibold leading-snug text-[#D4AF37]">
                    {headline}
                  </h2>

                  {error ? (
                    <p className="rounded-lg border border-rose-500/40 bg-rose-950/30 px-3 py-2 text-sm text-rose-100">
                      {error}
                    </p>
                  ) : null}

                  {loading ? (
                    <div className="flex items-center gap-2 text-sm text-white/55">
                      <Loader2 className="size-4 animate-spin text-[#D4AF37]" />
                      Генериране на хороскоп…
                    </div>
                  ) : null}

                  {!loading && text !== null ? (
                    <div
                      className={cn(
                        "relative whitespace-pre-wrap text-sm leading-relaxed text-white/85",
                        isGuest &&
                          "select-none blur-[3px] after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-b after:from-transparent after:to-[#0b0e14]/90",
                      )}
                    >
                      <p>{text || "—"}</p>
                      {isGuest ? (
                        <p className="mt-3 text-center text-xs font-medium text-[#D4AF37]">
                          Влез като безплатен потребител в Настройки, за да видиш
                          пълния текст.
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!text?.trim()}
                      onClick={() => void share()}
                      className="gap-2 rounded-full border-[#D4AF37]/50 bg-transparent text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] disabled:opacity-40"
                    >
                      <Share2 className="size-4" />
                      Сподели
                    </Button>
                  </div>
                  <TarotAccent />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function TarotAccent() {
  return (
    <div
      className="pointer-events-none absolute bottom-3 right-3 flex gap-1"
      aria-hidden
    >
      <motion.div
        initial={{ rotate: -8, opacity: 0.85 }}
        animate={{ rotate: -10, opacity: 1 }}
        className="h-16 w-11 rounded-md border border-[#D4AF37]/40 bg-[radial-gradient(circle_at_30%_20%,rgba(167,139,250,0.5),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(212,175,55,0.35),transparent_50%),#1a1535] shadow-lg"
      />
      <motion.div
        initial={{ rotate: 6, opacity: 0.85 }}
        animate={{ rotate: 8, opacity: 1 }}
        className="-ml-6 h-16 w-11 rounded-md border border-[#D4AF37]/35 bg-[radial-gradient(circle_at_60%_30%,rgba(99,102,241,0.45),transparent_50%),radial-gradient(circle_at_20%_70%,rgba(212,175,55,0.25),transparent_55%),#12101f] shadow-lg"
      />
    </div>
  );
}
