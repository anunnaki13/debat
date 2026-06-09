# REPUBLIK ARGUMEN — UI/UX RECOVERY & CONTINUATION BLUEPRINT
> **Dokumen koreksi implementasi untuk Codex**  
> Versi: `1.0.0-recovery-voice-first-mvp`  
> Status: **ACTIVE RECOVERY BLUEPRINT**  
> Menggantikan arahan UI yang sedang diimplementasikan apabila terdapat konflik.  
> Gunakan bersama:  
> - `REPUBLIK_ARGUMEN_MVP_VOICE_ARENA_BLUEPRINT.md`  
> - `REPUBLIK_ARGUMEN_UI_UX_STYLE_BLUEPRINT.md`  
>
> Dokumen ini dibuat berdasarkan audit visual terhadap implementasi staging saat ini melalui screenshot:
> - `docs/audit-current-state/01_current_top_dashboard.png`
> - `docs/audit-current-state/02_current_mid_dashboard.png`
> - `docs/audit-current-state/03_current_topic_setup.png`

---

# 0. PERINTAH UTAMA UNTUK CODEX

**Jangan menambahkan fitur baru sebelum fondasi UI/UX dan alur bermain dibenahi.**

Implementasi saat ini sudah memiliki beberapa elemen visual yang dapat dipertahankan, tetapi arah produknya melenceng: aplikasi terasa seperti dashboard politik simulatif yang penuh placeholder, bukan game debat AI voice-first yang dapat dimainkan secara mulus.

Lakukan pekerjaan secara **bertahap dan dapat diverifikasi**.

## 0.1 Aturan kerja

1. Buat branch:
   ```bash
   git checkout -b recovery/voice-first-mvp
   ```
2. Tag kondisi saat ini:
   ```bash
   git tag v0.0.0-before-ui-recovery
   ```
3. Jangan menghapus kode secara brutal.
4. Pindahkan fitur yang belum dibutuhkan ke feature flag atau folder archive.
5. Setiap sprint harus menghasilkan:
   - kode runnable;
   - screenshot QA;
   - laporan sprint;
   - lint;
   - type-check;
   - unit test;
   - production build;
   - smoke test.
6. Jangan lanjut sprint berikutnya sebelum acceptance criteria sprint aktif lolos.
7. Jika struktur repository aktual berbeda dari asumsi dokumen, dokumentasikan perbedaannya terlebih dahulu.
8. Jangan menyimpan OpenRouter API key di browser pada production.
9. Jangan menampilkan fake engagement metrics sebagai fakta.
10. Jangan membuat UI politik-only.
11. Fokus MVP:
    - Duel Wacana AI;
    - Kursi Panas AI;
    - custom topic privat;
    - AI topic refiner;
    - voice-to-voice;
    - kamera opsional;
    - AI Judge;
    - result;
    - delivery coach;
    - history lokal atau sederhana.

---

# 1. EXECUTIVE SUMMARY

## 1.1 Diagnosis singkat

Implementasi staging saat ini terlihat cukup menarik secara sekilas, tetapi memiliki empat masalah fundamental:

| Masalah | Dampak |
|---|---|
| Produk dipersempit menjadi `Arena Politika` | Bertentangan dengan visi topik luas: olahraga, teknologi, bisnis, hiburan, lifestyle, isu publik, dan topik santai |
| Seluruh fitur ditumpuk dalam satu halaman dashboard panjang | User tidak mengalami alur game; user hanya melihat panel-panel |
| Banyak fitur masa depan dan fake data tampil seolah aktif | Membuat MVP terasa palsu, membingungkan, dan sulit diuji |
| Voice-first debate belum menjadi pusat pengalaman | Padahal nilai unik utama adalah user berbicara dan AI membalas dengan suara seperti debat nyata |

## 1.2 Sasaran recovery

Setelah recovery, user harus mengalami alur berikut:

```text
Lobby
  → Pilih mode
  → Pilih topik / buat topik
  → Pilih input text / voice / voice + camera
  → Device check
  → Masuk arena
  → User berbicara
  → STT
  → User review transkrip
  → AI lawan menjawab dengan voice
  → User dapat interupsi
  → Ronde berlanjut
  → AI Judge menilai
  → Result reveal
  → Delivery Coach
  → Main lagi / lihat history
```

User tidak boleh dipaksa memahami semua fitur masa depan pada hari pertama.

---

# 2. AUDIT IMPLEMENTASI SAAT INI

## 2.1 Yang sudah bagus dan boleh dipertahankan

| Elemen | Penilaian | Tindakan |
|---|---|---|
| Dark navy base | Sesuai arah premium | Pertahankan |
| Cyan accent | Cocok untuk user dan CTA | Pertahankan |
| Coral / magenta accent | Cocok untuk AI opponent | Gunakan lebih disiplin |
| Gold accent | Cocok untuk prestige | Pertahankan tetapi kurangi frekuensi |
| Sidebar desktop | Berguna untuk desktop | Sederhanakan |
| Card language | Sudah cukup konsisten | Rapikan density |
| Topic cards | Dapat dipakai ulang | Refactor menjadi halaman topik |
| Persona AI cards | Berguna | Pindahkan ke flow pilih lawan atau mode tertentu |
| Input mode Text / Voice / Voice + Camera | Arah sudah benar | Jadikan step tersendiri |
| Tema premium | Sudah mulai terlihat | Perkuat melalui hierarchy dan whitespace |

