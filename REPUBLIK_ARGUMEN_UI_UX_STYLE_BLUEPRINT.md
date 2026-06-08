# REPUBLIK ARGUMEN — UI/UX STYLE BLUEPRINT
> **Dokumen implementasi visual untuk Codex**  
> Versi: `1.0.0-mvp-voice-arena-design-system`  
> Status: **Source of Truth khusus UI/UX dan visual implementation**  
> Digunakan bersama: `REPUBLIK_ARGUMEN_MVP_VOICE_ARENA_BLUEPRINT.md`  
> Platform awal: **Responsive web app / PWA-friendly**  
> Design direction: **Modern Civic Arena**  
> Bahasa UI utama: **Bahasa Indonesia**  
> Prioritas: **smooth, premium, mudah dipahami, voice-first, mobile-friendly, ready to upscale**

---

# 0. PETUNJUK WAJIB UNTUK CODEX

Baca dokumen ini seluruhnya sebelum mengubah tampilan.

Dokumen ini **tidak menggantikan** blueprint gameplay atau arsitektur backend. Dokumen ini mengatur:

- identitas visual;
- hierarchy;
- tokens;
- layout;
- component style;
- responsive behavior;
- arena voice experience;
- motion;
- accessibility;
- content style;
- quality assurance visual.

Jika terdapat konflik:

1. aturan keamanan dan fungsi dari `REPUBLIK_ARGUMEN_MVP_VOICE_ARENA_BLUEPRINT.md` tetap berlaku;
2. aturan visual, layout, styling, responsive behavior, dan motion mengikuti dokumen ini;
3. jangan menambah fitur baru hanya karena terlihat menarik pada mockup;
4. mockup adalah inspirasi visual, bukan kontrak fungsi;
5. dokumen ini adalah kontrak implementasi visual.

## 0.1 Tujuan utama

Bangun aplikasi yang membuat user merasa:

> “Saya sedang masuk ke arena debat digital premium dan berbicara langsung dengan lawan AI, bukan sekadar memakai chatbot dengan tema gelap.”

## 0.2 Prinsip implementasi

1. **Voice-first tetapi tidak voice-only.** Text input wajib selalu tersedia.
2. **Fokus pada arena.** Ketika debat dimulai, menu sekunder harus mundur dari perhatian.
3. **Premium dark, bukan cyberpunk berlebihan.**
4. **Sedikit glow, banyak depth.**
5. **Motion menjelaskan status, bukan dekorasi.**
6. **Satu layar memiliki satu primary action.**
7. **Mobile diperlakukan sebagai pengalaman utama, bukan versi desktop yang diperkecil.**
8. **Teks harus mudah dibaca pada layar kecil.**
9. **Jangan mengandalkan warna saja untuk menyampaikan status.**
10. **Dukung reduced motion.**
11. **Jangan menggunakan generated text di dalam aset gambar.** Semua label harus berupa HTML text.
12. **Jangan membuat UI menyerupai aplikasi enterprise, halaman admin, kasino, atau dashboard kontrol yang padat.**
13. **Jangan membuat user melihat semua fitur masa depan pada MVP.**
14. **Jangan menampilkan saldo kredit secara agresif.**
15. **Jangan membuat paywall atau pop-up promosi palsu pada fase MVP.**

## 0.3 Definition of Done global untuk UI

Satu halaman atau komponen hanya dianggap selesai jika:

- responsif pada mobile, tablet, desktop;
- memiliki hover, active, disabled, loading, empty, error, dan focus state yang relevan;
- dapat digunakan dengan keyboard;
- memiliki kontras terbaca;
- tidak overflow pada layar 360 px;
- tidak memotong teks penting;
- dapat dipahami tanpa melihat dokumentasi;
- animasinya berhenti atau disederhanakan saat `prefers-reduced-motion`;
- tidak membuat UI freeze saat audio streaming;
- tidak menyebabkan cumulative layout shift yang mengganggu;
- memiliki screenshot visual QA;
- melewati lint, type-check, test, dan build.

---

# 1. IDENTITAS PRODUK

## 1.1 Nama dan tagline

# **REPUBLIK ARGUMEN**

Tagline utama:

> **Panas pada gagasan. Tenang pada pembuktian.**

Tagline alternatif untuk konteks tertentu:

| Konteks | Copy |
|---|---|
| Lobby | `Siap menguji argumen hari ini?` |
| Duel Wacana AI | `Latih argumenmu melawan AI.` |
| Kursi Panas AI | `Bertahan dari serbuan bantahan.` |
| Satu Lawan Tribun | `Satu opini. Satu tribun. Pertahankan dengan data.` |
| Result | `Argumen selesai. Sekarang lihat bagaimana Anda berkembang.` |
| Delivery Coach | `Bukan hanya apa yang Anda katakan, tetapi bagaimana Anda menyampaikannya.` |

## 1.2 Personality brand

Gunakan kombinasi berikut:

| Nilai | Implementasi visual dan copy |
|---|---|
| Premium | navy gelap, gold lembut, serif editorial, whitespace cukup |
| Cerdas | hierarchy jelas, data ringkas, copy tidak berlebihan |
| Seru | motion status, reveal hasil, persona lawan, waveform |
| Aman | tombol keluar jelas, indikator mic/kamera jelas, consent eksplisit |
| Indonesia-modern | bahasa Indonesia natural, satire ringan, tidak menjadi parodi politik |
| Sportif | skor dan momentum tampil seperti pertandingan, bukan penghukuman |
| Edukatif | setiap layar hasil memberi satu insight praktis |

## 1.3 Positioning visual

Arah visual final:

# **Modern Civic Arena**

Perpaduan:

- klub debat premium;
- studio pertandingan olahraga;
- ruang sidang futuristik yang bersih;
- game progression yang ringan;
- social challenge yang shareable.

Hindari:

- terlalu banyak grid data;
- neon berlebihan;
- bentuk kaca transparan di semua panel;
- efek hologram berlebihan;
- font dekoratif sulit dibaca;
- terlalu banyak border;
- terlalu banyak ikon tanpa label;
- tampilan seperti terminal hacker;
- tampilan seperti aplikasi pemerintahan;
- tampilan seperti marketplace top-up.

---

# 2. REFERENSI VISUAL

Letakkan file referensi pada repository:

```text
docs/design-reference/
├── 01_primary_direction_modern_civic_arena.png
├── 02_alternative_direction_feature_rich.png
└── 03_wireframe_screen_inventory.png
```

Gunakan referensi pertama sebagai sumber visual utama:

```text
docs/design-reference/01_primary_direction_modern_civic_arena.png
```

## 2.1 Cara membaca mockup

Mockup menunjukkan:

- mood;
- hierarchy;
- card density;
- warna;
- hubungan lobby, arena, result, dan mobile;
- vibe premium;
- visual AI persona;
- voice waveform;
- momentum;
- result reveal.

Mockup **tidak** boleh diperlakukan sebagai instruksi membangun semua fitur.

Contoh:

| Elemen di mockup | Perlakuan pada MVP |
|---|---|
| Lobby | Bangun |
| Duel Wacana AI | Bangun |
| Kursi Panas AI | Bangun |
| Custom topic | Bangun |
| Voice + camera | Bangun |
| Result + AI Judge | Bangun |
| Kredit Arena | Placeholder atau demo kecil saja |
| Leaderboard | Placeholder hidden / feature flag OFF |
| Clan | Jangan bangun |
| Public challenge | Jangan bangun |
| Premium club | Jangan bangun sebagai transaksi aktif |
| Top-up | Jangan bangun pada MVP |

---

# 3. UX NORTH STAR

## 3.1 Pengalaman inti

Alur MVP:

