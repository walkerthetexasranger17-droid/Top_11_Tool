# Top Eleven Tool — v0.6.24 Recovery Handoff

## Fixed pass scope
Mobile app Home + Squad visual cleanup and branding only. No desktop design work. No football/scanner/training/decision logic changes.

## User-approved changes implemented
- New master app logo: `assets/v0624/branding/top-eleven-tool-logo.png`.
  - Exact approved tactics-board / clipboard logo.
  - Transparent PNG with alpha.
  - SHA-256 `1c48ed011a46583d039445cca5554045a8640d56fabe69d063be2f7e0407b23a`.
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
User should inspect Home + Squad on the real phone. Do not continue to the next page/theme stage until the user gives feedback on this v0.6.24 visual state.