## 2.2 Masalah kritis yang harus diperbaiki

### A. Branding salah arah

Saat ini logo dan copy memakai:

```text
ARENA POLITIKA
DEBAT. PIKIR. PIMPIN.
```

Target produk harus kembali menjadi:

```text
REPUBLIK ARGUMEN
Panas pada gagasan. Tenang pada pembuktian.
```

Politik hanyalah salah satu kategori, bukan identitas keseluruhan produk.

**Action:**
- rename brand;
- ganti logo text;
- ganti menu `Karir Politik`;
- ganti `Profil Ideologi`;
- ganti copy yang terlalu partisan;
- pertahankan satire politik hanya sebagai salah satu skin atau flavor.

### B. Dashboard terlalu padat

Saat ini satu halaman memuat:

- hero arena;
- timer;
- audience reaction;
- pilih persona AI;
- AI coach;
- mode cards;
- live feed;
- karir politik;
- profil ideologi;
- share result;
- topic picker;
- API key;
- model dropdown;
- setup posisi;
- input mode.

Ini bukan game flow. Ini dashboard showcase.

**Action:**
- pecah menjadi route dan step terpisah;
- lobby hanya menampilkan CTA, mode, dan beberapa topik;
- setup dipindahkan dari sidebar kanan ke flow khusus;
- arena hanya berisi hal relevan saat debat berlangsung.

### C. Fake engagement metrics

Contoh saat ini:

```text
512 setuju
218 butuh data
143 interupsi
89 menarik
156.230 pemain sedang online
612 menunggu
428 menunggu
```

Untuk MVP personal atau closed alpha, angka semacam ini tidak boleh tampil sebagai fakta.

**Action:**
- hapus;
- atau gunakan label jelas `DEMO`;
- default: jangan tampilkan sama sekali;
- analytics internal tidak boleh ditampilkan ke user sebagai social proof palsu.

### D. Feature overload

Saat ini tampil:

```text
Premium Club
Kredit Arena
Ranking
AI Coach
Misi Harian
Karir Politik
Coming soon mode cards
Profil Ideologi
Bagikan hasil
```

Sebagian besar belum relevan untuk menguji core loop.

**Action:**
- hide via feature flags;
- MVP sidebar maksimal:
  - Beranda
  - Main
  - Topik
  - Riwayat
  - Pengaturan
- dev-only:
  - AI config
  - model selector
  - API diagnostics
  - debug panel

### E. OpenRouter API key tampil di halaman user

Screenshot menunjukkan field:

```text
OpenRouter API Key
```

Ini berbahaya jika dipakai sebagai desain production.

**Action:**
- production: API key hanya server-side `.env`;
- development personal mode: optional local key hanya di route dev-only;
- jangan expose pada halaman user;
- jangan simpan key di database plaintext;
- jangan pernah log key;
- jangan pernah masukkan key ke client bundle.

### F. Model selector tampil ke user

Screenshot menunjukkan:

```text
Model lawan
Model wasit
```

Untuk MVP user experience, ini terlalu teknis.

**Action:**
- pindahkan ke `/dev/ai-config`;
- production selection server-side;
- default model dari environment;
- user hanya memilih persona, bukan nama model.

### G. Voice + camera belum menjadi pusat flow

Saat ini voice dan camera hanya opsi kecil di panel setup.

**Action:**
- buat route `/device-check`;
- buat preview kamera;
- mic meter;
- speaker test;
- pilih mode;
- arena voice-first;
- AI voice response;
- interupsi;
- caption;
- fallback text.

### H. Politik-only labels

Contoh:

```text
Karir Politikmu
Aktivis
Ketua OSIS
Caleg DPRD
Presiden
Profil Ideologi
Pragmatic Reformis
```

Ini mempersempit pasar dan berisiko membuat game tampak seperti simulasi politik partisan.

**Action:**
- untuk MVP, gunakan progression generik:
  - Penyimak
  - Penanggap
  - Orator Muda
  - Juru Bicara
  - Debater Tangguh
  - Negarawan Argumen
- progression politik satir dapat menjadi theme pack nanti.

### I. Dead space dan hierarchy

Terdapat area besar kosong di bawah hero. User harus scroll jauh sebelum mencapai topic setup.

**Action:**
- gunakan card height lebih proporsional;
- hero lobby maksimal 360–440 px desktop;
- setup bukan di bawah fold panjang;
- route-based flow.

---

# 3. PRODUK TARGET SETELAH RECOVERY

## 3.1 Scope MVP aktif

### Wajib dibangun

```text
1. Lobby
2. Pilih mode
3. Pilih topik
4. Buat topik privat
5. AI Topic Refiner
6. Device check
7. Duel Wacana AI text
8. Duel Wacana AI voice-to-voice
9. Voice + camera preview
10. Interupsi AI
11. AI Judge
12. Result reveal
13. Delivery Coach
14. History
15. Settings
16. Dev UI playground
17. Dev mock arena
18. Dev AI config
```

