# Top Eleven Tool — v0.6.28 Recovery Handoff

## Fixed pass scope
Replace the fragile CSS/text-rendered header logos with the user-approved image assets, normalise the page-header canvases, wire them into the correct pages, and preserve the existing mobile-first layout and frozen game logic.

## Implemented in v0.6.28
- Replaced the CSS-rendered global `TOP ELEVEN TOOL` wordmark with the approved wide image asset.
- Kept the live build number centred beneath the top-bar logo.
- Replaced page-title text with approved image headers on:
  - Home
  - Squad Management
  - Training
  - Team Plan
  - Drills
  - Settings
  - Add Player
  - Manager Profile
- Normalised every page-header image to **1774×887 (2:1)** with transparent background and preserved aspect ratio.
- Added a single reusable image-header CSS contract so the pages use consistent sizing/positioning rather than independent text styling.
- Home header remains upper-left.
- Squad summary cards remain removed and Add Player / Update Players remain directly above the roster.
- Existing v0.6.26 photographic tint remains in place.
- Player Profile remains intentionally excluded because its full page redesign is still pending.

## Approved header asset map
- `assets/v0628/headers/topbar.webp` — SHA-256 `f37d1d293ec840b4c0d006a75168a24277478855ae8359a28463ad2f42d8ae77`
- `assets/v0628/headers/home.webp` — SHA-256 `ebe43c07f578fdeaf196a2be550b751458d26d19530ecb142da5e34ec98ea96f`
- `assets/v0628/headers/squad.webp` — SHA-256 `3dedc639892d87b3bffb6675669c25a91e6a0d153b227d8d3c7335a07937cd67`
- `assets/v0628/headers/training.webp` — SHA-256 `288eb31634a684205efdb45eade037fc3260435950c25938cce7fff7cbd02b38`
- `assets/v0628/headers/team-plan.webp` — SHA-256 `b879aeddba5c82c2125ea643656636294f0e69d7bfa9c173105b48379e396215`
- `assets/v0628/headers/drills.webp` — SHA-256 `89c8f28a4d5bc8398641ac3df88ef9a05c4df86332051792fc6e6b589d335bd5`
- `assets/v0628/headers/settings.webp` — SHA-256 `7818c0c06bb837ef1cdee6830fcc2002908d904b4c2c5ebd735d9d1626e547cb`
- `assets/v0628/headers/add-player.webp` — SHA-256 `5f6fe3e0a4d07c30d7d3966cf57985b5ee18d79011b742414e2e3c2864119b68`
- `assets/v0628/headers/manager-profile.webp` — SHA-256 `4de0524e1464e77627f9884f24edb5d47a55bf4aed53d465a5f3bb0c672d1d42`

## Frozen boundaries
- Decision/calibration baseline: v0.5.17.
- Scanner: VERSION=12.
- No changes to formation, tactics, mentors, Team Plan decision logic, Best-in-Slot, training algorithms, scanner recognition, cloud data model, or player data.

## Next step
Test v0.6.28 on the real phone and confirm the image headers render cleanly over the approved backgrounds. Once accepted, continue the remaining page-fidelity sequence. Player Profile remains a separate redesign.
