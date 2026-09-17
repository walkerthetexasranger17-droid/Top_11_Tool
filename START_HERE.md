# v0.6.22 — START HERE

**CURRENT UI BRANCH:** v0.6.22 — Home + Squad Anchored Hero Scroll.  
**FROZEN DECISION CONTRACT:** v0.5.17.  
**SCANNER CALIBRATION:** VERSION=12; nationality remains an isolated optional metadata extension.

Read `DESIGN_RECOVERY_HANDOFF_v0.6.22.md` first, then `V0622_FIXED_HERO_SCROLL_VALIDATION.md`.

## Current visual contract
- Mobile/tablet is the product priority; desktop only needs to remain functional.
- Home and Squad use their existing approved real hero artwork; no generated replacement assets.
- On phone/tablet, Home and Squad hero artwork stays visually anchored beneath the sticky header while page content scrolls over it.
- Do not implement this with `background-attachment: fixed`; use the existing DOM picture media layer.
- Home keeps the overlapping stat-card treatment.
- Squad uses the same depth treatment with its stats/roster foreground overlapping the lower hero.
- Squad has no filter box.
- Squad Role Order: `GK → DL → DC → DR → DMC → ML → MC → MR → AML → AMC → AMR → ST`.
- Compact Squad rows retain role artwork, nationality flag, position badge, Playstyle image, Special Ability image(s), OVR and chevron.
- Bottom navigation exposes Home, Squad, Training, Team Plan, Drills and Settings directly.

Do not change frozen football/scanner/training calibration logic unless explicitly requested. Every development pass must reserve time for regression tests, embedded handoff update, full ZIP creation and fresh ZIP verification.