### Boleh disiapkan kontraknya tetapi jangan diaktifkan

```text
1. Kredit Arena production
2. Payment gateway
3. Public challenge link
4. Share poster production
5. Spectator live
6. PvP human
7. Clan / partai
8. Leaderboard publik
9. Event organizer
10. AI vs banyak manusia
11. Quiz event
12. Source pack / RAG organisasi
```

### Harus disembunyikan pada MVP user-facing

```text
1. Premium Club
2. Fake online count
3. Fake audience reaction
4. Profil ideologi
5. Karir politik
6. Ranking palsu
7. Coming soon cards berlebihan
8. API key input
9. Model selector
10. Debug diagnostics
```

---

# 4. INFORMATION ARCHITECTURE BARU

## 4.1 Routes

```text
/
├── /                         Lobby
├── /play                     Pilih mode
├── /topics                   Pilih topik
├── /topics/new               Buat topik privat
├── /topics/refine            AI topic refiner
├── /device-check             Kamera, mikrofon, speaker
├── /arena/[sessionId]        Arena voice debate
├── /results/[sessionId]      AI Judge result
├── /results/[sessionId]/coach Delivery Coach
├── /history                  Riwayat debat
├── /settings                 Preferensi
│
├── /dev/ui-playground        Dev only
├── /dev/mock-arena           Dev only
└── /dev/ai-config            Dev only
```

## 4.2 Sidebar desktop baru

```text
REPUBLIK ARGUMEN

Beranda
Main
Topik
Riwayat
Pengaturan
```

Optional small footer:

```text
MVP Voice Arena
v0.x.x
```

Jangan tampilkan:

```text
Kredit Arena
Premium Club
Ranking
Clan
Misi Harian
Karir Politik
```

## 4.3 Mobile bottom nav

```text
[ Beranda ] [ Main ] [ + ] [ Topik ] [ Riwayat ]
```

Tombol `+`:

```text
Buat topik privat
```

---

# 5. VISUAL DIRECTION FINAL

Gunakan:

# **Modern Civic Arena**

Bukan:

- dashboard politik;
- dashboard kantor;
- kasino;
- social media feed;
- cyberpunk neon berlebihan.

## 5.1 Prinsip visual

| Prinsip | Implementasi |
|---|---|
| Lobby tenang | Whitespace cukup, 1 CTA utama, kartu mode secukupnya |
| Arena dramatis | Timer, waveform, camera tile, AI avatar, caption |
| Result memuaskan | Progressive reveal, score bars, coaching |
| Premium | Navy, cyan, coral, gold lembut |
| Sportif | Bahasa tidak menghina |
| Mobile-first | PiP kamera, mic sticky, bottom sheet |
| Ready-to-scale | Tokens dan components reusable |

## 5.2 Warna

```css
:root {
  --ra-bg-deep: #070B13;
  --ra-bg-base: #0A111D;
  --ra-bg-surface: #0E1827;
  --ra-bg-panel: #132033;
  --ra-bg-panel-strong: #17283D;

  --ra-text-primary: #F6F2E9;
  --ra-text-secondary: #B5C0D0;
  --ra-text-muted: #7F8EA4;

  --ra-user: #32D4D1;
  --ra-ai: #EE6A64;
  --ra-gold: #D8AA5C;
  --ra-positive: #62D49C;
  --ra-violet: #9C7CFF;

  --ra-border-subtle: rgba(255, 255, 255, 0.08);
  --ra-border-default: rgba(255, 255, 255, 0.13);
}
```

## 5.3 Typography

```text
Heading editorial: Fraunces
UI text: Plus Jakarta Sans
```

Aturan:

- gunakan serif hanya untuk heading pilihan;
- jangan gunakan serif pada button, timer, caption, atau form;
- card title maksimal 2–3 baris;
- body minimal 14 px mobile.

---

# 6. LOBBY BARU

## 6.1 Desktop wireframe

```text
┌──────────────┬───────────────────────────────────────────────────────┐
│ Sidebar      │ Search                                  Settings      │
│              ├───────────────────────────────────────────────────────┤
│              │ Selamat datang kembali, Budi!                        │
│              │ Siap menguji argumen hari ini?                       │
│              │ [ MULAI DEBAT AI ] [ BUAT TOPIK SENDIRI ]            │
│              ├───────────────────────────────────────────────────────┤
│              │ PILIH MODE                                            │
│              │ [ Duel Wacana AI ] [ Kursi Panas AI ]                │
│              ├───────────────────────────────────────────────────────┤
│              │ TOPIK UNTUK ANDA                                      │
│              │ [ topic ] [ topic ] [ topic ]                         │
│              ├───────────────────────────────────────────────────────┤
│              │ LANJUTKAN LATIHAN                                     │
│              │ [ last result / recommendation ]                      │
└──────────────┴───────────────────────────────────────────────────────┘
```

## 6.2 Lobby content

Tampilkan:

- greeting;
- 2 CTA;
- 2 mode aktif;
- 3–6 topik;
- history terakhir;
- rekomendasi latihan.

