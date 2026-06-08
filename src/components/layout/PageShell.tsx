import { AppShell } from "@/components/layout/AppShell";

export function PageShell({
  children,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return <AppShell className={className}>{children}</AppShell>;
}
