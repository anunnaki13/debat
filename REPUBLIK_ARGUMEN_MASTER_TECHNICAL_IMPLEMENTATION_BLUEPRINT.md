# REPUBLIK ARGUMEN — MASTER TECHNICAL IMPLEMENTATION BLUEPRINT
> **Dokumen teknis utama untuk Codex dan developer**  
> Versi: `1.0.0-master-technical-blueprint`  
> Status: **SOURCE OF TRUTH UTAMA**  
> Target produk aktif: **Voice-first AI debate game MVP yang stabil, premium, dan ready to upscale**  
> Strategi: **modular monolith terlebih dahulu, scale secara bertahap**  
> Bahasa UI utama: **Bahasa Indonesia**  
> Brand utama: **REPUBLIK ARGUMEN**  
> Tagline: **Panas pada gagasan. Tenang pada pembuktian.**

---

# 0. CARA MENGGUNAKAN DOKUMEN INI

Dokumen ini menyatukan dan menstrukturkan keputusan dari blueprint terdahulu:

```text
REPUBLIK_ARGUMEN_MVP_AI_DEBATE_BLUEPRINT.md
REPUBLIK_ARGUMEN_MVP_VOICE_ARENA_BLUEPRINT.md
REPUBLIK_ARGUMEN_UI_UX_STYLE_BLUEPRINT.md
REPUBLIK_ARGUMEN_UI_UX_RECOVERY_AND_CONTINUATION_BLUEPRINT.md
REPUBLIK_ARGUMEN_COMMERCIAL_ALPHA_BLUEPRINT.md
```

Mulai sekarang:

# **Dokumen ini menjadi master plan utama.**

Dokumen lama tetap berguna sebagai detail historis atau referensi pendukung, tetapi apabila terdapat konflik maka aturan pada dokumen ini yang digunakan.

## 0.1 Hierarki dokumen di repository

Gunakan struktur:

```text
/
├── README.md
├── REPUBLIK_ARGUMEN_MASTER_TECHNICAL_IMPLEMENTATION_BLUEPRINT.md
│
├── docs/
│   ├── blueprint/
│   │   ├── README_BLUEPRINT_ORDER.md
│   │   ├── active/
│   │   │   └── REPUBLIK_ARGUMEN_MASTER_TECHNICAL_IMPLEMENTATION_BLUEPRINT.md
│   │   └── archive/
│   │       ├── REPUBLIK_ARGUMEN_MVP_AI_DEBATE_BLUEPRINT.md
│   │       ├── REPUBLIK_ARGUMEN_MVP_VOICE_ARENA_BLUEPRINT.md
│   │       ├── REPUBLIK_ARGUMEN_UI_UX_STYLE_BLUEPRINT.md
│   │       ├── REPUBLIK_ARGUMEN_UI_UX_RECOVERY_AND_CONTINUATION_BLUEPRINT.md
│   │       └── REPUBLIK_ARGUMEN_COMMERCIAL_ALPHA_BLUEPRINT.md
│   │
│   ├── audit-current-state/
│   │   ├── 01_current_top_dashboard.png
│   │   ├── 02_current_mid_dashboard.png
│   │   └── 03_current_topic_setup.png
│   │
│   ├── design-reference/
│   │   ├── 01_primary_modern_civic_arena.png
│   │   └── 02_feature_rich_reference.png
│   │
│   ├── adr/
│   ├── progress/
│   ├── recovery/
│   ├── visual-qa/
│   └── runbooks/
│
└── ...
```

## 0.2 Aturan keras untuk Codex

1. Jangan mengerjakan seluruh dokumen sekaligus.
2. Kerjakan **satu phase** dan **satu sprint** dalam satu waktu.
3. Setelah satu sprint selesai:
   - jalankan lint;
   - jalankan type-check;
   - jalankan unit test;
   - jalankan integration test yang relevan;
   - jalankan production build;
   - jalankan smoke test;
   - simpan screenshot QA;
   - tulis laporan;
   - berhenti dan tunggu persetujuan.
4. Jangan menambah fitur di luar scope sprint aktif.
5. Jangan memindahkan secret ke browser.
6. Jangan menampilkan data palsu sebagai data nyata.
7. Jangan mengubah brand menjadi politik-only.
8. Jangan menjadikan dashboard operator sebagai tampilan user.
9. Jangan menghapus kode yang mungkin berguna sebelum membuat backup dan catatan migrasi.
10. Semua perubahan database harus menggunakan migration.
11. Semua engine memiliki interface yang jelas.
12. Semua integrasi eksternal harus memiliki adapter.
13. Semua jalur AI harus dapat dimock untuk testing.
14. Semua fitur besar harus berada di balik feature flag.
15. Setiap keputusan arsitektur penting harus ditulis sebagai ADR pada `docs/adr/`.

## 0.3 Definition of Done global

Sebuah sprint hanya dianggap selesai apabila:

- kode dapat dijalankan dari fresh clone;
- `.env.example` diperbarui;
- migration dapat dijalankan;
- build production lolos;
- tidak ada secret pada client bundle;
- error state ditangani;
- loading state tersedia;
- responsive mobile diperiksa;
- accessibility dasar diperiksa;
- logs dan telemetry relevan tersedia;
- README diperbarui;
- screenshot QA tersedia;
- laporan sprint tersedia;
- known issues ditulis jujur.

---

# 1. VISI PRODUK DAN BATAS PRODUK

## 1.1 Produk

# **Republik Argumen**

Republik Argumen adalah game web voice-first untuk melatih:

- argumentasi;
- logika;
- struktur penyampaian;
- rebuttal;
- penggunaan data;
- integritas debat;
- public speaking;
- kemampuan memahami perspektif lain.

User dapat:

- memilih topik;
- membuat topik sendiri;
- berbicara menggunakan mikrofon;
- tampil melalui webcam atau kamera HP;
- berdebat melawan AI dengan suara;
- melakukan interupsi;
- menerima evaluasi AI Judge;
- melihat Delivery Coach;
- memainkan mode Kursi Panas AI;
- berkembang menuju pengalaman sosial pada fase berikutnya.

## 1.2 Produk tidak boleh dipersempit menjadi politik-only

Politik adalah salah satu kategori, bukan keseluruhan identitas produk.

Kategori MVP:

```text
Sepak Bola
Olahraga
Teknologi
Bisnis
Pekerjaan
Pendidikan
Lifestyle
Hiburan
Lingkungan
Energi
Isu Publik Ringan
Absurd dan Santai
```

Kategori fase lanjut:

```text
Kebijakan Publik
Politik Aktual Terkurasi
Ekonomi
Komunitas
Corporate Event
Kampus
K3 dan Keselamatan
Inovasi
```

## 1.3 Prinsip produk

| Prinsip | Implementasi |
|---|---|
| Voice-first | User dapat benar-benar berbicara dan AI membalas dengan suara |
| Text-safe | Seluruh pengalaman tetap dapat dimainkan melalui teks |
| Camera-optional | Kamera meningkatkan immersion, tetapi bukan syarat |
| Coaching-oriented | AI Judge memberi perbaikan, bukan mempermalukan |
| Premium visual | Modern Civic Arena |
| Safe by design | Moderasi, rate limit, audit, consent |
| Ready to upscale | Modul dipisahkan dan feature flag digunakan |
| No fake social proof | Tidak ada angka penonton palsu |
| No pay-to-win | Kredit membeli akses/resource, bukan kemenangan |
| Phased delivery | MVP selesai dulu sebelum social platform |

---

# 2. KONDISI IMPLEMENTASI SAAT INI DAN STRATEGI PEMULIHAN

## 2.1 Temuan audit visual staging

Berdasarkan screenshot staging:

```text
docs/audit-current-state/01_current_top_dashboard.png
docs/audit-current-state/02_current_mid_dashboard.png
docs/audit-current-state/03_current_topic_setup.png
```

Implementasi saat ini sudah memiliki:

- dark navy theme;
- sidebar;
- topic cards;
- AI persona cards;
- panel setup;
- input mode text / voice / voice + camera;
- style card yang cukup konsisten.

Namun implementasi melenceng karena:

1. branding berubah menjadi `Arena Politika`;
2. dashboard terlalu padat;
3. user flow ditumpuk dalam satu halaman panjang;
4. API key OpenRouter tampil pada halaman user;
5. dropdown model tampil pada halaman user;
6. banyak angka engagement palsu;
7. politik-only progression dan ideologi;
8. voice-to-voice belum menjadi pusat pengalaman;
9. fitur future tampil seolah aktif;
10. operator controls bercampur dengan user experience.

## 2.2 Yang dipertahankan

| Existing element | Keputusan |
|---|---|
| Dark navy base | Pertahankan |
| Cyan action color | Pertahankan |
| Coral-red AI accent | Pertahankan |
| Gold prestige accent | Pertahankan |
| Sidebar desktop | Sederhanakan |
| Topic cards | Refactor |
| Persona cards | Pindahkan ke mode setup |
| Text / Voice / Voice + Camera selector | Pindahkan ke `/device-check` |
| Existing reusable UI primitives | Audit lalu pertahankan jika bersih |

## 2.3 Yang disembunyikan pada MVP

