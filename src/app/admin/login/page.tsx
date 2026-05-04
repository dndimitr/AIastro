"use client";

import { Loader2, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const err = params.get("error");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(() => {
    if (err === "config") {
      return "Сървърът няма зададен ADMIN_DASHBOARD_SECRET — виж .env.example.";
    }
    if (err === "auth" || err === "session") {
      return "Сесията е изтекла или е невалидна. Влез отново.";
    }
    return null;
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setMessage(data.error ?? "Грешка");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setMessage("Мрежова грешка.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center">
      <Card className="w-full max-w-md border-[#D4AF37]/30 bg-[#12101f]/85 shadow-[0_0_40px_rgba(212,175,55,0.08)]">
        <CardContent className="space-y-5 p-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl border border-[#D4AF37]/35 bg-[#D4AF37]/10 text-[#D4AF37]">
              <Shield className="size-6" strokeWidth={1.5} />
            </span>
            <h1 className="text-lg font-semibold text-white">Админ вход</h1>
            <p className="text-xs text-white/50">
              Достъп само за екипа. Паролата е в{" "}
              <code className="rounded bg-white/10 px-1">ADMIN_DASHBOARD_PASSWORD</code>.
            </p>
          </div>

          {message ? (
            <p className="rounded-lg border border-amber-500/35 bg-amber-950/25 px-3 py-2 text-sm text-amber-100">
              {message}
            </p>
          ) : null}

          <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
            <label className="block space-y-1.5 text-xs font-medium text-white/55">
              Парола
              <Input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-white/10 bg-[#0e0c18]/9 text-white"
                placeholder="••••••••"
                required
              />
            </label>
            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#D4AF37] text-[#1a1535] hover:bg-[#e5c04a]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Влизане…
                </>
              ) : (
                "Влез"
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-white/40">
            <Link href="/horoscope" className="text-[#D4AF37]/90 hover:underline">
              Назад към приложението
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-white/50">
          Зареждане…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