```text
Lobby
  → Pilih Mode
  → Pilih Topik / Buat Topik
  → Pilih Text / Voice / Voice + Camera
  → Device Check
  → Arena Debate
  → Transcript Review singkat
  → AI Menjawab dengan Voice
  → Interupsi bila diperlukan
  → Ronde Berganti
  → AI Judge
  → Result Reveal
  → Delivery Coach
  → Main Lagi / Lihat Detail
```

## 3.2 Waktu memahami layar

Target:

| Layar | Target pemahaman |
|---|---:|
| Lobby | ≤ 5 detik |
| Pilih mode | ≤ 8 detik |
| Device check | ≤ 10 detik |
| Arena | ≤ 5 detik |
| Transcript review | ≤ 5 detik |
| Result utama | ≤ 8 detik |

## 3.3 Fokus setiap layar

| Layar | Satu pertanyaan yang harus dijawab |
|---|---|
| Lobby | `Apa yang ingin saya mainkan sekarang?` |
| Pilih mode | `Format debat mana yang cocok untuk saya?` |
| Pilih topik | `Argumen apa yang ingin saya uji?` |
| Device check | `Apakah kamera dan mikrofon saya siap?` |
| Arena | `Sekarang siapa yang berbicara dan apa yang harus saya lakukan?` |
| Result | `Apa kekuatan saya dan apa yang perlu diperbaiki?` |
| Delivery Coach | `Bagaimana cara bicara saya dapat menjadi lebih efektif?` |

---

# 4. DESIGN TOKENS

Implementasikan tokens terpusat. Jangan hard-code warna pada komponen.

File yang disarankan:

```text
src/styles/tokens.css
src/styles/globals.css
src/lib/design-tokens.ts
tailwind.config.ts
```

## 4.1 Core colors

```css
:root {
  /* Backgrounds */
  --ra-bg-deep: #070B13;
  --ra-bg-base: #0A111D;
  --ra-bg-surface: #0E1827;
  --ra-bg-panel: #132033;
  --ra-bg-panel-strong: #17283D;
  --ra-bg-elevated: #1B2D45;
  --ra-bg-overlay: rgba(3, 8, 15, 0.82);

  /* Text */
  --ra-text-primary: #F6F2E9;
  --ra-text-secondary: #B5C0D0;
  --ra-text-muted: #7F8EA4;
  --ra-text-disabled: #58677B;
  --ra-text-inverse: #07101C;

  /* Brand accents */
  --ra-cyan: #32D4D1;
  --ra-cyan-bright: #5BE7E1;
  --ra-cyan-soft: rgba(50, 212, 209, 0.14);
  --ra-blue: #4E9CFF;
  --ra-blue-soft: rgba(78, 156, 255, 0.14);

  /* Prestige */
  --ra-gold: #D8AA5C;
  --ra-gold-bright: #F0C97D;
  --ra-gold-soft: rgba(216, 170, 92, 0.15);

  /* AI opponent and danger */
  --ra-coral: #EE6A64;
  --ra-coral-bright: #FF8179;
  --ra-coral-soft: rgba(238, 106, 100, 0.14);

  /* Success and agreement */
  --ra-emerald: #62D49C;
  --ra-emerald-soft: rgba(98, 212, 156, 0.14);

  /* Special modes */
  --ra-violet: #9C7CFF;
  --ra-violet-soft: rgba(156, 124, 255, 0.15);
  --ra-amber: #E6A247;
  --ra-amber-soft: rgba(230, 162, 71, 0.15);

  /* Borders */
  --ra-border-subtle: rgba(255, 255, 255, 0.08);
  --ra-border-default: rgba(255, 255, 255, 0.13);
  --ra-border-strong: rgba(255, 255, 255, 0.20);

  /* Focus */
  --ra-focus-ring: #8CE9E3;
  --ra-focus-offset: #07101C;
}
```

## 4.2 Semantic colors

```css
:root {
  --ra-user: var(--ra-cyan);
  --ra-user-soft: var(--ra-cyan-soft);

  --ra-ai: var(--ra-coral);
  --ra-ai-soft: var(--ra-coral-soft);

  --ra-action: var(--ra-cyan);
  --ra-action-hover: var(--ra-cyan-bright);

  --ra-prestige: var(--ra-gold);
  --ra-positive: var(--ra-emerald);
  --ra-warning: var(--ra-amber);
  --ra-negative: var(--ra-coral);
  --ra-special: var(--ra-violet);
}
```

## 4.3 Gradients

Gunakan sedikit dan terarah.

```css
:root {
  --ra-gradient-hero:
    radial-gradient(circle at 72% 18%, rgba(50, 212, 209, 0.16), transparent 30%),
    radial-gradient(circle at 92% 62%, rgba(156, 124, 255, 0.11), transparent 34%),
    linear-gradient(135deg, #0B1422 0%, #08111E 56%, #0A1019 100%);

  --ra-gradient-user:
    linear-gradient(135deg, rgba(50, 212, 209, 0.26), rgba(78, 156, 255, 0.10));

  --ra-gradient-ai:
    linear-gradient(135deg, rgba(238, 106, 100, 0.24), rgba(156, 124, 255, 0.08));

  --ra-gradient-gold:
    linear-gradient(135deg, #F1D08A 0%, #D8AA5C 52%, #A97A32 100%);

  --ra-gradient-hot-seat:
    linear-gradient(145deg, rgba(230, 162, 71, 0.22), rgba(238, 106, 100, 0.11));

  --ra-gradient-result:
    radial-gradient(circle at 50% 18%, rgba(216, 170, 92, 0.20), transparent 34%),
    linear-gradient(180deg, #111B2B 0%, #09111C 100%);
}
```

Rules:

- background utama maksimal memiliki 2–3 sumber gradient;
- gunakan accent glow hanya pada elemen aktif;
- jangan memakai rainbow gradient;
- jangan menaruh gradient kuat di belakang body text;
- jangan membuat tombol primary memiliki animasi gradient terus-menerus.

## 4.4 Shadows and glow

```css
:root {
  --ra-shadow-card: 0 16px 44px rgba(0, 0, 0, 0.26);
  --ra-shadow-elevated: 0 24px 64px rgba(0, 0, 0, 0.34);
  --ra-shadow-overlay: 0 28px 80px rgba(0, 0, 0, 0.42);

  --ra-glow-user: 0 0 0 1px rgba(50, 212, 209, 0.28), 0 0 28px rgba(50, 212, 209, 0.16);
  --ra-glow-ai: 0 0 0 1px rgba(238, 106, 100, 0.26), 0 0 28px rgba(238, 106, 100, 0.14);
  --ra-glow-gold: 0 0 0 1px rgba(216, 170, 92, 0.30), 0 0 32px rgba(216, 170, 92, 0.16);
}
```

Glow rules:

- glow adalah state indicator;
- glow aktif hanya saat speaking, selected, unlocked, atau primary CTA;
- panel biasa tidak menggunakan glow kuat;
- maksimal satu elemen dominan bercahaya per area visual.

## 4.5 Border radius

```css
:root {
  --ra-radius-xs: 6px;
  --ra-radius-sm: 10px;
  --ra-radius-md: 14px;
  --ra-radius-lg: 18px;
  --ra-radius-xl: 24px;
  --ra-radius-pill: 999px;
}
```

Rules:

| Komponen | Radius |
|---|---|
| Small chip | pill |
| Input | md |
| Button | md |
| Card | lg |
| Modal / sheet | xl |
| Avatar ring | pill |
| Camera tile | lg |
| Mobile bottom sheet | xl pada sisi atas |

## 4.6 Spacing scale

Gunakan grid 4 px.

```css
:root {
  --ra-space-1: 4px;
  --ra-space-2: 8px;
  --ra-space-3: 12px;
  --ra-space-4: 16px;
  --ra-space-5: 20px;
  --ra-space-6: 24px;
  --ra-space-8: 32px;
  --ra-space-10: 40px;
  --ra-space-12: 48px;
  --ra-space-16: 64px;
  --ra-space-20: 80px;
}
```

