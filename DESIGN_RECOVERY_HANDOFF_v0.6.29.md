# Top Eleven Tool — v0.6.29 Recovery Handoff

## Baseline
v0.6.29 is the current UI baseline. It is a focused header-art hotfix on top of v0.6.28. The frozen football/decision contract remains v0.5.17 and scanner calibration remains VERSION=12.

## Corrected in v0.6.29
- Fixed the v0.6.28 extension mismatch where HTML referenced header `.png` files even though the packaged approved assets were transparent `.webp`.
- Moved the complete header pack to a fresh cache-busted namespace: `assets/v0629/headers/`.
- Home now uses the approved stacked TOP / ELEVEN / TOOL artwork in the upper-left.
- The global top bar still uses the separate approved wide TOP ELEVEN TOOL wordmark.
- Every converted page header is explicitly transparent WebP and topbar/Home are install-precached while the other fresh v0.6.29 header paths runtime-cache on first use.
- No game logic, scanner, formation, tactics, mentors, training, Team Plan or Best-in-Slot logic changed.

## Header mapping
- topbar.webp — global top bar only
- home.webp — Home hero only; stacked TOP / ELEVEN / TOOL
- squad.webp — Squad Management
- training.webp — Training
- team-plan.webp — Team Plan
- drills.webp — Drills
- settings.webp — Settings
- add-player.webp — Add Player
- manager-profile.webp — Manager Profile

Player Profile remains excluded pending its separate redesign.

## Asset hashes
- `add-player.webp` — `5f6fe3e0a4d07c30d7d3966cf57985b5ee18d79011b742414e2e3c2864119b68`
- `drills.webp` — `89c8f28a4d5bc8398641ac3df88ef9a05c4df86332051792fc6e6b589d335bd5`
- `home.webp` — `36ab4926f96f2d2196494f20c281c73aee989e1586d5981e3e988736eb358846`
- `manager-profile.webp` — `4de0524e1464e77627f9884f24edb5d47a55bf4aed53d465a5f3bb0c672d1d42`
- `settings.webp` — `7818c0c06bb837ef1cdee6830fcc2002908d904b4c2c5ebd735d9d1626e547cb`
- `squad.webp` — `3dedc639892d87b3bffb6675669c25a91e6a0d153b227d8d3c7335a07937cd67`
- `team-plan.webp` — `b879aeddba5c82c2125ea643656636294f0e69d7bfa9c173105b48379e396215`
- `topbar.webp` — `9eb390e902a97643e44461a5fedfa30e896407df14dc30ba4ba892e7500a32a5`
- `training.webp` — `288eb31634a684205efdb45eade037fc3260435950c25938cce7fff7cbd02b38`

## Next step
Test v0.6.29 on the real phone. Confirm there are no black header rectangles and Home shows the stacked logo in the upper-left.
