"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpenCheck,
  Clock,
  FileText,
  History,
  Mic2,
  PenLine,
  Sparkles,
  Swords,
  Trophy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { SpiceMeter } from "@/components/topics/SpiceMeter";
import {
  Badge,
  Button,
  Card,
  CardDescription,
  CardTitle,
} from "@/components/ui";
import { debateTopics } from "@/data/topics";
import { saveDebateFlowDraft } from "@/lib/flow/debateFlowDraft";
import { getLocalSessions } from "@/lib/storage/localSessions";
import type { DebateMode, DebateSession, DebateTopic } from "@/types/debate";

const featuredTopicIds = [
  "ai-jobs",
  "remote-work",
  "public-transport",
  "cashless",
] as const;

const topicArt: Partial<Record<string, { src: string; position: string }>> = {
  "ai-jobs": {
    src: "/assets/challenges/ai-jobs-unsplash.jpg",
    position: "center",
  },
  "remote-work": {
    src: "/assets/challenges/remote-work-unsplash.jpg",
    position: "center",
  },
  "public-transport": {
    src: "/assets/challenges/public-transport-unsplash.jpg",
    position: "center",
  },
  cashless: {
    src: "/assets/challenges/cashless-unsplash.jpg",
    position: "center",
  },
};

const activeModes: Array<{
  mode: DebateMode;
  title: string;
  description: string;
  href: string;
  cta: string;
  icon: LucideIcon;
  tone: "user" | "special";
}> = [
  {
    mode: "DUEL_WACANA_AI",
    title: "Duel Wacana AI",
    description:
      "Masuk arena 1 lawan 1. AI mengambil posisi lawan, lalu wasit menilai argumen.",
    href: "/play",
    cta: "Pilih Duel",
    icon: Swords,
    tone: "user",
  },
  {
    mode: "PRIVATE_OPINION",
    title: "Topik Privat",
    description:
      "Tulis tesis sendiri, rapikan klaimnya, lalu uji langsung di arena debat.",
    href: "/topics/new",
    cta: "Buat Tesis",
    icon: PenLine,
    tone: "special",
  },
];

const featuredTopics = featuredTopicIds
  .map((id) => debateTopics.find((topic) => topic.id === id))
  .filter((topic): topic is DebateTopic => Boolean(topic));

const fallbackRecommendation =
  debateTopics.find((topic) => topic.id === "ai-schoolwork") ?? debateTopics[0];

export default function Home() {
  const router = useRouter();
  const [sessions, setSessions] = useState<DebateSession[]>([]);

  useEffect(() => {
    queueMicrotask(() => setSessions(getLocalSessions()));
  }, []);

  const latestSession = sessions[0] ?? null;
  const completedCount = useMemo(
    () => sessions.filter((session) => session.status === "COMPLETED").length,
    [sessions],
  );
  const activeCount = sessions.length - completedCount;
  const recommendedTopic =
    latestSession?.topic.id === fallbackRecommendation.id
      ? (debateTopics.find((topic) => topic.id === "public-transport") ??
        fallbackRecommendation)
      : fallbackRecommendation;

  function startPrimaryFlow() {
    saveDebateFlowDraft({
      mode: "DUEL_WACANA_AI",
      inputMode: "TEXT",
    });
    router.push("/play");
  }

  function startMode(mode: DebateMode, href: string) {
    saveDebateFlowDraft({
      mode,
      inputMode: "TEXT",
    });
    router.push(href);
  }

  function useTopic(topic: DebateTopic) {
    saveDebateFlowDraft({
      mode: "DUEL_WACANA_AI",
      inputMode: "TEXT",
      topic,
      sideSelection: "RANDOM",
    });
    router.push("/topics");
  }

  return (
    <PageShell className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-stretch">
        <LobbyIntro
          hasHistory={sessions.length > 0}
          completedCount={completedCount}
          activeCount={activeCount}
          onPrimaryAction={startPrimaryFlow}
        />
        <RecommendationCard
          topic={recommendedTopic}
          latestSession={latestSession}
          onUseTopic={useTopic}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-start">
        <div className="space-y-6">
          <ActiveModeGrid onSelect={startMode} />
          <TopicRecommendationGrid topics={featuredTopics} onUseTopic={useTopic} />
        </div>
        <LatestHistoryCard
          latestSession={latestSession}
          completedCount={completedCount}
          activeCount={activeCount}
        />
      </section>
    </PageShell>
  );
}