Rules:

- card padding desktop: 20–24 px;
- card padding mobile: 14–18 px;
- layout gap desktop: 16–24 px;
- layout gap mobile: 12–16 px;
- jangan memakai gap acak seperti 13 px atau 27 px tanpa alasan.

## 4.7 Z-index scale

```css
:root {
  --ra-z-base: 0;
  --ra-z-card: 10;
  --ra-z-sticky: 30;
  --ra-z-dropdown: 50;
  --ra-z-modal: 80;
  --ra-z-toast: 100;
  --ra-z-critical: 120;
}
```

---

# 5. TYPOGRAPHY

## 5.1 Font families

Gunakan maksimal dua keluarga font.

```css
:root {
  --ra-font-display: "Fraunces", "DM Serif Display", Georgia, serif;
  --ra-font-ui: "Plus Jakarta Sans", Inter, system-ui, sans-serif;
}
```

Rekomendasi:

- heading editorial: `Fraunces`;
- UI dan angka: `Plus Jakarta Sans`;
- jangan gunakan serif untuk caption live, input, timer, atau tombol.

## 5.2 Type scale

```css
:root {
  --ra-text-xs: 12px;
  --ra-text-sm: 14px;
  --ra-text-md: 16px;
  --ra-text-lg: 18px;
  --ra-text-xl: 22px;
  --ra-text-2xl: 28px;
  --ra-text-3xl: 36px;
  --ra-text-4xl: 48px;
}
```

| Penggunaan | Desktop | Mobile | Weight |
|---|---:|---:|---:|
| Hero title | 36–48 | 28–34 | 700 |
| Page title | 28–36 | 24–30 | 700 |
| Section title | 20–24 | 18–22 | 700 |
| Card title | 16–18 | 15–17 | 700 |
| Body | 15–16 | 14–16 | 400–500 |
| Caption | 12–13 | 12–13 | 500 |
| Timer | 40–56 | 30–42 | 700 |
| Score reveal | 54–72 | 48–64 | 700 |

## 5.3 Text readability

- body line-height: `1.55`;
- live caption line-height: `1.50`;
- heading line-height: `1.10–1.22`;
- maksimal panjang baris body desktop: `68ch`;
- maksimal panjang caption arena: `56ch`;
- jangan gunakan uppercase panjang untuk body text;
- uppercase boleh untuk label kecil maksimal 2–3 kata.

---

# 6. ICONOGRAPHY AND ILLUSTRATION

## 6.1 Icon style

Gunakan satu library konsisten, misalnya:

```text
lucide-react
```

Rules:

- stroke icon 1.75–2 px;
- jangan campur outline icon dan filled icon secara acak;
- ikon selalu memiliki label atau accessible name;
- ukuran default: 18 px;
- ukuran mobile nav: 20–22 px;
- ukuran primary mic: 28–34 px.

## 6.2 Avatar dan AI persona

Gunakan ilustrasi original atau generated asset yang konsisten.

AI persona MVP:

| Persona | Visual direction |
|---|---|
| Menteri Klarifikasi | avatar AI humanoid formal, coral-red halo |
| Pengamat Statistik | AI dengan motif grid dan data nodes |
| Jurnalis Kritis | AI dengan visual lens / analytic lines |
| Pragmatis Lapangan | AI lebih solid dan utilitarian |
| Mediator Rasional | AI dengan emerald accent ringan |

Rules:

- avatar tidak menyerupai tokoh publik nyata;
- avatar AI jelas fiktif;
- AI avatar tidak terlalu menyeramkan;
- user avatar dapat berupa placeholder sederhana;
- gunakan circular portrait untuk arena;
- gunakan portrait rectangle untuk mode card.

## 6.3 Background scene

Lobby boleh menggunakan ilustrasi:

- auditorium gelap;
- podium;
- ruang sidang futuristik;
- garis arsitektur civic;
- silhouette penonton;
- lampu arena lembut.

Arena gunakan background lebih tenang agar caption terbaca.

Jangan memasukkan teks ke gambar latar.

---

# 7. APP SHELL

## 7.1 Desktop shell

Desktop menggunakan sidebar tetap:

```text
┌──────────────┬───────────────────────────────────────────────┐
│ Logo         │ Main Content                                  │
│              │                                               │
│ Beranda      │                                               │
│ Arena        │                                               │
│ Jelajah      │                                               │
│ Riwayat      │                                               │
│ Pengaturan   │                                               │
│              │                                               │
│ User Card    │                                               │
└──────────────┴───────────────────────────────────────────────┘
```

Ukuran:

| Elemen | Ukuran |
|---|---:|
| Sidebar desktop | 220–252 px |
| Main max width | 1440 px |
| Content padding | 24–32 px |
| Top utility bar | 56–64 px |

Sidebar MVP hanya menampilkan:

- Beranda;
- Arena;
- Jelajah Topik;
- Riwayat;
- Pengaturan.

Hide atau feature flag OFF:

- Kredit Arena production;
- Peringkat publik;
- Clan;
- Premium Club;
- public challenge.

## 7.2 Mobile shell

Gunakan bottom navigation:

```text
[ Beranda ] [ Arena ] [ + ] [ Jelajah ] [ Profil ]
```

Rules:

- height: 64–72 px + safe-area inset;
- tombol `+` dapat membuka custom topic privat;
- maksimal lima item;
- label tetap ditampilkan;
- active state memiliki cyan highlight;
- jangan menambahkan terlalu banyak badges.

## 7.3 Tablet shell

- sidebar boleh collapse menjadi rail 72 px;
- bottom nav boleh dipakai pada tablet portrait;
- arena tidak boleh memaksa tiga kolom sempit.

---

# 8. SCREEN INVENTORY MVP

Bangun layar berikut.

```text
/
├── /                           Lobby
├── /play                       Pilih mode
├── /topics                     Pilih topik
├── /topics/new                 Buat topik privat
├── /topics/refine              AI topic refiner
├── /device-check               Kamera, mic, speaker
├── /arena/[sessionId]          Arena voice debate
├── /arena/[sessionId]/review   Transcript review
├── /results/[sessionId]        Result reveal
├── /results/[sessionId]/coach  Delivery coach
├── /history                    Riwayat lokal
└── /settings                   Preferensi voice dan accessibility
```

Optional internal-only:

```text
/dev/ui-playground
/dev/audio-playground
/dev/mock-arena
```

---

# 9. LOBBY

## 9.1 Tujuan

Lobby harus terasa premium tetapi ringan. User harus langsung melihat:

1. sapaan;
2. primary CTA;
3. mode utama;
4. topik pilihan;
5. progres ringan.

## 9.2 Desktop layout

```text
┌─────────────────────────────────────────────────────────────┐
│ Search                                 Preferences / Avatar  │
├─────────────────────────────────────────────────────────────┤
│ HERO                                                        │
│ Selamat datang kembali, Budi!                               │
│ Siap menguji argumen hari ini?                              │
│ [ Mulai Debat AI ] [ Pasang Pendapat ]                      │
│                                 [ hero character / podium ]  │
├─────────────────────────────────────────────────────────────┤
│ Pilih Mode Permainan                                        │
│ [ Duel AI ] [ Kursi Panas AI ] [ Satu Lawan Tribun* ]       │
├─────────────────────────────────────────────────────────────┤
│ Tantangan Pilihan / Topik Untuk Anda                         │
│ [topic card] [topic card] [topic card]                       │
├─────────────────────────────────────────────────────────────┤
│ Lanjutkan Progres                                            │
│ Riwayat terakhir + rekomendasi latihan                       │
└─────────────────────────────────────────────────────────────┘
```

`Satu Lawan Tribun` pada MVP dapat tampil sebagai skin/category entry yang mengarahkan ke Kursi Panas AI dengan topik olahraga. Jangan membangun mode backend terpisah jika belum diperlukan.

## 9.3 Mobile layout

