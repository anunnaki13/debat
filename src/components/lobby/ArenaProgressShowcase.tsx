import Image from "next/image";
import { ArrowRight, Crown, Share2, Shield, Trophy } from "lucide-react";
import { Badge } from "@/components/ui";
import { arenaReferenceAssets, personaPortraits } from "@/lib/arena-reference-assets";

const careerSteps = [
  { label: "Aktivis", range: "0 - 1.000 XP", active: true },
  { label: "Ketua OSIS", range: "1.000 - 3.000 XP", active: true },
  { label: "Caleg DPRD", range: "3.000 - 8.000 XP", active: true },
  { label: "Presiden", range: "20.000+ XP", active: false },
] as const;

export function ArenaProgressShowcase() {
  return (
    <section className="grid gap-4 xl:grid-cols-[1.2fr_0.9fr_0.9fr]">
      <div className="relative overflow-hidden rounded-[var(--ra-radius-xl)] border border-[rgba(90,142,255,0.24)] bg-[rgba(5,12,28,0.82)] p-4 shadow-[var(--ra-shadow-card)]">
        <Image
          src={arenaReferenceAssets.arenaStagePodium}
          alt=""
          fill
          sizes="(min-width: 1280px) 36vw, 100vw"
          className="object-cover object-center opacity-[0.26]"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,8,23,0.96),rgba(2,8,23,0.64))]" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <Trophy size={18} aria-hidden="true" className="text-[var(--ra-gold)]" />
            <h2 className="text-sm font-black uppercase tracking-wide text-[var(--ra-text-primary)]">
              Karir Politikmu
            </h2>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            {careerSteps.map((step, index) => (
              <div key={step.label} className="relative">
                {index > 0 ? (
                  <span className="absolute -left-3 top-8 hidden h-px w-6 bg-[rgba(255,255,255,0.18)] sm:block" />
                ) : null}
                <div
                  className={`rounded-[var(--ra-radius-lg)] border p-3 text-center ${
                    step.active
                      ? "border-[rgba(216,170,92,0.42)] bg-[rgba(216,170,92,0.10)]"
                      : "border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.04)] opacity-70"
                  }`}
                >
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-[var(--ra-radius-pill)] border border-[rgba(216,170,92,0.42)] bg-[rgba(2,8,23,0.72)] text-[var(--ra-gold)]">
                    {index === 0 ? <Shield size={19} aria-hidden="true" /> : <Crown size={19} aria-hidden="true" />}
                  </span>
                  <p className="mt-3 text-xs font-black uppercase text-[var(--ra-text-primary)]">
                    {step.label}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-[var(--ra-text-muted)]">
                    {step.range}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[var(--ra-radius-xl)] border border-[rgba(123,93,255,0.28)] bg-[rgba(8,10,26,0.84)] p-4 shadow-[var(--ra-shadow-card)]">
        <Image
          src={arenaReferenceAssets.badgeSheet}
          alt=""
          fill
          sizes="(min-width: 1280px) 28vw, 100vw"
          className="object-cover object-center opacity-[0.22]"
          aria-hidden="true"
        />
        <div className="relative">
          <h2 className="text-sm font-black uppercase tracking-wide text-[var(--ra-text-primary)]">
            Profil Ideologi
          </h2>
          <div className="mt-4 grid grid-cols-[130px_minmax(0,1fr)] gap-4">
            <div className="grid aspect-square place-items-center rounded-[var(--ra-radius-lg)] border border-[rgba(157,98,255,0.32)] bg-[radial-gradient(circle,rgba(129,77,255,0.24),rgba(3,8,20,0.86))]">
              <div className="h-20 w-20 rotate-45 border border-[rgba(188,120,255,0.60)] bg-[rgba(123,66,255,0.22)] shadow-[0_0_30px_rgba(123,66,255,0.34)]" />
            </div>
            <div>
              <Badge tone="special">Tipe Anda</Badge>
              <p className="mt-3 text-xl font-black text-[#e49aff]">
                Pragmatic Reformis
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--ra-text-secondary)]">
                Seimbang antara idealisme dan realisme, fokus pada solusi praktis.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[var(--ra-radius-xl)] border border-[rgba(90,142,255,0.26)] bg-[rgba(5,12,28,0.84)] p-4 shadow-[var(--ra-shadow-card)]">
        <div className="flex items-center gap-2">
          <Share2 size={18} aria-hidden="true" className="text-[#55dfff]" />
          <h2 className="text-sm font-black uppercase tracking-wide text-[var(--ra-text-primary)]">
            Bagikan Hasil
          </h2>
        </div>
        <div className="mt-4 grid grid-cols-[70px_minmax(0,1fr)] gap-3 rounded-[var(--ra-radius-lg)] border border-[rgba(123,93,255,0.28)] bg-[linear-gradient(135deg,rgba(107,54,255,0.24),rgba(37,149,255,0.12))] p-3">
          <span
            className="h-16 w-16 rounded-[var(--ra-radius-pill)] border border-[#55dfff] bg-cover shadow-[0_0_24px_rgba(68,196,255,0.30)]"
            style={{
              backgroundImage: `url(${personaPortraits.livePlayer})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
            aria-hidden="true"
          />
          <div>
            <p className="text-base font-black leading-tight text-[var(--ra-text-primary)]">
              Saya baru saja debat di Arena Politika!
            </p>
            <p className="mt-2 text-xs font-bold text-[var(--ra-text-secondary)]">
              Skor sementara 78/100
            </p>
          </div>
        </div>
        <button
          type="button"
          className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-[var(--ra-radius-md)] border border-[rgba(90,142,255,0.34)] bg-[rgba(11,22,48,0.76)] text-sm font-bold text-[var(--ra-text-primary)]"
        >
          Lihat Kartu Hasil
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