function LobbyIntro({
  hasHistory,
  completedCount,
  activeCount,
  onPrimaryAction,
}: {
  hasHistory: boolean;
  completedCount: number;
  activeCount: number;
  onPrimaryAction: () => void;
}) {
  return (
    <section className="relative min-h-[420px] overflow-hidden rounded-[var(--ra-radius-xl)] border border-[var(--ra-border-chrome-soft)] bg-[var(--ra-bg-panel)] shadow-[var(--ra-shadow-elevated)]">
      <Image
        src="/assets/arena/hero-duel-scene.svg"
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) calc(100vw - 680px), 100vw"
        className="object-cover object-center opacity-80"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[image:var(--ra-gradient-esports-arena)] opacity-80" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--ra-bg-deep),rgba(7,11,19,0.82)_48%,rgba(7,11,19,0.34))]" />

      <div className="relative flex min-h-[420px] flex-col justify-between p-5 sm:p-7 lg:p-8">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="user">Voice Arena MVP</Badge>
            <Badge tone="prestige">AI lawan + wasit</Badge>
          </div>

          <div className="mt-10 max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--ra-cyan-bright)]">
              {hasHistory ? "Selamat datang kembali" : "Selamat datang di arena"}
            </p>
            <h1 className="mt-3 font-serif text-4xl font-black leading-tight text-[var(--ra-text-primary)] sm:text-5xl lg:text-6xl">
              Latih argumen melawan AI.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--ra-text-secondary)] sm:text-lg">
              Pilih mode, ambil posisi, debat melawan AI oposisi, lalu terima
              laporan wasit tentang logika, bukti, dan respons Anda.
            </p>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={onPrimaryAction}
              leadingIcon={<Swords size={19} aria-hidden="true" />}
              trailingIcon={<ArrowRight size={18} aria-hidden="true" />}
            >
              Mulai Debat AI
            </Button>
            <Link
              href="/topics"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--ra-radius-md)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-glass)] px-5 py-3 text-base font-semibold text-[var(--ra-text-primary)] transition hover:border-[var(--ra-cyan)] hover:bg-[var(--ra-cyan-soft)]"
            >
              Lihat Topik
              <BookOpenCheck size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          <ArenaStep icon={BookOpenCheck} label="Pilih topik" />
          <ArenaStep icon={Mic2} label="Debat teks/voice" />
          <ArenaStep icon={Trophy} label="Baca laporan" />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <LocalMetric label="Sesi selesai" value={completedCount} />
          <LocalMetric label="Sesi aktif" value={activeCount} />
        </div>
      </div>
    </section>
  );
}

function ArenaStep({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex min-h-14 items-center gap-3 rounded-[var(--ra-radius-md)] border border-[var(--ra-border-subtle)] bg-[var(--ra-bg-glass)] px-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[var(--ra-radius-sm)] border border-[var(--ra-cyan)] bg-[var(--ra-cyan-soft)] text-[var(--ra-cyan-bright)]">
        <Icon size={17} aria-hidden="true" />
      </span>
      <span className="text-sm font-bold text-[var(--ra-text-primary)]">
        {label}
      </span>
    </div>
  );
}

function LocalMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[var(--ra-radius-md)] border border-[var(--ra-border-subtle)] bg-[var(--ra-bg-glass)] px-4 py-3">
      <p className="font-serif text-2xl font-bold text-[var(--ra-text-primary)]">
        {value}
      </p>
      <p className="mt-1 text-xs font-semibold text-[var(--ra-text-muted)]">
        {label}
      </p>
    </div>
  );
}

