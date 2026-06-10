"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpenCheck,
  Clock,
  Crosshair,
  FileText,
  History,
  Mic2,
  PenLine,
  RadioTower,
  Sparkles,
  Swords,
  Trophy,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  AnimatedAvatarRing,
  AnimatedWaveform,
  ArenaParticleField,
  EnergyDivider,
} from "@/components/arena/ArenaEffects";
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
    <section className="ra-hud-panel ra-arena-scanline relative min-h-[520px] overflow-hidden rounded-[var(--ra-radius-xl)] border border-[rgba(21,248,255,0.36)] bg-[#020713] shadow-[var(--ra-shadow-elevated)]">
      <Image
        src="/assets/arena/arena-backdrop.svg"
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) calc(100vw - 680px), 100vw"
        className="object-cover object-center opacity-70"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_27%_24%,rgba(21,248,255,0.24),transparent_30%),radial-gradient(circle_at_78%_20%,rgba(255,43,214,0.18),transparent_30%),linear-gradient(90deg,rgba(2,7,19,0.96),rgba(2,7,19,0.78)_44%,rgba(2,7,19,0.40))]" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-[linear-gradient(0deg,#020713,transparent)]" />
      <ArenaParticleField density={14} />

      <div className="relative grid min-h-[520px] gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_390px] lg:p-8">
        <div className="flex min-w-0 flex-col justify-between">
          <div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="user" className="uppercase tracking-[0.18em]">
              Live Debate Arena
            </Badge>
            <Badge tone="special" className="uppercase tracking-[0.18em]">
              High Tech Match
            </Badge>
          </div>

          <div className="mt-10 max-w-4xl">
            <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.22em] text-[var(--ra-cyan-bright)]">
              <RadioTower size={16} aria-hidden="true" />
              {hasHistory ? "Selamat datang kembali" : "Selamat datang di arena"}
            </p>
            <h1 className="mt-3 text-4xl font-black uppercase leading-[0.95] text-[var(--ra-text-primary)] drop-shadow-[0_0_34px_rgba(21,248,255,0.20)] sm:text-6xl lg:text-7xl">
              Masuk Arena.
              <span className="block text-[var(--ra-cyan-bright)]">
                Lawan AI.
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--ra-text-secondary)] sm:text-lg">
              Pilih topik, nyalakan mode text atau voice, lalu bertanding dalam
              HUD kompetitif melawan AI oposisi dengan wasit objektif.
            </p>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button
              size="lg"
              className="ra-laser-sweep min-w-[190px] border border-[rgba(21,248,255,0.42)]"
              onClick={onPrimaryAction}
              leadingIcon={<Swords size={19} aria-hidden="true" />}
              trailingIcon={<ArrowRight size={18} aria-hidden="true" />}
            >
              Mulai Debat AI
            </Button>
            <Link
              href="/topics"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--ra-radius-md)] border border-[rgba(255,255,255,0.16)] bg-[rgba(7,11,19,0.72)] px-5 py-3 text-base font-semibold text-[var(--ra-text-primary)] transition hover:border-[var(--ra-cyan)] hover:bg-[var(--ra-cyan-soft)]"
            >
              Lihat Topik
              <BookOpenCheck size={18} aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-8 max-w-3xl">
            <EnergyDivider />
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <ArenaStep icon={BookOpenCheck} label="Pilih match" />
              <ArenaStep icon={Mic2} label="Aktifkan mode" />
              <ArenaStep icon={Trophy} label="Claim verdict" />
            </div>
          </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="ra-animated-frame rounded-[var(--ra-radius-xl)]">
            <div className="relative overflow-hidden rounded-[var(--ra-radius-xl)] border border-[rgba(21,248,255,0.26)] bg-[rgba(5,9,22,0.88)] p-4 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-black uppercase tracking-[0.26em] text-[var(--ra-cyan-bright)]">
                  Arena Match HUD
                </p>
                <Badge tone="ai">AI Online</Badge>
              </div>

              <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <DuelHudAvatar
                  label="Player"
                  src="/assets/arena/personas/field-commander.png"
                  tone="user"
                />
                <div className="grid h-14 w-14 place-items-center rounded-[var(--ra-radius-pill)] border border-[rgba(216,170,92,0.44)] bg-[rgba(216,170,92,0.12)] text-[var(--ra-gold-bright)] shadow-[var(--ra-glow-gold)]">
                  <Zap size={24} aria-hidden="true" />
                </div>
                <DuelHudAvatar
                  label="AI"
                  src="/assets/arena/personas/strategist.png"
                  tone="ai"
                />
              </div>

              <div className="mt-6 rounded-[var(--ra-radius-lg)] border border-[rgba(255,255,255,0.10)] bg-[rgba(7,11,19,0.72)] p-3">
                <div className="flex items-center justify-between gap-3 text-xs font-black uppercase tracking-[0.14em]">
                  <span className="text-[var(--ra-cyan-bright)]">Momentum</span>
                  <span className="text-[var(--ra-magenta-bright)]">AI pressure</span>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-[var(--ra-radius-pill)] bg-[rgba(255,255,255,0.10)]">
                  <div className="h-full w-[58%] rounded-[var(--ra-radius-pill)] bg-[linear-gradient(90deg,var(--ra-electric-cyan),var(--ra-magenta))] shadow-[0_0_22px_rgba(21,248,255,0.72)]" />
                </div>
                <AnimatedWaveform tone="user" className="mt-4 bg-[rgba(2,8,23,0.78)]" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <LocalMetric label="Selesai lokal" value={completedCount} />
                <LocalMetric label="Aktif lokal" value={activeCount} />
              </div>
            </div>
          </div>

          <div className="rounded-[var(--ra-radius-xl)] border border-[rgba(255,43,214,0.22)] bg-[rgba(20,5,30,0.66)] p-4 backdrop-blur-xl">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--ra-magenta-bright)]">
              <Crosshair size={14} aria-hidden="true" />
              Match Rule
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--ra-text-secondary)]">
              AI selalu mengambil sisi lawan. Wasit AI memberi verdict setelah
              semua ronde selesai.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function DuelHudAvatar({
  label,
  src,
  tone,
}: {
  label: string;
  src: string;
  tone: "user" | "ai";
}) {
  return (
    <div className="text-center">
      <AnimatedAvatarRing
        tone={tone}
        active
        className="mx-auto h-24 w-24 sm:h-28 sm:w-28"
      >
        <Image
          src={src}
          alt=""
          width={92}
          height={92}
          className="h-[92px] w-[92px] rounded-[var(--ra-radius-pill)] object-cover"
          aria-hidden="true"
        />
      </AnimatedAvatarRing>
      <p
        className={`mt-3 text-xs font-black uppercase tracking-[0.24em] ${
          tone === "ai"
            ? "text-[var(--ra-magenta-bright)]"
            : "text-[var(--ra-cyan-bright)]"
        }`}
      >
        {label}
      </p>
    </div>
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
    <Card
      variant="selected"
      className="ra-hud-panel relative overflow-hidden border-[rgba(216,170,92,0.34)] bg-[rgba(7,11,19,0.82)]"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-[image:linear-gradient(90deg,var(--ra-electric-cyan),var(--ra-magenta),var(--ra-gold))]" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge tone="prestige" className="uppercase tracking-[0.16em]">
            Training Quest
          </Badge>
          <CardTitle className="mt-4 text-2xl uppercase">
            Sesi berikutnya
          </CardTitle>
        </div>
        <Image
          src="/assets/arena/rank-orator-badge.svg"
          alt=""
          width={58}
          height={58}
          aria-hidden="true"
        />
      </div>
      <CardDescription className="mt-2">
        {exercise}
      </CardDescription>

      <div className="mt-5 rounded-[var(--ra-radius-lg)] border border-[rgba(21,248,255,0.24)] bg-[rgba(21,248,255,0.08)] p-4">
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
              className="group ra-hud-panel relative min-h-[210px] overflow-hidden rounded-[var(--ra-radius-lg)] border border-[rgba(255,255,255,0.12)] bg-[rgba(7,16,28,0.82)] p-5 text-left shadow-[var(--ra-shadow-card)] transition hover:border-[var(--ra-electric-cyan)] hover:bg-[rgba(7,16,28,0.95)] hover:shadow-[var(--ra-glow-esports-cyan)]"
            >
              <span className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--ra-electric-cyan),var(--ra-magenta))] opacity-70" />
              <span className="absolute -right-10 -top-10 h-36 w-36 rounded-[var(--ra-radius-pill)] bg-[rgba(21,248,255,0.10)] blur-2xl transition group-hover:bg-[rgba(255,43,214,0.14)]" />
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-[var(--ra-radius-md)] border border-[var(--ra-cyan)] bg-[var(--ra-cyan-soft)] text-[var(--ra-cyan-bright)]">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <Badge tone={mode.tone} className="uppercase tracking-[0.12em]">
                  Aktif
                </Badge>
              </div>
              <h3 className="mt-5 text-xl font-black uppercase text-[var(--ra-text-primary)]">
                {mode.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--ra-text-secondary)]">
                {mode.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.08em] text-[var(--ra-cyan-bright)]">
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