Urutan:

1. top app bar;
2. greeting;
3. hero CTA compact;
4. horizontal carousel mode;
5. satu challenge/topik utama;
6. lanjutkan progres;
7. bottom nav.

## 9.4 Lobby components

```text
LobbyHero
LobbyGreeting
PrimaryCtaGroup
ModeCarousel
ModeCard
FeaturedTopicCard
ProgressResumeCard
MiniStreakCard
UserUtilityBar
```

## 9.5 Mode card

Props:

```ts
type ModeCardProps = {
  id: string;
  title: string;
  subtitle: string;
  illustration: string;
  accent: "cyan" | "amber" | "violet" | "emerald";
  estimatedDuration?: string;
  difficulty?: "Pemula" | "Menengah" | "Menantang";
  badge?: string;
  disabled?: boolean;
  comingSoon?: boolean;
};
```

Visual:

- portrait image atau illustration pada bagian atas;
- title maksimal 2 baris;
- subtitle maksimal 2 baris;
- satu metadata kecil;
- selected state memiliki border accent dan shadow ringan;
- `coming soon` tidak boleh terlihat seperti aktif.

---

# 10. PILIH MODE

## 10.1 Tujuan

Berikan deskripsi singkat dan tidak menakutkan untuk pemula.

Mode aktif:

| Mode | Accent | Copy |
|---|---|---|
| Duel Wacana AI | Cyan | `Latihan debat 1 lawan 1 dengan AI.` |
| Kursi Panas AI | Amber / coral | `Hadapi beberapa persona AI secara bergiliran.` |
| Pasang Pendapat Privat | Violet | `Uji pendapat buatanmu sendiri.` |

Entry visual tambahan:

| Mode | Status |
|---|---|
| Satu Lawan Tribun | Skin olahraga untuk Kursi Panas AI |
| Majelis Publik | Feature flag OFF |
| Boss Battle | Feature flag OFF |

## 10.2 Layout

Desktop:

- grid 3 kolom aktif;
- maksimal 5 card dalam row;
- detail mode muncul di kanan atau dalam modal.

Mobile:

- card vertikal;
- tombol mulai berada di bagian bawah card;
- biaya kredit tidak menjadi fokus pada fase MVP.

---

# 11. PILIH TOPIK DAN CUSTOM TOPIC

## 11.1 Topic picker

Kategori MVP:

- Sepak Bola;
- Olahraga;
- Teknologi;
- Bisnis;
- Pendidikan;
- Lifestyle;
- Hiburan;
- Isu Publik Ringan;
- Absurd dan Santai.

Jangan tampilkan politik aktual sensitif pada MVP.

## 11.2 Topic card

```ts
type TopicCardProps = {
  title: string;
  category: string;
  spiceLevel: 1 | 2 | 3 | 4;
  summary?: string;
  estimatedDuration?: string;
  image?: string;
  recommended?: boolean;
};
```

Visual:

- category chip;
- title maksimal 3 baris;
- spice meter;
- CTA `Pilih Topik`;
- optional image;
- jangan tampilkan terlalu banyak statistik.

## 11.3 Custom topic form

Fields:

```text
Tesis utama
Kategori
Tingkat kepedasan
Posisi user
Konteks opsional
```

UX:

- gunakan progress indicator ringan;
- textarea besar;
- tampilkan character count;
- gunakan contoh placeholder;
- tombol utama: `Rapikan dengan AI`;
- tombol sekunder: `Gunakan Langsung`;
- jika topik sensitif: tampilkan warning dan minta topik lain.

## 11.4 AI refiner screen

Layout:

```text
┌────────────────────────────────────────┐
│ Rapikan Pendapat                       │
├────────────────────────────────────────┤
│ Versi Anda                             │
│ [ original thesis ]                    │
│                                        │
│ Versi yang Disarankan AI               │
│ [ refined thesis ]                     │
│                                        │
│ Kenapa dirapikan?                      │
│ • Menyerang gagasan, bukan kelompok    │
│ • Lebih spesifik                       │
│ • Lebih layak diperdebatkan            │
│                                        │
│ [ Gunakan Versi AI ] [ Edit Lagi ]     │
└────────────────────────────────────────┘
```

---

# 12. DEVICE CHECK

## 12.1 Tujuan

Membuat voice dan kamera terasa aman, jelas, dan terkendali.

## 12.2 Layout desktop

```text
┌──────────────────────────────────────────────────────────────┐
│ Persiapkan Arena                                              │
│ Uji kamera, mikrofon, dan speaker sebelum debat dimulai.      │
├─────────────────────────────┬────────────────────────────────┤
│ Camera preview              │ Perangkat                      │
│                             │ Kamera [ select ]              │
│ [ video ]                   │ Mikrofon [ select ]            │
│                             │ Speaker [ test ]               │
│ LIVE PREVIEW                │                                │
│                             │ Audio meter [|||||----]        │
├─────────────────────────────┴────────────────────────────────┤
│ [ Text Only ] [ Voice Only ] [ Voice + Camera ]              │
│                                          [ Masuk Arena ]      │
└──────────────────────────────────────────────────────────────┘
```

## 12.3 Device check rules

- kamera tidak otomatis menyala sebelum consent;
- tampilkan penjelasan singkat sebelum browser permission dialog;
- mic meter bergerak jika mic aktif;
- tombol test speaker memutar cue maksimal 2 detik;
- sediakan tombol `Lanjut tanpa kamera`;
- sediakan tombol `Gunakan teks saja`;
- jika permission denied, berikan instruksi yang tidak menyalahkan user;
- jangan mengunci user pada satu mode.

## 12.4 Status messages

| Status | Copy |
|---|---|
| Belum meminta izin | `Aktifkan kamera dan mikrofon untuk pengalaman arena penuh.` |
| Kamera siap | `Kamera siap digunakan.` |
| Mic siap | `Mikrofon menangkap suara Anda.` |
| Kamera ditolak | `Kamera belum diizinkan. Anda tetap dapat melanjutkan dengan suara atau teks.` |
| Mic ditolak | `Mikrofon belum diizinkan. Anda tetap dapat bermain melalui teks.` |
| HTTPS tidak tersedia | `Akses kamera dan mikrofon memerlukan koneksi aman HTTPS.` |

---

# 13. ARENA VOICE DEBATE

## 13.1 Tujuan

Arena adalah jantung produk. Fokus pada:

- siapa sedang berbicara;
- argumen terbaru;
- waktu;
- momentum;
- aksi utama;
- kemampuan interupsi;
- subtitle;
- kamera user.

## 13.2 Arena desktop layout

Gunakan 3-area layout, bukan dashboard padat.

```text
┌──────────────────────────────────────────────────────────────────────┐
│ ← Keluar    RONDE 2 · REBUTTAL               01:48       ⚙ Settings │
├──────────────────┬──────────────────────────────────┬────────────────┤
│ USER PODIUM      │ LIVE TRANSCRIPT                  │ AI OPPONENT    │
│                  │                                  │                │
│ [ Camera tile ]  │ Anda                             │ [ AI avatar ]  │
│                  │ “Naturalisasi dapat...”          │                │
│ Anda             │                                  │ Menteri        │
│ Budi Hidayat     │ AI Lawan                         │ Klarifikasi    │
│                  │ “Pembinaan butuh waktu...”       │                │
│ Momentum 58%     │                                  │ Momentum 42%   │
│                  │ [ streaming subtitle ]           │                │
├──────────────────┴──────────────────────────────────┴────────────────┤
│ [ Interupsi ] [ Kartu Data ] [ Cek Fakta ] [ Titik Temu ]           │
├──────────────────────────────────────────────────────────────────────┤
│ 🎙 Tahan untuk bicara atau ketik argumen...              [ Kirim ]  │
└──────────────────────────────────────────────────────────────────────┘
```

Desktop proportions:

| Area | Lebar |
|---|---:|
| User podium | 220–260 px |
| Transcript | flexible, minimal 460 px |
| AI opponent | 210–250 px |
| Arena content max width | 1480 px |

## 13.3 Arena mobile layout

Mobile menggunakan satu fokus visual.

```text
┌──────────────────────────────┐
│ ←  RONDE 2 · REBUTTAL  01:48 │
├──────────────────────────────┤
│       AI AVATAR + HALO       │
│      Menteri Klarifikasi     │
│          AI berbicara        │
│     [ coral waveform ]       │
│                              │
│ Subtitle streaming AI        │
│                              │
│                  [ PiP User ]│
├──────────────────────────────┤
│ Momentum Anda 58% · AI 42%   │
├──────────────────────────────┤
│ [ Data ][ Fakta ][ Titik ]   │
│ [ Interupsi ]                 │
├──────────────────────────────┤
│ 🎙 TAHAN UNTUK BICARA        │
│ atau ketik argumen           │
└──────────────────────────────┘
```

Rules:

- AI avatar menjadi fokus saat AI berbicara;
- camera tile user menjadi PiP;
- PiP dapat dipindahkan di empat anchor points;
- caption AI tampil maksimal 4–6 baris, dapat scroll;
- aksi interupsi harus mudah dijangkau ibu jari;
- timer selalu terlihat;
- user dapat membuka transcript lengkap melalui bottom sheet.

## 13.4 Camera tile

States:

| State | Visual |
|---|---|
| Preview ready | border subtle |
| User speaking | cyan border + cyan halo |
| Muted | icon mic off |
| Camera off | avatar placeholder |
| Low light | subtle warning |
| Permission revoked | error state |
| Recording local opt-in | red `REC` pill |

Rules:

- tile desktop aspect ratio `4:3`;
- tile mobile PiP aspect ratio `3:4` atau `4:3`;
- jangan memakai filter beautification;
- jangan melakukan emotion detection dari wajah;
- sediakan mirror toggle untuk preview;
- jangan simpan video tanpa opt-in eksplisit.

## 13.5 AI avatar

States:

| State | Visual |
|---|---|
| Idle | breathing glow sangat ringan |
| Thinking | ring bergerak lambat |
| Speaking | speaking halo + waveform |
| Interrupted | glow berhenti dengan fade-out |
| Error | avatar redup, tampil retry |
| Persona transition | short intro card |

## 13.6 Voice input

Desktop:

```text
[ Mic button ]  Tahan untuk bicara atau ketik argumen...  [ Send ]
```

Mobile:

```text
[ Large press-and-hold microphone ]
Tahan untuk bicara
Ketik sebagai alternatif
```

Rules:

- selalu tampilkan status: `Siap`, `Mendengarkan`, `Memproses`, `Transkrip siap`, `AI menjawab`;
- press-and-hold default pada MVP;
- optional tap-to-toggle dapat diaktifkan melalui settings;
- audio waveform cyan saat user bicara;
- jangan membuat user menebak apakah mic aktif.

## 13.7 Interupsi

Button:

```text
INTERUPSI
```

Behavior:

- menghentikan audio AI;
- menghentikan subtitle streaming setelah cutoff;
- memperlihatkan status `AI dihentikan. Silakan sampaikan interupsi Anda.`;
- mengaktifkan voice input user;
- mencatat event;
- tidak memberikan bonus skor otomatis.

Visual:

- coral outline saat AI bicara;
- active press memberikan flash 120–160 ms;
- gunakan icon yang jelas;
- jangan menggunakan animasi agresif.

## 13.8 Action cards MVP

Gunakan empat aksi:

| Action | Fungsi UX |
|---|---|
| Interupsi | Menghentikan jawaban AI |
| Kartu Data | Membuka panel catatan data |
| Cek Fakta | Menandai klaim untuk dibahas dalam hasil |
| Titik Temu | Mengakui bagian argumen lawan yang valid |

Pada MVP, action cards boleh berfungsi ringan dan tidak perlu memiliki sistem item kompleks.

## 13.9 Momentum meter

Momentum bukan skor final.

Display:

```text
Anda 58%  ━━━━━━━━━━━╋━━━━━━━━  42% AI
```

Rules:

- gunakan label dan angka;
- jangan hanya warna;
- animasi perubahan 280–420 ms;
- perubahan kecil maksimal ±8 per event;
- jangan manipulatif;
- tooltip: `Momentum adalah indikator dinamika debat, bukan penilaian akhir.`

---

# 14. ARENA STATE MACHINE VISUAL

Implementasikan state eksplisit.

```ts
type ArenaVisualState =
  | "ready"
  | "user_listening"
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

## 14.1 Visual mapping

| State | Primary visual | Primary copy | CTA |
|---|---|---|---|
| ready | mic ring soft | `Silakan mulai argumen Anda.` | Speak |
| user_listening | mic halo | `Mikrofon siap.` | Hold mic |
| user_speaking | cyan waveform | `Mendengarkan Anda...` | Release |
| transcribing | moving dots | `Mengubah suara menjadi teks...` | Cancel |
| transcript_review | transcript sheet | `Periksa transkrip sebelum dikirim.` | Kirim |
| ai_thinking | AI breathing halo | `AI menyiapkan bantahan...` | Wait |
| ai_streaming_text | subtitle streaming | `AI menyusun respons...` | Interrupt |
| ai_generating_voice | waveform skeleton | `Menyiapkan suara AI...` | Read text |
| ai_speaking | coral waveform | `AI sedang berbicara.` | Interrupt |
| interrupting | cutoff animation | `Interupsi diterima.` | Speak |
| round_transition | round banner | `Ronde berikutnya dimulai.` | Continue |
| judging | score skeleton | `Majelis AI menilai debat Anda...` | Wait |
| complete | result reveal | `Sidang selesai.` | View result |
| recoverable_error | error card | `Terjadi gangguan. Coba lagi.` | Retry |
| fatal_error | exit card | `Sesi belum dapat dilanjutkan.` | Exit |

---

# 15. TRANSCRIPT REVIEW

## 15.1 Tujuan

STT dapat salah. User harus dapat mengoreksi transkrip sebelum dikirim.

## 15.2 UI

Desktop modal atau inline panel. Mobile bottom sheet.

```text
PERIKSA TRANSKRIP

[ text area editable ]

Durasi bicara: 00:42
Kata: 96

[ Rekam Ulang ] [ Kirim Argumen ]
```

Rules:

- tampilkan transkrip maksimum 2–4 detik setelah STT selesai;
- autofocus textarea;
- jangan mengirim otomatis tanpa opsi user pada default MVP;
- settings boleh memiliki auto-send opt-in;
- beri warning jika transkrip kosong;
- user dapat kembali ke text-only.

---

# 16. RESULT REVEAL

## 16.1 Tujuan

Berikan momen puas dan insight yang berguna.

Jangan langsung menampilkan halaman penuh data.

Gunakan progressive reveal.

## 16.2 Tahap reveal

### Tahap 1 — Sidang selesai

```text
SIDANG SELESAI
Anda menyelesaikan 3 ronde.
```

### Tahap 2 — Grade

```text
A-
ORATOR MUDA
```

### Tahap 3 — Score bars

```text
Speak by Data   78
Struktur        84
Logika          81
Rebuttal        76
Integritas      92
```

### Tahap 4 — Insight

```text
Kekuatan utama:
Mampu membedakan solusi jangka pendek dan strategi jangka panjang.

