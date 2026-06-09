# R0 Component Inventory

Tanggal: 2026-06-10

## Layout

| Component | Status | Recovery Note |
|---|---|---|
| `PageShell` | Aktif | Wrapper utama halaman. |
| `AppShell` | Aktif | Shell global. |
| `DesktopSidebar` | Aktif | Harus disederhanakan di R1. Masih memuat politik/ranking/kredit/fake online count. |
| `MobileBottomNav` | Aktif | Harus diselaraskan dengan nav target recovery. |
| `AppHeader` | Aktif | Perlu dicek ulang saat R1/R2. |

## Lobby

| Component | Status | Recovery Note |
|---|---|---|
| `LobbyHero` | Aktif | Terlalu dashboard/showcase, masih brand `Arena Politika`, fake live/audience stats, AI Coach. |
| `UserUtilityBar` | Aktif | Masih menampilkan `Premium Club`. |
| `ModeCarousel` / `ModeCard` | Aktif | Bisa dipakai ulang, tetapi harus disederhanakan dan future/coming-soon cards disembunyikan. |
| `PopularChallengeStrip` | Aktif | Menampilkan `Live Arena Feed` dan fake waiting counts. Harus disembunyikan/diubah. |
| `ArenaProgressShowcase` | Aktif | Menampilkan `Karir Politikmu`, `Profil Ideologi`, dan copy `Arena Politika`. Harus disembunyikan di R1. |
| `ProgressResumeCard` | Aktif | Kandidat dipertahankan karena relevan dengan history/latihan. |

## Topics

| Component | Status | Recovery Note |
|---|---|---|
| `TopicExplorer` | Aktif | Search/filter/custom topic ada; target R2/R5 dipindah ke route `/topics`. |
| `TopicCard` | Aktif | Bisa dipakai ulang; density perlu diringankan. |
| `CustomTopicForm` | Aktif | Bisa dipakai ulang untuk `/topics/new`. |
| `RefinerComparisonCard` | Aktif | Local refiner; target recovery meminta AI refiner screen. |
| `InputModeSelector` | Aktif | Saat ini di lobby setup; target recovery memindahkan ke device/input flow. |
| `SideSelector` | Aktif | Bisa dipakai dalam setup step. |
| `SpiceMeter` | Aktif | Bisa dipertahankan. |

## Device And Voice

| Component | Status | Recovery Note |
|---|---|---|
| `DeviceCheckScreen` | Aktif | Sudah dekat blueprint: permission, camera preview, mic meter, fallback. Route perlu diselaraskan. |
| `VoiceInputButton` | Aktif | Browser/OpenRouter voice flow. |
| `SpeakResponseButton` | Aktif | Browser TTS helper. |

## Debate Arena

| Component | Status | Recovery Note |
|---|---|---|
| `DebateScreen` | Aktif | Core arena real. Perlu R10/R11 untuk audio queue/chunking dan voice-first polish. |
| `ArenaVisuals` | Aktif | Visual state dan AI/user panels; masih ada `AI Coach` label. |
| `DebateComposer` | Aktif | Text/transcript input. |
| `DebateTranscript` | Aktif | Transcript center. |
| `MessageBubble` | Aktif | Transcript item. |
| `RoundStepper` | Aktif | Round indicator. |
| `TurnTimer` | Aktif | Timer. |

## Result And Coach

| Component | Status | Recovery Note |
|---|---|---|
| `ResultScreen` | Aktif | Masih ada copy `Arena Politika`. Perlu brand cleanup R1. |
| `JudgeReportPanel` | Aktif | Score/coach panel. |
| `ScoreBar` | Aktif | Reusable. |
| `TranscriptAccordion` | Aktif | Reusable. |

## Dev

| Component | Status | Recovery Note |
|---|---|---|
| `UiPlayground` | Aktif | Sesuai dev requirement. |
| `MockArena` | Aktif | Sesuai visual state/dev QA. |

## UI Primitives

`Badge`, `Button`, `Card`, `Chip`, `Input`, `Modal`, `BottomSheet`, `Toast`, `Skeleton`, `ErrorState`, dan `IconButton` sudah tersedia. R3 perlu audit token/focus/reduced-motion dan hard-coded color pada komponen inti.

## Komponen Yang Harus Ditangani R1

- `DesktopSidebar`
- `MobileBottomNav`
- `LobbyHero`
- `UserUtilityBar`
- `PopularChallengeStrip`
- `ArenaProgressShowcase`
- `ResultScreen`
- Bagian setup API/model di `src/app/page.tsx`

R1 harus memakai hide/refactor aman, bukan menghapus domain logic.