Jangan tampilkan:

- live audience;
- ranking;
- politik career;
- ideologi;
- premium;
- KA production;
- issue sensationalized;
- fake live status.

---

# 7. PILIH MODE

## 7.1 Mode aktif

| Mode | Fungsi | Accent |
|---|---|---|
| Duel Wacana AI | 1 vs 1 AI | Cyan |
| Kursi Panas AI | User menghadapi 3 atau 5 persona AI | Amber / coral |
| Custom Topic | User menguji tesis sendiri | Violet |

## 7.2 Mode skin opsional

`Satu Lawan Tribun` tidak perlu menjadi backend mode baru pada MVP.

Implementasikan sebagai preset:

```text
Kursi Panas AI
+ kategori olahraga
+ persona fans
+ stadium skin
```

---

# 8. TOPIC FLOW

## 8.1 Kategori MVP

```text
Sepak Bola
Olahraga
Teknologi
Bisnis
Pendidikan
Pekerjaan
Lifestyle
Hiburan
Lingkungan
Isu Publik Ringan
Absurd dan Santai
```

Politik aktual sensitif: jangan aktif pada MVP.

## 8.2 Topic card

Harus lebih ringan daripada implementasi saat ini.

Tampilkan:

```text
Kategori
Tesis
Ringkasan 1–2 baris
Level
Kepedasan
[ Pilih ]
```

Jangan tampilkan:

```text
612 menunggu
viral
live
audience
```

kecuali benar-benar memiliki backend nyata.

---

# 9. DEVICE CHECK

## 9.1 Route

```text
/device-check
```

## 9.2 Fungsi

- permission explanation;
- camera preview;
- mic permission;
- mic meter;
- speaker test;
- pilihan:
  - Text Only
  - Voice Only
  - Voice + Camera
- fallback jelas.

## 9.3 Wireframe

```text
┌──────────────────────────────────────────────────────┐
│ Persiapkan Arena                                     │
│ Uji kamera, mikrofon, dan speaker.                   │
├───────────────────────┬──────────────────────────────┤
│ Camera Preview        │ Kamera [ select ]            │
│ [ video ]             │ Mikrofon [ select ]          │
│                       │ Speaker [ test ]             │
│ LIVE PREVIEW          │ Mic level [|||||----]        │
├───────────────────────┴──────────────────────────────┤
│ [ Text ] [ Voice ] [ Voice + Camera ]                │
│                                  [ MASUK ARENA ]     │
└──────────────────────────────────────────────────────┘
```

## 9.4 Rules

- kamera tidak aktif sebelum consent;
- mic tidak aktif sebelum consent;
- sediakan `Lanjut tanpa kamera`;
- sediakan `Gunakan teks saja`;
- production wajib HTTPS;
- kamera tidak dikirim ke OpenRouter;
- video tidak disimpan default.

---

# 10. ARENA VOICE-FIRST

## 10.1 Arena desktop

```text
┌─────────────────────────────────────────────────────────────────────┐
│ ← Keluar     RONDE 2 · REBUTTAL              01:48      Settings    │
├─────────────────┬──────────────────────────────────┬────────────────┤
│ USER PODIUM     │ LIVE TRANSCRIPT                  │ AI LAWAN       │
│ [ Camera ]      │ Anda                             │ [ AI avatar ]  │
│ Budi            │ “Naturalisasi dapat...”          │ Persona        │
│ Momentum 58%    │                                  │ Momentum 42%   │
│                 │ AI                               │                │
│                 │ “Pembinaan butuh waktu...”       │                │
├─────────────────┴──────────────────────────────────┴────────────────┤
│ [ Interupsi ] [ Catatan Data ] [ Cek Fakta ] [ Titik Temu ]       │
├─────────────────────────────────────────────────────────────────────┤
│ 🎙 Tahan untuk bicara atau ketik argumen...              [ Kirim ] │
└─────────────────────────────────────────────────────────────────────┘
```

## 10.2 Arena mobile

```text
┌──────────────────────────────┐
│ ← RONDE 2 · REBUTTAL   01:48 │
├──────────────────────────────┤
│ AI AVATAR                    │
│ Menteri Klarifikasi          │
│ ● AI sedang berbicara        │
│ [ waveform ]                 │
│                              │
│ Caption AI                   │
│                              │
│                    [ PiP cam ]│
├──────────────────────────────┤
│ Anda 58% · AI 42%            │
├──────────────────────────────┤
│ [ Data ][ Fakta ][ Titik ]   │
│ [ INTERUPSI ]                 │
├──────────────────────────────┤
│ 🎙 TAHAN UNTUK BICARA        │
│ Ketik sebagai alternatif     │
└──────────────────────────────┘
```

## 10.3 Arena visual state

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
  | "recoverable_error";
```

## 10.4 Voice sequence

```text
Press mic
  → record audio
  → stop
  → upload STT request
  → show editable transcript
  → send final text to opponent LLM
  → stream AI response text
  → generate TTS
  → play AI voice
  → allow Interupsi
