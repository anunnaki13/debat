# Arena Asset Pack

Generated for the uploaded visual references:

- `docs/design-reference/mockup-arena-overview.png`
- `docs/design-reference/mockup-product-system.png`

Assets:

- `logo-mark.svg` — neon esports shield mark.
- `rank-orator-badge.svg` — gold esports rank badge.
- `user-orator-avatar.svg` — cyan player helmet HUD avatar.
- `ai-opponent-avatar.svg` — magenta AI mech helmet HUD avatar.
- `arena-backdrop.svg` — wide neon esports arena background.
- `hero-duel-scene.svg` — high-tech esports stage with competitor pods.
- `mode-duel-ai.svg` — duel mode stage/pod art.
- `mode-kursi-panas.svg` — hot-seat arena throne art.
- `mode-majelis-publik.svg` — futuristic council arena art.
- `mode-satu-lawan-tribun.svg` — solo podium versus audience wall art.
- `mode-boss-battle.svg` — boss AI helmet projection art.
- `challenge-ai-jobs.svg` — cyan broadcast/data challenge art.
- `challenge-remote-work.svg` — green tactical challenge art.
- `challenge-cashless.svg` — gold scoreboard challenge art.
- `challenge-public-transport.svg` — violet route-map challenge art.

These are SVG assets so they stay sharp, lightweight, and easy to recolor or layer in CSS. The current direction is esports arena / high-tech HUD: helmet silhouettes, stage geometry, neon cyan-magenta glow, and broadcast panels instead of character illustration.

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