```text
Premium Club
Kredit Arena production
Ranking publik
Karir politik
Profil ideologi
Clan
Misi harian
Live feed palsu
Audience reaction palsu
Fake online count
Coming-soon cards berlebihan
API key field
Model selector user-facing
Debug diagnostics user-facing
```

## 2.4 Yang tidak boleh dihapus tanpa audit

```text
Potential wallet domain logic
Topic seed data
Persona data
Existing CSS tokens
Reusable Card components
Existing mode data
Existing local history
Any working OpenRouter adapter
Any working audio capture code
```

---

# 3. PHASE MAP — DARI RECOVERY HINGGA PLATFORM BESAR

## 3.1 Ringkasan fase

| Phase | Nama | Tujuan | Status |
|---|---|---|---|
| Phase 0 | Recovery & Repository Audit | Memahami kode staging dan memulihkan arah produk | Kerjakan pertama |
| Phase 1 | Technical Foundation | Menyiapkan monorepo modular, design system, config, DB, auth dasar | Setelah Phase 0 |
| Phase 2 | Text Debate Core | Duel Wacana AI text-only end-to-end | Wajib sebelum voice |
| Phase 3 | Voice Arena MVP | STT, TTS, kamera, interupsi, caption | Nilai unik utama |
| Phase 4 | Judge, Coach, Hot Seat | AI Judge, Delivery Coach, Kursi Panas AI | MVP lengkap |
| Phase 5 | Closed Alpha Hardening | Operator ringan, analytics, observability, invite-only | Uji tester |
| Phase 6 | Commercial Beta Foundation | Kredit Arena, payment, public challenge, poster | Setelah retention terbukti |
| Phase 7 | Social Multiplayer | PvP voice-video, spectator, clan, ranked | Setelah basis user cukup |
| Phase 8 | Organization Platform | AI vs banyak manusia, polling, quiz, Arena Aspirasi | Jalur B2B |
| Phase 9 | Scale & Reliability | Multi-instance, SRE, governance, compliance | Ketika traffic tumbuh |

## 3.2 Gate antar fase

Tidak boleh lanjut hanya karena fitur sebelumnya terlihat bagus.

| Gate | Minimal bukti |
|---|---|
| Phase 0 → 1 | Repository terinventarisasi, branch recovery tersedia |
| Phase 1 → 2 | Build stabil, route shell dan dev mocks siap |
| Phase 2 → 3 | Text debate selesai end-to-end |
| Phase 3 → 4 | Voice-to-voice stabil dengan fallback |
| Phase 4 → 5 | Dua mode utama selesai, Judge konsisten |
| Phase 5 → 6 | Closed alpha menunjukkan retention dan biaya dapat diterima |
| Phase 6 → 7 | Public beta aman, wallet dan moderation stabil |
| Phase 7 → 8 | Social engine stabil dan operator siap |
| Phase 8 → 9 | B2B use case tervalidasi dan beban nyata meningkat |

---

# 4. TARGET EXPERIENCE MVP

## 4.1 Core loop

```text
Lobby
  → pilih mode
  → pilih topik atau tulis tesis privat
  → pilih posisi pro / kontra / acak
  → pilih Text / Voice / Voice + Camera
  → device check
  → masuk arena
  → user menyampaikan argumen
  → transkripsi
  → review transkrip
  → AI lawan membalas dengan teks streaming
  → AI membalas dengan voice
  → user dapat menginterupsi
  → ronde berikutnya
  → AI Judge
  → result reveal
  → Delivery Coach
  → history / main lagi
```

## 4.2 Mode MVP

### Duel Wacana AI

```text
User vs satu persona AI
3 ronde:
1. Opening
2. Rebuttal
3. Closing
```

### Kursi Panas AI

```text
User vs 3 atau 5 persona AI bergiliran
Setiap persona menyerang dari sudut berbeda
Contoh:
- Pengamat Statistik
- Fans Emosional
- Jurnalis Kritis
- Pragmatis Lapangan
- Mediator Rasional
```

### Satu Lawan Tribun

Pada MVP bukan engine terpisah.

Implementasikan sebagai preset:

```text
Kursi Panas AI
+ kategori olahraga
+ persona fans
+ stadium skin
```

### Custom Topic Privat

User menulis tesis. AI Topic Refiner membantu mempertajam argumen tanpa mengubah makna utama.

## 4.3 Future modes — kontrak disiapkan, jangan aktifkan sekarang

```text
Human vs Human
Kursi Panas Publik
AI vs Republik
Arena Aspirasi
Quiz Arena
Komisi Data
Pengadilan Opini
Debat Fraksi
Clan / Partai
Spectator Live
```

---

# 5. ARSITEKTUR TARGET

## 5.1 Prinsip arsitektur

Gunakan:

# **Modular Monolith pada monorepo**

Alasan:

- lebih cepat dibangun daripada microservices;
- lebih mudah dipahami Codex;
- masih memiliki boundary domain;
- dapat dipisah menjadi service ketika traffic tumbuh;
- cocok untuk VPS awal;
- mengurangi kompleksitas deployment.

Jangan langsung membangun microservices.

## 5.2 High-level architecture MVP

```text
Browser / Mobile Browser
        │
        ▼
Cloudflare DNS + TLS + optional Turnstile
        │
        ▼
Reverse Proxy: Caddy atau Nginx
        │
        ▼
Next.js Web App
  ├── User UI
  ├── Operator UI
  ├── Route Handlers
  ├── SSE Streaming
  ├── Auth Adapter
  ├── AI Adapter
  └── Audio Proxy
        │
        ├── PostgreSQL
        ├── Redis
        ├── BullMQ Worker
        ├── OpenRouter API
        ├── Supabase Auth
        ├── R2 Object Storage [future cloud media]
        └── Sentry / OpenTelemetry
```

## 5.3 High-level architecture social scale

```text
Browser
  │
  ├── HTTPS API
  ├── SSE AI streaming
  ├── WebSocket room events
  └── WebRTC media
        │
        ▼
Load Balancer / Reverse Proxy
        │
        ├── Next.js Web Instances
        ├── API Instances
        ├── Realtime Gateway
        ├── Worker Instances
        ├── TURN Server
        ├── PostgreSQL primary + replica
        ├── Redis HA
        └── Object Storage
```

## 5.4 Technology defaults

| Layer | Default |
|---|---|
| Monorepo | pnpm workspace |
| Web | Next.js App Router + TypeScript |
| Styling | Tailwind CSS + CSS variables |
| UI primitives | shadcn/ui atau Radix primitives, disesuaikan |
| Motion | Motion for React atau CSS transitions ringan |
| Validation | Zod |
| Database | PostgreSQL |
| Managed DB prod | Supabase Postgres |
| ORM | Pertahankan existing ORM jika sehat; jika belum ada gunakan Drizzle ORM |
| Migrations | SQL migrations terkontrol |
| Auth staging/prod | Supabase Auth |
| Dev auth | Dev bypass hanya lokal |
| Queue | Redis + BullMQ |
| Storage future | Cloudflare R2 |
| Error monitoring | Sentry |
| Telemetry | OpenTelemetry bertahap |
| E2E | Playwright |
| Unit test | Vitest |
| Component test | Testing Library |
| Reverse proxy | Caddy atau Nginx |
| Container | Docker + Docker Compose |
| CI | GitHub Actions |

---

# 6. MONOREPO STRUCTURE

```text
/
├── apps/
│   ├── web/
│   │   ├── app/
│   │   ├── components/
│   │   ├── public/
│   │   ├── styles/
│   │   └── tests/
│   │
│   ├── worker/
│   │   ├── src/
│   │   │   ├── processors/
│   │   │   ├── queues/
│   │   │   └── index.ts
│   │   └── tests/
│   │
│   └── realtime/                 # Phase 7, jangan bangun sekarang
│
├── packages/
│   ├── domain/
│   │   ├── game/
│   │   ├── topics/
│   │   ├── ai/
│   │   ├── audio/
│   │   ├── moderation/
│   │   ├── wallet/
│   │   ├── events/
│   │   └── common/
│   │
│   ├── db/
│   │   ├── schema/
│   │   ├── migrations/
│   │   ├── repositories/
│   │   └── seed/
│   │
│   ├── ai/
│   │   ├── openrouter/
│   │   ├── prompts/
│   │   ├── schemas/
│   │   ├── mocks/
│   │   └── tests/
│   │
│   ├── audio/
│   │   ├── browser/
│   │   ├── server/
│   │   ├── codecs/
│   │   ├── mocks/
│   │   └── tests/
│   │
│   ├── ui/
│   │   ├── primitives/
│   │   ├── components/
│   │   ├── tokens/
│   │   └── themes/
│   │
│   ├── config/
│   │   ├── env.ts
│   │   ├── feature-flags.ts
│   │   └── constants.ts
│   │
│   ├── observability/
│   │   ├── logger.ts
│   │   ├── metrics.ts
│   │   ├── tracing.ts
│   │   └── sentry.ts
│   │
│   └── test-fixtures/
│
├── infra/
│   ├── docker/
│   ├── caddy/
│   ├── nginx/
│   ├── scripts/
│   └── github-actions/
│
├── docs/
│   ├── blueprint/
│   ├── adr/
│   ├── progress/
│   ├── recovery/
│   ├── runbooks/
│   ├── visual-qa/
│   └── audit-current-state/
│
├── docker-compose.yml
├── pnpm-workspace.yaml
├── package.json
├── .env.example
├── README.md
└── REPUBLIK_ARGUMEN_MASTER_TECHNICAL_IMPLEMENTATION_BLUEPRINT.md
```

