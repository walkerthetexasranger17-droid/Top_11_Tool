# Top Eleven Tool — v0.6.6 Design Recovery Handoff

**Status:** UNPUBLISHED DESIGN PASS 6  
**UI/runtime version:** v0.6.6  
**Decision/calibration contract:** v0.5.17 frozen  
**Scoring/model fingerprint:** companion-strategy-v2-own-squad-runtime-v0515 — unchanged

## Locked workflow
Every approved page is completed as one unit: audit/reuse assets → create missing responsive production assets → build real HTML/CSS/JS against existing data/logic → verify responsive layout → regressions → embedded handoff → full verified ZIP. Mobile uses the same design with bottom navigation.

## Completed redesign units
Home/auth, Squad, Player Profile, Training, Team Plan, and now Drills / My Drills.

## v0.6.6 Drills implementation
- Reuses existing `assets/scenes/team-training.webp` as the source artwork and existing `assets/drills/*.webp` for real drill imagery.
- Adds `assets/v060/scenes/drills-hero-desktop.webp` and `drills-hero-mobile.webp`.
- Preserves the approved Drills reference at `docs/design/reference/v060/approved-drills-desktop.webp`.
- Normal drill setup is now a dense professional library while retaining every real unlocked toggle and saved level control.
- Adds UI-only search and category filtering; this does not alter training scoring or drill data.
- Master card stock remains editable using the real current Master inventory model.
- Live summary counts show total normal drills, saved/unlocked drill levels and Master card stock.
- Existing training optimiser reads the same saved drill profile as before.

## Critical non-changes
No training scoring/selection, Formation, Tactics, Set Pieces, Mentors, scanner recognition, SA eligibility or canonical decision data changed.

## Next complete page unit
Settings + Account/Security. Reuse the existing settings scene and current auth/cloud state. Do not invent subscription or paid-plan data.
