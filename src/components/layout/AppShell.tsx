import type { ReactNode } from "react";
import { DesktopSidebar } from "@/components/layout/DesktopSidebar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { cn } from "@/lib/cn";

export function AppShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      data-ra-theme="default"
      className="min-h-screen bg-[radial-gradient(circle_at_18%_0%,rgba(45,129,255,0.12),transparent_30%),radial-gradient(circle_at_88%_6%,rgba(255,64,82,0.10),transparent_28%),linear-gradient(180deg,#030714,#060a15_48%,#03060d)] text-[var(--ra-text-primary)]"
    >
      <DesktopSidebar />
      <div className="min-h-screen lg:pl-[252px]">
        <main
          className={cn(
            "mx-auto w-full max-w-[1440px] px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-7",
            className,
          )}
        >
          {children}
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