## 6.1 Operator UI

Pada fase awal, operator UI dapat berada dalam app yang sama:

```text
apps/web/app/(operator)/operator/
```

Namun domain dan akses harus terpisah.

Pada skala lebih besar, operator dapat dipisahkan menjadi:

```text
apps/operator/
```

---

# 7. ROUTE MAP USER DAN OPERATOR

## 7.1 User routes MVP

```text
/
├── /                         Lobby
├── /play                     Pilih mode
├── /topics                   Pilih topik
├── /topics/new               Buat topik privat
├── /topics/refine            AI Topic Refiner
├── /device-check             Kamera, mic, speaker
├── /arena/[sessionId]        Arena debat
├── /results/[sessionId]      Hasil AI Judge
├── /results/[sessionId]/coach Delivery Coach
├── /history                  Riwayat
└── /settings                 Preferensi
```

## 7.2 Operator routes alpha

```text
/operator
├── /overview
├── /sessions
├── /sessions/[id]
├── /topics
├── /personas
├── /prompts
├── /ai-usage
├── /feature-flags
├── /system-health
├── /audit-logs
└── /tester-invites
```

## 7.3 Dev-only routes

```text
/dev
├── /ui-playground
├── /mock-arena
├── /ai-config
├── /audio-playground
├── /session-replay
└── /fault-injection
```

Dev route hanya aktif jika:

```env
ENABLE_DEV_ROUTES=true
NODE_ENV=development
```

Pada staging, lindungi dengan operator auth.

---

# 8. DOMAIN ENGINES

## 8.1 Game Session Engine

Tanggung jawab:

- membuat sesi;
- menentukan mode;
- mengatur ronde;
- menentukan actor turn;
- menyimpan transkrip;
- menangani timeout;
- menangani abandon;
- menangani interupsi;
- menyelesaikan sesi;
- memicu Judge.

State:

```ts
type DebateSessionStatus =
  | "created"
  | "device_check"
  | "ready"
  | "active"
  | "waiting_user"
  | "transcribing"
  | "waiting_ai"
  | "ai_speaking"
  | "round_transition"
  | "judging"
  | "completed"
  | "abandoned"
  | "error";
```

Command examples:

```ts
createSession()
startSession()
submitUserTurn()
interruptAi()
advanceRound()
completeSession()
abandonSession()
retryFailedTurn()
```

Invariant:

```text
Satu sesi hanya memiliki satu active turn.
Ronde tidak boleh maju tanpa turn yang valid.
AI Judge tidak boleh dipanggil sebelum sesi lengkap.
Sesi error dapat diretry tanpa membuat turn duplikat.
```

## 8.2 AI Orchestrator Engine

Tanggung jawab:

- routing model;
- prompt versioning;
- provider preference;
- timeout;
- retry;
- fallback;
- streaming;
- structured output validation;
- usage capture;
- cost guardrail;
- trace id;
- privacy routing.

AI roles:

```text
opponent
judge
topic_refiner
topic_moderator
delivery_coach
summary
event_synthesizer [future]
policy_defender [future]
quiz_grader [future]
```

## 8.3 Voice Experience Engine

Tanggung jawab:

- mic capture;
- audio recording;
- encoding;
- upload STT;
- transcript review;
- TTS segmentation;
- audio playback queue;
- subtitle synchronization;
- mute;
- interruption;
- cancellation;
- fallback;
- delivery signals.

## 8.4 Camera and Media Engine

Tanggung jawab MVP:

- permission;
- preview;
- device selection;
- camera switch mobile;
- track cleanup;
- local replay opt-in;
- no cloud upload default.

Tanggung jawab beta:

- signed upload URL;
- R2 upload;
- retention;
- private access;
- audit access;
- delete.

## 8.5 Topic Engine

Tanggung jawab:

- curated topics;
- categories;
- search;
- custom topic;
- spice level;
- AI refiner;
- safety labels;
- moderation result.

## 8.6 Judge Engine

Tanggung jawab:

- transcript collection;
- scoring;
- JSON validation;
- confidence;
- feedback;
- grade;
- title;
- delivery metrics merge.

## 8.7 Progression Engine

MVP:

- optional local XP;
- title unlock;
- history;
- recommendation.

Beta:

- tier;
- streak;
- badges;
- quests;
- leaderboard.

## 8.8 Operator Engine

Tanggung jawab:

- topics CMS;
- persona CMS;
- prompt versions;
- feature flags;
- system settings;
- AI usage;
- session inspection;
- kill switch;
- audit logs.

## 8.9 Wallet Engine — Phase 6

Tanggung jawab:

- balance;
- ledger;
- reservation;
- capture;
- release;
- bonus;
- refund;
- adjustment;
- top-up webhook;
- idempotency.

## 8.10 Social Engine — Phase 7

Tanggung jawab:

- matchmaking;
- room;
- WebSocket events;
- PvP;
- WebRTC signaling;
- spectator;
- moderation;
- replay consent.

## 8.11 Organization Event Engine — Phase 8

Tanggung jawab:

- organizer;
- event;
- source pack;
- AI vs Republik;
- quiz;
- scoring;
- consensus map;
- report;
- human jury;
- rewards metadata.

---

# 9. DATABASE MODEL

## 9.1 General rules

1. PostgreSQL.
2. UUID primary key.
3. `created_at`, `updated_at`.
4. Soft-delete hanya jika perlu.
5. Migration wajib.
6. RLS wajib untuk tabel yang diekspos melalui Supabase Data API.
7. Index ditentukan berdasarkan query nyata.
8. JSONB hanya untuk metadata fleksibel; jangan jadikan seluruh domain JSONB.
9. Event dan audit logs append-only.
10. Wallet ledger append-only.

## 9.2 Core tables

### `profiles`

```sql
id uuid primary key references auth.users(id) on delete cascade,
username text unique,
display_name text,
avatar_url text,
role text not null default 'player',
locale text not null default 'id-ID',
created_at timestamptz not null default now(),
updated_at timestamptz not null default now()
```

### `tester_invites`

```sql
id uuid primary key,
code_hash text not null unique,
max_uses int not null default 1,
used_count int not null default 0,
expires_at timestamptz,
created_by uuid,
created_at timestamptz not null default now()
```

### `topics`

```sql
id uuid primary key,
slug text unique not null,
title text not null,
thesis text not null,
summary text,
category text not null,
difficulty text not null,
spice_level int not null check (spice_level between 1 and 5),
is_active boolean not null default true,
is_public boolean not null default false,
is_sensitive boolean not null default false,
created_by uuid,
moderation_status text not null default 'approved',
created_at timestamptz not null default now(),
updated_at timestamptz not null default now()
```

### `ai_personas`

```sql
id uuid primary key,
slug text unique not null,
name text not null,
description text not null,
system_style text not null,
difficulty text not null,
accent text,
avatar_asset text,
is_active boolean not null default true,
metadata jsonb not null default '{}',
created_at timestamptz not null default now(),
updated_at timestamptz not null default now()
```

### `game_modes`

```sql
id uuid primary key,
slug text unique not null,
name text not null,
description text not null,
is_active boolean not null default false,
config jsonb not null default '{}',
created_at timestamptz not null default now(),
updated_at timestamptz not null default now()
```

### `debate_sessions`

```sql
id uuid primary key,
user_id uuid not null,
mode_slug text not null,
topic_id uuid,
custom_topic text,
user_position text not null,
input_mode text not null,
status text not null,
current_round int not null default 0,
total_rounds int not null,
persona_sequence jsonb not null default '[]',
started_at timestamptz,
completed_at timestamptz,
abandoned_at timestamptz,
error_code text,
metadata jsonb not null default '{}',
created_at timestamptz not null default now(),
updated_at timestamptz not null default now()
```

### `debate_turns`

```sql
id uuid primary key,
session_id uuid not null references debate_sessions(id) on delete cascade,
round_no int not null,
turn_no int not null,
actor text not null,
persona_id uuid,
text_content text not null,
audio_asset_id uuid,
was_interrupted boolean not null default false,
duration_ms int,
metadata jsonb not null default '{}',
created_at timestamptz not null default now()
```

Unique:

```sql
unique(session_id, turn_no)
```

### `judge_reports`

```sql
id uuid primary key,
session_id uuid not null unique references debate_sessions(id) on delete cascade,
judge_model text not null,
prompt_version_id uuid,
scores jsonb not null,
strengths jsonb not null,
improvements jsonb not null,
best_argument text,
grade text,
title_unlocked text,
delivery_tips jsonb not null default '[]',
confidence numeric,
metadata jsonb not null default '{}',
created_at timestamptz not null default now()
```

### `delivery_metrics`

