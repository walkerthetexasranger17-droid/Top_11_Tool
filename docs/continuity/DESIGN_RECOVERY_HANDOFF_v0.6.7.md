# Top Eleven Tool — v0.6.7 Design Recovery Handoff

**Status:** UNPUBLISHED DESIGN PASS 7  
**UI/runtime version:** v0.6.7  
**Decision/calibration contract:** v0.5.17 frozen  
**Scoring/model fingerprint:** companion-strategy-v2-own-squad-runtime-v0515 — unchanged

## Locked page workflow
Approved mockup → existing asset audit → missing responsive production assets → real page code/data wiring → responsive verification → regressions → embedded handoff → verified full ZIP. Mobile uses the same design with bottom navigation.

## Completed redesign units
Home/auth, Squad, Player Profile, Training, Team Plan, Drills, Settings and Account/Security.

## v0.6.7 Settings / Account implementation
- Reuses existing `assets/scenes/settings.webp` as the source artwork.
- Adds responsive `settings-hero-desktop.webp` and `settings-hero-mobile.webp`.
- Preserves the selected Settings reference at `docs/design/reference/v060/approved-settings-desktop.webp`.
- Settings now presents the real account, cloud-sync, scanner and version controls as a clean dashboard; no fake subscription, theme or notification settings were invented.
- Scanner key save/test/clear and scanner status remain the existing real controls. Long scanner implementation detail is collapsed into an optional technical-details disclosure rather than dominating the page.
- Cloud local-first status, Profile & Security link and clear-cloud-data control remain real and wired.
- Account/Security is restyled into the same responsive system while preserving display name, linked Google provider, fresh-auth security requirement, email/password changes and authenticator-app TOTP enrolment.

## Critical non-changes
No cloud/auth behavior, scanner recognition, training/formation/tactic/mentor/set-piece scoring or canonical decision data changed.

## Next complete page unit
Add Player / Scanner. Reuse the verified playstyle/SA reference assets and existing add-player scene before creating any new artwork.