function RecommendationCard({
  topic,
  latestSession,
  onUseTopic,
}: {
  topic: DebateTopic;
  latestSession: DebateSession | null;
  onUseTopic: (topic: DebateTopic) => void;
}) {
  const exercise =
    latestSession?.report?.recommendedExercise ??
    "Mulai dengan klaim pembuka 45 detik, lalu siapkan satu data dan satu sanggahan.";

  return (
    <Card variant="selected" className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-[image:linear-gradient(90deg,var(--ra-electric-cyan),var(--ra-magenta),var(--ra-gold))]" />
      <Badge tone="prestige">Rekomendasi Latihan</Badge>
      <CardTitle className="mt-4 text-2xl">Sesi berikutnya</CardTitle>
      <CardDescription className="mt-2">
        {exercise}
      </CardDescription>

      <div className="mt-5 rounded-[var(--ra-radius-lg)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] p-4">
        <Badge tone="user">{topic.category}</Badge>
        <h2 className="mt-3 text-base font-black leading-6 text-[var(--ra-text-primary)]">
          {topic.title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--ra-text-secondary)]">
          {topic.shortContext}
        </p>
      </div>

      <Button
        className="mt-5 w-full"
        onClick={() => onUseTopic(topic)}
        trailingIcon={<ArrowRight size={17} aria-hidden="true" />}
      >
        Pakai Rekomendasi
      </Button>
    </Card>
  );
}

function ActiveModeGrid({
  onSelect,
}: {
  onSelect: (mode: DebateMode, href: string) => void;
}) {
  return (
    <section aria-labelledby="active-mode-title" className="space-y-4">
      <div>
        <Badge tone="user">2 mode aktif</Badge>
        <h2
          id="active-mode-title"
          className="mt-3 text-2xl font-black text-[var(--ra-text-primary)]"
        >
          Pilih cara masuk arena
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {activeModes.map((mode) => {
          const Icon = mode.icon;

          return (
            <button
              key={mode.mode}
              type="button"
              onClick={() => onSelect(mode.mode, mode.href)}
              className="group min-h-[190px] rounded-[var(--ra-radius-lg)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-glass)] p-5 text-left shadow-[var(--ra-shadow-card)] transition hover:border-[var(--ra-cyan)] hover:bg-[var(--ra-cyan-soft)] hover:shadow-[var(--ra-glow-esports-cyan)]"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-[var(--ra-radius-md)] border border-[var(--ra-cyan)] bg-[var(--ra-cyan-soft)] text-[var(--ra-cyan-bright)]">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <Badge tone={mode.tone}>Aktif</Badge>
              </div>
              <h3 className="mt-5 text-xl font-black text-[var(--ra-text-primary)]">
                {mode.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--ra-text-secondary)]">
                {mode.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--ra-cyan-bright)]">
                {mode.cta}
                <ArrowRight
                  size={16}
                  aria-hidden="true"
                  className="transition group-hover:translate-x-1"
                />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function TopicRecommendationGrid({
  topics,
  onUseTopic,
}: {
  topics: DebateTopic[];
  onUseTopic: (topic: DebateTopic) => void;
}) {
  return (
    <section aria-labelledby="topic-recommendation-title" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Badge tone="positive">Topik rekomendasi</Badge>
          <h2
            id="topic-recommendation-title"
            className="mt-3 text-2xl font-black text-[var(--ra-text-primary)]"
          >
            Arena yang bisa langsung dipanasi
          </h2>
        </div>
        <Link
          href="/topics"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[var(--ra-radius-md)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] px-3 text-sm font-semibold text-[var(--ra-text-secondary)] transition hover:bg-[var(--ra-bg-panel-strong)] hover:text-[var(--ra-text-primary)]"
        >
          Semua topik
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {topics.map((topic) => (
          <TopicRecommendationCard
            key={topic.id}
            topic={topic}
            onUseTopic={onUseTopic}
          />
        ))}
      </div>
    </section>
  );
}

function TopicRecommendationCard({
  topic,
  onUseTopic,
}: {
  topic: DebateTopic;
  onUseTopic: (topic: DebateTopic) => void;
}) {
  const art = topicArt[topic.id];

  return (
    <button
      type="button"
      onClick={() => onUseTopic(topic)}
      className="group relative min-h-[210px] overflow-hidden rounded-[var(--ra-radius-lg)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] p-4 text-left shadow-[var(--ra-shadow-card)] transition hover:border-[var(--ra-cyan)] hover:shadow-[var(--ra-glow-esports-cyan)]"
    >
      {art ? (
        <Image
          src={art.src}
          alt=""
          fill
          sizes="(min-width: 1024px) 360px, 100vw"
          className="object-cover opacity-90 transition duration-300 group-hover:scale-[1.04]"
          style={{ objectPosition: art.position }}
          aria-hidden="true"
        />
      ) : null}
      <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,11,19,0.14),rgba(7,11,19,0.48)_42%,var(--ra-bg-deep))]" />
      <span className="absolute inset-x-0 top-0 h-1 bg-[var(--ra-cyan)]" />

      <div className="relative z-[1] flex items-start justify-between gap-3">
        <Badge tone={topic.difficulty === "lanjutan" ? "warning" : "positive"}>
          {topic.category}
        </Badge>
        <SpiceMeter level={topic.spiceLevel ?? 2} compact />
      </div>

      <div className="relative z-[1] mt-16">
        <h3 className="line-clamp-2 text-base font-black leading-snug text-[var(--ra-text-primary)]">
          {topic.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--ra-text-secondary)]">
          {topic.shortContext}
        </p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--ra-cyan-bright)]">
          Pakai topik
          <ArrowRight
            size={15}
            aria-hidden="true"
            className="transition group-hover:translate-x-1"
          />
        </span>
      </div>
    </button>
  );
}

