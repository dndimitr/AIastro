"use client";

import { motion, LayoutGroup } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { MAIN_NAV } from "@/components/layout/main-nav";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#D4AF37]/15 bg-[#0b0e14]/65 pb-[env(safe-area-inset-bottom)] backdrop-blur-md supports-[backdrop-filter]:bg-[#0b0e14]/45 lg:hidden"
      aria-label="Основна навигация"
    >
      <div className="mx-auto flex h-[4.25rem] max-w-[480px] items-center justify-around px-2">
        <LayoutGroup id="bottom-nav">
          {MAIN_NAV.map(({ href, label, Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2"
                aria-current={active ? "page" : undefined}
                title={label}
              >
                <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl">
                  {active ? (
                    <motion.span
                      layoutId="mobile-nav-active"
                      className="absolute inset-0 rounded-2xl bg-[#D4AF37] shadow-[0_0_24px_rgba(212,175,55,0.35)]"
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
                      "relative z-10 size-[1.35rem]",
                      active
                        ? "text-[#1a1535]"
                        : "text-white/45 hover:text-white/70",
                    )}
                  />
                </span>
                <span
                  className={cn(
                    "max-w-[4.5rem] truncate text-[0.65rem] font-medium tracking-wide",
                    active ? "text-[#D4AF37]" : "text-white/35",
                  )}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </LayoutGroup>
      </div>
    </nav>
  );
}
