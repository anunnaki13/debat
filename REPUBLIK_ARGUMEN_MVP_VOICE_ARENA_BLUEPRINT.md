# REPUBLIK ARGUMEN — MVP VOICE ARENA BLUEPRINT

> **Dokumen implementasi utama untuk Codex**  
> Versi: `1.2.0-mvp-voice-arena-ready-to-scale`  
> Status: **Source of Truth untuk fase MVP aktif**  
> Sasaran: **MVP personal + closed alpha yang terasa seperti debat nyata dengan AI**  
> Platform awal: **Web responsive / PWA-friendly**  
> Bahasa utama: **Bahasa Indonesia**  
> AI gateway: **OpenRouter**  
> Design direction: **Modern Civic Arena**  
> Filosofi: **Buat satu pengalaman debat AI yang benar-benar seru, halus, dan terasa nyata. Siapkan fondasi upgrade, tetapi jangan membangun platform komersial penuh sebelum core loop tervalidasi.**

---

# 0. PETUNJUK WAJIB UNTUK CODEX

Baca dokumen ini seluruhnya sebelum menulis kode.

## 0.1 Dokumen mana yang berlaku?

Dokumen ini menggantikan blueprint lama untuk pengerjaan aktif MVP.

Jika repository masih memiliki file blueprint sebelumnya, pindahkan ke:

```text
docs/archive/
```

Gunakan file ini sebagai source of truth:

```text
REPUBLIK_ARGUMEN_MVP_VOICE_ARENA_BLUEPRINT.md
```

## 0.2 Prinsip pengerjaan

1. Fokus pada MVP yang dapat dimainkan secara nyata, bukan membangun terlalu banyak menu.
2. Prioritaskan kualitas pengalaman voice-to-voice, UI/UX, latency, fallback, dan kestabilan.
3. Jangan membangun payment gateway, wallet production, multiplayer manusia, spectator live, clan, public feed, atau event organisasi pada fase ini.
4. Boleh menyiapkan interface, feature flag, dan struktur folder untuk upgrade; jangan mengaktifkan fitur masa depan.
5. Seluruh API key berada di server-side environment variables.
6. Jangan pernah mengekspos OpenRouter API key pada browser bundle.
7. Pastikan aplikasi tetap dapat dimainkan melalui text-only apabila voice atau kamera bermasalah.
8. Jangan membuat klaim “deteksi emosi” yang berlebihan. Gunakan istilah **Delivery Signals** atau **Sinyal Penyampaian**.
9. Jangan melakukan face recognition, biometric identification, atau emotion inference dari wajah.
10. Setelah setiap sprint jalankan:
   - lint;
   - TypeScript type-check;
   - unit test;
   - integration test relevan;
   - production build;
   - smoke test desktop;
   - smoke test mobile responsive.
11. Setelah setiap sprint update:
   - `README.md`;
   - `.env.example`;
   - `CHANGELOG.md`;
   - `docs/progress/SPRINT_X_REPORT.md`.
12. Jangan melompat sprint tanpa lolos acceptance criteria sprint sebelumnya.

## 0.3 Definition of Done global

Fitur hanya dianggap selesai jika:

- berfungsi di desktop dan mobile;
- memiliki loading, empty, error, retry, dan fallback state;
- tidak membocorkan secret;
- memiliki analytics event;
- memiliki structured log server-side yang relevan;
- dapat digunakan dengan keyboard;
- dapat digunakan tanpa kamera;
- dapat digunakan tanpa mikrofon;
- tetap dapat dimainkan text-only;
- diuji minimal happy path dan satu failure path;
- dokumentasi setup diperbarui.

---

# 1. VISI MVP

## 1.1 Nama produk

# **REPUBLIK ARGUMEN**

Tagline:

> **Panas pada gagasan. Tenang pada pembuktian.**

## 1.2 Sasaran MVP

MVP harus membuat user merasakan:

> “Saya bukan sedang mengisi chat box. Saya sedang masuk arena debat, berbicara melalui mikrofon, melihat diri saya di kamera seperti berada di podium, mendengar AI membalas dengan suara, lalu memperoleh coaching report yang berguna.”

## 1.3 Scope utama MVP

Bangun pengalaman lengkap berikut:

```text
Lobby
  -> Pilih mode
  -> Pilih topik atau buat topik sendiri
  -> Pilih TEXT / VOICE / VOICE + CAMERA
  -> Device Check
  -> Masuk arena
  -> User bicara
  -> Audio ditranskripsi
  -> User dapat mengoreksi transkrip singkat
  -> AI Lawan menjawab secara streaming
  -> Jawaban AI dibacakan dengan suara
  -> User dapat melakukan interupsi
  -> Ronde selesai
  -> AI Judge menilai isi argumen
  -> Delivery Coach menilai cara penyampaian
  -> Hasil dan saran latihan tampil
```

## 1.4 Hal yang sengaja belum dibangun

Jangan bangun sekarang:

- payment gateway;
- top-up rupiah;
- wallet ledger production;
- multiplayer manusia;
- WebRTC antar-user;
- spectator live;
- public share link aktif;
- public challenge feed;
- clan atau partai;
- leaderboard publik;
- organizer dashboard;
- polling publik;
- quiz event organisasi;
- cloud video upload;
- automatic highlight publishing;
- crawling berita;
- moderasi politik kompleks;
- aplikasi native Android/iOS.

MVP boleh memiliki **placeholder** atau **feature flag OFF** untuk fitur masa depan.

---

# 2. MODE PERMAINAN MVP

Bangun hanya tiga mode aktif.

## 2.1 Duel Wacana AI

Format dasar user vs satu AI.

### Alur

1. Pilih topik.
2. Pilih posisi `PRO`, `KONTRA`, atau `ACAK`.
3. Pilih input: text, voice, atau voice + camera.
4. Jalankan 3 ronde:
   - Opening Statement;
   - Rebuttal;
   - Closing Statement.
5. AI Judge memberi laporan.

### Tujuan

- mode onboarding;
- paling cepat dipahami;
- baseline untuk menguji latency dan kualitas model.

## 2.2 Kursi Panas AI

Format user menghadapi beberapa persona AI bergiliran.

### Varian MVP

| Varian | Jumlah persona | Durasi target |
|---|---:|---:|
| Ringkas | 3 persona | 6–10 menit |
| Penuh | 5 persona | 10–18 menit |

### Persona awal

| Persona | Fungsi |
|---|---|
| Pengamat Statistik | Meminta bukti, angka, dan perbandingan |
| Jurnalis Kritis | Menemukan asumsi dan inkonsistensi |
| Pragmatis Lapangan | Menekankan implementasi nyata |
| Fans Emosional | Menguji ketenangan user dengan argumen populer |
| Mediator Rasional | Mencari titik temu dan trade-off |

### Tujuan

- menghasilkan pengalaman “1 vs banyak” yang unik;
- menjadi mode premium masa depan;
- menguji kemampuan user mempertahankan konsistensi.

