import { BottomNav } from "@/components/layout/bottom-nav";
import { DesktopSideNav } from "@/components/layout/desktop-side-nav";
import { Starfield } from "@/components/layout/starfield";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh w-full flex-col overflow-x-hidden bg-[#0b0e14] text-white lg:flex-row">
      <Starfield />
      <DesktopSideNav />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col lg:min-h-dvh lg:pl-64">
        <div
          className="scrollbar-none mx-auto min-h-0 w-full max-w-[480px] flex-1 overflow-y-auto overflow-x-hidden px-4 pb-[calc(5.25rem+env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] lg:max-w-6xl lg:px-8 lg:pb-8 lg:pt-6"
        >
          {children}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