Perbaikan terpenting:
Tambahkan satu data konkret ketika membahas dampak pembinaan pemain muda.
```

### Tahap 5 — CTA

```text
[ Main Lagi ] [ Lihat Detail ] [ Delivery Coach ]
```

Optional local-only:

```text
[ Preview Share Card ]
```

## 16.3 Visual result

- background gradient gold subtle;
- grade ring / laurels;
- confetti minimal;
- animasi maksimum 1 detik;
- score bars muncul bertahap;
- CTA muncul setelah reveal;
- jangan memakai fireworks berlebihan.

## 16.4 Score rules

- jangan gunakan label `Anda kalah telak`;
- jangan mempermalukan user;
- gunakan coaching-oriented copy;
- grade adalah feedback, bukan identitas permanen;
- AI Judge report harus menonjolkan satu hal positif dan satu perbaikan praktis.

---

# 17. DELIVERY COACH

## 17.1 Tujuan

Membuat voice mode memiliki manfaat nyata.

Metrics MVP:

- durasi bicara;
- estimasi words per minute;
- filler words;
- pause ratio;
- volume stability;
- response latency;
- jumlah interupsi;
- repeated phrases.

Jangan menyebut ini sebagai emotion detection.

## 17.2 UI

```text
DELIVERY COACH

Kecepatan bicara
147 kata/menit
Cukup jelas

Filler words
4 kali
Kurangi “eee” sebelum menyampaikan data.

Rasio jeda
18%
Stabil

Interupsi
1 kali
Digunakan secara relevan.
```

Rules:

- gunakan plain language;
- jangan membuat diagnosis;
- jangan menilai wajah;
- jangan memberi klaim psikologis;
- setiap metric memiliki tips;
- tampilkan `beta` badge.

---

# 18. MODE SKINS

Gunakan satu design system dengan aksen mode, bukan membuat aplikasi berbeda.

## 18.1 Base Civic Arena

Default:

- navy;
- cyan;
- gold;
- coral AI;
- auditorium futuristik.

## 18.2 Kursi Panas AI

Accent:

- amber;
- coral;
- spotlight;
- chair motif;
- ring arena;
- pressure meter ringan.

## 18.3 Satu Lawan Tribun

Skin untuk Kursi Panas AI kategori olahraga.

Accent:

- emerald;
- teal;
- garis stadion abstrak;
- silhouette tribun;
- scoreboard motif.

## 18.4 Warung Wacana

Untuk topik absurd dan santai.

Accent:

- warm amber;
- coffee-table illustration;
- copy lebih playful;
- motion lebih ringan.

## 18.5 Majelis Publik

Future feature flag OFF.

Accent:

- restrained gold;
- document panels;
- source chips;
- minimal motion.

## 18.6 CSS approach

```tsx
<AppShell modeTheme="default">
<AppShell modeTheme="hot-seat">
<AppShell modeTheme="tribune">
<AppShell modeTheme="warkop">
<AppShell modeTheme="public-council">
```

Gunakan variables, bukan duplikasi komponen.

---

# 19. MOTION SYSTEM

Gunakan Motion for React atau CSS transitions yang ringan.

## 19.1 Motion timing

| Motion | Durasi |
|---|---:|
| Hover | 120–180 ms |
| Tap press | 90–140 ms |
| Card enter | 180–260 ms |
| Panel slide | 220–320 ms |
| Bottom sheet | 260–360 ms |
| AI halo pulse | 1400–2200 ms loop |
| Waveform update | realtime |
| Round transition | 450–650 ms |
| Result reveal | 700–1000 ms |
| Toast | 220 ms |

## 19.2 Motion principles

- gunakan easing lembut;
- hindari bounce berlebihan;
- jangan membuat seluruh background bergerak;
- animasi status lebih penting daripada dekorasi;
- jangan menganimasikan layout besar ketika audio sedang aktif jika dapat menyebabkan frame drop;
- gunakan transform dan opacity;
- hindari animasi blur besar terus-menerus.

## 19.3 Reduced motion

Jika `prefers-reduced-motion: reduce`:

- nonaktifkan parallax;
- ganti pulse dengan opacity static;
- hilangkan confetti;
- hilangkan slide besar;
- gunakan fade 100–160 ms;
- pertahankan state indicator melalui icon dan text.

---

# 20. AUDIO UX

## 20.1 Sound design MVP

Gunakan audio cue ringan dan opsional.

| Event | Cue |
|---|---|
| Masuk arena | soft chime |
| Ronde mulai | short pulse |
| Mic aktif | subtle click |
| AI mulai bicara | soft cue |
| Interupsi berhasil | short cutoff cue |
| Ronde selesai | soft bell |
| Hasil muncul | restrained achievement sound |
| Error | low soft warning |

Rules:

- default volume rendah;
- sediakan mute sound effects;
- jangan gunakan suara agresif;
- jangan mengganggu voice AI;
- cue maksimal 1–2 detik;
- audio assets dikompresi.

## 20.2 Voice subtitle

- subtitle AI selalu tampil ketika TTS berjalan;
- user transcript tersedia;
- user dapat mematikan voice AI dan membaca teks;
- caption tidak boleh hilang terlalu cepat;
- caption mendukung scroll manual.

---

# 21. ACCESSIBILITY

Target MVP: praktik WCAG 2.2 yang baik.

## 21.1 Contrast

- body text normal minimal target `4.5:1`;
- text besar minimal target `3:1`;
- jangan menempatkan body text pada gradient sibuk;
- icon-only controls memiliki tooltip dan accessible label.

## 21.2 Focus

- semua interactive element keyboard-focusable;
- focus ring terlihat;
- jangan menghapus outline tanpa pengganti;
- modal dan sheet menggunakan focus trap;
- Esc menutup modal jika aman;
- Enter mengaktifkan primary action.

Focus token:

```css
:focus-visible {
  outline: 3px solid var(--ra-focus-ring);
  outline-offset: 3px;
}
```

## 21.3 Touch targets

- minimum touch target praktis: `44 × 44 px`;
- primary mic mobile: minimal `72 × 72 px`;
- tombol interupsi mudah dijangkau;
- hindari icon buttons terlalu rapat.

## 21.4 Non-color status

Status harus menggunakan:

- warna;
- icon;
- label;
- optional aria-live announcement.

Contoh:

```text
● AI sedang berbicara
● Mikrofon aktif
● Kamera dimatikan
```

## 21.5 Captions

- AI speech selalu memiliki caption;
- user speech menghasilkan editable transcript;
- captions dapat diperbesar melalui settings;
- sediakan text-only path penuh.

## 21.6 Motion

- hormati reduced motion;
- jangan memakai flashing cepat;
- jangan memakai visual yang dapat memicu gangguan.

---

# 22. RESPONSIVE BEHAVIOR

## 22.1 Breakpoints

```text
xs   360 px
sm   480 px
md   768 px
lg   1024 px
xl   1280 px
2xl  1536 px
```

## 22.2 Rules per breakpoint

### Mobile `< 768`

- bottom nav;
- AI avatar dominant;
- user camera PiP;
- transcript melalui bottom sheet;
- primary mic sticky bottom;
- action bar horizontal scroll bila perlu;
- modal menjadi bottom sheet.

### Tablet `768–1023`

- condensed sidebar atau bottom nav;
- arena 2-area layout;
- transcript center;
- user camera kecil;
- AI avatar compact.

### Desktop `>= 1024`

- fixed sidebar;
- arena 3-area layout;
- keyboard shortcuts;
- expanded transcript;
- user camera tile dan AI opponent panel.

### Large desktop `>= 1536`

- main width dibatasi;
- jangan memperlebar paragraph;
- gunakan whitespace;
- jangan menambah panel hanya karena ruang tersedia.

---

# 23. COMPONENT LIBRARY

Gunakan komponen kecil, composable, dan typed.

## 23.1 Foundation

```text
Button
IconButton
Input
Textarea
Select
Toggle
Switch
Tabs
Chip
Badge
Tooltip
Popover
Modal
BottomSheet
Toast
Skeleton
Progress
Avatar
Card
SectionHeader
EmptyState
ErrorState
```

## 23.2 Product components

```text
AppShell
DesktopSidebar
MobileBottomNav
LobbyHero
ModeCard
ModeCarousel
TopicCard
SpiceMeter
CustomTopicForm
RefinerComparisonCard
DeviceCheckPanel
DeviceSelector
CameraPreviewTile
MicLevelMeter
SpeakerTestButton
VoiceModeSelector
ArenaHeader
RoundStepper
TimerBadge
UserPodium
AiOpponentPanel
AiSpeakingHalo
VoiceWaveform
MomentumMeter
LiveCaptionPanel
TranscriptReviewSheet
ActionCardBar
InterruptButton
DataNotePanel
FactCheckMarker
AgreementMarker
RoundTransitionOverlay
JudgeLoadingPanel
JudgeResultPanel
ScoreBar
GradeBadge
DeliveryCoachPanel
DeliveryMetricCard
ShareCardPreview
HistoryCard
PreferencePanel
```

## 23.3 Component folder structure

```text
src/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── lobby/
│   ├── topics/
│   ├── device-check/
│   ├── arena/
│   ├── results/
│   ├── coach/
│   └── dev/
├── styles/
│   ├── tokens.css
│   ├── globals.css
│   ├── motion.css
│   └── themes.css
└── lib/
    ├── design-tokens.ts
    ├── ui-config.ts
    └── cn.ts