```sql
id uuid primary key,
session_id uuid not null unique references debate_sessions(id) on delete cascade,
words_per_minute numeric,
speaking_duration_ms int,
pause_ratio numeric,
filler_words jsonb not null default '{}',
volume_stability numeric,
response_latency_avg_ms int,
interruption_count int not null default 0,
repeated_phrases jsonb not null default '[]',
metadata jsonb not null default '{}',
created_at timestamptz not null default now()
```

## 9.3 AI tables

### `prompt_versions`

```sql
id uuid primary key,
role text not null,
version text not null,
content text not null,
schema_version text,
is_active boolean not null default false,
created_by uuid,
created_at timestamptz not null default now(),
unique(role, version)
```

### `ai_usage_logs`

```sql
id uuid primary key,
session_id uuid,
turn_id uuid,
role text not null,
model text not null,
provider text,
request_id text,
input_tokens int,
output_tokens int,
audio_seconds numeric,
cost_usd numeric,
latency_ms int,
status text not null,
error_code text,
metadata jsonb not null default '{}',
created_at timestamptz not null default now()
```

Index:

```sql
create index ai_usage_logs_created_at_idx on ai_usage_logs(created_at);
create index ai_usage_logs_session_idx on ai_usage_logs(session_id);
create index ai_usage_logs_role_idx on ai_usage_logs(role);
```

## 9.4 Operator tables

### `feature_flags`

```sql
key text primary key,
enabled boolean not null default false,
description text,
config jsonb not null default '{}',
updated_by uuid,
updated_at timestamptz not null default now()
```

### `system_settings`

```sql
key text primary key,
value jsonb not null,
updated_by uuid,
updated_at timestamptz not null default now()
```

### `audit_logs`

```sql
id uuid primary key,
actor_id uuid,
actor_role text,
action text not null,
entity_type text,
entity_id text,
reason text,
metadata jsonb not null default '{}',
created_at timestamptz not null default now()
```

### `analytics_events`

```sql
id uuid primary key,
user_id uuid,
session_id uuid,
event_name text not null,
properties jsonb not null default '{}',
created_at timestamptz not null default now()
```

## 9.5 Media tables

### `user_media_preferences`

```sql
user_id uuid primary key,
default_input_mode text not null default 'text',
camera_mirror boolean not null default true,
voice_ai_enabled boolean not null default true,
sound_effects_enabled boolean not null default true,
reduced_motion text not null default 'system',
local_replay_enabled boolean not null default false,
updated_at timestamptz not null default now()
```

### `media_assets` — Phase 6 optional cloud media

```sql
id uuid primary key,
owner_user_id uuid not null,
session_id uuid,
type text not null,
storage_key text not null,
mime_type text not null,
size_bytes bigint,
duration_ms int,
visibility text not null default 'private',
status text not null,
retention_until timestamptz,
metadata jsonb not null default '{}',
created_at timestamptz not null default now(),
deleted_at timestamptz
```

### `media_access_audit_logs`

```sql
id uuid primary key,
asset_id uuid not null,
actor_id uuid,
action text not null,
reason text,
created_at timestamptz not null default now()
```

## 9.6 Wallet tables — Phase 6

### `wallets`

```sql
user_id uuid primary key,
balance_ka bigint not null default 0,
updated_at timestamptz not null default now()
```

### `wallet_transactions`

```sql
id uuid primary key,
user_id uuid not null,
type text not null,
amount_ka bigint not null,
balance_before bigint not null,
balance_after bigint not null,
reference_type text,
reference_id text,
idempotency_key text unique,
metadata jsonb not null default '{}',
created_at timestamptz not null default now()
```

Types:

```text
TOPUP
SPEND_RESERVE
SPEND_CAPTURE
SPEND_RELEASE
BONUS
REFUND
ADJUSTMENT
```

### `topup_orders`

```sql
id uuid primary key,
user_id uuid not null,
package_id uuid not null,
amount_idr bigint not null,
credit_ka bigint not null,
gateway text not null,
gateway_reference text,
status text not null,
idempotency_key text not null unique,
created_at timestamptz not null default now(),
paid_at timestamptz,
expired_at timestamptz
```

## 9.7 Social tables — Phase 7

```text
public_challenges
challenge_participants
challenge_share_assets
matchmaking_tickets
realtime_rooms
room_participants
spectator_sessions
clans
clan_members
leaderboard_snapshots
moderation_cases
reports
```

## 9.8 Organization tables — Phase 8

```text
organizations
organization_members
organization_events
event_participants
event_source_documents
event_submissions
event_scores
event_jury_reviews
event_rewards
event_consensus_clusters
event_reports
```

---

# 10. API CONTRACTS

Gunakan route handlers server-side.

## 10.1 General response shape

Success:

```ts
type ApiSuccess<T> = {
  ok: true;
  data: T;
  traceId: string;
};
```

Error:

```ts
type ApiError = {
  ok: false;
  error: {
    code: string;
    message: string;
    retryable: boolean;
  };
  traceId: string;
};
```

Jangan kirim stack trace ke client.

## 10.2 MVP endpoints

### Health

```text
GET /api/health
GET /api/ready
```

### Session

```text
POST /api/debate/sessions
GET  /api/debate/sessions/:id
POST /api/debate/sessions/:id/start
POST /api/debate/sessions/:id/user-turn
POST /api/debate/sessions/:id/interrupt
POST /api/debate/sessions/:id/complete
POST /api/debate/sessions/:id/abandon
POST /api/debate/sessions/:id/retry
GET  /api/debate/sessions/:id/history
```

### AI

```text
POST /api/ai/opponent/stream
POST /api/ai/judge
POST /api/ai/topics/refine
POST /api/ai/topics/moderate
```

### Audio

```text
POST /api/audio/transcribe
POST /api/audio/speech
```

### Topic

```text
GET  /api/topics
GET  /api/topics/:slug
POST /api/topics/private
POST /api/topics/private/refine
```

### User

```text
GET  /api/me
GET  /api/me/history
PUT  /api/me/preferences
```

## 10.3 Operator endpoints

```text
GET  /api/operator/overview
GET  /api/operator/sessions
GET  /api/operator/sessions/:id
GET  /api/operator/ai-usage
GET  /api/operator/topics
POST /api/operator/topics
PUT  /api/operator/topics/:id
GET  /api/operator/personas
POST /api/operator/personas
PUT  /api/operator/personas/:id
GET  /api/operator/prompts
POST /api/operator/prompts
POST /api/operator/prompts/:id/activate
GET  /api/operator/feature-flags
PUT  /api/operator/feature-flags/:key
GET  /api/operator/audit-logs
POST /api/operator/system/kill-switch
```

## 10.4 Phase 6 endpoints

```text
GET  /api/wallet
GET  /api/wallet/transactions
GET  /api/wallet/packages
POST /api/wallet/topup
POST /api/payments/webhooks/:gateway
POST /api/challenges
GET  /api/challenges/:slug
POST /api/challenges/:id/join
POST /api/media/upload-intents
```

## 10.5 Phase 7 realtime contracts

WebSocket events:

```text
room:join
room:leave
room:state
room:user-ready
room:turn-start
room:turn-end
room:interrupt
room:moderation-warning
room:spectator-count
room:reaction
room:ended
```

WebRTC signaling:

```text
webrtc:offer
webrtc:answer
webrtc:ice-candidate
webrtc:renegotiate
webrtc:disconnect
```

---

# 11. OPENROUTER INTEGRATION

## 11.1 Server-only adapter

Semua request OpenRouter harus melalui server.

Jangan:

```text
Browser → OpenRouter langsung
```

Gunakan:

```text
Browser → Republik Argumen server → OpenRouter
```

## 11.2 Environment

```env
OPENROUTER_API_KEY=
OPENROUTER_SITE_URL=
OPENROUTER_APP_NAME=Republik Argumen

OPENROUTER_OPPONENT_MODEL=
OPENROUTER_JUDGE_MODEL=
OPENROUTER_TOPIC_REFINER_MODEL=
OPENROUTER_TOPIC_MODERATOR_MODEL=
OPENROUTER_STT_MODEL=
OPENROUTER_TTS_MODEL=
OPENROUTER_FALLBACK_TEXT_MODEL=
OPENROUTER_TTS_VOICE=
OPENROUTER_TTS_RESPONSE_FORMAT=mp3

OPENROUTER_TIMEOUT_MS=30000
OPENROUTER_MAX_RETRIES=2
OPENROUTER_MAX_SESSION_COST_USD=
OPENROUTER_DAILY_COST_LIMIT_USD=
OPENROUTER_ENFORCE_ZDR=true
```

## 11.3 Text completion

Gunakan:

```text
POST https://openrouter.ai/api/v1/chat/completions
```

Untuk opponent:

- streaming `true`;
- output text;
- server membuat SSE ke browser;
- simpan usage dan cost.

## 11.4 Structured Judge

Judge menggunakan JSON Schema.

Contoh shape:

