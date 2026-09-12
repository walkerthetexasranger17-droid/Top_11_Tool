# Top Eleven Tool v0.4.6

Top Eleven Tool is a local-first PWA companion for managing a Top Eleven squad, scanning player cards, planning training, selecting an XI, assigning set pieces and turning the tactics engine into simple in-game selections.

`v0.4.6` is the first product-structure build after resetting the public version line. Internal reverse-engineered game-data provenance remains in the packaged code/docs where required, but it is no longer plastered across the normal app UI.

## Product structure

The main navigation is intentionally limited to six destinations:

- **Home** — squad overview and quick actions.
- **Squad** — add, update, review and manage players. The scanner is entered from here rather than having its own navigation page.
- **Training** — Individual and Team training live on one page behind tabs.
- **Team Plan** — Formation, Set Pieces and Tactics live on one page behind tabs.
- **Drills** — drill-level/unlock/Master-card setup.
- **Settings** — Gemini scanner configuration and local-data controls.

## Player management

- Squad search has been removed; the page starts with a prominent **Add Player** action.
- Existing players can be updated by a fresh scan from their profile.
- A multi-role player can have any detected natural role promoted to primary by tapping that role.
- Profiles show the actual **Playstyle** and **Special Ability/Abilities** with icon artwork and support multiple Special Abilities.
- Special Ability learning/progress is stored separately from unlocked abilities.
- Role intelligence shows both the strongest three and weakest three key attributes for each natural role.

## Scanner

The proven Gemini 3.1 Flash Live scanner remains intact:

- HIGH-thinking Live sessions;
- automatic normalisation of native phone screenshots to the canonical scan frame;
- separate core, playstyle identity and playstyle-level passes;
- per-slot Special Ability classification;
- separate goalkeeper and outfield attribute layouts;
- Special Ability training/progress widget detection;
- editable review before save;
- queue persistence and explicit retry handling.

Benchmark answers are not supplied to Gemini in production.

## Team Plan

Formation selection is automatic. The user no longer types a formation or sees a redundant Starting XI/Bench text list beside the pitch.

The formation engine scores legal assignments against the actual squad. In addition to the internal verified baseline shapes, v0.4.6 adds a small set of **community-informed 2026 candidate shapes** (4-1-4-1, 3-1-4-1-1 and 3-1-2-1-3). They are candidates only: the app does not claim one universal meta formation, and the user's own role means/floors still decide the winner.

Set Pieces uses the same football-pitch interaction with assignment modes for captain, penalty, left/right free kick and left/right corner.

Tactics is split into three game-like phases:

- **In Possession**
- **In Transition**
- **Out of Possession**

The main UI shows the selections to copy into Top Eleven; calculation/provenance detail stays in the background.

## Mentors

Mentor levels are user-settable and stored locally. The app no longer assumes that levels visible in reverse-engineering screenshots are the user's own mentor levels.

## Cloud sync

Cross-device account sync is **not implemented in v0.4.6**. Current squad data remains local to each browser/device. The planned architecture is authenticated cloud storage (for example Supabase) with migration of the existing local squad and an offline cache. A real backend project and credentials are required before this can be shipped honestly.

## Development / validation

Run from the app root:

```bash
node tests/core-tests.js
node tests/scanner_failover_tests.js
python tests/scanner_regression.py
python tests/scanner_image_contract.py
python tests/navigation_queue_contract.py
python tests/static_checks.py
python tests/package_integrity.py
```

The app remains a static PWA suitable for GitHub Pages/local hosting. The Gemini API key is stored only in the user's browser.

## Local squad recovery

If a restructuring update leaves previously saved players hidden, v0.4.6 automatically checks the existing local player records and migration backups. A manual **Recover existing squad** control is also available in Settings. Healthy current records are preserved; recovery only restores missing/corrupt canonical copies and resets stale squad filters.

