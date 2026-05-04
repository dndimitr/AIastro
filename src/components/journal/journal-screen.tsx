"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/contexts/user-context";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["П", "В", "С", "Ч", "П", "С", "Н"] as const;

const MOODS = ["😊", "🥰", "😐", "😤", "😢", "🤯", "😴"] as const;

const DOTS: Record<number, ("r" | "g" | "b")[]> = {
  3: ["g"],
  7: ["r", "b"],
  12: ["g", "b"],
  18: ["r"],
  24: ["g", "r", "b"],
};

export function JournalScreen() {
  const { tier } = useUser();
  const premium = tier === "premium";
  const [selectedMood, setSelectedMood] = useState<number | null>(2);
  const [dayNote, setDayNote] = useState("");
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [moonSign, setMoonSign] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const { year, monthLabel, cells } = useMemo(() => buildCalendar(2024, 0), []);

  async function fetchInterpretation() {
    if (!premium) return;
    setLoadingAi(true);
    setAiError(null);
    try {
      const emoji =
        selectedMood !== null ? MOODS[selectedMood] ?? "😐" : "😐";
      const res = await fetch("/api/ai/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier,
          emoji,
          dayNote: dayNote.trim() || undefined,
        }),
      });
      const data = (await res.json()) as {
        text?: string;
        moonSign?: string;
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "Грешка");
      setInterpretation(data.text ?? "");
      setMoonSign(data.moonSign ?? null);
    } catch (e) {
      setInterpretation(null);
      setAiError(e instanceof Error ? e.message : "Неуспешна заявка");
    } finally {
      setLoadingAi(false);
    }
  }

  return (
    <div className="grid gap-5 pb-2 lg:grid-cols-2 lg:items-start lg:gap-8">
      <div className="flex flex-col gap-5">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-[#D4AF37]/25 bg-[#12101f]/72 backdrop-blur-md">
            <CardContent className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="rounded-lg p-2 text-white/50 hover:bg-white/5 hover:text-white"
                  aria-label="Предишен месец"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">
                  {monthLabel} {year}
                </p>
                <button
                  type="button"
                  className="rounded-lg p-2 text-white/50 hover:bg-white/5 hover:text-white"
                  aria-label="Следващ месец"
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-[0.65rem] font-medium text-white/40">
                {WEEKDAYS.map((d, idx) => (
                  <span key={`${d}-${idx}`}>{d}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-2 text-center text-sm">
                {cells.map((cell, i) =>
                  cell === null ? (
                    <span key={`e-${i}`} />
                  ) : (
                    <div key={cell} className="flex flex-col items-center gap-1">
                      <span
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full text-white/90",
                          cell === 15 &&
                            "bg-[#D4AF37]/25 ring-1 ring-[#D4AF37]/60",
                        )}
                      >
                        {cell}
                      </span>
                      <span className="flex h-1.5 items-center justify-center gap-0.5">
                        {(DOTS[cell] ?? []).map((c) => (
                          <span
                            key={c}
                            className={cn(
                              "size-1 rounded-full",
                              c === "r" && "bg-rose-400",
                              c === "g" && "bg-emerald-400",
                              c === "b" && "bg-sky-400",
                            )}
                          />
                        ))}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-white/90">Днешни емоджи</h2>
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {MOODS.map((emoji, idx) => {
              const active = selectedMood === idx;
              return (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedMood(idx)}
                  className={cn(
                    "flex size-12 shrink-0 items-center justify-center rounded-full border text-xl transition-colors",
                    active
                      ? "border-[#D4AF37] bg-[#D4AF37]/15 shadow-[0_0_20px_rgba(212,175,55,0.25)]"
                      : "border-white/10 bg-white/5 hover:border-[#D4AF37]/40",
                  )}
                  aria-pressed={active}
                >
                  {emoji}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <div className="flex flex-col gap-5">
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-white/90">
            AI интерпретация
          </h2>
          <Card
            className={cn(
              "border-[#D4AF37]/45 bg-[#0e0c18]/75 backdrop-blur-md",
              !premium && "relative overflow-hidden",
            )}
          >
            <CardContent className="space-y-3 p-4 text-sm leading-relaxed">
              {premium ? (
                <>
                  {moonSign ? (
                    <p className="text-xs text-[#D4AF37]/85">
                      Луна (тропик) днес: {moonSign}
                    </p>
                  ) : null}
                  {aiError ? (
                    <p className="rounded-md border border-rose-500/35 bg-rose-950/20 px-2 py-1.5 text-xs text-rose-100">
                      {aiError}
                    </p>
                  ) : null}
                  {interpretation ? (
                    <p className="whitespace-pre-wrap text-white/85">
                      {interpretation}
                    </p>
                  ) : (
                    <p className="text-white/50">
                      Натисни бутона за интерпретация спрямо избраното емоджи и
                      (по избор) бележката ти за деня.
                    </p>
                  )}
                  <Button
                    type="button"
                    onClick={() => void fetchInterpretation()}
                    disabled={loadingAi}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-[#D4AF37]/90 text-[#1a1535] hover:bg-[#D4AF37] disabled:opacity-50"
                  >
                    {loadingAi ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Генериране…
                      </>
                    ) : (
                      "Обнови AI интерпретацията"
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <p className="blur-sm select-none text-white/85">
                    Луната и транзитите се интерпретират тук с AI — достъпно за
                    Премиум.
                  </p>
                  <p className="text-center text-xs font-medium text-[#D4AF37]">
                    Настройки → Премиум (демо), за да активираш тази функция.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-white/90">
            Текст днешния ден
          </h2>
          <Textarea
            value={dayNote}
            onChange={(e) => setDayNote(e.target.value)}
            placeholder="Опиши днешния ден…"
            className="min-h-[120px] resize-none border-white/10 bg-[#0e0c18]/85 text-white placeholder:text-white/35 focus-visible:ring-[#D4AF37]/40 lg:min-h-[220px]"
          />
        </section>
      </div>
    </div>
  );
}

function buildCalendar(year: number, monthIndex: number) {
  const first = new Date(year, monthIndex, 1);
  const startPad = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const monthLabel = first.toLocaleString("bg-BG", { month: "long" });

  const cells: (number | null)[] = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return { year, monthLabel, cells };
}