## 2.3 Pasang Pendapat Privat

User membuat topik sendiri untuk dimainkan melawan AI.

### Form

```text
Judul singkat
Tesis utama
Kategori
Tingkat kepedasan
Posisi user
Konteks opsional
```

### Tingkat kepedasan

| Nilai | Nama | Contoh |
|---:|---|---|
| 1 | Santai | “Kerja pagi lebih produktif daripada kerja malam.” |
| 2 | Pedas Wajar | “Kerja kantor lima hari seminggu sudah ketinggalan zaman.” |
| 3 | Panas | “Sebagian klub besar hidup dari nostalgia, bukan performa.” |
| 4 | Kursi Panas | Perlu refinement AI lebih ketat |
| 5 | Sensitif | Tolak pada MVP atau minta topik lain |

### AI Topic Refiner

AI membantu mengubah ragebait kasar menjadi tesis tajam tetapi layak debat.

Contoh:

```text
Draft user:
“Fans MU delusional semua.”

Hasil refiner:
“Sebagian penilaian terhadap Manchester United terlalu bergantung pada sejarah klub dibandingkan performa beberapa musim terakhir.”
```

---

# 3. CORE EXPERIENCE: REAL VOICE-TO-VOICE DEBATE

## 3.1 Definisi voice-to-voice MVP

MVP bukan full-duplex voice call tanpa jeda. MVP menggunakan **natural turn-based voice conversation** dengan latency rendah:

```text
User bicara
  -> sistem mendeteksi akhir ucapan
  -> audio ditranskripsi
  -> AI Lawan berpikir
  -> teks AI di-stream
  -> TTS mulai membacakan jawaban AI
  -> user dapat menginterupsi
```

Ini harus terasa seperti debat nyata, tetapi tetap cukup sederhana untuk stabil di web.

## 3.2 Tiga mode input

```ts
export type DebateInputMode =
  | "TEXT"
  | "VOICE"
  | "VOICE_CAMERA";
```

| Mode | Mic | Camera | STT | AI voice output | Wajib tersedia |
|---|---:|---:|---:|---:|---:|
| `TEXT` | Tidak | Tidak | Tidak | Opsional | Ya |
| `VOICE` | Ya | Tidak | Ya | Ya | Ya |
| `VOICE_CAMERA` | Ya | Ya | Ya | Ya | Ya bila perangkat mendukung |

## 3.3 Voice UX state machine

```ts
export type VoiceArenaState =
  | "IDLE"
  | "READY"
  | "USER_LISTENING"
  | "USER_SPEAKING"
  | "USER_SILENCE_PENDING"
  | "TRANSCRIBING"
  | "TRANSCRIPT_REVIEW"
  | "SUBMITTING_ARGUMENT"
  | "AI_THINKING"
  | "AI_STREAMING_TEXT"
  | "AI_SYNTHESIZING"
  | "AI_SPEAKING"
  | "AI_INTERRUPTED"
  | "ROUND_TRANSITION"
  | "ERROR_FALLBACK_TEXT";
```

Aturan:

- hanya satu state aktif;
- state tampil jelas melalui status chip;
- user selalu dapat memilih `Beralih ke Ketik`;
- user selalu dapat menekan `Stop`;
- user dapat menginterupsi AI ketika AI sedang berbicara.

## 3.4 Voice loop utama

```mermaid
sequenceDiagram
  participant U as User
  participant B as Browser
  participant W as Web API
  participant OR as OpenRouter
  participant P as Audio Player

  U->>B: Tekan Bicara / mulai berbicara
  B->>B: getUserMedia + audio meter + local capture
  B->>B: VAD mendeteksi silence
  B->>W: POST /api/voice/transcribe
  W->>OR: POST /api/v1/audio/transcriptions
  OR-->>W: transcript + usage
  W-->>B: final transcript
  B-->>U: tampilkan transcript review 2–4 detik
  U->>B: Kirim atau edit
  B->>W: POST /api/debate/sessions/:id/respond/stream
  W->>OR: chat completion stream=true
  OR-->>W: text chunks
  W-->>B: SSE text chunks
  B->>B: sentence chunker
  B->>W: POST /api/voice/synthesize per kalimat
  W->>OR: POST /api/v1/audio/speech
  OR-->>W: audio bytes
  W-->>B: audio bytes
  B->>P: enqueue audio
  P-->>U: AI berbicara
```

## 3.5 STT utama: OpenRouter transcription endpoint

Gunakan server-side adapter ke:

```text
POST https://openrouter.ai/api/v1/audio/transcriptions
```

Payload minimum:

```json
{
  "input_audio": {
    "data": "<base64-audio>",
    "format": "wav"
  },
  "model": "<OPENROUTER_STT_MODEL>",
  "language": "id"
}
```

Gunakan `usage.cost`, `usage.seconds`, dan token usage untuk analytics biaya.

### Format audio MVP

Prioritas capture:

1. `audio/webm;codecs=opus` dari browser bila didukung;
2. konversi server-side ke WAV bila model STT membutuhkan WAV;
3. fallback langsung WAV sederhana;
4. batasi durasi per turn.

### STT fallback

```text
Primary: OpenRouter STT server-side
Fallback 1: browser SpeechRecognition jika tersedia
Fallback 2: text input manual
```

Catatan:

- browser `SpeechRecognition` tidak tersedia konsisten di seluruh browser;
- jangan menjadikannya satu-satunya jalur voice;
- hasil transkripsi selalu dapat diedit sebelum dikirim.

## 3.6 AI Lawan: OpenRouter text streaming

Gunakan server-side OpenRouter chat completions dengan streaming.

```text
POST /api/v1/chat/completions
stream=true
```

AI Lawan hanya menerima:

- tesis;
- posisi;
- persona;
- ronde;
- history ringkas;
- argumen final user dalam bentuk teks.

Jangan kirim video ke AI Lawan.

Jangan kirim raw audio ke AI Lawan kecuali mode eksperimen audio analysis diaktifkan pada fase setelah alpha.

## 3.7 TTS utama: OpenRouter speech endpoint

Gunakan server-side adapter ke:

```text
POST https://openrouter.ai/api/v1/audio/speech
```

Payload minimum:

```json
{
  "input": "<teks respons AI>",
  "model": "<OPENROUTER_TTS_MODEL>",
  "voice": "<OPENROUTER_TTS_VOICE>",
  "response_format": "mp3",
  "speed": 1
}
```

### Strategi latency TTS

Jangan menunggu seluruh teks AI selesai.

Gunakan **sentence queue**:

1. terima text streaming dari AI Lawan;
2. kumpulkan sampai tanda akhir kalimat atau panjang aman;
3. kirim satu kalimat ke TTS;
4. enqueue audio;
5. putar kalimat pertama segera;
6. lanjutkan sintesis kalimat berikutnya di background.

