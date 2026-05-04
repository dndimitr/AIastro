"use client";

import { motion, LayoutGroup } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { MAIN_NAV } from "@/components/layout/main-nav";
import { cn } from "@/lib/utils";

export function DesktopSideNav() {
  const pathname = usePathname();

  return (
    <aside
      className="relative z-30 hidden w-64 shrink-0 flex-col border-r border-[#D4AF37]/15 bg-[#0b0e14]/80 backdrop-blur-md lg:fixed lg:inset-y-0 lg:left-0 lg:flex"
      aria-label="Навигация за настолни устройства"
    >
      <div className="flex items-center gap-2 border-b border-white/5 px-5 py-5">
        <span className="flex size-10 items-center justify-center rounded-xl bg-[#D4AF37]/20 text-[#D4AF37]">
          <Sparkles className="size-5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-base font-semibold tracking-tight text-white">
            AstroAI
          </p>
          <p className="truncate text-xs text-white/45">
            Астрология и AI асистент
          </p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        <LayoutGroup id="desktop-nav">
          {MAIN_NAV.map(({ href, label, Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "text-[#1a1535]"
                    : "text-white/65 hover:bg-white/5 hover:text-white",
                )}
                aria-current={active ? "page" : undefined}
              >
                {active ? (
                  <motion.span
                    layoutId="desktop-nav-active"
                    className="absolute inset-0 rounded-xl bg-[#D4AF37] shadow-[0_0_24px_rgba(212,175,55,0.2)]"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 32,
                    }}
                  />
                ) : null}
                <Icon
                  strokeWidth={1.75}
                  className={cn(
                    "relative z-10 size-5 shrink-0",
                    active ? "text-[#1a1535]" : "text-white/55",
                  )}
                />
                <span className="relative z-10 truncate">{label}</span>
              </Link>
            );
          })}
        </LayoutGroup>
      </nav>
      <p className="border-t border-white/5 px-5 py-3 text-[0.65rem] leading-snug text-white/35">
        Оптимизирано за мобилни устройства и настолни компютри.
      </p>
    </aside>
  );
}
