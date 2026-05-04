import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-[#0b0e14] text-white">
      <header className="sticky top-0 z-40 border-b border-[#D4AF37]/20 bg-[#12101f]/92 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 md:px-8">
          <Link
            href="/admin"
            className="text-sm font-semibold tracking-wide text-[#D4AF37] md:text-base"
          >
            AstroAI · Админ
          </Link>
          <Link
            href="/dashboard"
            className="text-xs text-white/55 hover:text-white md:text-sm"
          >
            Потребителско табло
          </Link>
          <Link
            href="/horoscope"
            className="text-xs text-white/55 hover:text-white md:text-sm"
          >
            Към приложението
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-10">
        {children}
      </div>
    </div>
  );
}
