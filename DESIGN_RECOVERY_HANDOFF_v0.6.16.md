# Top Eleven Tool — v0.6.16 Recovery Handoff

## Pass scope
Mobile-first Home correction only.

## Changes completed
- Removed Home hero `Get Started` and `Watch Tour` buttons entirely.
- Kept approved mobile Home hero/headline/mantra composition otherwise intact.
- Replaced touch `More` navigation with six direct bottom-bar destinations: Home, Squad, Training, Team Plan, Drills, Settings.
- Home Team Plan Snapshot now uses the richer v0.6 Home pitch artwork.
- Bumped runtime/cache identity to v0.6.16 and duplicated the Home asset pack under `assets/v0616/home/` for deploy-safe cache paths.
- No scanner, football, formation, tactics, mentor, training, Best-in-Slot or strategy logic changed.

## Mobile product priority
Phone/tablet is the design target. Desktop only needs to remain functional.

## Verification
- Core: 355 assertions PASS.
- Scanner compact-reference regression PASS.
- Scanner failover: 11 assertions PASS.
- Update matcher: 11 assertions PASS.
- Update persistence: 20 assertions PASS.
- Package integrity PASS.
- Real Chromium offline viewport audit: 45/45 PASS; zero horizontal overflow; zero console errors.
- Frozen engine/data containment checked byte-identical to v0.6.15 baseline for scanner/training/formation/tactics/mentor/team-plan/Best-in-Slot/strategy files.

## Next step
Deploy this build with the user's real cloud squad and review the real mobile Home only. Keep future design work mobile/tablet-first and do not reintroduce Home hero CTA buttons or a More bottom-nav item unless explicitly requested.
