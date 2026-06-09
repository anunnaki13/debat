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
      className="min-h-screen bg-[radial-gradient(circle_at_18%_0%,rgba(21,248,255,0.08),transparent_28%),radial-gradient(circle_at_88%_8%,rgba(255,43,214,0.08),transparent_30%),var(--ra-bg-deep)] text-[var(--ra-text-primary)]"
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