### TTS fallback

```text
Primary: OpenRouter TTS
Fallback 1: browser speechSynthesis
Fallback 2: tampilkan teks saja
```

### AI voice persona

Setiap persona dapat memiliki konfigurasi:

```ts
interface PersonaVoiceConfig {
  providerMode: "OPENROUTER_TTS" | "BROWSER_TTS";
  voiceId: string;
  speed: number;
  styleHint?: string;
}
```

Pada MVP cukup gunakan 2–3 suara berbeda bila TTS model mendukungnya.

## 3.8 Barge-in / interupsi

Agar terasa seperti debat nyata, user dapat memotong respons AI.

### MVP P0

- tampilkan tombol `INTERUPSI` ketika AI berbicara;
- menekan tombol menghentikan playback audio;
- batalkan audio queue yang belum diputar;
- simpan event `ai_voice_interrupted`;
- ubah state menjadi `USER_LISTENING`;
- user langsung dapat berbicara.

### P1 opsional

- jika VAD mendeteksi user mulai berbicara saat AI berbicara, sistem menawarkan auto-interrupt;
- jangan aktifkan auto-interrupt default sebelum stabil;
- hindari echo dari speaker AI terbaca sebagai suara user.

## 3.9 Latency target MVP

Gunakan target realistis, bukan jaminan absolut.

| Tahap | Target koneksi baik |
|---|---:|
| User selesai bicara -> STT selesai | ≤ 2.5 detik |
| STT selesai -> text AI mulai stream | ≤ 2.5 detik |
| Kalimat AI pertama -> audio mulai terdengar | ≤ 2.0 detik |
| Total user stop -> suara AI pertama | target ≤ 5–7 detik |

Tampilkan state secara visual agar waktu tunggu terasa wajar:

- `Mendengarkan...`
- `Merangkum ucapan Anda...`
- `Lawan menyusun bantahan...`
- `Lawan mulai menjawab...`

## 3.10 Audio capture constraints

```ts
const audioConstraints: MediaTrackConstraints = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  channelCount: 1,
};
```

Gunakan mono untuk menghemat bandwidth dan proses STT.

## 3.11 Voice activity detection

### MVP P0

Gunakan `AnalyserNode` untuk:

- audio level meter;
- deteksi apakah user mulai bicara;
- deteksi silence sederhana;
- waveform visual.

Gunakan RMS energy threshold dengan adaptive baseline.

Aturan awal:

```text
silence threshold: adaptive
minimum speech duration: 400ms
silence timeout to end turn: 900–1400ms
maximum turn duration: 120s
```

Buat setting operator / env agar mudah dituning.

### P1 upgrade

Gunakan `AudioWorklet` untuk VAD lebih presisi dan low-latency tanpa membebani main thread.

Jangan menjadikan AudioWorklet blocker Sprint pertama.

---

# 4. CAMERA EXPERIENCE

## 4.1 Tujuan camera

Kamera bukan untuk AI melihat wajah user. Kamera digunakan untuk:

- immersion;
- rasa berada di podium;
- self-review;
- local replay opsional;
- fondasi highlight masa depan.

## 4.2 Camera rules MVP

- camera preview lokal default tersedia pada mode `VOICE_CAMERA`;
- user harus memberi izin;
- preview lokal `muted` agar tidak echo;
- video tidak dikirim ke OpenRouter;
- video tidak diunggah ke server;
- recording default OFF;
- user dapat mematikan kamera kapan saja;
- user tetap dapat lanjut voice-only atau text-only.

## 4.3 Device check route

```text
/debate/device-check?mode=DUEL_WACANA_AI&input=VOICE_CAMERA
```

Tampilkan:

- camera preview;
- mic meter;
- pilihan camera;
- pilihan microphone;
- toggle kamera;
- toggle suara AI;
- pilihan voice AI;
- tombol tes mikrofon;
- tombol tes suara AI;
- tombol `Mulai Debat`;
- tombol `Lanjut Tanpa Kamera`;
- tombol `Gunakan Ketikan Saja`;
- privacy copy singkat.

Copy:

> Kamera hanya digunakan sebagai preview lokal pada MVP. Video tidak dikirim ke AI dan tidak diunggah. Mikrofon digunakan untuk mengubah suara Anda menjadi teks agar AI dapat membalas.

## 4.4 Camera constraints

```ts
const videoConstraints: MediaTrackConstraints = {
  facingMode: "user",
  width: { ideal: 1280, max: 1280 },
  height: { ideal: 720, max: 720 },
  frameRate: { ideal: 24, max: 30 },
};
```

Fallback:

1. 720p;
2. 480p;
3. mic-only;
4. text-only.

## 4.5 Local replay opsional

Replay lokal adalah P1, bukan blocker voice MVP.

Jika dibuat:

- gunakan `MediaRecorder`;
- record per turn;
- simpan Blob ke IndexedDB;
- jangan simpan Blob ke localStorage;
- user dapat menghapus replay;
- tidak upload cloud;
- tampilkan indikator merah `RECORDING`.

---

# 5. DELIVERY SIGNALS — BUKAN DETEKSI EMOSI

## 5.1 Prinsip

Jangan memberi label:

- marah;
- sedih;
- takut;
- bohong;
- gugup;
- depresi;
- agresif secara psikologis.

MVP tidak boleh mengklaim membaca perasaan user.

Gunakan istilah:

# **Delivery Signals / Sinyal Penyampaian**

## 5.2 Sinyal yang boleh dihitung

| Signal | Cara hitung | Fungsi coaching |
|---|---|---|
| Durasi bicara | Waktu audio turn | Apakah jawaban terlalu panjang |
| Kecepatan bicara | Jumlah kata / menit | Apakah terlalu cepat atau lambat |
| Rasio jeda | Silence / total audio | Apakah penyampaian terlalu banyak jeda |
| Filler words | Deteksi kata seperti “eee”, “anu”, “maksudnya” | Latihan kelancaran |
| Response latency | Waktu sebelum mulai menjawab | Latihan spontanitas |
| Volume stability | Variasi RMS audio | Apakah suara terlalu pelan atau tidak stabil |
| Talk-time balance | Durasi user dibanding AI | Apakah terlalu dominan atau terlalu pasif |
| Interupsi | Jumlah user menekan tombol interupsi | Coaching kontrol percakapan |
| Repetition | Kemiripan antar kalimat | Apakah user mengulang argumen |

## 5.3 Sinyal eksperimental P1

Boleh dipertimbangkan kemudian:

- pitch variation sederhana;
- speaking-energy variation;
- penekanan kata;
- ritme jawaban.

Selalu tampilkan disclaimer:

> Sinyal penyampaian adalah estimasi teknis dari pola bicara, bukan diagnosis emosi atau kondisi psikologis.

## 5.4 Jangan gunakan camera untuk emotion score

Dilarang pada MVP:

