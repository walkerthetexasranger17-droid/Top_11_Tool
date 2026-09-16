# v0.5.17 DEV PASS11 validation

**State:** UNPUBLISHED — do not publish.  
**Scope:** package cleanup + navigation/button reliability + PWA cache hardening + Training/Team Plan performance.  
**Football logic:** v0.5.15 Match Ready calibration and Pass5 Best-in-Slot objective unchanged.

## Cleanup / PWA

- Pass10 baseline: 825 files / 37,290,874 bytes.
- Historical `.pre_*`, old design/research binaries and embedded source archives removed with provenance in `docs/maintenance/pass11_removed_files.json`.
- Active scanner runtime refs/manifests and scanner fixtures preserved.
- Service-worker install precache reduced from 466 files / ~17.9 MB to **58 essential files / 2,637,579 bytes**; scanner references runtime-cache on demand.
- Pass11 service-worker generation: `te-v0-5-17-p11`.

## Interaction / performance hardening

- Serialized/latest-wins page-render queue; cloud UI refresh defers during active page render.
- Real horizontal swipe threshold (`>=32px`) before Squad-row click suppression.
- Toast layer uses `pointer-events:none`.
- Heavy Training/Team Plan actions are duplicate-locked.
- Team Plan redundant pre-Formation calculation removed; full search yields between formation candidates.
- Training beam-search temporary state compacted; frozen 72-case comparison across all roles/modes/seeds/Master stock remained byte-identical.

## Stress result

`tests/engine_stress.js`: **197 PASS**
- 16 fresh Team Plans (2 rounds x 8 approach/drain configurations), deterministic across rounds;
- 36 Training builds (12 roles x 3 modes);
- 40 consecutive verified age/skills/derived-OVR persistence cycles;
- completed in **34.236 seconds** in the verification environment.

## Deterministic regression gate

- Core: **355 PASS**
- Tactics calibration: **178 PASS**
- Live drain: **52 PASS**
- Formation invariants: **27 PASS**
- Squad Blueprint: **21 PASS**
- Team Training: **14 PASS**
- Set Pieces: **29 PASS**
- Mentor: **18 PASS**
- Stitched pipeline: **26 PASS**
- Stitched monotonicity: **8 PASS**
- Direct all-in-one: **5 PASS**
- Best-in-Slot: **127 PASS**
- Best-in-Slot squad gap: **28 PASS**
- SA role eligibility: **65 PASS**
- Automatic player update: **31 PASS**
- Player update persistence/derived OVR: **20 PASS**
- Tactic UI labels: **33 PASS**
- Balanced Training representative matrix: **24 PASS** + dedicated mode contract **8 PASS**
- Runtime interaction/stability: **12 PASS**
- Button-binding audit: **72/72 buttons bound**
- Cloud/navigation/runtime hardening: PASS
- Strategy/data + release identity + static checks: PASS
- Package cleanliness/integrity: PASS
- Scanner failover/image/compact/native-resolution contracts: PASS
- Additional data completeness, formation assignment/fallback, Training repetition and v0.4.12–v0.4.18 scanner contracts: PASS

No application assertion failed in the deterministic/local suite. Browser/Chromium smoke remains an execution-environment limitation when Chromium cannot start reliably; it is not treated as an application assertion failure.

## Release boundary

This pass changes implementation/performance/package composition only. It does **not** recalibrate Formation, Tactics, Mentor, Set Pieces, Training objectives, Best-in-Slot football ranking or opponent scope.