```

## 10.5 AI interruption

Ketika user menekan `INTERUPSI`:

1. stop AI audio;
2. cancel queued playback;
3. preserve partial caption;
4. record interruption event;
5. open mic;
6. allow user to speak;
7. continue debate flow.

---

# 11. OPENROUTER SECURITY REFACTOR

## 11.1 Hapus dari user page

Hapus:

```text
OpenRouter API Key field
Model lawan dropdown
Model wasit dropdown
Tes OpenRouter button
```

## 11.2 Server environment

Gunakan:

```env
OPENROUTER_API_KEY=
OPENROUTER_OPPONENT_MODEL=
OPENROUTER_JUDGE_MODEL=
OPENROUTER_STT_MODEL=
OPENROUTER_TTS_MODEL=
OPENROUTER_FALLBACK_TEXT_MODEL=
```

Optional:

```env
OPENROUTER_APP_NAME=Republik Argumen
OPENROUTER_SITE_URL=
```

## 11.3 Dev-only config

Route:

```text
/dev/ai-config
```

Hanya aktif jika:

```env
ENABLE_DEV_ROUTES=true
NODE_ENV=development
```

atau dilindungi basic auth di staging.

## 11.4 API routes

```text
POST /api/ai/opponent
POST /api/ai/judge
POST /api/audio/transcribe
POST /api/audio/speech
POST /api/topics/refine
GET  /api/health
```

Rules:

- validation;
- timeout;
- retry terbatas;
- redact secrets;
- log biaya;
- log latency;
- error mapping user-friendly;
- rate limit.

---

# 12. AI JUDGE RESULT

## 12.1 Score dimensions

```text
Speak by Data
Struktur
Logika
Rebuttal
Integritas
Delivery
```

`Delivery` hanya tampil untuk voice mode.

## 12.2 Result reveal

```text
SIDANG SELESAI

Grade A-
Orator Muda

Speak by Data  78
Struktur       84
Logika         81
Rebuttal       76
Integritas     92
Delivery       80

Kekuatan utama:
...

Perbaikan terpenting:
...

[ Main Lagi ] [ Delivery Coach ] [ Riwayat ]
```

## 12.3 Jangan gunakan

```text
Anda kalah telak
AI menang mutlak
Pendapat Anda buruk
```

Gunakan coaching-oriented copy.

---

# 13. DELIVERY COACH

## 13.1 MVP signals

```text
Words per minute
Durasi bicara
Pause ratio
Filler words
Volume stability
Response latency
Interruption count
Repeated phrases
```

## 13.2 Jangan bangun

```text
Face emotion recognition
Psychological diagnosis
Lie detection
Political profiling
Biometric identity matching
```

## 13.3 UX

```text
DELIVERY COACH — BETA

Kecepatan bicara
147 kata/menit
Cukup jelas

Filler words
4 kali
Kurangi “eee” sebelum menyampaikan data.

Rasio jeda
18%
Stabil
```

---

# 14. COMPONENT REFACTOR MAP

## 14.1 Existing → New

| Existing UI | Tindakan | New component |
|---|---|---|
| `Arena Politika` brand | Rename | `BrandMark` |
| Dashboard hero | Replace | `LobbyHero` |
| Hero arena preview | Remove from lobby | `ArenaShell` route |
| Audience reaction cards | Remove | none |
| AI coach sidebar | Move to result | `JudgeSummary` |
| Persona cards on lobby | Move to mode setup | `PersonaSelector` |
| Mode cards | Keep, simplify | `ModeCard` |
| Live arena feed | Hide MVP | future |
| Career politics | Hide MVP | future theme |
| Ideology profile | Remove | none |
| Share result card | Keep local preview only | `ShareCardPreview` |
| Topic list | Refactor route | `TopicGrid` |
| API key panel | Remove user-facing | `/dev/ai-config` |
| Input mode selector | Move | `DeviceCheckPanel` |

## 14.2 Component folders

```text
src/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── lobby/
│   ├── modes/
│   ├── topics/
│   ├── device-check/
│   ├── arena/
│   ├── results/
│   ├── coach/
│   └── dev/
├── lib/
│   ├── ai/
│   ├── audio/
│   ├── game/
│   ├── analytics/
│   └── config/
├── styles/
│   ├── tokens.css
│   ├── globals.css
│   ├── themes.css
│   └── motion.css
└── app/
```

---

# 15. FEATURE FLAGS

Gunakan:

```ts
type FeatureFlags = {
  enableVoiceArena: boolean;
  enableCameraPreview: boolean;
  enableHotSeatAi: boolean;
  enableCustomTopic: boolean;
  enableTopicRefiner: boolean;
  enableDeliveryCoach: boolean;

  enableCreditArenaDemo: boolean;
  enablePublicLeaderboard: boolean;
  enablePublicChallenges: boolean;
  enableSpectator: boolean;
  enablePremium: boolean;
  enableClan: boolean;
  enablePoliticalCareerTheme: boolean;
  enableOrganizerPlatform: boolean;
};
```

Default MVP:

```ts
{
  enableVoiceArena: true,
  enableCameraPreview: true,
  enableHotSeatAi: true,
  enableCustomTopic: true,
  enableTopicRefiner: true,
  enableDeliveryCoach: true,

  enableCreditArenaDemo: false,
  enablePublicLeaderboard: false,
  enablePublicChallenges: false,
  enableSpectator: false,
  enablePremium: false,
  enableClan: false,
  enablePoliticalCareerTheme: false,
  enableOrganizerPlatform: false
}
```

---

# 16. DATA MODEL MVP

Gunakan database sederhana atau local persistence sesuai kondisi repo. Namun interface domain harus jelas.

```ts
type DebateMode = "duel_ai" | "hot_seat_ai";

