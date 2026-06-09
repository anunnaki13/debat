# R0 Environment Inventory

Tanggal: 2026-06-10

## Prinsip Audit

- Tidak ada secret dicetak.
- Nilai `.env.local` hanya dicatat sebagai `<set>` atau `<empty>`.
- Recovery blueprint meminta OpenRouter key tidak tampil di UI production dan tidak disimpan di browser.

## OpenRouter Variables Dari `.env.example`

| Variable | Purpose | Default State |
|---|---|---|
| `OPENROUTER_API_KEY` | Shared fallback key | empty |
| `OPENROUTER_SHARED_API_KEY` | Shared key alternatif | empty |
| `OPENROUTER_OPPONENT_API_KEY` | Role-specific opponent key | empty |
| `OPENROUTER_JUDGE_API_KEY` | Role-specific judge key | empty |
| `OPENROUTER_OPPONENT_MODEL` | Server opponent model | empty |
| `OPENROUTER_JUDGE_MODEL` | Server judge model | empty |
| `OPENROUTER_SITE_URL` | OpenRouter referer metadata | set/default |
| `OPENROUTER_APP_NAME` | OpenRouter title metadata | set/default |
| `OPENROUTER_APP_URL` | App URL metadata | set/default |
| `OPENROUTER_STT_API_KEY` | STT key | empty |
| `OPENROUTER_STT_MODEL` | STT model | set/default |
| `OPENROUTER_STT_LANGUAGE` | STT language | set/default |
| `OPENROUTER_TTS_API_KEY` | TTS key | empty |
| `OPENROUTER_TTS_MODEL` | TTS model | empty |
| `OPENROUTER_TTS_VOICE` | TTS voice | set/default |
| `OPENROUTER_TTS_FORMAT` | TTS format | set/default |
| `OPENROUTER_TTS_SPEED` | TTS speed | set/default |

## Voice And Camera Variables

| Variable | Purpose | Default State |
|---|---|---|
| `VOICE_ENABLE` | Feature flag voice | set/default |
| `VOICE_CAMERA_ENABLE` | Feature flag voice+camera | set/default |
| `VOICE_TTS_ENABLE` | Feature flag TTS | set/default |
| `VOICE_BROWSER_TTS_FALLBACK` | Browser TTS fallback | set/default |
| `VOICE_BROWSER_STT_FALLBACK` | Browser STT fallback | set/default |
| `VOICE_AUTO_END_SILENCE_MS` | Silence tuning | set/default |
| `VOICE_MIN_SPEECH_MS` | Minimum speech duration | set/default |
| `VOICE_MAX_TURN_SECONDS` | Max voice turn | set/default |
| `VOICE_AUDIO_FORMAT` | Audio format | set/default |
| `VOICE_BARGE_IN_BUTTON` | Interruption button | set/default |
| `VOICE_AUTO_BARGE_IN` | Auto barge-in flag | set/default |
| `VOICE_TRANSCRIPT_REVIEW_SECONDS` | Transcript review tuning | set/default |
| `CAMERA_DEFAULT_ENABLE` | Camera default | set/default |
| `CAMERA_LOCAL_REPLAY_ENABLE` | Local replay flag | set/default |
| `CAMERA_CLOUD_UPLOAD_ENABLE` | Cloud upload flag | set/default |
| `CAMERA_WIDTH` | Camera width | set/default |
| `CAMERA_HEIGHT` | Camera height | set/default |
| `CAMERA_FRAME_RATE` | Camera frame rate | set/default |

## Feature Flags Dari `.env.example`

| Variable | Default State | Recovery Note |
|---|---|---|
| `ENABLE_DUEL_WACANA_AI` | set/default | Active MVP mode |
| `ENABLE_KURSI_PANAS_AI` | set/default | UI/flow belum penuh |
| `ENABLE_CUSTOM_TOPIC` | set/default | Custom topic sudah ada |
| `ENABLE_TOPIC_REFINER` | set/default | AI refiner belum ada |
| `ENABLE_VOICE_ARENA` | set/default | Voice arena partially implemented |
| `ENABLE_VOICE_CAMERA` | set/default | Camera preview implemented |
| `ENABLE_DELIVERY_SIGNALS` | set/default | Implemented technical signals |
| `ENABLE_LOCAL_REPLAY` | set/default | Not active in MVP user flow |
| `ENABLE_PUBLIC_CHALLENGE` | set/default | Should stay off |
| `ENABLE_PAYMENT` | set/default | Should stay off |
| `ENABLE_MULTIPLAYER` | set/default | Should stay off |

## Browser-Exposed Variables

| Variable | Recovery Note |
|---|---|
| `NEXT_PUBLIC_APP_NAME` | Safe if it only contains public app name |
| `NEXT_PUBLIC_ENABLE_VOICE_INPUT` | Public feature flag |
| `NEXT_PUBLIC_ENABLE_VOICE_OUTPUT` | Public feature flag |

No `NEXT_PUBLIC_OPENROUTER_*` variable is present in `.env.example`.

## `.env.local` Status At Audit Time

OpenRouter key variables in `.env.local` are present but empty:

- `OPENROUTER_API_KEY`
- `OPENROUTER_OPPONENT_API_KEY`
- `OPENROUTER_JUDGE_API_KEY`
- `OPENROUTER_OPPONENT_MODEL`
- `OPENROUTER_JUDGE_MODEL`

This means manual real-key OpenRouter validation could not be completed from terminal during R0.

## Security Observations

- Server-side OpenRouter env structure exists.
- User-facing UI still accepts and stores OpenRouter key in browser preferences.
- Recovery blueprint considers this unacceptable for production.
- R6 should remove API key/model controls from production user UI and move diagnostics/config to `/dev/ai-config`.