```ts
const JudgeReportSchema = z.object({
  scores: z.object({
    data: z.number().min(0).max(100),
    structure: z.number().min(0).max(100),
    logic: z.number().min(0).max(100),
    rebuttal: z.number().min(0).max(100),
    integrity: z.number().min(0).max(100),
    delivery: z.number().min(0).max(100).optional(),
  }),
  strengths: z.array(z.string()).min(1).max(5),
  improvements: z.array(z.string()).min(1).max(5),
  bestArgument: z.string().optional(),
  grade: z.string(),
  titleUnlocked: z.string().optional(),
  confidence: z.number().min(0).max(1).optional(),
});
```

Jika structured output invalid:

1. retry satu kali;
2. jika tetap invalid, lakukan repair parser;
3. jika gagal, simpan raw response pada internal log;
4. tampilkan error aman;
5. jangan membuat score palsu.

## 11.5 STT

Gunakan endpoint:

```text
POST https://openrouter.ai/api/v1/audio/transcriptions
```

Request:

```json
{
  "model": "<STT_MODEL>",
  "input_audio": {
    "data": "<BASE64_RAW_AUDIO>",
    "format": "mp3"
  },
  "language": "id"
}
```

Response:

```json
{
  "text": "...",
  "usage": {
    "cost": 0.0005,
    "seconds": 9.2
  }
}
```

## 11.6 TTS

Gunakan endpoint:

```text
POST https://openrouter.ai/api/v1/audio/speech
```

Request:

```json
{
  "model": "<TTS_MODEL>",
  "input": "Teks respons AI",
  "voice": "<VOICE>",
  "response_format": "mp3",
  "speed": 1
}
```

Response:

```text
raw audio byte stream
```

## 11.7 Privacy routing

Untuk data sensitif, gunakan preferensi provider Zero Data Retention bila tersedia:

```json
{
  "provider": {
    "zdr": true
  }
}
```

Catat apabila model atau provider yang dipilih tidak kompatibel dengan ZDR.

## 11.8 Cost accounting

Log minimal:

```ts
type AiUsageLog = {
  role: string;
  model: string;
  requestId?: string;
  inputTokens?: number;
  outputTokens?: number;
  audioSeconds?: number;
  costUsd?: number;
  latencyMs: number;
  status: "success" | "error";
  errorCode?: string;
};
```

---

# 12. VOICE EXPERIENCE TECHNICAL DESIGN

## 12.1 MVP input strategy

Default:

# **Press and hold to talk**

Mengapa:

- stabil;
- mengurangi echo;
- jelas bagi user;
- lebih mudah daripada VAD penuh;
- interupsi dapat dikontrol.

Future:

```text
auto VAD
automatic turn detection
full duplex
noise suppression enhancement
```

## 12.2 Browser media capture

Gunakan:

```ts
navigator.mediaDevices.getUserMedia({
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
  video: false,
});
```

Untuk camera mode:

```ts
navigator.mediaDevices.getUserMedia({
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
  video: {
    facingMode: "user",
    width: { ideal: 640 },
    height: { ideal: 480 },
  },
});
```

## 12.3 Recording

Gunakan `MediaRecorder`.

Codec selection:

```ts
const candidates = [
  "audio/webm;codecs=opus",
  "audio/mp4",
  "audio/webm",
];

const selected = candidates.find((mime) =>
  MediaRecorder.isTypeSupported(mime)
);
```

## 12.4 Audio normalization pipeline

```text
Browser captures audio
  → Blob
  → server validates size and duration
  → if STT provider accepts format: pass through
  → else transcode with ffmpeg worker
  → base64 encode normalized audio
  → OpenRouter STT
```

Target normalized format:

```text
mp3 mono 16 kHz or wav mono 16 kHz
```

## 12.5 Transcript review

Default MVP:

```text
STT selesai
  → transcript sheet
  → user edit
  → user click Kirim
```

Optional later:

```text
auto-send transcript
```

## 12.6 AI streaming and TTS segmentation

Jangan tunggu seluruh respons terlalu lama.

Pipeline:

```text
OpenRouter opponent streaming text
  → SSE chunk ke browser
  → sentence segmenter server
  → ketika kalimat selesai atau threshold tercapai
  → kirim segment ke TTS
  → audio queue browser
  → play sequentially
```

Segment threshold:

```text
punctuation boundary
atau 120–220 chars
atau 2.5 s timeout
```

## 12.7 Interruption / barge-in

Manual MVP:

```text
User tekan Interupsi
  → AbortController cancel TTS fetch pending
  → stop Audio element
  → clear playback queue
  → preserve partial caption
  → mark AI turn interrupted
  → enable mic capture
```

Future:

```text
VAD detects user voice while AI speaking
  → optional automatic barge-in
```

## 12.8 Delivery signals

Hitung lokal sebanyak mungkin.

MVP:

```text
words per minute
speaking duration
pause ratio
filler words
volume stability
response latency
interruption count
repeated phrases
```

Gunakan:

```text
Web Audio API AnalyserNode
timestamps
transcript parser
```

Jangan mengklaim:

```text
emotion detection akurat
lie detection
psychological diagnosis
face-based personality
```

---

# 13. CAMERA AND MEDIA PRIVACY

## 13.1 Kamera MVP

Kamera digunakan untuk:

- self preview;
- immersion;
- podium feeling;
- future replay.

Kamera tidak digunakan untuk:

- face recognition;
- emotion inference;
- identity matching;
- model training;
- cloud upload otomatis.

## 13.2 Consent rules

- minta izin pada `/device-check`;
- jelaskan alasan;
- sediakan text-only;
- sediakan voice-only;
- recording default OFF;
- indikator recording wajib;
- hentikan track saat keluar arena.

Cleanup:

```ts
stream.getTracks().forEach((track) => track.stop());
```

## 13.3 Local replay

Optional alpha:

- opt-in;
- simpan IndexedDB;
- per turn;
- user dapat hapus;
- tidak upload.

## 13.4 Cloud replay Phase 6

Gunakan R2 presigned PUT URL:

```text
Browser
  → request upload intent
  → server generates presigned PUT URL
  → browser upload direct to R2
  → server records metadata
```

File private default.

Signed GET URL hanya sementara.

Retention default:

```text
30 hari
```

atau sesuai consent.

---

# 14. FRONTEND UI/UX ARCHITECTURE

## 14.1 Design direction

# **Modern Civic Arena**

Rules:

- lobby tenang;
- arena dramatis;
- result memuaskan;
- dark navy;
- cyan user;
- coral AI;
- gold prestige;
- tidak cyberpunk berlebihan;
- tidak dashboard enterprise;
- mobile-first.

## 14.2 Sidebar MVP

```text
Beranda
Main
Topik
Riwayat
Pengaturan
```

## 14.3 Mobile nav

```text
Beranda
Main
+
Topik
Riwayat
```

## 14.4 User-facing routes

Implementasikan route-based UX. Jangan kembali ke dashboard panjang.

## 14.5 Arena desktop

```text
┌───────────────────────────────────────────────────────────────┐
│ ← Keluar      RONDE 2 · REBUTTAL         01:48      Settings │
├──────────────┬───────────────────────────────┬────────────────┤
│ User camera  │ Transcript + live captions    │ AI avatar      │
│ Momentum     │                               │ Momentum       │
├──────────────┴───────────────────────────────┴────────────────┤
│ Interupsi | Catatan Data | Cek Fakta | Titik Temu            │
├───────────────────────────────────────────────────────────────┤
│ Mic / textarea / send                                        │
└───────────────────────────────────────────────────────────────┘
```

## 14.6 Arena mobile

```text
AI avatar
AI speaking halo
caption
camera user PiP
momentum
action buttons
sticky mic
text fallback
```

## 14.7 Visual states

```ts
type ArenaVisualState =
  | "ready"
  | "user_speaking"
  | "transcribing"
  | "transcript_review"
  | "ai_thinking"
  | "ai_streaming_text"
  | "ai_generating_voice"
  | "ai_speaking"
  | "interrupting"
  | "round_transition"
  | "judging"
  | "complete"
  | "recoverable_error"
  | "fatal_error";
```

## 14.8 UI feature flags

```ts
type FeatureFlags = {
  enableVoiceArena: boolean;
  enableCameraPreview: boolean;
  enableHotSeatAi: boolean;
  enableCustomTopic: boolean;
  enableTopicRefiner: boolean;
  enableDeliveryCoach: boolean;

  enableCreditArenaDemo: boolean;
  enableProductionWallet: boolean;
  enablePremium: boolean;
  enablePublicChallenges: boolean;
  enablePublicLeaderboard: boolean;
  enableSpectator: boolean;
  enableClan: boolean;
  enablePoliticalCareerTheme: boolean;
  enableOrganizerPlatform: boolean;
};
```

MVP defaults:

```ts
{
  enableVoiceArena: true,
  enableCameraPreview: true,
  enableHotSeatAi: true,
  enableCustomTopic: true,
  enableTopicRefiner: true,
  enableDeliveryCoach: true,

  enableCreditArenaDemo: false,
  enableProductionWallet: false,
  enablePremium: false,
  enablePublicChallenges: false,
  enablePublicLeaderboard: false,
  enableSpectator: false,
  enableClan: false,
  enablePoliticalCareerTheme: false,
  enableOrganizerPlatform: false
}
```

---

# 15. TOPIC AND MODERATION ENGINE

## 15.1 Spice meter

