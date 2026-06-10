"use client";

import {
  ArrowRight,
  Bell,
  Check,
  Compass,
  Gavel,
  Home,
  Mic,
  Pause,
  Settings,
  Sparkles,
  Swords,
  Volume2,
} from "lucide-react";
import { LoadingDots } from "@/components/common/LoadingDots";
import { useState } from "react";
import {
  Badge,
  BottomSheet,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Chip,
  ErrorState,
  IconButton,
  Input,
  Modal,
  Skeleton,
  Textarea,
  Toast,
} from "@/components/ui";
import { arenaVisualStates } from "@/lib/design-tokens";

const waveformBars = [18, 34, 22, 48, 28, 54, 36, 24, 42, 30, 46, 20];
const foundationTokens = [
  ["App shell", "var(--ra-bg-app-shell)", "--ra-bg-app-shell"],
  ["Panel", "var(--ra-bg-panel)", "--ra-bg-panel"],
  ["Glass", "var(--ra-bg-glass)", "--ra-bg-glass"],
  ["Action", "var(--ra-action)", "--ra-action"],
  ["AI", "var(--ra-ai)", "--ra-ai"],
  ["Prestige", "var(--ra-prestige)", "--ra-prestige"],
  ["Focus", "var(--ra-focus-ring)", "--ra-focus-ring"],
  ["Chrome", "var(--ra-bg-sidebar)", "--ra-bg-sidebar"],
] as const;

const navPreviewItems = [
  { label: "Beranda", icon: Home, active: false },
  { label: "Main", icon: Swords, active: true },
  { label: "Topik", icon: Compass, active: false },
] as const;