- emotion recognition dari wajah;
- face analysis;
- gaze tracking;
- biometric scoring;
- identity recognition.

## 5.5 Delivery report

Contoh:

```text
DELIVERY COACH

Kecepatan bicara: 147 kata/menit — cukup jelas
Rasio jeda: 18% — stabil
Filler words: 4 kali — kurangi “eee” sebelum menyampaikan data
Durasi jawaban rata-rata: 54 detik — baik
Volume: cukup stabil
Interupsi: 1 kali — digunakan secara relevan

Saran latihan:
Berikan jeda singkat sebelum menyampaikan data utama agar poin lebih mudah ditangkap.
```

Delivery score terpisah dari AI Judge semantic score.

---

# 6. AI JUDGE DAN HASIL

## 6.1 Dua laporan terpisah

### A. Argument Quality Report

Dinilai AI Judge berdasarkan transkrip:

| Dimensi | Bobot |
|---|---:|
| Speak by Data | 20% |
| Struktur | 20% |
| Logika | 25% |
| Rebuttal | 20% |
| Integritas | 15% |

### B. Delivery Coach Report

Dihitung dari sinyal audio terukur:

- pace;
- pause ratio;
- filler words;
- response latency;
- answer duration;
- volume stability;
- interruption pattern.

Jangan campur dua skor ini secara otomatis pada MVP.

## 6.2 Judge JSON schema

```json
{
  "scores": {
    "data": 0,
    "structure": 0,
    "logic": 0,
    "rebuttal": 0,
    "integrity": 0
  },
  "overallScore": 0,
  "strengths": ["string"],
  "improvements": ["string"],
  "bestArgument": "string",
  "missedOpportunity": "string",
  "recommendedExercise": "string",
  "titleUnlocked": "string",
  "safetyFlags": ["string"]
}
```

## 6.3 Result screen

Tampilkan bertahap:

1. `SIDANG SELESAI`;
2. grade utama;
3. skor argumen;
4. highlight argumen terbaik;
5. satu perbaikan terpenting;
6. tab `Delivery Coach`;
7. CTA:
   - Main Lagi;
   - Lihat Detail;
   - Simpan Hasil;
   - Preview Share Card.

Share card pada MVP hanya preview lokal, belum publish otomatis.

---

# 7. UI / UX STYLE SYSTEM

## 7.1 Design direction

Gunakan gaya:

# **Modern Civic Arena**

Perpaduan:

- premium civic club;
- pertandingan esports yang tertata;
- studio debat modern;
- dark cinematic UI;
- gold untuk prestise;
- cyan untuk user dan aksi utama;
- coral-red untuk AI opponent dan warning;
- sedikit glow, bukan neon berlebihan.

Jangan membuat UI seperti:

- dashboard enterprise;
- aplikasi pemerintah;
- chat app biasa;
- kasino digital;
- cyberpunk penuh efek;
- panel terlalu padat.

## 7.2 Design tokens

```css
:root {
  --bg-deep: #070C16;
  --bg-surface: #0E1726;
  --bg-panel: #142033;
  --bg-elevated: #182942;

  --text-primary: #F7F2E8;
  --text-secondary: #A6B2C5;
  --text-muted: #6E7D92;

  --cyan-primary: #29D4D0;
  --cyan-secondary: #4BB7FF;
  --gold-primary: #D8AA5C;
  --gold-soft: #F1C979;
  --coral-danger: #EE6A64;
  --emerald-success: #62D49C;
  --violet-special: #9C7CFF;

  --radius-card: 18px;
  --radius-button: 12px;
  --border-subtle: rgba(255,255,255,0.10);
  --shadow-panel: 0 18px 45px rgba(0,0,0,0.28);
}
```

## 7.3 Typography

Gunakan maksimal dua font:

| Fungsi | Font |
|---|---|
| Logo / heading editorial | `DM Serif Display` atau `Fraunces` |
| UI text | `Plus Jakarta Sans` |

Fallback:

```css
font-family: "Plus Jakarta Sans", Inter, system-ui, sans-serif;
```

## 7.4 Layout philosophy

### Lobby

Tenang, premium, mudah dipahami.

### Arena

Dramatis tetapi fokus. Jangan tampilkan semua fitur sekaligus.

### Result

Berikan rasa pencapaian seperti game progression.

## 7.5 Desktop arena layout

```text
┌─────────────────────────────────────────────────────────────┐
│ Kembali        RONDE 2 — REBUTTAL       01:48      Settings │
├────────────────┬──────────────────────────────┬─────────────┤
│ CAMERA TILE    │ TRANSKRIP / LIVE CAPTION     │ AI PERSONA  │
│ USER           │                              │ AVATAR      │
│                │ bubble user                  │             │
│ waveform       │ bubble AI                    │ momentum    │
│ delivery chip  │ live streaming response      │             │
├────────────────┴──────────────────────────────┴─────────────┤
│ [Interupsi] [Kartu Data] [Cek Fakta] [Titik Temu]           │
├─────────────────────────────────────────────────────────────┤
│ 🎙 Tahan untuk bicara / Ketik argumen...       [Kirim]      │
└─────────────────────────────────────────────────────────────┘
```

## 7.6 Mobile arena layout

Gunakan fokus tunggal:

```text
┌──────────────────────────────┐
│ RONDE 2 · REBUTTAL     01:48 │
├──────────────────────────────┤
│ AI avatar + speaking halo    │
│ AI voice waveform            │
│                              │
│ caption respons AI           │
│                              │
│ [PiP camera user]            │
├──────────────────────────────┤
│ Data  Fakta  Titik  Interupsi│
├──────────────────────────────┤
│ 🎙 TAHAN UNTUK BICARA        │
│ Ketik sebagai alternatif     │
└──────────────────────────────┘
```

## 7.7 Arena voice animation

| State | Visual |
|---|---|
| Ready | ring mic lembut |
| User speaking | cyan waveform + camera border cyan |
| Silence pending | pulse melambat |
| Transcribing | waveform menjadi titik bergerak |
| AI thinking | avatar AI memiliki breathing glow |
| AI speaking | coral waveform + subtitle live |
| Interruption | flash singkat + audio fade-out |
| Round complete | transition horizontal 450–650ms |

## 7.8 Motion rules

- hover: `120–180ms`;
- panel transition: `220–320ms`;
- round transition: `450–650ms`;
- badge reveal: `700–1000ms`;
- jangan animasikan semua elemen;
- hormati `prefers-reduced-motion`.

## 7.9 Core components

```text
AppShell
LobbyHero
ModeCard
TopicCard
CustomTopicForm
SpiceMeter
DeviceCheckPanel
CameraPreviewTile
MicLevelMeter
VoiceWaveform
VoiceModeToggle
VoicePersonaSelector
ArenaHeader
RoundStepper
MomentumMeter
DebateCaptionPanel
TranscriptReviewSheet
ActionCardBar
InterruptButton
AiSpeakingHalo
JudgeResultPanel
DeliveryCoachPanel
ShareCardPreview
ErrorFallbackCard
```

