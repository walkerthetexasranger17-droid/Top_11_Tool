# Top Eleven Tool — v0.6.5 Design Recovery Handoff

**Status:** UNPUBLISHED DESIGN PASS 5  
**UI/runtime version:** v0.6.5  
**Decision/calibration contract:** v0.5.17 frozen  
**Scoring/model fingerprint:** companion-strategy-v2-own-squad-runtime-v0515 — unchanged

## Workflow
Each approved page is a complete implementation unit: audit/reuse existing assets, create only missing production assets, build the real page against live app data/logic, verify responsive behaviour, run regressions, update this handoff, and create/extract/verify the full ZIP. Mobile keeps the same design with bottom navigation.

## Completed redesign units
- v0.6.1 shell/auth/Home
- v0.6.2 Squad
- v0.6.3 Player Profile
- v0.6.4 Training
- v0.6.5 Team Plan

## v0.6.5 Team Plan implementation
- Reuses the existing `assets/scenes/tactics.webp` as the source artwork.
- Adds responsive production header assets:
  - `assets/v060/scenes/team-plan-header-desktop.webp`
  - `assets/v060/scenes/team-plan-header-mobile.webp`
- Uses the already-packaged approved Team Plan reference at `docs/design/reference/v060/approved-team-plan-desktop.webp`.
- Keeps the real Formation, Set Pieces and Tactics tab logic and simply presents the formation tab as **Lineup**.
- Formation is now the main large pitch workspace with Build Best Match Plan, squad coverage and Best-in-Slot arranged as a professional desktop workspace and stacked responsively on mobile.
- Set Pieces keeps the actual selected-XI assignments and coverage logic.
- Tactics keeps the real Tactic Calculator, phase instructions and condition/drain presentation.
- Mentor UI reuses the authoritative game-extracted portraits in `assets/mentors/`; no generated mentor portraits are used. `jonas-brown.png` remains a legacy filename only and displays as Jonas Braun through the existing data.

## Critical non-changes
No Formation/Tactics/Set Piece/Mentor scoring logic, training logic, scanner recognition or canonical decision data is changed in this design pass. v0.5.17 decision logic and v0.5.15 scoring fingerprint remain frozen.

## Next complete page unit
Drills / My Drills. Audit and reuse the existing drill art first; create only missing page-level assets.
