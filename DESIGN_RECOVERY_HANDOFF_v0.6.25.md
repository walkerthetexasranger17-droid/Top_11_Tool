# Top Eleven Tool — v0.6.25 Recovery Handoff

## Fixed pass scope
Mobile app Home + Squad visual cleanup and branding only. No desktop design work. No football/scanner/training/decision logic changes.

## User-approved changes implemented
- New master app logo: `assets/v0624/branding/top-eleven-tool-logo.png`.
  - Exact approved tactics-board / clipboard logo.
  - Transparent PNG with alpha.
  - SHA-256 `8b09477d11447c9577e99e251c1139e9afc68660d0f6a0b7c913473d9fd1e536`.
  - Derived `icon-192.png` and `icon-512.png` now use this branding.
- Home hero has **no title, slogan, eyebrow or marketing copy**. The approved Home background is the hero.
- Squad hero contains only the functional page title **SQUAD MANAGEMENT** (white + lime) plus the existing Add Player / Update Players actions.
- Removed all motivational copy from these two heroes, including “Your squad / your plan / your next win”, “A stronger tomorrow”, “Same Game / Smarter Managers” and “Analyse / Improve / Win”.
- The existing Training, Drills, Team Plan, Scanner, Settings, Manager Profile and Player Profile hero slogans/mantras were also stripped back so the current build follows the same no-motivational-copy rule across all pages; their larger visual/background redesigns remain future passes.
- Removed the dark haze/scrim layers over the approved Home and Squad backgrounds.
- Removed the visible hero divider/seam/border so the fixed background and scrolling page transition are continuous.
- Reduced phone portrait hero spacer from 390px to 250px and foreground overlap to -14px. At the 390×844 reference viewport the first stat row begins at y=302px on both Home and Squad.
- Approved v0.6.23 portrait backgrounds remain unchanged and continue to fill the usable viewport under the app header while remaining anchored behind scrolling content.

## Visual policy now locked
- App/mobile is the design target; do not spend passes polishing desktop unless required for functionality.
- Home requires no page-title overlay.
- Other page heroes should use only a concise functional page title. No motivational slogans, philosophy lines, faux marketing copy or decorative manifesto text.
- Background imagery should remain clearly visible. Use local text shadow/contrast only where needed rather than darkening the whole image.
- No coloured seam/divider between hero art and page content.

## Frozen boundaries
Decision/calibration remains v0.5.17. Scanner remains VERSION=12. Training, formation, tactics, mentors, Team Plan, Best-in-Slot, cloud data model, player scanner recognition and nationality logic were not changed in this pass.

## Next step
User should inspect Home + Squad plus the corrected logo/icon branding on the real phone. Do not continue to the next page/theme stage until the user gives feedback on this v0.6.25 visual state.

## Approved reference asset preservation
The complete approved portrait-background set is now embedded in the package under `assets/v0624/reference-backgrounds/` so a new chat does not depend on conversation history to recover the selected art:
- Home: `home-approved.png`
- Squad: `squad-approved.png`
- Training: `training-approved.png`
- Team Plan: `team-plan-approved.png`
- Drills: `drills-approved.png`
- Scanner/Add Player: `scanner-add-player-approved.png`
- Settings: `settings-approved.png`
- Manager/Account: `manager-account-approved.png`

The new approved tactics-board logo is embedded at `assets/v0624/branding/top-eleven-tool-logo.png` and is the branding master going forward. Old cone branding is retired.

Player Profile remains intentionally excluded from this background set because its entire page is due a separate concept/redesign.

## v0.6.25 delta
This pass is a focused branding asset correction only.

- Replaced the faulty transparent master logo with the corrected approved tactics-board logo.
- Regenerated `icon-192.png` and `icon-512.png` from the corrected master.
- Preserved all Home/Squad mobile hero work and all frozen v0.5.17 decision/scanner logic.
- Fixed the visible Settings design-branch version card to show `v0.6.25` instead of the stale `v0.6.19` label.

## Corrected branding asset hashes
- `assets/v0624/branding/top-eleven-tool-logo.png` — `8b09477d11447c9577e99e251c1139e9afc68660d0f6a0b7c913473d9fd1e536`
- `icon-192.png` — `48fd43ec1aba1cf1666d57e07585be5dccae0183d21091ccf5557c2a0358c863`
- `icon-512.png` — `3ae9eb8f2d8d3a6ecc21dbe279c40468a43ecf1000662899898fa5594a07d043`

