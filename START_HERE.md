# v0.6.23 — START HERE

**CURRENT UI BRANCH:** v0.6.23 — Approved Home + Squad Full-Screen Backgrounds.  
**FROZEN DECISION CONTRACT:** v0.5.17.  
**SCANNER CALIBRATION:** VERSION=12; nationality remains an isolated optional metadata extension.

Read `DESIGN_RECOVERY_HANDOFF_v0.6.23.md` first, then `V0623_HOME_SQUAD_BACKGROUND_VALIDATION.md`.

## Current visual contract
- Mobile phone is the product priority; desktop must remain functional but is not the design target.
- Home and Squad use the exact hand-picked v0.6.23 portrait backgrounds under `assets/v0623/backgrounds/`.
- On phone/tablet the artwork fills the whole usable viewport and stays anchored while content scrolls over it.
- Home and Squad use one shared mobile hero-stage rhythm so their first stat rows line up vertically.
- Do not use `background-attachment: fixed`.
- Squad has no filter box.
- Squad Role Order: `GK → DL → DC → DR → DMC → ML → MC → MR → AML → AMC → AMR → ST`.
- DML and DMR are not current game roles and are excluded from Role Order.
- Mobile Squad rows keep role artwork, nationality flag, small inline position badge after role/age, Playstyle image, Special Ability image(s), OVR and chevron.
- Bottom navigation exposes Home, Squad, Training, Team Plan, Drills and Settings directly.

Do not change frozen football/scanner/training calibration logic unless explicitly requested. Every development pass ends with regression checks, handoff update, full ZIP creation, fresh extraction and verification.
