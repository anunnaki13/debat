"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, PenLine, Route, Swords } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { LobbyHero } from "@/components/lobby/LobbyHero";
import { ProgressResumeCard } from "@/components/lobby/ProgressResumeCard";
import { UserUtilityBar } from "@/components/lobby/UserUtilityBar";
import { Badge, Card, CardDescription, CardTitle } from "@/components/ui";
import { getLocalSessions } from "@/lib/storage/localSessions";

export default function Home() {
  const router = useRouter();
  const [completedCount, setCompletedCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    queueMicrotask(() => {
      const sessions = getLocalSessions();
      setCompletedCount(
        sessions.filter((session) => session.status === "COMPLETED").length,
      );
      setActiveCount(
        sessions.filter((session) => session.status !== "COMPLETED").length,
      );
    });
  }, []);

  return (
    <PageShell className="space-y-6">
      <UserUtilityBar />
      <LobbyHero
        onPrimaryAction={() => router.push("/play")}
        onSecondaryAction={() => router.push("/topics/new")}
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <RouteCard
          icon={<Swords size={19} aria-hidden="true" />}
          label="Step 1"
          title="Pilih mode"
          description="Mulai dari format debat dan input arena, lalu lanjut ke topik."
          href="/play"
          cta="Mulai Flow"
        />
        <RouteCard
          icon={<Route size={19} aria-hidden="true" />}
          label="Step 2"
          title="Pilih topik"
          description="Masuk langsung ke daftar topik jika mode/input sudah cocok."
          href="/topics"
          cta="Buka Topik"
        />
        <RouteCard
          icon={<PenLine size={19} aria-hidden="true" />}
          label="Privat"
          title="Buat tesis sendiri"
          description="Tulis topik privat atau rapikan tesis sebelum debat."
          href="/topics/new"
          cta="Buat Topik"
        />
      </section>

      <ProgressResumeCard
        completedCount={completedCount}
        activeCount={activeCount}
      />
    </PageShell>
  );
}

function RouteCard({
  icon,
  label,
  title,
  description,
  href,
  cta,
}: {
  icon: ReactNode;
  label: string;
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <Card variant="outline" className="bg-[var(--ra-bg-glass)]">
      <div className="flex items-center justify-between gap-3">
        <Badge tone="user">{label}</Badge>
        <span className="grid h-10 w-10 place-items-center rounded-[var(--ra-radius-md)] border border-[rgba(50,212,209,0.28)] bg-[rgba(50,212,209,0.10)] text-[var(--ra-cyan-bright)]">
          {icon}
        </span>
      </div>
      <CardTitle className="mt-4 text-lg">{title}</CardTitle>
      <CardDescription className="mt-2">{description}</CardDescription>
      <Link
        href={href}
        className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[var(--ra-radius-md)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] px-4 text-sm font-semibold text-[var(--ra-text-primary)] transition hover:border-[var(--ra-cyan)] hover:bg-[var(--ra-cyan-soft)]"
      >
        {cta}
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </Card>
  );
}
