# Top Eleven Tool — v0.6.27 Recovery Handoff

## Fixed pass scope
Mobile-first visual refinement only: unified typography, branded page-title language, Home hero/header alignment, Squad summary removal and vertical compaction. No football/scanner/training/decision logic changes.

## Implemented in v0.6.27
- Preserved the corrected official tactics-board logo introduced in v0.6.25.
- Kept the CSS-rendered high-definition `TOP ELEVEN TOOL` wordmark from v0.6.26 and refined it:
  - final `N` in `ELEVEN` gets extra breathing room so it cannot clip;
  - `TOOL` is centred beneath `TOP ELEVEN`;
  - `v0.6.27` is centred directly below `TOOL`.
- Moved the Home hero brand block from the centre to the **upper-left** of the page so it reads as page branding and no longer sits over the player's face.
- Home remains slogan-free. It keeps the functional `HOME` pill and `Today at a glance` bar.
- Introduced a reusable branded page-title system based on the approved logo language: metallic/white primary line, lime accent line and cyan/lime underline treatment.
- Applied that functional title language to Squad, Player Scanner, Training Builder, Drill Library, Team Plan, Manager Profile and App Settings. Player Profile remains excluded because its full redesign is still reserved separately.
- Unified normal app letters and numbers around the same condensed `Barlow Condensed` type family. Existing emoji/flag rendering keeps its dedicated fallback where needed.
- Removed the five redundant Squad summary boxes entirely:
  - Total Players
  - Average OVR
  - Highest OVR
  - Position Balance
  - Needs Attention
- Pulled Add Player / Update Players and the Squad Players roster upward so the management actions lead directly into the roster.
- Preserved the v0.6.26 subtle background tone layer; no new background images were introduced in this pass.
- Runtime/cache markers bumped to v0.6.27 / `0627`; service-worker cache is `te-v0-6-27-type-title-squad-cleanup`.

## Preserved
- Home and Squad approved portrait background composition/crops.
- Home `Today at a glance` bar and compact workspace below it.
- Squad compact player rows, role artwork, nationality flags, position badges, Playstyle and Special Ability imagery.
- Squad Role Order: `GK → DL → DC → DR → DMC → ML → MC → MR → AML → AMC → AMR → ST`.
- Corrected logo master: `assets/v0624/branding/top-eleven-tool-logo.png`.
- Approved portrait reference pack: `assets/v0624/reference-backgrounds/`.
- Decision/calibration baseline v0.5.17.
- Scanner VERSION=12.

## Locked visual rules
- Mobile app first.
- No motivational slogans.
- Home branding sits upper-left; do not recentre it unless explicitly requested.
- Header wordmark sub-lines (`TOOL` and version) stay centred beneath the main wordmark.
- Main page titles use the branded title language, but remain concise and functional.
- Use the unified condensed typography system for normal UI letters/numbers rather than mixing body fonts.
- Background photography remains visible but slightly toned for readability.
- Squad summary cards are retired; do not restore them unless requested.

## Next step
User tests v0.6.27 on the real phone. After acceptance, continue the remaining page-fidelity work using the already-approved portrait assets and this typography/title system. Player Profile remains a separate future redesign.
