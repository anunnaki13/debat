import { AppHeader } from "@/components/layout/AppHeader";

export function PageShell({
  children,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#164e63_0%,#071019_42%,#05080d_100%)] text-slate-100">
      <AppHeader />
      <main className={`mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 ${className}`}>
        {children}
      </main>
    </div>
  );
}