type InputMode = "text" | "voice" | "voice_camera";

type DebateSession = {
  id: string;
  mode: DebateMode;
  topicId?: string;
  customTopic?: string;
  userPosition: "pro" | "contra";
  inputMode: InputMode;
  status:
    | "created"
    | "device_check"
    | "active"
    | "judging"
    | "completed"
    | "abandoned"
    | "error";
  currentRound: number;
  totalRounds: number;
  personaIds: string[];
  createdAt: string;
  completedAt?: string;
};

type DebateTurn = {
  id: string;
  sessionId: string;
  actor: "user" | "ai";
  round: number;
  text: string;
  audioUrl?: string;
  interrupted?: boolean;
  durationMs?: number;
  createdAt: string;
};

type JudgeReport = {
  sessionId: string;
  scores: {
    data: number;
    structure: number;
    logic: number;
    rebuttal: number;
    integrity: number;
    delivery?: number;
  };
  strengths: string[];
  improvements: string[];
  bestArgument?: string;
  deliveryTips?: string[];
  grade: string;
  titleUnlocked?: string;
};
```

---

# 17. RESPONSIVE REQUIREMENTS

## 17.1 Breakpoints

```text
360 px
480 px
768 px
1024 px
1280 px
1536 px
```

## 17.2 Screenshots wajib

```text
docs/visual-qa/
├── recovery-lobby-desktop.png
├── recovery-lobby-mobile.png
├── recovery-topic-desktop.png
├── recovery-device-check-mobile.png
├── recovery-arena-ai-speaking-desktop.png
├── recovery-arena-user-speaking-mobile.png
├── recovery-transcript-review-mobile.png
├── recovery-result-desktop.png
└── recovery-delivery-coach-mobile.png
```

---

# 18. RECOVERY SPRINT PLAN

## Sprint R0 — Freeze, inventory, and audit

### Tasks

1. Tag kondisi awal.
2. Buat recovery branch.
3. Dokumentasikan stack aktual.
4. Dokumentasikan route aktual.
5. Dokumentasikan component tree aktual.
6. Dokumentasikan package dependencies.
7. Dokumentasikan env vars.
8. Dokumentasikan mana yang benar-benar bekerja dan mana yang mock.
9. Simpan screenshot current state.
10. Pastikan production build kondisi awal tercatat.

### Output

```text
docs/recovery/R0_CURRENT_STATE_AUDIT.md
docs/recovery/R0_ROUTE_INVENTORY.md
docs/recovery/R0_COMPONENT_INVENTORY.md
docs/recovery/R0_ENV_INVENTORY.md
```

### Acceptance criteria

- kondisi awal dapat di-build;
- mock dan real feature dibedakan jelas;
- tidak ada kode diubah selain dokumentasi;
- laporan selesai.

---

## Sprint R1 — Remove misleading MVP clutter

### Tasks

Hide melalui feature flags:

- Premium Club;
- ranking;
- clan;
- career politics;
- ideology profile;
- audience reaction;
- live feed;
- fake counts;
- Kredit Arena production;
- coming soon cards berlebihan.

Rename:

```text
ARENA POLITIKA
→ REPUBLIK ARGUMEN
```

Simplify sidebar.

### Acceptance criteria

- lobby tidak lagi terlihat sebagai dashboard politik;
- sidebar maksimal 5 menu;
- fake metrics tidak tampil;
- branding konsisten;
- build lolos.

---

## Sprint R2 — Route-based flow

### Tasks

Bangun routes:

```text
/
 /play
 /topics
 /topics/new
 /topics/refine
 /device-check
 /arena/[sessionId]
 /results/[sessionId]
 /results/[sessionId]/coach
 /history
 /settings