```text
1 Santai
2 Pedas Wajar
3 Panas
4 Kursi Panas
5 Perlu Kurasi
```

## 15.2 Topic refinement

Input:

```json
{
  "draft": "Fans MU delusional semua",
  "category": "Sepak Bola"
}
```

Output:

```json
{
  "status": "revise",
  "refinedThesis": "Sebagian fans Manchester United terlalu bergantung pada sejarah klub ketika menilai performa saat ini.",
  "reason": [
    "Menyerang gagasan, bukan kelompok.",
    "Lebih spesifik.",
    "Lebih layak diperdebatkan."
  ],
  "spiceLevel": 3
}
```

## 15.3 Moderation classes

```text
allow
allow_with_refinement
review
reject
```

## 15.4 Reject examples

```text
Doxing
Ancaman
Ujaran kebencian
Serangan personal
Tuduhan kriminal tanpa sumber
Seksualisasi
Ajakan kekerasan
Propaganda ekstrem
Prompt injection terhadap AI system
```

---

# 16. BACKGROUND JOBS

Gunakan BullMQ + Redis.

Queues:

```text
ai-judge
topic-refiner
topic-moderation
audio-transcode
share-card
analytics-flush
cleanup
media-retention
event-report [future]
consensus-map [future]
```

## 16.1 Job rules

- idempotency key;
- attempts;
- exponential backoff;
- timeout;
- dead-letter logging;
- trace id;
- structured logs;
- unrecoverable errors tidak diretry terus-menerus.

Example:

```ts
await queue.add("judge-session", payload, {
  jobId: `judge:${sessionId}`,
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 1000,
  },
  removeOnComplete: 1000,
  removeOnFail: 5000,
});
```

---

# 17. AUTHORIZATION AND SECURITY

## 17.1 Auth strategy

### Development

```text
Dev bypass optional
```

Only if:

```env
ENABLE_DEV_AUTH_BYPASS=true
NODE_ENV=development
```

### Closed alpha

```text
Supabase Auth magic link atau email OTP
+ invite code
```

### Public beta

```text
Supabase Auth
+ Google OAuth optional
+ email verification
+ phone verification untuk mode publik sensitif
```

## 17.2 Roles

```text
player
tester
moderator
operator
admin
organizer
jury
```

## 17.3 Security baseline

- API key server-side;
- secrets via env;
- HTTPS;
- reverse proxy;
- CSP;
- Permissions-Policy;
- rate limiting;
- CSRF protection;
- input validation;
- Zod;
- database RLS;
- audit logs;
- dependency scanning;
- no PII in logs;
- no audio in analytics;
- no raw transcript in third-party analytics unless necessary.

## 17.4 Recommended security headers

```text
Content-Security-Policy
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(self), microphone=(self)
Strict-Transport-Security
```

## 17.5 Rate limits initial

```text
POST /api/audio/transcribe       20 requests / minute / user
POST /api/audio/speech           30 requests / minute / user
POST /api/ai/opponent/stream     20 requests / minute / user
POST /api/ai/judge                5 requests / minute / user
POST /api/topics/private/refine  10 requests / hour / user
```

Adjust after alpha.

---

# 18. OPERATOR CONSOLE

## 18.1 Operator overview

Display:

```text
Active sessions
Completed sessions today
Failed sessions
Average AI cost per session
STT success rate
TTS success rate
Median opponent latency
Judge queue depth
Daily AI spend
Top errors
Feature flag status
Kill switch
```

## 18.2 Session inspector

Display:

```text
session metadata
user
mode
topic
persona
turn timeline
text transcript
interruption
audio usage metadata
model
prompt version
cost
latency
errors
judge report
```

Default:

```text
No raw cloud video access
```

## 18.3 Prompt management

- list prompt versions;
- create draft;
- test with fixture;
- activate version;
- rollback;
- log operator;
- compare output;
- no direct edit of active prompt without version.

## 18.4 Topic CMS

- create;
- edit;
- activate;
- deactivate;
- category;
- difficulty;
- spice;
- sensitive label;
- preview.

## 18.5 Persona CMS

- name;
- description;
- system style;
- difficulty;
- voice mapping;
- accent;
- avatar;
- active;
- test.

## 18.6 AI kill switch

Flags:

```text
disable_all_ai
disable_stt
disable_tts
disable_judge
disable_hot_seat
force_text_only
```

---

# 19. ANALYTICS AND OBSERVABILITY

## 19.1 Product events

```text
app_opened
auth_completed
lobby_viewed
mode_selected
topic_selected
custom_topic_started
topic_refiner_used
device_check_opened
camera_permission_result
microphone_permission_result
input_mode_selected
debate_started
round_completed
user_turn_submitted
stt_completed
transcript_edited
ai_response_started
tts_started
tts_completed
interrupt_used
debate_completed
debate_abandoned
judge_report_viewed
delivery_coach_viewed
history_viewed
fallback_to_text
error_shown
```

## 19.2 Technical metrics

```text
http_request_duration
http_error_rate
db_query_duration
redis_connection_status
queue_depth
queue_job_duration
openrouter_cost_usd
openrouter_latency_ms
openrouter_error_rate
stt_latency_ms
stt_error_rate
tts_latency_ms
tts_error_rate
judge_latency_ms
judge_invalid_json_rate
camera_permission_denied_rate
microphone_permission_denied_rate
```

## 19.3 Tracing

Trace:

```text
session
  → user turn
  → audio upload
  → STT
  → opponent stream
  → TTS segments
  → playback metadata
  → judge
```

## 19.4 SLO alpha internal

| Metric | Target awal |
|---|---:|
| Text debate successful completion | > 95% |
| STT success | > 90% |
| TTS success | > 90% |
| Judge report valid | > 95% |
| API 5xx | < 2% |
| Session fatal error | < 5% |
| Median STT latency | < 3 s |
| Median opponent first token | < 2.5 s |
| Median TTS first playable segment | < 3.5 s |

---

# 20. CI/CD

## 20.1 Branch strategy

```text
main
staging
develop
feature/*
fix/*
recovery/*
```

## 20.2 GitHub Actions

Workflow:

```text
pull request
  → install
  → lint
  → type-check
  → unit test
  → integration test
  → build
  → Playwright smoke
```

On staging merge:

```text
build Docker image
  → deploy staging
  → migrate
  → health check
  → smoke test
```

On production release:

```text
manual approval
  → backup
  → deploy
  → migrate
  → health check
  → smoke
  → monitor
  → rollback if needed
```

## 20.3 Required commands

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm test:integration
pnpm test:e2e
pnpm build
pnpm db:migrate
pnpm db:seed
pnpm dev
pnpm worker:dev
pnpm docker:up
pnpm docker:down
```

---

# 21. DEPLOYMENT TOPOLOGY

## 21.1 Local

```text
Docker Compose:
- web
- worker
- postgres
- redis
```

## 21.2 Staging

```text
VPS
├── Caddy / Nginx
├── web container
├── worker container
├── Redis container or managed Redis
├── managed Supabase Postgres
└── Sentry
```

Subdomain:

```text
staging.republikargumen.id
```

## 21.3 Production beta

```text
Cloudflare
  → reverse proxy
  → 2 web instances
  → worker instance
  → managed Postgres
  → managed Redis
  → R2
  → Sentry
