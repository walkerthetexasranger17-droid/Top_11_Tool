# v5.2.19 Bible Compliance Record — Build 30527

Contract: `TOP_ELEVEN_TOOL_BIBLE_BUILD_30527_v1.md` (document v1.0). This record classifies the shipped implementation against the creator checklist and does not treat unresolved private server/match-engine formulas as implementation failures.

| Area | v5.2.19 implementation | Status |
| --- | --- | --- |
| Roles / player model | Exactly 12 current roles. DML/DMR removed from current selectors/scanner outputs and retained only as legacy metadata. Natural and Related roles stored separately. | PASS |
| Playstyle / SA preservation | Full playstyle object state is retained; role-aware chooser; Ball Playing GK not offered. Current 19 SAs, no Shadow Striker, no hard two-SA storage cap, no invented universal SA eligibility matrix. | PASS |
| Data migration | `te:` storage retained. Migration is idempotent, backs up pre-migration player records, preserves player/scanner/image/drill/Master data, full playstyle state, abilities, and current natural/related roles; obsolete recommendation caches are version-invalidated. | PASS |
| Squad / Profile / Scanner | Squad supports search plus role, age, OVR, playstyle and availability filters. Profile shows role/white-skill and playstyle state information. Scanner v3 uses the Gemini Developer API free-tier ingestion path with runtime-discovered stable Flash failover; player schema/role/playstyle/special-ability compatibility is preserved. | PASS |
| Formation | Five Bible templates are data-driven. Player-to-role value is exact target-role key-skill mean; wrong roles are excluded; Natural/Related is categorical; no OVR/adjacency magic weights. Whole XI is solved globally. | PASS |
| Pitch X/Y | Uses confirmed 0–1000 role rectangles. Repeated-role players are evenly spaced by the Bible generator; rounding/clamping occurs only at storage/render boundary. Team Plan stores exact assigned X/Y. | PASS |
| Formation presentation | Shows recommended formation, graphical pitch, player/assigned role, Natural/Related status, Top Eleven Tool Role Score, weakest three target-role key skills, playstyle fit/level, abilities and bench. | PASS |
| Tactics / drain | All 11 settings use canonical Build-30527 option IDs. Exact 15 + Σ(0/5/7) drain arithmetic and strict thresholds are used. Fixed mentality search enumerates 19,440 candidates; full-grid checksum is regression-tested. | PASS |
| Dependency graph | Valid cached formation is preserved when only Approach or Drain changes. Those inputs recalculate Tactics then Mentor; squad/rebuild changes can regenerate Formation. | PASS |
| Mentors | Seven documented mentors and captured raw effects are preserved. Recommendation is lexicographic direct tactic match → useful assigned-role attribute coverage → mentor level → stable order. Best + at least two alternatives with reasons are returned. Raw arrays are not reinterpreted. | PASS |
| Individual Training | Natural-role white union; target = mean(top 3 white values); need formula per Bible; grey utility exactly zero; drill strength from XP/effect; multi-white utility accumulated; diminishing credits; Master stock respected; six-slot beam width 250. No exact gain prediction. | PASS |
| Team Training | Uses actual saved players in each selected group, each player's white union/need and per-player credits; six-slot beam width 250. Protocol TeamPlayTrainingDrill remains explicitly separate. | PASS |
| PWA / precache | Existing theme/assets/icon/PWA behaviour retained. Service-worker cache `te-v5-2-13-30527` precaches every required runtime module/data/asset: 70/70. | PASS |
| Specialists | Optional companion-only logic is visibly treated as companion logic and does not alter Formation Role Score. No authoritative captain formula is fabricated. | PASS |
| Evidence boundary | GAME/LIVE facts come from Build-30527 Bible/data; companion calculations are labelled; unresolved private logic is not fabricated. | PASS |

| Legacy contract path | Historical `data/build_30527/IMPLEMENTATION_CONTRACT.md` now defers to the canonical Bible and is regression-checked for stale max-target/greedy/dilution rules. | PASS |

## Automated evidence

- `tests/core-tests.js`: PASS — 254 assertions.
- `tests/scanner_regression.py`: PASS — Gemini 3.8-only retry contract, Locked/Standard/Intermediate/Advanced/Master playstyle states, Ariel Bravo Locked + François Roelandt Intermediate fixtures, 19 special abilities, and the David Andrews two-ability fixture.
- `tests/scanner_failover_tests.js`: PASS — transient/rate/daily/request classification and RetryInfo/backoff parsing.
- `tests/navigation_queue_contract.py`: PASS — swipe delete, history/back, refresh persistence, drawer and scanner queue retry/persistence hooks.
- `tests/static_checks.py`: PASS.
- `tests/package_integrity.py`: PASS — 70/70 runtime files precached.
- All JavaScript/service-worker files pass `node --check`.

## Browser smoke classification

**ENVIRONMENT BLOCKED — NOT APPLICATION FAILURE.** Headless Chromium failed to start/terminate correctly in the build environment. No application assertion failure was produced. Manual device/browser smoke testing is recommended after packaging.

## Remaining unresolved game logic

Only items the Bible explicitly classifies as unresolved remain unimplemented: exact private match-engine weights, exact playstyle/mentor magnitude, universal SA eligibility without per-player server data, Squad Balance formula, Talent weighting and exact server-side training gain/RNG/age coefficients. The app does not invent substitutes and does not claim exact predicted percentage-point gains.