---

# 8. MINIMAL BACKEND READY TO UPSCALE

## 8.1 Prinsip

Bangun backend minimal, modular, dan tidak berlebihan.

MVP tidak memerlukan microservices. Gunakan monorepo dengan web app dan worker kecil.

## 8.2 Monorepo

```text
republik-argumen/
  apps/
    web/                    # Next.js App Router
    worker/                 # job ringan: judge, cleanup, analytics flush
  packages/
    ai/                     # OpenRouter adapters dan prompts
    voice/                  # STT, TTS, sentence chunker, VAD helpers
    game-engine/            # state machine ronde dan mode
    db/                     # Drizzle schema dan migrations
    ui/                     # tokens dan komponen UI
    analytics/              # event contracts
    config/                 # env validation dan feature flags
    shared/                 # types dan utils
  docs/
    architecture/
    prompts/
    runbooks/
    progress/
    archive/
  infra/
    docker/
    caddy/
  docker-compose.yml
  .env.example
  README.md
  CHANGELOG.md
```

## 8.3 Technology choices

| Layer | Pilihan |
|---|---|
| Web | Next.js App Router + TypeScript |
| Styling | Tailwind CSS |
| UI primitives | Radix / shadcn compatible primitives |
| Animation | Framer Motion |
| Validation | Zod |
| Database | PostgreSQL |
| ORM | Drizzle ORM |
| Queue | Redis + BullMQ ringan |
| AI LLM | OpenRouter chat completions |
| STT | OpenRouter transcription endpoint |
| TTS | OpenRouter speech endpoint |
| Camera + mic | `navigator.mediaDevices.getUserMedia()` |
| Local audio visualizer | Web Audio `AnalyserNode` |
| Optional low latency VAD | `AudioWorklet` P1 |
| Local replay | IndexedDB P1 |
| Logging | Pino structured logging |
| Error monitoring | Sentry optional |
| Tests | Vitest + Playwright |
| Deploy | Docker Compose di VPS |
| Proxy | Caddy atau Nginx |

## 8.4 Services MVP

```mermaid
flowchart LR
  Browser --> Proxy[Caddy / Nginx]
  Proxy --> Web[Next.js Web App]
  Web --> DB[(PostgreSQL)]
  Web --> Redis[(Redis)]
  Web --> OR[OpenRouter]
  Web --> Logs[Structured Logs]
  Browser --> Media[Camera + Mic]
  Media --> Browser
```

## 8.5 Engines MVP

### Game Session Engine

- membuat sesi;
- mengelola ronde;
- mengelola turn;
- menyimpan transcript;
- menentukan selesai atau abandon;
- memanggil judge.

### AI Orchestrator

- OpenRouter auth server-side;
- prompt version;
- streaming response;
- timeout;
- retry terbatas;
- fallback model;
- cost logging.

### Voice Experience Engine

- mic permission;
- audio capture;
- VAD;
- STT adapter;
- transcript review;
- sentence chunking;
- TTS adapter;
- audio playback queue;
- barge-in;
- fallback browser TTS;
- fallback text-only;
- delivery signals.

### Topic Refiner Engine

- klasifikasi kategori;
- spice level;
- refinement;
- safety rejection untuk topik sensitif.

### Judge Engine

- structured output;
- schema validation;
- scoring;
- report persistence.

### Analytics Engine

- session event;
- latency;
- STT error;
- TTS error;
- voice fallback;
- cost per session;
- preferred input mode.

---

# 9. API CONTRACTS MVP

## 9.1 Create session

```text
POST /api/debate/sessions
```

Request:

```json
{
  "mode": "DUEL_WACANA_AI",
  "topicId": "uuid",
  "userPosition": "PRO",
  "inputMode": "VOICE_CAMERA",
  "personaCodes": ["JURNALIS_KRITIS"]
}
```

## 9.2 Transcribe voice

```text
POST /api/voice/transcribe
Content-Type: multipart/form-data
```

Fields:

```text
sessionId
turnId
audioBlob
mimeType
language=id
```

Response:

```json
{
  "transcript": "Naturalisasi dapat membantu performa jangka pendek...",
  "usage": {
    "seconds": 18.2,
    "costUsd": 0.0001
  },
  "deliverySignals": {
    "durationMs": 18200,
    "wordsPerMinute": 142,
    "pauseRatio": 0.16,
    "fillerWordCount": 2,
    "volumeStability": 0.78
  }
}
```

## 9.3 Submit final transcript and stream AI text

```text
POST /api/debate/sessions/:sessionId/respond/stream
Accept: text/event-stream
```

Request:

```json
{
  "turnId": "uuid",
  "finalTranscript": "...",
  "inputSource": "OPENROUTER_STT"
}
```

SSE event types:

```text
meta
text_delta
sentence_ready
usage
complete
error
```

## 9.4 Synthesize AI sentence

```text
POST /api/voice/synthesize
```

Request:

```json
{
  "sessionId": "uuid",
  "turnId": "uuid",
  "text": "Namun solusi jangka pendek tidak selalu cukup.",
  "voiceId": "default-opponent",
  "responseFormat": "mp3"
}
```

Response:

```text
audio/mpeg bytes
```

## 9.5 Finalize session

```text
POST /api/debate/sessions/:sessionId/finalize
```

Response:

```json
{
  "status": "JUDGE_QUEUED"
}
```

## 9.6 Get result

```text
GET /api/debate/sessions/:sessionId/result
```

---

# 10. DATABASE MVP

Gunakan UUID dan UTC timestamps.

## 10.1 `topics`

```text
id uuid pk
slug text unique
title text
thesis text
category text
spice_level integer
context text nullable
is_custom boolean default false
is_active boolean default true
created_at timestamptz
```

## 10.2 `ai_personas`

```text
id uuid pk
code text unique
name text
short_description text
system_prompt text
voice_id text nullable
voice_speed numeric default 1
avatar_url text nullable
is_active boolean default true
created_at timestamptz
```

## 10.3 `debate_sessions`

```text
id uuid pk
mode text
status text
topic_snapshot jsonb
user_position text
input_mode text
current_round integer
started_at timestamptz
completed_at timestamptz nullable
abandoned_at timestamptz nullable
created_at timestamptz
```

## 10.4 `debate_turns`

```text
id uuid pk
session_id uuid
round_number integer
speaker text              # USER or AI
persona_code text nullable
text_content text
input_source text nullable # TEXT, OPENROUTER_STT, BROWSER_STT
started_at timestamptz
completed_at timestamptz
created_at timestamptz
```

## 10.5 `voice_turn_metrics`