```

Refactor existing topic and mode UI ke route yang tepat.

### Acceptance criteria

- user dapat menyelesaikan navigation flow tanpa scroll dashboard panjang;
- state antar-step tersimpan;
- back button bekerja;
- refresh tidak merusak flow secara fatal.

---

## Sprint R3 — Design system recovery

### Tasks

- tokens;
- typography;
- button variants;
- card variants;
- sidebar;
- bottom nav;
- modal;
- bottom sheet;
- toast;
- loading;
- error;
- skeleton;
- focus state;
- reduced motion;
- `/dev/ui-playground`.

### Acceptance criteria

- styles terpusat;
- tidak ada hard-coded arbitrary colors pada komponen inti;
- playground tersedia;
- keyboard focus terlihat;
- mobile 360 px tidak overflow.

---

## Sprint R4 — Lobby reconstruction

### Tasks

Bangun lobby sesuai wireframe:

- greeting;
- primary CTA;
- 2 mode aktif;
- topic recommendations;
- history terakhir;
- recommendation card.

### Acceptance criteria

- lobby dapat dipahami < 5 detik;
- tidak ada fake social proof;
- tidak ada API config;
- CTA jelas;
- responsive.

---

## Sprint R5 — Topic and custom topic flow

### Tasks

- topic categories;
- topic grid;
- search;
- filter;
- custom topic;
- spice meter;
- refiner screen;
- validation;
- safe copy.

### Acceptance criteria

- topik luas, tidak politik-only;
- custom topic dapat dibuat;
- topic refiner bekerja;
- sensitive topic fallback tersedia;
- mobile form nyaman.

---

## Sprint R6 — OpenRouter security refactor

### Tasks

- remove API key input dari user UI;
- remove model selector dari user UI;
- server-side AI adapter;
- dev-only AI config;
- endpoint validation;
- timeout;
- retry;
- error mapping;
- cost log;
- latency log;
- `/api/health`.

### Acceptance criteria

- key tidak ada pada browser bundle;
- key tidak ada di localStorage;
- key tidak tampil di network response;
- opponent dan judge terpisah;
- error aman;
- smoke test lolos.

---

## Sprint R7 — Text debate engine

### Tasks

- create session;
- round state;
- user turn;
- AI turn;
- streaming text;
- transcript;
- submit;
- cancel;
- retry;
- result trigger.

### Acceptance criteria

- Duel Wacana AI text-only dapat selesai end-to-end;
- refresh dan error recovery cukup aman;
- AI lawan konsisten dengan posisi kontra;
- AI Judge dipanggil setelah sesi selesai.

---

## Sprint R8 — Device check and camera preview

### Tasks

- permission explanation;
- `getUserMedia`;
- camera preview;
- mic meter;
- speaker test;
- device selector;
- fallback text;
- fallback voice-only;
- cleanup stream tracks.

### Acceptance criteria

- camera tidak aktif sebelum consent;
- mic tidak aktif sebelum consent;
- user dapat lanjut text-only;
- stream tracks berhenti saat keluar;
- device denied state jelas;
- HTTPS note tersedia.

---

## Sprint R9 — STT and transcript review

### Tasks

- audio capture;
- STT route;
- transcript editable;
- retry;
- empty transcript;
- cancel;
- fallback text.

### Acceptance criteria

- user dapat berbicara;
- transkrip muncul;
- transkrip dapat diedit;
- transkrip final dikirim;
- STT error tidak memblokir game.

---

## Sprint R10 — TTS and AI voice

### Tasks

- AI response streaming;
- TTS route;
- audio playback queue;
- subtitle;
- mute;
- browser speech synthesis fallback;
- error state.

### Acceptance criteria

- AI membalas dengan suara;
- caption tampil;
- user dapat mute;
- jika TTS gagal, teks tetap terbaca;
- audio queue tidak overlap.

---

## Sprint R11 — Interruption and arena polish

### Tasks

- interupsi;
- cancel audio;
- preserve partial caption;
- open mic;
- waveform;
- AI speaking halo;
- camera PiP mobile;
- mobile sticky mic;
- timer;
- round transition.

### Acceptance criteria

- interupsi menghentikan audio;
- mic siap setelah interupsi;
- state tidak rusak;
- mobile usable;
- reduced motion berfungsi.

---

## Sprint R12 — Judge result and Delivery Coach

### Tasks

- structured JSON Judge output;
- result reveal;
- score bars;
- strengths;
- improvements;
- delivery metrics;
- Delivery Coach beta;
- history.

### Acceptance criteria

- report konsisten;
- result usable;
- delivery signals tidak mengklaim emotion detection;
- history menyimpan sesi;
- mobile rapi.

---

## Sprint R13 — Kursi Panas AI

### Tasks

- pilih 3 atau 5 persona;
- persona transition;
- mini-round;
- summary;
- result;
- optional stadium skin for sports.

### Acceptance criteria

- flow berbeda dari duel biasa;
- persona terasa berbeda;
- tetap menggunakan engine yang reusable;
- tidak membutuhkan multiplayer.

---

## Sprint R14 — Stabilization and staging

### Tasks

- responsive QA;
- browser QA;
- accessibility sweep;
- visual QA screenshots;
- performance;
- error recovery;
- staging env;
- health check;
- log review;
- backup;
- documentation.

### Acceptance criteria

- closed alpha ready;
- core loop stabil;
- screenshot QA lengkap;
- known issues terdokumentasi;
- build production lolos.

---

# 19. CODEX REPORT FORMAT

Setelah setiap sprint:

```text
docs/recovery/RX_SPRINT_REPORT.md
```

Isi:

```text
1. Tujuan sprint
2. Perubahan dibuat
3. File dibuat
4. File diubah
5. Feature flag diubah
6. Command dijalankan
7. Hasil lint
8. Hasil type-check
9. Hasil test
10. Hasil production build
11. Screenshot QA
12. Known issues
13. Risiko
14. Rekomendasi sprint selanjutnya
15. STOP — tunggu instruksi
```

---

# 20. PROMPT PERTAMA UNTUK CODEX

```text
Baca `REPUBLIK_ARGUMEN_UI_UX_RECOVERY_AND_CONTINUATION_BLUEPRINT.md` secara menyeluruh.

