# Arena Asset Pack

Generated for the uploaded visual references:

- `docs/design-reference/mockup-arena-overview.png`
- `docs/design-reference/mockup-product-system.png`

Assets:

- `logo-mark.svg` — hex civic/game logo mark.
- `rank-orator-badge.svg` — premium/rank badge.
- `user-orator-avatar.svg` — user podium avatar placeholder.
- `ai-opponent-avatar.svg` — AI opponent avatar placeholder.
- `arena-backdrop.svg` — wide dark neon arena background.
- `mode-duel-ai.svg` — mode card art.
- `mode-kursi-panas.svg` — mode card art.
- `mode-majelis-publik.svg` — mode card art.
- `mode-satu-lawan-tribun.svg` — mode card art.

These are SVG assets so they stay sharp, lightweight, and easy to recolor or layer in CSS.

Animation hooks:

- `src/styles/motion.css`
  - `ra-neon-border-flow`
  - `ra-wave-dance`
  - `ra-orbit-spin`
  - `ra-scanline`
  - `ra-particle-rise`
  - `ra-card-float`
  - `ra-energy-sweep`
- `src/components/arena/ArenaEffects.tsx`
  - `NeonFrame`
  - `ArenaParticleField`
  - `AnimatedAvatarRing`
  - `AnimatedWaveform`
  - `EnergyDivider`
