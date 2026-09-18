# v0.6.28 — START HERE

**CURRENT UI BRANCH:** v0.6.28 — Approved image-based header branding.  
**FROZEN DECISION CONTRACT:** v0.5.17.  
**SCANNER CALIBRATION:** VERSION=12; nationality remains an isolated optional metadata extension.

Read `DESIGN_RECOVERY_HANDOFF_v0.6.28.md` first, then `V0628_APPROVED_HEADER_ART_VALIDATION.md`.

## Current visual contract
- Mobile phone is the product priority; desktop only needs to remain functional for development/testing.
- The official tactics-board app icon remains unchanged.
- Header/page-title text is no longer recreated in CSS for the converted pages. Use the approved raster artwork in `assets/v0628/headers/`.
- Global top bar uses `topbar.webp`; the version remains centred below it as live HTML text.
- Home uses `home.webp` in the upper-left of the hero.
- Squad uses `squad.webp`; Training uses `training.webp`; Team Plan uses `team-plan.webp`; Drills uses `drills.webp`; Settings uses `settings.webp`; Add Player uses `add-player.webp`; Manager Profile uses `manager-profile.webp`.
- All page-header artwork is normalised to an exact 1774×887 (2:1) transparent canvas so CSS can size every page consistently without distorting the artwork.
- Approved background imagery/tinting and v0.6.27 Squad cleanup remain unchanged.
- Player Profile remains excluded from this header-art conversion pending its separate redesign.
- Squad Role Order remains `GK → DL → DC → DR → DMC → ML → MC → MR → AML → AMC → AMR → ST`.

Do not change frozen football/scanner/training calibration logic unless explicitly requested. Every development pass ends with regression checks, handoff update, full ZIP creation, fresh extraction and verification.