Jangan langsung memperbaiki UI. Mulai hanya dari `Sprint R0 — Freeze, inventory, and audit`.

Tujuan pertama adalah mendokumentasikan kondisi repository aktual sebelum perubahan dibuat.

Wajib:
1. buat branch `recovery/voice-first-mvp`;
2. tag kondisi saat ini sebagai `v0.0.0-before-ui-recovery`;
3. inventaris route;
4. inventaris component;
5. inventaris package;
6. inventaris environment variable;
7. bedakan mock feature dan real feature;
8. simpan screenshot current state;
9. jalankan lint, type-check, test, dan production build;
10. tulis laporan pada:
   - `docs/recovery/R0_CURRENT_STATE_AUDIT.md`
   - `docs/recovery/R0_ROUTE_INVENTORY.md`
   - `docs/recovery/R0_COMPONENT_INVENTORY.md`
   - `docs/recovery/R0_ENV_INVENTORY.md`
11. jangan mengubah behavior atau UI pada Sprint R0;
12. berhenti dan tunggu instruksi selanjutnya.
```

---

# 21. PROMPT KEDUA SETELAH R0 LOLOS

```text
Baca ulang `REPUBLIK_ARGUMEN_UI_UX_RECOVERY_AND_CONTINUATION_BLUEPRINT.md`.

Kerjakan hanya `Sprint R1 — Remove misleading MVP clutter`.

Gunakan feature flags dan refactor aman. Jangan menghapus domain logic yang mungkin dibutuhkan nanti.

Prioritas:
1. ganti brand `Arena Politika` menjadi `Republik Argumen`;
2. sederhanakan sidebar menjadi Beranda, Main, Topik, Riwayat, Pengaturan;
3. sembunyikan fake audience metrics;
4. sembunyikan live feed palsu;
5. sembunyikan Premium Club;
6. sembunyikan Kredit Arena production;
7. sembunyikan ranking publik;
8. sembunyikan karir politik;
9. sembunyikan profil ideologi;
10. sembunyikan coming-soon cards berlebihan;
11. pindahkan AI config dari user-facing UI menjadi dev-only route;
12. jalankan lint, type-check, test, build;
13. simpan screenshot QA;
14. tulis `docs/recovery/R1_SPRINT_REPORT.md`;
15. berhenti.
```

---

# 22. FINAL MVP ACCEPTANCE CHECKLIST

## Brand

- [ ] Nama `Republik Argumen`.
- [ ] Tidak politik-only.
- [ ] Tagline konsisten.
- [ ] Visual premium dark.

## Lobby

- [ ] Satu CTA utama jelas.
- [ ] Maksimal 2–3 mode aktif.
- [ ] Tidak ada fake metrics.
- [ ] Tidak ada API key.
- [ ] Tidak ada model dropdown.

## Topic flow

- [ ] Kategori luas.
- [ ] Search dan filter.
- [ ] Custom topic.
- [ ] AI refiner.
- [ ] Safe topic handling.

## Device check

- [ ] Kamera permission.
- [ ] Mic permission.
- [ ] Speaker test.
- [ ] Preview.
- [ ] Fallback text-only.
- [ ] Cleanup tracks.

## Arena

- [ ] Text works.
- [ ] Voice works.
- [ ] Camera preview works.
- [ ] STT works.
- [ ] Transcript review works.
- [ ] TTS works.
- [ ] Caption works.
- [ ] Interupsi works.
- [ ] Error fallback works.
- [ ] Mobile works.

## Judge

- [ ] AI Judge terpisah.
- [ ] Structured output.
- [ ] Score 5–6 dimensi.
- [ ] Strength.
- [ ] Improvement.
- [ ] Delivery Coach beta.

## Security

- [ ] API key server-side.
- [ ] Tidak ada secret di browser.
- [ ] Tidak ada secret di log.
- [ ] Rate limit.
- [ ] Timeout.
- [ ] Retry terbatas.
- [ ] HTTPS note.
- [ ] Stream cleanup.

## QA

- [ ] 360 px lolos.
- [ ] 393 px lolos.
- [ ] 768 px lolos.
- [ ] 1366 px lolos.
- [ ] 1440 px lolos.
- [ ] Chrome lolos.
- [ ] Edge lolos.
- [ ] Firefox text fallback lolos.
- [ ] Mobile Chrome lolos.
- [ ] Screenshot QA lengkap.
- [ ] Production build lolos.

---

# PENUTUP

Jangan memperbaiki implementasi saat ini dengan menambah lebih banyak panel.

Lakukan kebalikannya:

1. kurangi;
2. pecah alur;
3. jadikan voice-first;
4. pindahkan config teknis ke dev route;
5. pisahkan fitur masa depan;
6. buat game dapat dimainkan end-to-end;
7. baru poles.

Prinsip akhir:

> **Republik Argumen bukan dashboard politik. Ia adalah arena debat AI voice-first yang terasa nyata, premium, dan siap berkembang.**
