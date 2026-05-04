"use client";

import { motion } from "framer-motion";
import {
  ArrowUp,
  ChevronLeft,
  Loader2,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";

import { Input } from "@/components/ui/input";
import { useUser } from "@/contexts/user-context";

type Msg = { role: "user" | "assistant"; content: string };

const CHIPS = ["Виж кариера", "Питай за Юпитер"] as const;

const WELCOME =
  "Здравей! Попитай за транзити, домове, ретроградност или конкретна планета — отговарям на български.";

export function ChatScreen() {
  const { tier } = useUser();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(
    async (raw: string) => {
      const t = raw.trim();
      if (!t || sending) return;

      if (tier === "guest") {
        setError(
          "За чат с AI избери „Безплатен“ или „Премиум“ в Настройки (демо нива).",
        );
        return;
      }

      setError(null);
      const nextThread: Msg[] = [...messages, { role: "user", content: t }];
      setMessages(nextThread);
      setDraft("");
      setSending(true);

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tier,
            messages: nextThread,
          }),
        });
        const data = (await res.json()) as { reply?: string; error?: string };
        if (!res.ok) {
          throw new Error(data.error ?? "Грешка");
        }
        setMessages((m) => [
          ...m,
          { role: "assistant", content: data.reply ?? "—" },
        ]);
      } catch (e) {
        setMessages((m) => m.slice(0, -1));
        setDraft(t);
        setError(e instanceof Error ? e.message : "Неуспешна заявка");
      } finally {
        setSending(false);
      }
    },
    [messages, sending, tier],
  );

  return (
    <div className="flex min-h-[calc(100dvh-6rem)] flex-col gap-3 pb-2 lg:min-h-[calc(100dvh-4rem)]">
      <motion.header
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-20 -mx-4 mb-1 flex items-center gap-3 border-b border-white/5 bg-[#0b0e14]/80 px-2 py-3 backdrop-blur-md lg:mx-0 lg:mb-2 lg:rounded-xl lg:border lg:border-white/10 lg:px-4"
      >
        <Link
          href="/horoscope"
          className="rounded-lg p-2 text-white/60 hover:bg-white/5 hover:text-white lg:hidden"
          aria-label="Назад към хороскоп"
        >
          <ChevronLeft className="size-6" />
        </Link>
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#D4AF37]">
            <Sparkles className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">AstroAI чат</p>
            <p className="truncate text-xs text-white/45">Gemini или Claude (сървър)</p>
          </div>
        </div>
        <button
          type="button"
          className="rounded-lg p-2 text-white/50 hover:bg-white/5 hover:text-white"
          aria-label="Още"
        >
          <MoreHorizontal className="size-5" />
        </button>
      </motion.header>

      {error ? (
        <p className="rounded-lg border border-rose-500/35 bg-rose-950/25 px-3 py-2 text-sm text-rose-100">
          {error}
        </p>
      ) : null}

      <div className="flex flex-1 flex-col gap-3">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            className="mr-4 flex gap-2"
          >
            <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/25 text-[#D4AF37]">
              <Sparkles className="size-4" />
            </span>
            <div className="flex-1 rounded-2xl rounded-bl-md bg-[#14131f]/95 px-4 py-3 text-sm leading-relaxed text-white/88 ring-1 ring-white/5">
              {WELCOME}
            </div>
          </motion.div>
        ) : null}

        {messages.map((m, i) =>
          m.role === "user" ? (
            <motion.div
              key={`u-${i}-${m.content.slice(0, 12)}`}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              className="ml-8 whitespace-pre-wrap rounded-2xl rounded-br-md bg-[#1e2a4a]/95 px-4 py-3 text-sm leading-relaxed text-white/90 shadow-inner"
            >
              {m.content}
            </motion.div>
          ) : (
            <motion.div
              key={`a-${i}-${m.content.slice(0, 12)}`}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              className="mr-4 flex gap-2"
            >
              <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/25 text-[#D4AF37]">
                <Sparkles className="size-4" />
              </span>
              <div className="flex-1 space-y-3 rounded-2xl rounded-bl-md bg-[#14131f]/95 px-4 py-3 text-sm leading-relaxed text-white/88 ring-1 ring-white/5">
                <p className="whitespace-pre-wrap">{m.content}</p>
              </div>
            </motion.div>
          ),
        )}

        {sending ? (
          <div className="flex items-center gap-2 text-sm text-white/50">
            <Loader2 className="size-4 animate-spin text-[#D4AF37]" />
            Мисля…
          </div>
        ) : null}
      </div>

      <div className="mt-auto space-y-2 pt-2">
        <div className="flex flex-wrap gap-2">
          {CHIPS.map((label) => (
            <button
              key={label}
              type="button"
              disabled={sending}
              onClick={() => {
                const q =
                  label === "Виж кариера"
                    ? "Какво да очаквам за кариерата ми според текущите транзити?"
                    : "Какво означава положението на Юпитер за мен тази година?";
                void send(q);
              }}
              className="rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/10 px-3 py-1.5 text-xs font-medium text-[#D4AF37] hover:bg-[#D4AF37]/18 disabled:opacity-40"
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#0e0c18]/88 px-3 py-1.5 backdrop-blur-md">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(draft);
              }
            }}
            placeholder="Попитай астролога…"
            disabled={sending}
            className="flex-1 border-0 bg-transparent text-sm text-white shadow-none placeholder:text-white/35 focus-visible:ring-0 disabled:opacity-50"
          />
          <button
            type="button"
            disabled={sending || !draft.trim()}
            onClick={() => void send(draft)}
            className="flex size-10 items-center justify-center rounded-full bg-[#D4AF37] text-[#1a1535] shadow-[0_0_20px_rgba(212,175,55,0.35)] hover:bg-[#e5c04a] disabled:opacity-40"
            aria-label="Изпрати"
          >
            <ArrowUp className="size-5" strokeWidth={2.25} />
          </button>
        </div>
      </div>
    </div>
  );
}
