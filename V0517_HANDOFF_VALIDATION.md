# v0.5.17 handoff validation

## Release identity

- Release: **v0.5.17**
- Decision model fingerprint: `companion-strategy-v2-own-squad-runtime-v0515` (unchanged)
- Focus Passing internal key: `center` / current-client enum `FocusPassingCenter`
- Focus Passing live UI label: **Through the Middle**
- Scoring/calibration changes: **none**
- Opponent information: out of scope
- Mixed Medium/High drain weighting: unresolved

## Regression gate before packaging

- Core: **353 assertions PASS**
- Tactics calibration: **178 assertions PASS**
- Live drain: **52 assertions PASS**
- Formation invariants: **27 assertions PASS**
- Squad Blueprint: **21 assertions PASS**
- Team Training: **14 assertions PASS**
- Set Pieces: **29 assertions PASS**
- Mentor: **18 assertions PASS**
- Stitched pipeline: **26 assertions PASS**
- Stitched monotonicity: **8 assertions PASS**
- Direct all-in-one planner: **5 assertions PASS**
- Tactic UI labels: **33 selectable labels PASS**; internal `center` renders as **Through the Middle**
- Strategy/data, release identity, runtime hardening, static, package integrity, cloud/navigation, scanner/failover/native-resolution contracts: **PASS**
- Active JavaScript syntax: **PASS**

## Release boundary

This is a user-facing option-identity hotfix only. Formation, Tactics scoring, drain semantics, Mentor, Set Pieces, Training and Team Plan selection remain the v0.5.15 calibrated model.
