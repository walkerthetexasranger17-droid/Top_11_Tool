# v0.6.27 — START HERE

**CURRENT UI BRANCH:** v0.6.27 — Unified typography, branded page titles, Home alignment and Squad cleanup.  
**FROZEN DECISION CONTRACT:** v0.5.17.  
**SCANNER CALIBRATION:** VERSION=12; nationality remains an isolated optional metadata extension.

Read `DESIGN_RECOVERY_HANDOFF_v0.6.27.md` first, then `V0627_TYPOGRAPHY_SQUAD_CLEANUP_VALIDATION.md`.

## Current visual contract
- Mobile phone is the product priority; desktop only needs to remain functional for development/testing.
- The corrected tactics-board logo remains the official app icon/branding master: `assets/v0624/branding/top-eleven-tool-logo.png`.
- Header wordmark is CSS-rendered for high-density sharpness. `TOOL` is centred beneath `TOP ELEVEN`, and the version is centred beneath `TOOL`.
- Home hero branding is anchored in the upper-left rather than centred over the player.
- Home keeps the `Today at a glance` summary bar; the old duplicate four-stat row remains removed.
- Main functional page titles use the branded white/lime TOP ELEVEN TOOL visual language instead of motivational copy.
- The app-wide letter/number system uses the same condensed branded type family consistently for normal UI text, labels, buttons and statistics.
- Squad has no five-card summary block. Add Player / Update Players sit directly above the roster so the page is pulled upward.
- Approved portrait background references remain embedded at `assets/v0624/reference-backgrounds/` and keep the v0.6.26 subtle photographic tone.
- Squad Role Order remains `GK → DL → DC → DR → DMC → ML → MC → MR → AML → AMC → AMR → ST`.

Do not change frozen football/scanner/training calibration logic unless explicitly requested. Every development pass ends with regression checks, handoff update, full ZIP creation, fresh extraction and verification.
