# v0.5.16 Release Hardening Validation — Validation Record

**Release state:** RELEASE-FROZEN  
**Freeze date:** 2026-09-16

Primary recovery file: `CALIBRATION_RECOVERY_HANDOFF_v0.5.16.md`

## Frozen source-tree gate

- Core deterministic suite: **PASS — 353 assertions**
- Tactics calibration: **PASS — 178 assertions**
- Live-drain profile: **PASS — 52 assertions**
- Formation calibration invariants: **PASS — 27 assertions**
- Formation assignment: **PASS — 4 assertions**
- Formation natural fallback: **PASS — 4 assertions**
- Formation fallback monotonicity: **PASS — 5 assertions**
- Formation Playstyle: **PASS — 3 assertions**
- Squad Blueprint: **PASS — 21 assertions**
- Data completeness: **PASS — 10 assertions**
- Team Plan completeness: **PASS — 5 assertions**
- Training matrix: **PASS — 40 profiles (12 base + 28 Role+Playstyle)**
- Team Training: **PASS — 14 assertions**
- Set Pieces: **PASS — 29 assertions**
- Mentors: **PASS — 18 assertions**
- Stitched pipeline: **PASS — 26 assertions**
- Stitched plan monotonicity: **PASS — 8 assertions**
- Roster-order invariance: **PASS — 4 assertions**
- Direct all-in-one `TeamPlan.buildOptimalPlan()`: **PASS — 5 assertions**
- Strategy/data contract: **PASS — 12 roles, 28 role+Playstyle profiles, 11 formation rules, 56 tactic rules, 143 strings**
- Release identity/synchronisation contract: **PASS**
- Package integrity: **PASS — 464 precached runtime files; 461 required runtime files**
- Static/cloud/navigation contracts: **PASS**
- Scanner v12/failover/image/reference/level/badge/compact-reference/pixel/native-source/all-native-resolution contracts: **PASS**
- JavaScript syntax for active `js/*.js`, `sw.js` and executable `tests/*.js`: **PASS**

## Release identity

- Calibrated scoring model unchanged from v0.5.15: **verified**

- Public/runtime version: `0.5.16`
- Strategy generation: `companion-strategy-v2-own-squad-runtime-v0515`
- Tactics generation: `30527-drain-fit-v5-calibrated-v0515-affinity-dedup-sa-canonical-ps-gate`
- Team Plan schema: `6`
- Service-worker cache: `te-v0-5-16`
- Runtime cache-buster: `r=0516`
- Canonical `decision_logic_v2.json` and browser `js/strategy-data.js`: **deep-equal at freeze**
- Decision manifest SHA-256/byte counts: **verified by release identity contract**

- Runtime hardening contract: **PASS — 8 subpath-safe hero refs; offline query fallback; account escaping; scanner 0–520 boundary; malformed scratch probe archived**

## Frozen decision state

- All-in-one own-squad planner is stitched and directly regression-tested.
- Active Playstyle semantics require active state **and** eligible current assigned role everywhere they influence match planning.
- Declared Playstyle/active-SA affinities are active with proven identity-only duplicate paths suppressed.
- Exact hard-legal Playstyle/SA semantic maximum is **74 raw → 14 points**.
- Weak unused reserves, unavailable players and incomplete players are protected from leaking into the Match Ready plan.
- Shadow Striker is the sole player-facing SA identity; `LongShots` is internal/provenance compatibility only.
- Opponent information remains permanently out of scope.

## Intentionally unresolved, safely contained

Mixed Medium/High live tactic-drain exchange rate remains unresolved. Runtime uses categorical intensities and proven safe ordering only; no numeric exchange rate is invented. Exact Mentor per-level server magnitudes, exact current Set Piece specialist magnitude and Training age-rate values also remain unresolved rather than guessed.

## Release rule

v0.5.16 is frozen after runtime hardening. The v0.5.15 calibrated scoring model is unchanged. Any subsequent product/scoring change starts **v0.5.17**. Historical `.pre_*` files are recovery evidence only and are not active runtime code.