```

## 21.4 Social scale

Add:

```text
Realtime gateway
TURN server
WebSocket sticky routing
Postgres replica
Redis HA
autoscaling
```

---

# 22. TEST STRATEGY

## 22.1 Unit tests

Test:

```text
session state machine
round advancement
interrupt behavior
prompt builder
Judge schema validation
topic refiner parser
wallet reservation [Phase 6]
feature flags
delivery metrics
audio segmenter
TTS queue
```

## 22.2 Integration tests

Test:

```text
create session
submit turn
mock STT
mock opponent stream
mock TTS
interrupt
complete session
mock Judge
persist report
```

## 22.3 E2E Playwright

Minimum:

```text
text debate complete
voice fallback text
device permission denied
camera denied
STT error fallback
TTS error text response
interrupt AI
Judge result
hot seat flow
mobile 390x844
desktop 1440x900
```

## 22.4 Mock systems

Mandatory:

```text
MockOpenRouterAdapter
MockSttAdapter
MockTtsAdapter
MockJudgeAdapter
MockTopicRefinerAdapter
MockAudioBlob
MockMediaDevices
```

Dev route:

```text
/dev/mock-arena
```

## 22.5 Fault injection

Simulate:

```text
429
500
502
timeout
invalid JSON Judge
empty transcript
TTS corrupt audio
Redis unavailable
DB unavailable
camera denied
mic denied
```

---

# 23. PHASE EXECUTION DETAIL

# PHASE 0 — RECOVERY & REPOSITORY AUDIT

## Objective

Membekukan kondisi staging, menginventarisasi kode aktual, memisahkan mock dan fitur nyata.

## Sprint P0.1 — Freeze

Tasks:

```text
create branch recovery/voice-first-mvp
tag v0.0.0-before-master-recovery
backup repo
capture screenshots
run baseline build
```

Deliverables:

```text
docs/recovery/P0_1_FREEZE_REPORT.md
```

## Sprint P0.2 — Inventory

Inventaris:

```text
routes
components
styles
dependencies
env vars
API handlers
OpenRouter usage
localStorage
DB usage
fake data
mock data
working features
broken features
```

Deliverables:

```text
docs/recovery/P0_2_ROUTE_INVENTORY.md
docs/recovery/P0_2_COMPONENT_INVENTORY.md
docs/recovery/P0_2_ENV_INVENTORY.md
docs/recovery/P0_2_FEATURE_MATRIX.md
```

## Sprint P0.3 — Safe clutter removal

Hide:

```text
Arena Politika branding
fake metrics
political career
ideology profile
Premium Club
ranking
live feed
API key field
model selector
coming soon overload
```

Rename:

```text
Arena Politika → Republik Argumen
```

Exit criteria:

- build lolos;
- UI lebih sederhana;
- screenshot QA;
- tidak ada behavior inti rusak.

---

# PHASE 1 — TECHNICAL FOUNDATION

## Objective

Membuat fondasi modular dan route-based.

## Sprint P1.1 — Monorepo and config

- pnpm workspace;
- packages;
- env validation;
- logger;
- config;
- feature flags;
- Docker Compose;
- README.

## Sprint P1.2 — Design system

- tokens;
- typography;
- primitives;
- app shell;
- mobile nav;
- `/dev/ui-playground`.

## Sprint P1.3 — Routes

- lobby;
- play;
- topics;
- new topic;
- device check;
- arena shell;
- results shell;
- history;
- settings.

## Sprint P1.4 — Database

- Postgres;
- migration;
- seed topics;
- seed personas;
- repositories;
- test fixtures.

Exit criteria:

- fresh clone runnable;
- DB migration works;
- route shell responsive;
- no API key in browser;
- dev mock arena works.

---

# PHASE 2 — TEXT DEBATE CORE

## Objective

Menyelesaikan satu debat AI end-to-end tanpa voice.

## Sprint P2.1 — Session engine

- create session;
- positions;
- rounds;
- user turn;
- status;
- persistence.

## Sprint P2.2 — OpenRouter opponent

- server adapter;
- streaming;
- prompt;
- retry;
- timeout;
- fallback;
- usage log.

## Sprint P2.3 — Transcript UI

- user message;
- AI streaming caption;
- round stepper;
- timer;
- recoverable error;
- retry.

## Sprint P2.4 — Judge

- transcript compile;
- JSON schema;
- structured output;
- save report;
- result reveal.

Exit criteria:

```text
Duel Wacana AI text-only selesai end-to-end.
```

---

# PHASE 3 — VOICE ARENA MVP

## Objective

Menghasilkan pengalaman voice-to-voice nyata.

## Sprint P3.1 — Device check

- permission explanation;
- camera;
- mic;
- meter;
- speaker test;
- fallback.

## Sprint P3.2 — MediaRecorder

- press and hold;
- blob;
- codec selection;
- cleanup;
- error.

## Sprint P3.3 — STT

- audio route;
- normalization;
- OpenRouter transcribe;
- transcript review;
- edit;
- retry;
- fallback text.

## Sprint P3.4 — TTS

- OpenRouter speech;
- audio queue;
- subtitle;
- mute;
- browser TTS fallback.

## Sprint P3.5 — Interruption

- stop AI audio;
- clear queue;
- abort requests;
- open mic;
- preserve partial caption;
- state recovery.

## Sprint P3.6 — Camera polish

- user PiP;
- desktop tile;
- mirror;
- camera switch;
- track cleanup.

Exit criteria:

```text
User berbicara → AI memahami → AI membalas dengan suara → user dapat interupsi.
```

---

# PHASE 4 — JUDGE, COACH, HOT SEAT

## Sprint P4.1 — Delivery metrics

- local metrics;
- transcript metrics;
- merge;
- delivery UI.

## Sprint P4.2 — Delivery Coach

- tips;
- beta label;
- no emotion claims;
- result integration.

## Sprint P4.3 — Kursi Panas AI

- persona sequence;
- mini rounds;
- persona transition;
- summary;
- result.

## Sprint P4.4 — Custom topic

- thesis input;
- category;
- spice;
- refiner;
- moderation;
- use refined version.

Exit criteria:

- Duel Wacana AI siap;
- Kursi Panas AI siap;
- custom topic siap;
- result dan coach siap.

---

# PHASE 5 — CLOSED ALPHA HARDENING

## Sprint P5.1 — Auth and invites

- Supabase Auth;
- invite code;
- roles;
- RLS;
- dev bypass local.

## Sprint P5.2 — Operator console lite

- overview;
- sessions;
- AI usage;
- topics;
- personas;
- prompts;
- flags;
- kill switch.

## Sprint P5.3 — Analytics

- events;
- dashboards;
- cost monitor;
- retention metrics;
- error tracking.

## Sprint P5.4 — Observability

- Sentry;
- structured logs;
- tracing;
- health;
- alerts;
- runbooks.

## Sprint P5.5 — QA

- mobile;
- desktop;
- browser;
- voice;
- camera;
- error;
- staging.

Exit criteria:

```text
10–30 tester dapat bermain melalui staging dengan biaya terpantau.
```

---

# PHASE 6 — COMMERCIAL BETA FOUNDATION

Aktifkan hanya setelah retention MVP sehat.

## 6.1 Wallet

- Kredit Arena;
- ledger;
- reservation;
- capture;
- release;
- refund;
- operator adjustment.

## 6.2 Payment

- QRIS;
- payment gateway;
- webhook;
- idempotency;
- order;
- receipt.

## 6.3 Public challenge

- publish thesis;
- moderation;
- link;
- banner;
- QR;
- share.

## 6.4 Cloud media optional

- R2;
- signed URL;
- retention;
- private;
- delete;
- audit.

## 6.5 Premium optional

- monthly pack;
- KA included;
- no pay-to-win.

Exit criteria:

```text
User dapat top-up, memainkan mode mahal, dan membagikan tantangan dengan aman.
```

---

# PHASE 7 — SOCIAL MULTIPLAYER

## 7.1 PvP

- matchmaking;
- rooms;
- WebSocket;
- room state;
- moderation.

## 7.2 WebRTC

- signaling;
- RTCPeerConnection;
- STUN;
- TURN;
- mic;
- camera;
- connection state;
- reconnect;
- consent.

## 7.3 Spectator

- delayed viewing;
- reaction rate limit;
- no score manipulation;
- moderation.

## 7.4 Clan

- clan;
- roles;
- season;
- team debate.

Exit criteria:

```text
Human vs human voice-video stabil dengan moderation dan spectator aman.
```

---

# PHASE 8 — ORGANIZATION PLATFORM

## 8.1 Arena Aspirasi

Organizer:

- create event;
- private link;
- QR;
- participants;
- source pack;
- report.

## 8.2 AI vs Republik

```text
AI membela kebijakan
banyak peserta mengajukan kritik
AI menjawab berdasarkan source pack
sistem mengelompokkan masukan
```

## 8.3 Quiz Arena

- objective questions;
- timed;
- leaderboard;
- essay AI grading;
- human jury optional.

## 8.4 Consensus Map

- cluster;
- representative statements;
- no claim of representative population unless sampling valid.

## 8.5 Human jury

AI hanya shortlist. Hadiah besar dan keputusan serius membutuhkan human validation.

Exit criteria:

```text
Satu event internal 20–100 peserta dapat selesai dan menghasilkan laporan.
```

---

# PHASE 9 — SCALE AND RELIABILITY

## 9.1 Infrastructure

- multiple web instances;
- worker scaling;
- managed Redis;
- DB pooler;
- replica;
- CDN;
- object lifecycle;
- queue monitoring.

## 9.2 SRE

- SLO;
- on-call;
- incident;
- rollback;
- backup restore drill;
- disaster recovery.

## 9.3 Governance

- privacy;
- moderation;
- content policy;
- audit;
- child safety;
- retention;
- operator training.

---

# 24. ENVIRONMENT VARIABLES

```env
# App
NODE_ENV=
APP_ENV=
NEXT_PUBLIC_APP_URL=
APP_NAME=Republik Argumen
APP_VERSION=
ENABLE_DEV_ROUTES=
ENABLE_DEV_AUTH_BYPASS=

# Database
DATABASE_URL=
DIRECT_DATABASE_URL=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Redis
REDIS_URL=

# OpenRouter
OPENROUTER_API_KEY=
OPENROUTER_SITE_URL=
OPENROUTER_APP_NAME=Republik Argumen
OPENROUTER_OPPONENT_MODEL=
OPENROUTER_JUDGE_MODEL=
OPENROUTER_TOPIC_REFINER_MODEL=
OPENROUTER_TOPIC_MODERATOR_MODEL=
OPENROUTER_STT_MODEL=
OPENROUTER_TTS_MODEL=
OPENROUTER_TTS_VOICE=
OPENROUTER_TTS_RESPONSE_FORMAT=mp3
OPENROUTER_FALLBACK_TEXT_MODEL=
OPENROUTER_TIMEOUT_MS=30000
OPENROUTER_MAX_RETRIES=2
OPENROUTER_MAX_SESSION_COST_USD=
OPENROUTER_DAILY_COST_LIMIT_USD=
OPENROUTER_ENFORCE_ZDR=true

