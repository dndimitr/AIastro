"use client";

import { motion } from "framer-motion";
import { Heart, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@/contexts/user-context";
import { ZODIAC_BG } from "@/lib/zodiac";

export function CompatibilityScreen() {
  const { tier } = useUser();
  const [a, setA] = useState<string>("Лъв");
  const [b, setB] = useState<string>("Скорпион");
  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/compatibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signA: a, signB: b, tier }),
      });
      const data = (await res.json()) as { text?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Грешка");
      setText(data.text ?? "");
    } catch (e) {
      setText(null);
      setError(e instanceof Error ? e.message : "Неуспешна заявка");
    } finally {
      setLoading(false);
    }
  }, [a, b, tier]);

  return (
    <div className="flex flex-col gap-4 pb-2">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-[#D4AF37]/25 bg-[#12101f]/72 backdrop-blur-md">
          <CardContent className="space-y-5 p-5">
            <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-center sm:text-left">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-[#D4AF37]/35 bg-[#D4AF37]/10 text-[#D4AF37]">
                <Heart className="size-7" strokeWidth={1.5} />
              </span>
              <div>
                <h1 className="text-lg font-semibold text-white">Съвместимост</h1>
                <p className="text-sm text-white/55">
                  Избери две Слънчеви зодии — AI дава обща картина (не замества
                  пълна синастрия).
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-xs font-medium text-white/55">
                Първа зодия
                <select
                  value={a}
                  onChange={(e) => setA(e.target.value)}
                  className="rounded-xl border border-white/10 bg-[#0e0c18]/9 px-3 py-2.5 text-sm text-white focus:border-[#D4AF37]/45 focus:outline-none"
                >
                  {ZODIAC_BG.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-xs font-medium text-white/55">
                Втора зодия
                <select
                  value={b}
                  onChange={(e) => setB(e.target.value)}
                  className="rounded-xl border border-white/10 bg-[#0e0c18]/9 px-3 py-2.5 text-sm text-white focus:border-[#D4AF37]/45 focus:outline-none"
                >
                  {ZODIAC_BG.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <Button
              type="button"
              onClick={() => void run()}
              disabled={loading || a === b}
              className="inline-flex w-full items-center justify-center rounded-xl bg-[#D4AF37] text-[#1a1535] hover:bg-[#e5c04a] disabled:opacity-40 sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Анализ…
                </>
              ) : (
                "Генерирай анализ"
              )}
            </Button>

            {a === b ? (
              <p className="text-center text-xs text-amber-200/90">
                Избери две различни зодии.
              </p>
            ) : null}

            {error ? (
              <p className="rounded-lg border border-rose-500/35 bg-rose-950/25 px-3 py-2 text-sm text-rose-100">
                {error}
              </p>
            ) : null}

            {text ? (
              <div className="rounded-xl border border-[#D4AF37]/20 bg-[#0e0c18]/6 p-4 text-sm leading-relaxed whitespace-pre-wrap text-white/88">
                {text}
              </div>
            ) : null}

            {tier === "premium" ? (
              <p className="text-center text-[0.65rem] text-white/35">
                Премиум: по-подробен текст при същата заявка.
              </p>
            ) : null}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