function LatestHistoryCard({
  latestSession,
  completedCount,
  activeCount,
}: {
  latestSession: DebateSession | null;
  completedCount: number;
  activeCount: number;
}) {
  const targetHref = latestSession
    ? latestSession.status === "COMPLETED"
      ? `/results/${latestSession.id}`
      : `/arena/${latestSession.id}`
    : "/history";

  return (
    <Card variant="outline" className="bg-[var(--ra-bg-glass)] xl:sticky xl:top-7">
      <Badge tone={latestSession ? "positive" : "neutral"}>
        Riwayat terakhir
      </Badge>
      <CardTitle className="mt-4 text-xl">
        {latestSession ? latestSession.topic.title : "Belum ada sesi lokal"}
      </CardTitle>
      <CardDescription className="mt-2">
        {latestSession
          ? `${readStatusLabel(latestSession.status)} - ${formatSessionDate(
              latestSession.completedAt ?? latestSession.startedAt,
            )}`
          : "Mulai satu debat untuk mengisi riwayat di browser ini."}
      </CardDescription>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <LocalMetric label="Selesai" value={completedCount} />
        <LocalMetric label="Aktif" value={activeCount} />
      </div>

      {latestSession?.report ? (
        <div className="mt-5 rounded-[var(--ra-radius-lg)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] p-4">
          <div className="flex items-start gap-3">
            <Sparkles
              size={18}
              aria-hidden="true"
              className="mt-1 shrink-0 text-[var(--ra-gold-bright)]"
            />
            <p className="text-sm leading-6 text-[var(--ra-text-secondary)]">
              {latestSession.report.biggestImprovementArea}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-[var(--ra-radius-lg)] border border-[var(--ra-border-subtle)] bg-[var(--ra-bg-panel)] p-4">
          <div className="flex items-start gap-3">
            <FileText
              size={18}
              aria-hidden="true"
              className="mt-1 shrink-0 text-[var(--ra-cyan-bright)]"
            />
            <p className="text-sm leading-6 text-[var(--ra-text-secondary)]">
              Laporan wasit akan muncul setelah sesi selesai.
            </p>
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={targetHref}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--ra-radius-md)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] px-4 py-2 text-sm font-semibold text-[var(--ra-text-primary)] transition hover:bg-[var(--ra-bg-panel-strong)]"
        >
          <History size={17} aria-hidden="true" />
          {latestSession ? "Buka sesi" : "Buka riwayat"}
        </Link>
        {latestSession ? (
          <Link
            href={`/results/${latestSession.id}/coach`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--ra-radius-md)] border border-[var(--ra-border-default)] px-4 py-2 text-sm font-semibold text-[var(--ra-text-secondary)] transition hover:bg-[var(--ra-bg-panel)] hover:text-[var(--ra-text-primary)]"
          >
            <Clock size={17} aria-hidden="true" />
            Coach
          </Link>
        ) : null}
      </div>
    </Card>
  );
}

function readStatusLabel(status: DebateSession["status"]): string {
  if (status === "COMPLETED") {
    return "Selesai";
  }

  if (status === "AWAITING_JUDGE") {
    return "Menunggu laporan";
  }

  if (status === "IN_PROGRESS") {
    return "Sedang berjalan";
  }

  return "Setup";
}

function formatSessionDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "tanggal tidak tersedia";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}