# Storage future
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=
R2_ENDPOINT=
R2_SIGNED_URL_EXPIRY_SECONDS=

# Sentry
SENTRY_DSN=
SENTRY_AUTH_TOKEN=
SENTRY_ORG=
SENTRY_PROJECT=

# Feature flags defaults
FEATURE_VOICE_ARENA=true
FEATURE_CAMERA_PREVIEW=true
FEATURE_HOT_SEAT_AI=true
FEATURE_CUSTOM_TOPIC=true
FEATURE_TOPIC_REFINER=true
FEATURE_DELIVERY_COACH=true
FEATURE_CREDIT_ARENA_DEMO=false
FEATURE_PRODUCTION_WALLET=false
FEATURE_PUBLIC_CHALLENGES=false
FEATURE_SPECTATOR=false
FEATURE_CLAN=false
FEATURE_ORGANIZER_PLATFORM=false
```

---

# 25. RUNBOOKS WAJIB

Buat:

```text
docs/runbooks/
├── DEPLOY_STAGING.md
├── DEPLOY_PRODUCTION.md
├── ROLLBACK.md
├── DATABASE_BACKUP_RESTORE.md
├── OPENROUTER_OUTAGE.md
├── REDIS_OUTAGE.md
├── STT_TTS_DEGRADATION.md
├── AI_KILL_SWITCH.md
├── SECURITY_INCIDENT.md
└── MEDIA_PRIVACY_REQUEST.md
```

---

# 26. ADR WAJIB

```text
docs/adr/
├── ADR-001-modular-monolith.md
├── ADR-002-openrouter-server-side-adapter.md
├── ADR-003-voice-press-to-talk-first.md
├── ADR-004-camera-preview-no-cloud-upload-mvp.md
├── ADR-005-supabase-auth-and-rls.md
├── ADR-006-redis-bullmq-background-jobs.md
├── ADR-007-r2-presigned-uploads-future.md
└── ADR-008-webrtc-only-for-human-live-phase.md
```

---

# 27. CODEX SPRINT REPORT FORMAT

Setiap sprint:

```text
docs/progress/<PHASE>_<SPRINT>_REPORT.md
```

Isi:

```text
1. Objective
2. Scope
3. Files created
4. Files changed
5. Migrations
6. Feature flags
7. Commands run
8. Lint result
9. Type-check result
10. Unit test result
11. Integration test result
12. E2E / smoke result
13. Production build result
14. Screenshot QA
15. Observability notes
16. Security notes
17. Known issues
18. Risk
19. Recommended next step
20. STOP — wait for approval
```

---

# 28. PROMPT PERTAMA UNTUK CODEX

```text
Baca `REPUBLIK_ARGUMEN_MASTER_TECHNICAL_IMPLEMENTATION_BLUEPRINT.md` secara menyeluruh.

Perlakukan dokumen tersebut sebagai source of truth utama.

Jangan langsung membangun fitur baru.

Mulai hanya dari:

PHASE 0 — RECOVERY & REPOSITORY AUDIT
Sprint P0.1 — Freeze
dan
Sprint P0.2 — Inventory

Wajib:
1. buat branch `recovery/voice-first-mvp`;
2. tag kondisi saat ini sebagai `v0.0.0-before-master-recovery`;
3. backup kondisi repo;
4. audit routes;
5. audit components;
6. audit styles;
7. audit dependencies;
8. audit env vars;
9. audit OpenRouter usage;
10. audit localStorage dan database usage;
11. bedakan mock feature, placeholder, dan feature nyata;
12. catat API key exposure;
13. jalankan lint, type-check, test, build, dan smoke test baseline;
14. tulis laporan:
   - `docs/recovery/P0_1_FREEZE_REPORT.md`
   - `docs/recovery/P0_2_ROUTE_INVENTORY.md`
   - `docs/recovery/P0_2_COMPONENT_INVENTORY.md`
   - `docs/recovery/P0_2_ENV_INVENTORY.md`
   - `docs/recovery/P0_2_FEATURE_MATRIX.md`
15. jangan mengubah UI atau behavior selain dokumentasi;
16. berhenti dan tunggu instruksi selanjutnya.
```

---

# 29. PROMPT KEDUA SETELAH AUDIT LOLOS

```text
Baca ulang `REPUBLIK_ARGUMEN_MASTER_TECHNICAL_IMPLEMENTATION_BLUEPRINT.md`.

Kerjakan hanya:

PHASE 0
Sprint P0.3 — Safe clutter removal

Prioritas:
1. ganti brand Arena Politika menjadi Republik Argumen;
2. hapus atau sembunyikan fake metrics;
3. sembunyikan karir politik;
4. sembunyikan profil ideologi;
5. sembunyikan Premium Club;
6. sembunyikan ranking publik;
7. sembunyikan live feed palsu;
8. sembunyikan Kredit Arena production;
9. sembunyikan coming-soon card berlebihan;
10. pindahkan API key OpenRouter ke server-side config;
11. pindahkan model selector ke dev-only route;
12. pertahankan kode reusable;
13. gunakan feature flags;
14. update screenshot QA;
15. jalankan lint, type-check, test, build;
16. tulis `docs/progress/P0_3_SAFE_CLUTTER_REMOVAL_REPORT.md`;
17. berhenti.
```

---

# 30. FINAL MASTER CHECKLIST

## MVP

- [ ] Republik Argumen branding.
- [ ] Tidak politik-only.
- [ ] Lobby sederhana.
- [ ] Route-based flow.
- [ ] Topik luas.
- [ ] Custom topic.
- [ ] Topic refiner.
- [ ] Text debate.
- [ ] Voice input.
- [ ] OpenRouter STT.
- [ ] AI response text stream.
- [ ] OpenRouter TTS.
- [ ] Camera preview.
- [ ] AI interruption.
- [ ] AI Judge.
- [ ] Delivery Coach.
- [ ] Kursi Panas AI.
- [ ] History.
- [ ] Settings.
- [ ] Dev mocks.
- [ ] Operator lite.
- [ ] Logs.
- [ ] Analytics.
- [ ] Cost monitor.
- [ ] Staging.
- [ ] Closed alpha.

## Security

- [ ] API key server-side.
- [ ] No secret browser bundle.
- [ ] No secret localStorage.
- [ ] HTTPS.
- [ ] Rate limit.
- [ ] Validation.
- [ ] RLS.
- [ ] Audit log.
- [ ] Kill switch.
- [ ] Camera consent.
- [ ] Mic consent.
- [ ] Recording OFF default.
- [ ] No face emotion detection.
- [ ] No fake analytics.

## Future-ready

- [ ] Wallet domain planned.
- [ ] Payment planned.
- [ ] R2 planned.
- [ ] PvP WebRTC planned.
- [ ] Spectator planned.
- [ ] Clan planned.
- [ ] Organization event planned.
- [ ] AI vs Republik planned.
- [ ] Quiz planned.
- [ ] Consensus Map planned.

---

# 31. REFERENSI TEKNIS RESMI

Gunakan referensi resmi berikut saat implementasi:

## OpenRouter

```text
https://openrouter.ai/docs/quickstart
https://openrouter.ai/docs/api/reference/streaming
https://openrouter.ai/docs/guides/overview/multimodal/stt
https://openrouter.ai/docs/guides/overview/multimodal/tts
https://openrouter.ai/docs/guides/features/zdr
https://openrouter.ai/docs/api/api-reference/models/get-models
```

## Next.js

```text
https://nextjs.org/docs/app/guides/self-hosting
https://nextjs.org/docs/app/getting-started/deploying
```

## Supabase

```text
https://supabase.com/docs/guides/database/postgres/row-level-security
https://supabase.com/docs/guides/auth
https://supabase.com/docs/guides/storage/security/access-control
```

## Media

```text
https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API
https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection
https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API
```

## Queue

```text
https://docs.bullmq.io/
https://docs.bullmq.io/guide/retrying-failing-jobs
https://docs.bullmq.io/guide/going-to-production
```

## Storage

```text
https://developers.cloudflare.com/r2/
https://developers.cloudflare.com/r2/api/s3/presigned-urls/
https://developers.cloudflare.com/r2/objects/upload-objects/
```

## Testing

```text
https://playwright.dev/docs/intro
https://playwright.dev/docs/ci-intro
```

## Observability

```text
https://docs.sentry.io/platforms/javascript/guides/nextjs/
https://opentelemetry.io/docs/languages/js/getting-started/nodejs/
```

---

# PENUTUP

Produk ini harus dibangun serius, tetapi tidak boleh dibangun serentak tanpa kendali.

Gunakan pola:

```text
Audit
→ Recovery
→ Foundation
→ Text core
→ Voice arena
→ Judge and Coach
→ Closed alpha
→ Commercial beta
→ Social multiplayer
→ Organization platform
→ Scale
```

Prinsip akhir:

# **Bangun kecil secara scope, tetapi benar secara fondasi.**
# **Jadikan voice debate nyata sebagai daya tarik utama.**
# **Siapkan operator backend sejak awal, aktifkan fitur komersial setelah MVP terbukti.**