```text
id uuid pk
session_id uuid
turn_id uuid
capture_duration_ms integer
words_per_minute numeric nullable
pause_ratio numeric nullable
filler_word_count integer default 0
response_latency_ms integer nullable
volume_stability numeric nullable
was_interruption boolean default false
stt_provider text nullable
stt_model text nullable
stt_cost_usd numeric nullable
tts_provider text nullable
tts_model text nullable
tts_cost_usd numeric nullable
created_at timestamptz
```

## 10.6 `judge_reports`

```text
id uuid pk
session_id uuid unique
report_json jsonb
overall_score integer
created_at timestamptz
```

## 10.7 `ai_usage_logs`

```text
id uuid pk
session_id uuid nullable
turn_id uuid nullable
role text                  # OPPONENT, JUDGE, TOPIC_REFINER, STT, TTS
model text
provider text nullable
input_tokens integer nullable
output_tokens integer nullable
audio_seconds numeric nullable
cost_usd numeric nullable
latency_ms integer
status text
error_code text nullable
created_at timestamptz
```

## 10.8 `analytics_events`

```text
id uuid pk
session_id uuid nullable
event_name text
payload jsonb
created_at timestamptz
```

---

# 11. OPENROUTER CONFIGURATION

## 11.1 Empat jalur AI

```text
1. OPPONENT LLM
2. JUDGE LLM
3. STT
4. TTS
```

Semua berada di server-side.

## 11.2 Environment variables

```bash
# App
NODE_ENV=development
APP_URL=http://localhost:3000
APP_TIMEZONE=Asia/Jakarta
SESSION_SECRET=change-me

# Database
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/republik_argumen

# Redis
REDIS_URL=redis://redis:6379

# OpenRouter metadata
OPENROUTER_APP_NAME=Republik Argumen
OPENROUTER_APP_URL=http://localhost:3000

# Opponent LLM
OPENROUTER_OPPONENT_API_KEY=
OPENROUTER_OPPONENT_MODEL=
OPENROUTER_OPPONENT_FALLBACK_MODELS=

# Judge LLM
OPENROUTER_JUDGE_API_KEY=
OPENROUTER_JUDGE_MODEL=
OPENROUTER_JUDGE_FALLBACK_MODELS=

# Speech-to-text
OPENROUTER_STT_API_KEY=
OPENROUTER_STT_MODEL=openai/whisper-large-v3
OPENROUTER_STT_LANGUAGE=id

# Text-to-speech
OPENROUTER_TTS_API_KEY=
OPENROUTER_TTS_MODEL=
OPENROUTER_TTS_VOICE=
OPENROUTER_TTS_FORMAT=mp3
OPENROUTER_TTS_SPEED=1

# Optional shared fallback key for personal alpha only
OPENROUTER_SHARED_API_KEY=

# Voice tuning
VOICE_ENABLE=true
VOICE_CAMERA_ENABLE=true
VOICE_TTS_ENABLE=true
VOICE_BROWSER_TTS_FALLBACK=true
VOICE_BROWSER_STT_FALLBACK=true
VOICE_AUTO_END_SILENCE_MS=1100
VOICE_MIN_SPEECH_MS=400
VOICE_MAX_TURN_SECONDS=120
VOICE_AUDIO_FORMAT=webm
VOICE_BARGE_IN_BUTTON=true
VOICE_AUTO_BARGE_IN=false
VOICE_TRANSCRIPT_REVIEW_SECONDS=3

# Camera
CAMERA_DEFAULT_ENABLE=true
CAMERA_LOCAL_REPLAY_ENABLE=false
CAMERA_CLOUD_UPLOAD_ENABLE=false
CAMERA_WIDTH=1280
CAMERA_HEIGHT=720
CAMERA_FRAME_RATE=24

# AI cost guardrails
AI_DAILY_COST_LIMIT_USD=5
AI_PER_SESSION_COST_LIMIT_USD=0.50
AI_GLOBAL_KILL_SWITCH=false

# Feature flags
ENABLE_DUEL_WACANA_AI=true
ENABLE_KURSI_PANAS_AI=true
ENABLE_CUSTOM_TOPIC=true
ENABLE_TOPIC_REFINER=true
ENABLE_VOICE_ARENA=true
ENABLE_VOICE_CAMERA=true
ENABLE_DELIVERY_SIGNALS=true
ENABLE_LOCAL_REPLAY=false
ENABLE_PUBLIC_CHALLENGE=false
ENABLE_PAYMENT=false
ENABLE_MULTIPLAYER=false

# Monitoring
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=
```

## 11.3 Key rules

- boleh memakai `OPENROUTER_SHARED_API_KEY` untuk personal alpha;
- tetap sediakan env terpisah agar mudah dipisahkan nanti;
- jangan commit `.env.local`;
- commit `.env.example` tanpa secret;
- log model dan biaya per role;
- pasang timeout;
- pasang circuit breaker bila biaya abnormal.

---

# 12. ANALYTICS MVP

Catat event minimum:

```text
app_opened
mode_selected
topic_selected
custom_topic_created
topic_refiner_used
device_check_opened
camera_permission_granted
camera_permission_denied
mic_permission_granted
mic_permission_denied
voice_mode_started
voice_capture_started
voice_capture_ended
vad_silence_detected
stt_started
stt_completed
stt_failed
transcript_edited
argument_submitted
ai_stream_started
ai_first_token_received
tts_started
tts_first_audio_played
tts_failed
browser_tts_fallback_used
text_fallback_used
ai_voice_interrupted
round_completed
debate_completed
debate_abandoned
judge_report_viewed
delivery_report_viewed
share_card_previewed
```

## 12.1 Latency telemetry

Catat:

```text
capture_duration_ms
stt_latency_ms
llm_time_to_first_token_ms
tts_latency_ms
user_stop_to_ai_audio_ms
```

Tampilkan internal diagnostics sederhana pada dev mode.

---

# 13. MINI OPERATOR / DEVELOPER PANEL

Bangun panel ringan. Jangan membuat admin suite besar.

Route:

```text
/dev
```

Hanya aktif jika:

```text
NODE_ENV !== production
atau DEV_PANEL_ENABLE=true
```

Menu:

## 13.1 Session diagnostics

- session ID;
- mode;
- topic;
- transcript;
- state transitions;
- STT latency;
- LLM latency;
- TTS latency;
- total cost;
- fallback yang terpakai;
- error.

## 13.2 Model config

- opponent model;
- judge model;
- STT model;
- TTS model;
- voice ID;
- toggle browser fallback;
- test connection.

## 13.3 Prompt playground

- pilih persona;
- input contoh argumen;
- jalankan respons;
- lihat raw output;
- lihat token dan biaya.

## 13.4 Voice diagnostics

- mic level;
- VAD threshold;
- silence timeout;
- test STT;
- test TTS;
- test browser TTS fallback;
- audio queue status.

## 13.5 Reset demo data

- reset sessions;
- reset local settings;
- clear IndexedDB replay;
- reseed topics.

---

# 14. ERROR HANDLING DAN FALLBACK

## 14.1 Fallback ladder

