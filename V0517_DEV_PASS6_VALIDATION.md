# v0.5.17 DEV PASS6 validation

**State:** UNPUBLISHED — do not publish.  
**Scope:** Best-in-Slot current-squad gap/coverage; no Match Ready scoring changes.  
**Base:** verified v0.5.17-dev-pass5.

## Change

Pass6 adds a stat-free current-squad comparison against the frozen Best-in-Slot v2 goal.

- one player can cover only one goal slot;
- natural role is mandatory for long-term slot coverage;
- related roles do not count;
- exact active Playstyle, Playstyle level and target SAs choose the closest current natural-role match;
- OVR and skill values are never read;
- slot states expose master-ready, development/identity and recruit gaps;
- Best-in-Slot goal generation stays independent of the Match Ready plan.

## New regression gates

- `tests/best_in_slot_squad_gap.js` — **24 assertions PASS**.
- `tests/best_in_slot_ui_contract.py` — **28 assertions PASS** after adding the coverage overlay contract.

## Existing regression gates

- Core: **353 PASS**
- Tactics calibration: **178 PASS**
- Live drain: **52 PASS**
- Formation invariants: **27 PASS**
- Formation assignment: **4 PASS**
- Formation fallback monotonicity: **5 PASS**
- Natural fallback: **4 PASS**
- Formation Playstyle: **3 PASS**
- Squad Blueprint: **21 PASS**
- Team Training: **14 PASS**
- Set Pieces: **29 PASS**
- Mentor: **18 PASS**
- Stitched pipeline: **26 PASS**
- Stitched monotonicity: **8 PASS**
- Order invariance: **4 PASS**
- Direct all-in-one: **5 PASS**
- SA role eligibility: **65 PASS**
- Best-in-Slot v2 goal: **127 PASS**
- Luiu fixture: **7 PASS**
- Player update scanner: **18 PASS**
- Set Piece coverage UI: **12 PASS**
- SA picker: **11 PASS**
- Tactic UI labels: **33 PASS**
- strategy/static/runtime/cloud/navigation/scanner contracts: PASS
- active runtime JavaScript syntax: PASS

No Match Ready Formation/Tactics/Mentor/Set Piece/Training coefficient changed. Mixed live Medium/High drain arithmetic remains unresolved.

## Package verification

Pre-final packaging extracted **815/815 files byte-identically** and reran the Best-in-Slot squad-gap, Best-in-Slot UI, 353-core, 5-assertion direct all-in-one and package-integrity gates successfully from the extracted copy. The final ZIP is repackaged after recording this result and is independently extracted/verified before handoff.