```

---

# 24. CONTENT DESIGN

## 24.1 Tone

Copy harus:

- jelas;
- singkat;
- percaya diri;
- hangat;
- sedikit satir bila relevan;
- tidak menggurui;
- tidak merendahkan user.

## 24.2 Button labels

Gunakan kata kerja.

Baik:

```text
Mulai Debat
Masuk Arena
Tahan untuk Bicara
Kirim Argumen
Interupsi
Coba Lagi
Lanjut tanpa Kamera
Gunakan Teks Saja
Lihat Detail
Main Lagi
```

Hindari:

```text
Submit
Proceed
Execute
Continue Process
Buy Now!!!
```

## 24.3 Error copy

Baik:

```text
Suara AI belum berhasil dibuat. Anda tetap dapat membaca responsnya.
```

Hindari:

```text
TTS API ERROR 500
```

Detail teknis boleh masuk console atau dev panel.

---

# 25. SETTINGS MVP

Settings yang perlu dibangun:

```text
Voice AI:
[ ON / OFF ]

Sound effects:
[ ON / OFF ]

Input mode default:
[ Text ] [ Voice ] [ Voice + Camera ]

Mic behavior:
[ Press and hold ] [ Tap to toggle ]

Camera mirror:
[ ON / OFF ]

Caption size:
[ Normal ] [ Besar ]

Reduced motion:
[ Ikuti sistem ] [ Aktif ] [ Nonaktif ]

Auto-send transcript:
[ OFF default ]