```text
VOICE + CAMERA
  -> VOICE ONLY
  -> BROWSER STT + OPENROUTER TTS
  -> TEXT INPUT + BROWSER TTS
  -> TEXT INPUT + TEXT OUTPUT
```

## 14.2 Error copy

### Camera denied

> Kamera tidak aktif. Anda masih dapat berdebat menggunakan suara atau ketikan.

### Mic denied

> Mikrofon belum diizinkan. Anda tetap dapat melanjutkan melalui ketikan.

### STT failed

> Suara belum berhasil diubah menjadi teks. Coba ulangi atau gunakan ketikan.

### TTS failed

> Suara AI belum dapat diputar. Respons teks tetap tersedia.

### LLM failed

> Lawan debat sedang mengalami gangguan. Coba lagi tanpa kehilangan sesi.

## 14.3 Retry policy

| Role | Retry |
|---|---:|
| STT | 1 kali |
| Opponent LLM | 1 kali dengan fallback model |
| TTS | 1 kali lalu browser TTS fallback |
| Judge | queue retry maksimal 2 kali |

---

# 15. SECURITY DAN PRIVACY MVP

Wajib:

- HTTPS pada staging/production;
- kamera dan mikrofon hanya aktif setelah user memberi izin;
- video preview lokal;
- video tidak dikirim ke AI;
- raw audio hanya dikirim ke endpoint STT server-side;
- raw audio jangan disimpan permanen pada MVP;
- transcript disimpan untuk riwayat sesi;
- recording lokal default OFF;
- tidak ada face recognition;
- tidak ada emotion recognition dari wajah;
- tidak ada diagnosis psikologis;
- tidak ada background recording;
- selalu stop seluruh `MediaStreamTrack` ketika user keluar arena;
- API route memiliki payload limit;
- rate limit route STT dan TTS;
- sanitize custom topic;
- audit cost log.

Tambahkan header:

```text
Permissions-Policy: camera=(self), microphone=(self)
```

Gunakan sebagai lapisan tambahan, bukan satu-satunya mekanisme keamanan.

---

# 16. PERFORMANCE BUDGET

## 16.1 Frontend

- lobby LCP target < 2.5 detik pada koneksi layak;
- jangan preload video besar;
- lazy-load avatar art;
- waveform ringan;
- hindari rerender besar ketika audio meter berjalan;
- gunakan requestAnimationFrame untuk visualizer;
- audio queue tidak menyebabkan UI freeze.

## 16.2 Voice

- audio mono;
- max turn 120 detik;
- compress bila perlu;
- jangan upload camera video;
- batasi paralel TTS queue;
- cancel queue ketika interupsi;
- lakukan cleanup object URLs.

---

# 17. TEST PLAN

## 17.1 Unit tests

- state machine voice;
- sentence chunker;
- filler word counter;
- WPM calculator;
- pause ratio calculator;
- TTS queue cancel;
- env validation;
- judge schema validator;
- topic refiner schema.

## 17.2 Integration tests

- mock STT success;
- mock STT failure -> text fallback;
- mock TTS success;
- mock TTS failure -> browser fallback;
- mock opponent stream;
- mock interruption;
- finalize session -> judge report.

## 17.3 Playwright tests

- text-only debate end-to-end;
- voice mode mocked media permission;
- camera denied -> voice-only;
- mic denied -> text-only;
- AI TTS failure -> text output remains visible;
- mobile responsive arena;
- custom topic -> refiner -> debate.

## 17.4 Manual device matrix

| Device | Browser | Wajib tes |
|---|---|---|
| Windows laptop | Chrome | Ya |
| Windows laptop | Firefox | Ya text fallback |
| Android phone | Chrome | Ya |
| iPhone | Safari | Bila perangkat tersedia |
| Desktop | Edge | Opsional tetapi dianjurkan |

---

# 18. SPRINT PLAN

## Sprint 0 — Repository foundation

### Deliverables

- monorepo;
- Next.js app;
- packages;
- Docker Compose;
- PostgreSQL;
- Redis;
- Caddy dev config;
- `.env.example`;
- env validation;
- lint;
- type-check;
- Vitest;
- Playwright baseline;
- README.

### Acceptance criteria

- `pnpm install` bekerja;
- `pnpm dev` bekerja;
- `docker compose up` bekerja;
- halaman health tampil;
- lint, type-check, test, build lolos.

## Sprint 1 — UI design system

### Deliverables

- tokens;
- typography;
- AppShell;
- lobby mock functional;
- ModeCard;
- TopicCard;
- mobile bottom nav;
- arena shell;
- result shell;
- reduced-motion support.

### Acceptance criteria

- tampilan sesuai Modern Civic Arena;
- responsive desktop/mobile;
- tidak terlihat seperti dashboard enterprise;
- seluruh screen memiliki loading skeleton.

## Sprint 2 — Core game text-only

### Deliverables

- topics seed;
- Duel Wacana AI;
- session engine;
- rounds;
- text composer;
- OpenRouter opponent adapter;
- streaming text;
- transcript history;
- finish session.

### Acceptance criteria

- satu debat text-only selesai end-to-end;
- AI streaming tampil;
- error retry bekerja;
- secret aman.

## Sprint 3 — AI Judge dan result screen

### Deliverables

- judge prompt;
- JSON schema;
- schema validation;
- report persistence;
- result reveal;
- score bars;
- highlight;
- recommendation;
- share preview lokal.

### Acceptance criteria

- report konsisten;
- malformed judge output ditangani;
- result tampil responsif.

## Sprint 4 — Device check dan camera preview

### Deliverables

- `/debate/device-check`;
- getUserMedia;
- mic permission;
- camera permission;
- camera dropdown;
- mic dropdown;
- camera preview;
- audio meter;
- voice-only fallback;
- text fallback;
- cleanup track.

### Acceptance criteria

- camera preview berjalan;
- kamera ditolak tidak menggagalkan sesi;
- mic ditolak beralih text-only;
- seluruh track berhenti ketika route berubah.

## Sprint 5 — OpenRouter STT

### Deliverables

- audio capture;
- MediaRecorder audio-only;
- VAD sederhana;
- silence auto-end;
- `/api/voice/transcribe`;
- OpenRouter STT adapter;
- transcript review;
- edit sebelum kirim;
- browser STT fallback opsional;
- STT usage log.

### Acceptance criteria

- user bicara bahasa Indonesia;
- transkrip muncul;
- transkrip dapat diedit;
- text-only tetap tersedia;
- biaya dan latency tercatat.

## Sprint 6 — OpenRouter TTS dan AI voice

### Deliverables

- `/api/voice/synthesize`;
- OpenRouter TTS adapter;
- voice config;
- sentence chunker;
- audio queue;
- AI speaking state;
- subtitle live;
- browser speechSynthesis fallback;
- mute;
- test voice button.

### Acceptance criteria

