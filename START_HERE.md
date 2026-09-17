# v0.6.21 — START HERE

**CURRENT UI BRANCH:** v0.6.21 — Squad Hero Reliability Hotfix.  
**FROZEN DECISION CONTRACT:** v0.5.17.  
**SCANNER CALIBRATION:** VERSION=12; nationality is an isolated optional metadata extension.

Read `DESIGN_RECOVERY_HANDOFF_v0.6.21.md` first, then `V0621_SQUAD_HERO_HOTFIX_VALIDATION.md`.

## Current Squad contract
- cinematic Squad header with real responsive image asset;
- no Squad filter box;
- Role Order: `GK → DL → DC → DR → DMC → ML → MC → MR → AML → AMC → AMR → ST`;
- compact mobile rows with new role artwork, nationality flag, glossy position badge, authoritative Playstyle image, authoritative Special Ability images, OVR and chevron;
- no stars and no Playstyle/SA text labels on mobile;
- mobile/tablet app header remains visible;
- bottom navigation exposes Home, Squad, Training, Team Plan, Drills and Settings directly.

Do not change frozen football/scanner/training calibration logic unless explicitly requested. Every development pass must reserve time for regression tests, embedded handoff update, full ZIP creation and fresh ZIP verification.