Show delivery coach:
[ ON ]
```

Jangan membuat settings terlalu panjang.

---

# 26. DEV UI PLAYGROUND

Bangun route internal:

```text
/dev/ui-playground
```

Hanya aktif pada development environment.

Tampilkan:

- seluruh button variants;
- inputs;
- cards;
- chips;
- score bars;
- avatar states;
- AI halo states;
- mic states;
- waveform mock;
- momentum meter;
- modal;
- bottom sheet;
- toast;
- error state;
- loading state;
- reduced motion preview;
- mode themes.

Bangun juga:

```text
/dev/mock-arena
```

Fungsi:

- simulasi arena tanpa OpenRouter;
- tombol paksa setiap visual state;
- simulasi mobile;
- simulasi permission denied;
- simulasi STT error;
- simulasi TTS error;
- simulasi AI speaking;
- simulasi interupsi;
- simulasi judging;
- simulasi result reveal.

Ini wajib agar Codex dapat memeriksa UI tanpa membakar biaya API.

---

# 27. ANALYTICS UI EVENTS

Catat minimal:

```text
ui_lobby_viewed
ui_mode_card_selected
ui_topic_selected
ui_custom_topic_opened
ui_device_check_opened
ui_camera_permission_result
ui_microphone_permission_result
ui_voice_mode_selected
ui_arena_opened
ui_press_to_talk_started
ui_press_to_talk_completed
ui_transcript_review_opened
ui_transcript_edited
ui_ai_speaking_started
ui_interrupt_clicked
ui_round_transition_seen
ui_result_reveal_completed
ui_delivery_coach_opened
ui_fallback_to_text
ui_reduced_motion_used
```

Analytics tidak boleh mengirim isi audio atau transkrip sensitif tanpa kebutuhan jelas.

---

# 28. PERFORMANCE BUDGET

Target:

| Item | Target |
|---|---:|
| Initial mobile route JS | sesedikit mungkin |
| Largest Contentful Paint | < 2.5 s pada koneksi wajar |
| Layout shift | minimal |
| Interaction feedback | < 100 ms |
| Button response | langsung |
| Waveform UI | halus pada perangkat menengah |
| AI streaming text | tidak membuat scroll freeze |
| Camera preview | stabil pada mobile |
| Motion | 60 fps pada perangkat menengah bila memungkinkan |

Rules:

- lazy-load ilustrasi;
- gunakan image optimization;
- hindari video background;
- hindari blur besar terus-menerus;
- waveform jangan terlalu banyak bars;
- AI avatar image cukup WebP/AVIF;
- jangan menggunakan canvas berat kecuali perlu;
- nonaktifkan efek dekoratif pada perangkat lemah bila perlu.

---

# 29. VISUAL QA MATRIX

Uji minimum:

| Device | Viewport |
|---|---:|
| Small Android | 360 × 800 |
| Common Android | 393 × 873 |
| iPhone-like | 390 × 844 |
| Tablet portrait | 768 × 1024 |
| Laptop | 1366 × 768 |
| Desktop | 1440 × 900 |
| Large desktop | 1920 × 1080 |

Browser:

- Chrome desktop;
- Chrome Android;
- Edge desktop;
- Safari iOS bila tersedia;
- Firefox desktop untuk text fallback.

## 29.1 Screenshot requirements

Setelah implementasi, simpan screenshot:

```text
docs/visual-qa/
├── lobby-desktop.png
├── lobby-mobile.png
├── device-check-desktop.png
├── device-check-mobile.png
├── arena-user-speaking-desktop.png
├── arena-ai-speaking-desktop.png
├── arena-ai-speaking-mobile.png
├── arena-transcript-review-mobile.png
├── result-desktop.png
├── result-mobile.png
├── delivery-coach-mobile.png
└── ui-playground.png
```

---

# 30. UI IMPLEMENTATION SPRINTS

Kerjakan secara berurutan.

## UI Sprint 0 — Design foundation

Bangun:

- tokens;
- global CSS;
- typography;
- layout primitives;
- Button;
- IconButton;
- Card;
- Badge;
- Chip;
- Modal;
- BottomSheet;
- Toast;
- Skeleton;
- ErrorState;
- `/dev/ui-playground`.

Acceptance criteria:

- semua tokens terpusat;
- tidak ada hard-coded arbitrary color di komponen inti;
- keyboard focus visible;
- reduced motion base tersedia;
- UI playground dapat dibuka;
- screenshot UI playground tersimpan.

## UI Sprint 1 — App shell dan lobby

Bangun:

- desktop sidebar;
- mobile bottom nav;
- lobby hero;
- mode cards;
- topic cards;
- progress resume card;
- responsive lobby.

Acceptance criteria:

- lobby dapat dipahami cepat;
- primary CTA jelas;
- mobile 360 px tidak overflow;
- mode carousel mobile smooth;
- sidebar tidak terlalu padat.

## UI Sprint 2 — Topic flow

Bangun:

- topic picker;
- filters;
- category chips;
- custom topic form;
- spice meter;
- AI refiner comparison;
- validation state.

Acceptance criteria:

- form mudah digunakan pada mobile;
- user mengetahui aksi utama;
- topic refiner jelas;
- sensitive topic rejection memiliki copy baik.

## UI Sprint 3 — Device check

Bangun:

- permission explanation;
- camera preview;
- mic meter;
- device selector;
- speaker test;
- fallback buttons;
- responsive state.

Acceptance criteria:

- user dapat lanjut tanpa kamera;
- user dapat lanjut text-only;
- permission denied state jelas;
- camera preview tidak aktif sebelum consent.

## UI Sprint 4 — Arena base

Bangun:

- arena header;
- timer;
- round stepper;
- transcript panel;
- user podium;
- AI panel;
- momentum;
- action bar;
- input dock;
- mobile layout;
- `/dev/mock-arena`.

Acceptance criteria:

- state `ready`, `user_speaking`, `ai_thinking`, `ai_speaking`, `recoverable_error` dapat disimulasikan;
- arena mobile usable;
- timer terlihat;
- caption terbaca;
- input dock tidak tertutup bottom nav.

## UI Sprint 5 — Voice polish

Bangun:

- waveform;
- mic halo;
- AI speaking halo;
- subtitle streaming;
- transcript review sheet;
- interupsi;
- camera PiP mobile;
- fallback messages.

Acceptance criteria:

- state transition smooth;
- reduced motion bekerja;
- interupsi mudah ditemukan;
- PiP tidak menutupi caption;
- audio UI tidak membuat render freeze.

## UI Sprint 6 — Result dan Delivery Coach

Bangun:

- judging skeleton;
- result reveal;
- grade badge;
- score bars;
- strengths;
- improvements;
- CTA;
- delivery metrics;
- share preview lokal.

Acceptance criteria:

- reveal terasa memuaskan tetapi tidak berlebihan;
- insight terbaca;
- mobile result rapi;
- grade tidak mempermalukan user;
- score tidak hanya bergantung pada warna.

## UI Sprint 7 — Final polish dan QA

Bangun:

- visual QA screenshots;
- empty states;
- error states;
- loading states;
- accessibility sweep;
- performance sweep;
- copy review;
- mobile testing;
- desktop testing.

Acceptance criteria:

- seluruh visual QA matrix diuji;
- tidak ada overflow;
- tidak ada hard-coded mock text yang salah konteks;
- feature flag hidden benar-benar tidak tampil;
- build production lolos.

---

# 31. CODEX OUTPUT FORMAT PER SPRINT

Setelah menyelesaikan satu UI sprint, Codex wajib menulis:

```text
docs/progress/UI_SPRINT_X_REPORT.md
```

Isi laporan:

```text
1. Ringkasan perubahan
2. File dibuat
3. File diubah
4. Screenshot visual QA
5. State yang diuji
6. Responsive breakpoint yang diuji
7. Accessibility check
8. Performance notes
9. Known issues
10. Next sprint recommendation
```

Jangan lanjut sprint berikutnya tanpa konfirmasi.

---

# 32. ACCEPTANCE CHECKLIST FINAL MVP STYLE

## Brand

- [ ] Modern Civic Arena terasa konsisten.
- [ ] Premium dark, bukan cyberpunk berlebihan.
- [ ] Cyan user, coral AI, gold prestige konsisten.
- [ ] Serif editorial hanya digunakan pada area tepat.
- [ ] UI text mudah dibaca.

## Lobby

- [ ] Primary CTA terlihat jelas.
- [ ] Mode card tidak terlalu padat.
- [ ] Topik dapat ditemukan dengan mudah.
- [ ] Mobile lobby tidak overflow.

## Device check

- [ ] Camera preview hanya aktif setelah consent.
- [ ] Mic meter bekerja.
- [ ] Fallback text-only mudah ditemukan.
- [ ] Copy permission ramah.

## Arena

- [ ] Siapa sedang berbicara selalu jelas.
- [ ] Timer terlihat.
- [ ] Caption terbaca.
- [ ] Interupsi mudah ditemukan.
- [ ] Voice input state jelas.
- [ ] User camera PiP tidak menutupi konten.
- [ ] Momentum memiliki label angka.
- [ ] Reduced motion tersedia.

## Result

- [ ] Reveal memuaskan.
- [ ] Insight utama terbaca.
- [ ] Grade tidak mempermalukan user.
- [ ] Delivery Coach mudah dipahami.
- [ ] CTA berikutnya jelas.

## Responsive

- [ ] 360 × 800 lolos.
- [ ] 393 × 873 lolos.
- [ ] 768 × 1024 lolos.
- [ ] 1366 × 768 lolos.
- [ ] 1440 × 900 lolos.
- [ ] 1920 × 1080 lolos.

## Accessibility

- [ ] Keyboard path tersedia.
- [ ] Focus visible.
- [ ] Caption tersedia.
- [ ] Text fallback penuh tersedia.
- [ ] Status tidak hanya berdasarkan warna.
- [ ] Touch target cukup.
- [ ] Reduced motion dihormati.

---

# 33. FUTURE UPSCALE NOTES — JANGAN DIBANGUN SEKARANG

Fondasi visual ini harus siap untuk:

- public challenge cards;
- shareable poster generator;
- live spectator;
- PvP human voice debate;
- WebRTC camera tiles;
- clan / partai;
- leaderboard;
- Kredit Arena;
- premium pass;
- event organizer;
- Arena Aspirasi;
- AI vs Republik;
- quiz event;
- consensus map;
- tournament bracket.

Tetapi jangan membangun halaman-halaman tersebut pada MVP aktif.

## 33.1 Cara menyiapkan upscale secara aman

- gunakan component library reusable;
- gunakan theme variables;
- gunakan feature flags;
- hindari hard-code;
- pisahkan lobby, arena, results;
- gunakan typed component props;
- bangun `/dev/ui-playground`;
- gunakan mock arena states;
- simpan assets terstruktur.

---

# 34. REFERENSI TEKNIS RESMI

Gunakan referensi berikut saat implementasi:

- MDN `getUserMedia()`:
  `https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia`
- MDN Web Speech API:
  `https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API`
- MDN `SpeechRecognition`:
  `https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition`
- MDN `SpeechSynthesis`:
  `https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis`
- WCAG 2.2:
  `https://www.w3.org/TR/WCAG22/`
- Motion for React accessibility:
  `https://motion.dev/docs/react-accessibility`
- Motion for React reduced motion:
  `https://motion.dev/docs/react-use-reduced-motion`

---

# 35. INSTRUKSI PERTAMA UNTUK CODEX

Gunakan prompt berikut:

```text
Baca `REPUBLIK_ARGUMEN_UI_UX_STYLE_BLUEPRINT.md` secara menyeluruh dan perlakukan sebagai source of truth khusus tampilan serta UX.

Baca juga `REPUBLIK_ARGUMEN_MVP_VOICE_ARENA_BLUEPRINT.md` sebagai source of truth untuk gameplay, keamanan, voice flow, dan backend.

Jangan mengimplementasikan semua layar sekaligus. Mulai hanya dari `UI Sprint 0 — Design foundation`.

Pastikan:
1. tokens terpusat;
2. tidak ada API call pada UI playground;
3. tidak ada hard-coded API key;
4. reduced motion base tersedia;
5. keyboard focus terlihat;
6. UI playground memiliki variants dan states utama;
7. dokumentasi dan screenshot QA diperbarui.

Setelah selesai, tulis `docs/progress/UI_SPRINT_0_REPORT.md`, jalankan lint, type-check, test, production build, lalu berhenti dan tunggu instruksi selanjutnya.
```

---

# PENUTUP

Desain MVP Republik Argumen tidak boleh sekadar terlihat futuristik.

Ia harus terasa:

- jelas;
- premium;
- hidup;
- aman;
- sportif;
- mudah digunakan;
- nyaman pada mobile;
- siap berkembang.

Prinsip akhir:

> **Lobby harus tenang seperti klub premium. Arena harus terasa seperti pertandingan. Result harus memberi rasa berkembang.**