- AI membalas dengan suara;
- teks AI selalu terlihat;
- kegagalan TTS tidak menggagalkan sesi;
- queue bersih setelah ronde.

## Sprint 7 — Barge-in dan polish voice arena

### Deliverables

- tombol Interupsi;
- cancel audio queue;
- fade-out playback;
- mic aktif setelah interupsi;
- waveform cyan/coral;
- state transitions;
- latency status copy;
- mobile PiP camera;
- haptic optional mobile.

### Acceptance criteria

- user dapat memotong AI;
- AI audio benar-benar berhenti;
- user langsung dapat bicara;
- tidak terjadi echo loop umum.

## Sprint 8 — Delivery Signals

### Deliverables

- WPM;
- pause ratio;
- filler word count;
- answer duration;
- response latency;
- volume stability;
- interruption count;
- delivery report;
- disclaimer;
- tab result.

### Acceptance criteria

- tidak ada emotion claim;
- score semantic dan delivery terpisah;
- seluruh metric dapat dijelaskan.

## Sprint 9 — Kursi Panas AI

### Deliverables

- persona sequence;
- 3 persona;
- 5 persona;
- persona intro;
- voice per persona jika tersedia;
- mini-round;
- summary akhir.

### Acceptance criteria

- satu sesi 3 persona selesai;
- voice flow tetap stabil;
- persona terasa berbeda.

## Sprint 10 — Custom topic dan refiner

### Deliverables

- custom form;
- category;
- spice meter;
- refiner;
- safety reject;
- snapshot ke sesi.

### Acceptance criteria

- ragebait kasar diberi alternatif;
- topik sensitif dapat ditolak;
- custom topik dapat dimainkan.

## Sprint 11 — Dev panel dan stabilization

### Deliverables

- `/dev`;
- cost monitor;
- latency monitor;
- model config display;
- voice diagnostics;
- prompt playground;
- error logs;
- reset demo;
- mobile manual testing;
- documentation.

### Acceptance criteria

- 10 sesi berurutan dapat selesai;
- error diketahui dengan jelas;
- biaya per sesi terlihat;
- voice fallback teruji.

---

# 19. ACCEPTANCE CRITERIA MVP RELEASE

MVP siap dites personal / closed alpha jika:

- [ ] user dapat memilih text-only;
- [ ] user dapat memilih voice;
- [ ] user dapat memilih voice + camera;
- [ ] camera preview bekerja pada Chrome desktop dan Android Chrome;
- [ ] mic permission diproses dengan benar;
- [ ] user dapat berbicara bahasa Indonesia;
- [ ] OpenRouter STT mengubah audio menjadi teks;
- [ ] user dapat mengedit transcript;
- [ ] AI lawan menerima transcript final;
- [ ] AI lawan menjawab streaming;
- [ ] OpenRouter TTS membacakan respons AI;
- [ ] subtitle selalu terlihat;
- [ ] user dapat menginterupsi AI;
- [ ] AI audio queue berhenti setelah interupsi;
- [ ] fallback browser TTS tersedia;
- [ ] fallback text-only tersedia;
- [ ] AI Judge memberi laporan;
- [ ] Delivery Coach memberi metric terukur;
- [ ] tidak ada klaim emotion recognition;
- [ ] video tidak dikirim ke AI;
- [ ] audio tidak disimpan permanen;
- [ ] seluruh MediaStreamTrack dihentikan saat keluar;
- [ ] biaya dan latency STT, LLM, TTS tercatat;
- [ ] UI responsive;
- [ ] build production lolos;
- [ ] README jelas.

---

# 20. ROADMAP SETELAH MVP TERVERIFIKASI

Jangan dibangun sebelum data alpha cukup baik.

## Phase B — Closed alpha polish

- invite code;
- analytics retention;
- local replay opt-in;
- voice persona tuning;
- cost optimization;
- prompt tuning;
- 10–30 tester.

## Phase C — Public beta foundation

- auth;
- Kredit Arena;
- payment;
- challenge share link;
- public banner;
- moderation queue;
- rate limit lebih kuat.

## Phase D — Social game

- human vs human;
- WebRTC;
- spectator;
- clan;
- leaderboard;
- turnamen.

## Phase E — Organization event

- Arena Aspirasi;
- AI vs Republik;
- quiz;
- scoring event;
- source pack;
- human jury;
- report.

---

# 21. REFERENSI TEKNIS RESMI

Gunakan dokumentasi resmi berikut ketika implementasi:

- OpenRouter Chat Completion API: `https://openrouter.ai/docs/api/api-reference/chat/send-chat-completion-request`
- OpenRouter Streaming: `https://openrouter.ai/docs/api/reference/streaming`
- OpenRouter STT: `https://openrouter.ai/docs/api/api-reference/transcriptions/create-audio-transcriptions`
- OpenRouter TTS: `https://openrouter.ai/docs/api/api-reference/speech/create-audio-speech`
- OpenRouter multimodal audio overview: `https://openrouter.ai/docs/guides/overview/multimodal/audio`
- MDN getUserMedia: `https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia`
- MDN MediaRecorder: `https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder`
- MDN SpeechRecognition: `https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition`
- MDN SpeechSynthesis: `https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis`
- MDN AnalyserNode: `https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode`
- MDN AudioWorklet: `https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet`

---

# 22. INSTRUKSI EKSEKUSI PERTAMA UNTUK CODEX

Gunakan instruksi ini setelah file diunggah ke repository:

```text
Baca REPUBLIK_ARGUMEN_MVP_VOICE_ARENA_BLUEPRINT.md secara menyeluruh.
Perlakukan dokumen tersebut sebagai source of truth fase MVP aktif.

Mulai hanya dari Sprint 0.
Jangan mengerjakan Sprint 1 sebelum seluruh acceptance criteria Sprint 0 lolos.
Jangan membangun fitur di luar scope.

Setelah Sprint 0 selesai:
1. tulis daftar file yang dibuat atau diubah;
2. jelaskan struktur repository;
3. tulis command yang dijalankan;
4. lampirkan hasil lint, type-check, test, dan production build;
5. jelaskan masalah yang ditemukan;
6. tulis langkah berikutnya sesuai blueprint;
7. update README.md, CHANGELOG.md, dan docs/progress/SPRINT_0_REPORT.md.

Pastikan repository tetap runnable.
```

---

# 23. RINGKASAN KEPUTUSAN PRODUK

MVP ini fokus pada satu diferensiasi yang kuat:

# **Debat AI voice-to-voice yang terasa nyata, didukung kamera opsional, coaching argumen, dan Delivery Signals yang jujur.**

Prioritas:

1. pengalaman bicara yang mulus;
2. AI menjawab dengan suara;
3. user dapat menginterupsi;
4. UI premium dan dramatis;
5. fallback kuat;
6. biaya dan latency terukur;
7. arsitektur siap berkembang;
8. tidak terburu-buru membangun fitur komersial penuh.