export function UiPlayground() {
  const [modalOpen, setModalOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedChip, setSelectedChip] = useState("Siap");

  return (
    <main
      data-ra-theme="default"
      className="min-h-screen px-4 py-6 text-[var(--ra-text-primary)] sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="rounded-[var(--ra-radius-xl)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-glass)] p-5 shadow-[var(--ra-shadow-elevated)] md:p-8">
          <Badge tone="prestige">Sprint R3</Badge>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_340px] lg:items-end">
            <div>
              <h1 className="max-w-3xl font-serif text-4xl font-bold leading-tight text-[var(--ra-text-primary)]">
                Republik Argumen Design Foundation
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--ra-text-secondary)]">
                Playground visual untuk tokens, komponen dasar, state UI, dan
                arah Modern Civic Arena. Halaman ini tidak memanggil API.
              </p>
            </div>
            <div className="rounded-[var(--ra-radius-lg)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] p-4">
              <p className="text-sm font-semibold text-[var(--ra-text-secondary)]">
                North star
              </p>
              <p className="mt-2 font-serif text-2xl font-bold leading-tight">
                Panas pada gagasan. Tenang pada pembuktian.
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr_360px]">
          <PlaygroundSection title="Tokens" description="Warna, surface, glow, dan chrome utama dipanggil lewat variable.">
            <div className="grid gap-3 sm:grid-cols-2">
              {foundationTokens.map(([label, background, token]) => (
                <div
                  key={token}
                  className="flex min-h-16 items-center gap-3 rounded-[var(--ra-radius-md)] border border-[var(--ra-border-subtle)] bg-[var(--ra-bg-panel)] p-3"
                >
                  <span
                    className="h-10 w-10 shrink-0 rounded-[var(--ra-radius-sm)] border border-[var(--ra-border-default)]"
                    style={{ background }}
                    aria-hidden="true"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-bold">{label}</span>
                    <code className="block truncate text-xs text-[var(--ra-text-muted)]">
                      {token}
                    </code>
                  </span>
                </div>
              ))}
            </div>
          </PlaygroundSection>

          <PlaygroundSection title="Typography" description="Display untuk judul arena, UI font untuk kontrol cepat dibaca.">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--ra-text-muted)]">
                  Display
                </p>
                <p className="mt-2 font-serif text-3xl font-bold leading-tight">
                  Panas pada gagasan
                </p>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--ra-text-muted)]">
                  Interface
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--ra-text-secondary)]">
                  Debat harus terasa cepat, jelas, dan dapat dipindai tanpa
                  kehilangan nuansa arena.
                </p>
              </div>
            </div>
          </PlaygroundSection>

          <PlaygroundSection title="Sidebar and Bottom Nav" description="Chrome navigasi memakai token yang sama dengan AppShell.">
            <div className="rounded-[var(--ra-radius-lg)] border border-[var(--ra-border-chrome)] bg-[image:var(--ra-bg-sidebar)] p-3">
              <div className="rounded-[var(--ra-radius-md)] border border-[var(--ra-border-brand)] bg-[var(--ra-bg-brand-panel)] p-3 text-center">
                <p className="font-black uppercase leading-none text-[var(--ra-text-primary)]">
                  Republik
                </p>
                <p className="mt-1 font-black uppercase leading-none text-[var(--ra-brand-mark)]">
                  Argumen
                </p>
              </div>
              <div className="mt-3 grid gap-1.5">
                {navPreviewItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className={`flex min-h-10 items-center gap-2 rounded-[var(--ra-radius-md)] border px-3 text-sm font-bold ${
                        item.active
                          ? "border-[var(--ra-border-nav-active)] bg-[image:var(--ra-bg-nav-active)] shadow-[var(--ra-shadow-nav-active)]"
                          : "border-transparent text-[var(--ra-text-secondary)]"
                      }`}
                    >
                      <Icon size={16} aria-hidden="true" />
                      {item.label}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-1 rounded-[var(--ra-radius-lg)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-mobile-nav)] p-2">
              {["Home", "Main", "Buat", "Topik", "Log"].map((label, index) => (
                <span
                  key={label}
                  className={`grid min-h-12 place-items-center rounded-[var(--ra-radius-md)] text-[10px] font-bold ${
                    index === 2
                      ? "bg-[var(--ra-cyan)] text-[var(--ra-text-inverse)] shadow-[var(--ra-glow-user)]"
                      : "text-[var(--ra-text-muted)]"
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>
          </PlaygroundSection>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <PlaygroundSection title="Buttons" description="Primary action jelas, state loading/disabled terlihat.">
            <div className="flex flex-wrap gap-3">
              <Button leadingIcon={<Mic size={18} aria-hidden="true" />}>
                Mulai Debat
              </Button>
              <Button variant="secondary">Masuk Arena</Button>
              <Button variant="outline">Lihat Detail</Button>
              <Button variant="ghost">Gunakan Teks Saja</Button>
              <Button variant="danger" leadingIcon={<Pause size={18} aria-hidden="true" />}>
                Interupsi
              </Button>
              <Button variant="prestige" trailingIcon={<ArrowRight size={18} aria-hidden="true" />}>
                Reveal Hasil
              </Button>
              <Button isLoading>Memproses</Button>
              <Button disabled>Nonaktif</Button>
              <IconButton
                icon={<Settings size={18} aria-hidden="true" />}
                label="Buka pengaturan"
                variant="secondary"
              />
            </div>
          </PlaygroundSection>

          <PlaygroundSection title="Badges and Chips" description="Status selalu memakai label, bukan warna saja.">
            <div className="flex flex-wrap gap-2">
              <Badge tone="user">User bicara</Badge>
              <Badge tone="ai">AI menjawab</Badge>
              <Badge tone="prestige">Majelis AI</Badge>
              <Badge tone="positive">Stabil</Badge>
              <Badge tone="warning">Perlu cek</Badge>
              <Badge tone="special">Beta</Badge>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Siap", "Mendengarkan", "Transkrip siap", "AI menjawab"].map(
                (label) => (
                  <Chip
                    key={label}
                    selected={selectedChip === label}
                    tone={selectedChip === label ? "cyan" : "neutral"}
                    onClick={() => setSelectedChip(label)}
                  >
                    {label}
                  </Chip>
                ),
              )}
            </div>
          </PlaygroundSection>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr_360px]">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Mode Card</CardTitle>
              <CardDescription>
                Selected state memakai accent glow ringan, bukan dekorasi berlebihan.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Card variant="selected" className="p-4">
                <Badge tone="user">Aktif</Badge>
                <h4 className="mt-4 font-serif text-xl font-bold">Duel Wacana AI</h4>
                <p className="mt-2 text-sm leading-6 text-[var(--ra-text-secondary)]">
                  Latihan debat 1 lawan 1 dengan AI.
                </p>
              </Card>
              <Card variant="outline" className="p-4 opacity-80">
                <Badge tone="warning">Coming soon</Badge>
                <h4 className="mt-4 font-serif text-xl font-bold">Kursi Panas AI</h4>
                <p className="mt-2 text-sm leading-6 text-[var(--ra-text-secondary)]">
                  Hadapi beberapa persona AI secara bergiliran.
                </p>
              </Card>
            </CardContent>
          </Card>

          <PlaygroundSection title="Inputs" description="Fields mobile-friendly dengan helper text dan disabled state.">
            <div className="grid gap-4">
              <Input
                label="Tesis utama"
                name="thesis"
                placeholder="Naturaliasi pemain adalah jalan pintas yang perlu dibatasi."
                helperText="Tulis klaim yang spesifik dan bisa dibantah."
              />
              <Textarea
                label="Konteks opsional"
                name="context"
                placeholder="Tambahkan konteks singkat..."
                helperText="Maksimal ringkas agar arena tetap fokus."
              />
              <Input label="Disabled" name="disabled" value="Tidak aktif" disabled readOnly />
            </div>
          </PlaygroundSection>

          <PlaygroundSection title="Toast and Error" description="Copy ramah, bukan pesan teknis mentah.">
            <Toast
              tone="success"
              title="Mikrofon siap"
              description="Mikrofon menangkap suara Anda."
              icon={<Check size={18} aria-hidden="true" />}
            />
            <div className="mt-4">
              <ErrorState
                title="Suara AI belum berhasil dibuat"
                description="Anda tetap dapat membaca responsnya dan lanjut melalui teks."
                actionLabel="Coba Lagi"
                onAction={() => setModalOpen(true)}
              />
            </div>
          </PlaygroundSection>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <PlaygroundSection title="Arena Visual States" description="State eksplisit dari blueprint UI/UX.">
            <div className="grid gap-2">
              {arenaVisualStates.slice(0, 8).map((state) => (
                <div
                  key={state}
                  className="flex min-h-10 items-center justify-between rounded-[var(--ra-radius-md)] border border-[var(--ra-border-subtle)] bg-[var(--ra-bg-panel)] px-3 text-sm"
                >
                  <span>{state.replaceAll("_", " ")}</span>
                  <Badge tone={state.includes("ai") ? "ai" : "user"}>state</Badge>
                </div>
              ))}
            </div>
          </PlaygroundSection>

          <PlaygroundSection title="Voice and Halo" description="Motion menjelaskan status voice, bukan ornamen.">
            <div className="flex flex-col items-center gap-5">
              <div className="relative grid h-40 w-40 place-items-center rounded-[var(--ra-radius-pill)] border border-[var(--ra-coral)] bg-[var(--ra-coral-soft)]">
                <span
                  className="absolute inset-3 rounded-[var(--ra-radius-pill)] border border-[var(--ra-coral)]"
                  style={{ animation: "ra-halo-pulse 1.8s ease-in-out infinite" }}
                  aria-hidden="true"
                />
                <Gavel size={44} aria-hidden="true" className="text-[var(--ra-coral-bright)]" />
              </div>
              <div className="flex h-16 items-end gap-2" aria-label="Waveform contoh">
                {waveformBars.map((height, index) => (
                  <span
                    key={`${height}-${index}`}
                    className="w-2 rounded-[var(--ra-radius-pill)] bg-[var(--ra-cyan)]"
                    style={{ height }}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <Badge tone="ai">AI sedang berbicara</Badge>
            </div>
          </PlaygroundSection>

          <PlaygroundSection title="Skeleton and Momentum" description="Loading dan momentum punya label angka.">
            <div className="space-y-4">
              <LoadingDots label="AI sedang menyiapkan respons" />
              <Skeleton className="h-8" />
              <Skeleton className="h-24" />
              <div>
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span>Anda 58%</span>
                  <span>42% AI</span>
                </div>
                <div className="mt-2 h-3 overflow-hidden rounded-[var(--ra-radius-pill)] bg-[var(--ra-bg-panel)]">
                  <div className="h-full w-[58%] rounded-[var(--ra-radius-pill)] bg-[var(--ra-cyan)]" />
                </div>
                <p className="mt-2 text-xs leading-5 text-[var(--ra-text-muted)]">
                  Momentum adalah indikator dinamika debat, bukan penilaian akhir.
                </p>
              </div>
            </div>
          </PlaygroundSection>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <PlaygroundSection title="Overlay Components" description="Modal dan bottom sheet memiliki Escape close dan fokus awal.">
            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                leadingIcon={<Bell size={18} aria-hidden="true" />}
                onClick={() => setModalOpen(true)}
              >
                Buka Modal
              </Button>
              <Button
                variant="outline"
                leadingIcon={<Volume2 size={18} aria-hidden="true" />}
                onClick={() => setSheetOpen(true)}
              >
                Buka Bottom Sheet
              </Button>
            </div>
          </PlaygroundSection>

          <PlaygroundSection title="Reduced Motion Base" description="CSS global menghormati prefers-reduced-motion.">
            <div className="rounded-[var(--ra-radius-lg)] border border-[var(--ra-border-default)] bg-[var(--ra-bg-panel)] p-4">
              <div className="flex items-start gap-3">
                <Sparkles size={20} aria-hidden="true" className="mt-1 text-[var(--ra-gold-bright)]" />
                <p className="text-sm leading-6 text-[var(--ra-text-secondary)]">
                  Pulse, skeleton, dan transisi tetap memiliki label/status. Saat
                  reduced motion aktif, animasi disederhanakan oleh CSS global.
                </p>
              </div>
            </div>
          </PlaygroundSection>
        </section>
      </div>

      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Periksa Transkrip"
        description="STT dapat salah. Koreksi dulu sebelum argumen dikirim."
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Rekam Ulang
            </Button>
            <Button onClick={() => setModalOpen(false)}>Kirim Argumen</Button>
          </>
        }
      >
        <Textarea
          label="Transkrip"
          name="modal-transcript"
          defaultValue="Naturalisasi dapat membantu jangka pendek, tetapi pembinaan muda tetap harus menjadi prioritas."
        />
      </Modal>

      <BottomSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title="Delivery Coach"
        description="Sinyal teknis bicara, bukan deteksi emosi."
        footer={
          <Button variant="secondary" onClick={() => setSheetOpen(false)}>
            Tutup
          </Button>
        }
      >
        <div className="grid gap-3">
          {[
            ["Kecepatan bicara", "147 kata/menit", "Cukup jelas"],
            ["Filler words", "4 kali", "Kurangi filler sebelum data utama."],
            ["Rasio jeda", "18%", "Stabil"],
          ].map(([title, value, note]) => (
            <Card key={title} variant="outline" className="p-4">
              <p className="text-sm text-[var(--ra-text-secondary)]">{title}</p>
              <p className="mt-1 font-serif text-2xl font-bold">{value}</p>
              <p className="mt-1 text-sm text-[var(--ra-text-muted)]">{note}</p>
            </Card>
          ))}
        </div>
      </BottomSheet>
    </main>
  );
}

function PlaygroundSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card variant="outline">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
