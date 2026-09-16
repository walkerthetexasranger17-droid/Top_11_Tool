# v0.5.17 DEV PASS9 validation

**State:** UNPUBLISHED — do not publish.  
**Base:** verified v0.5.17-dev-pass8.  
**Scope:** fix live automatic-update persistence failure.  
**Match Ready decision model:** frozen v0.5.15 calibration unchanged.

## Live defect corrected

User testing proved Pass8 could scan/match an update screenshot without changing the saved player. The Pass8 static contract did not execute the persistence path. Code audit found `updateScanSafeForAutoSave()` used `updateScanWarnings(scan).length` as an unconditional veto, so any Gemini uncertainty could stop before `P.save()`.

Pass9:

1. adds `Players.updateAgeSkillsOnly()` as the dedicated existing-player maintenance mutation;
2. validates age + every required visible skill;
3. preserves name, OVR, natural/related roles, Playstyle state and Special Abilities;
4. writes the existing key and immediately reloads it;
5. throws instead of claiming success unless age + every new skill match persisted storage;
6. allows deterministic clean scans to save even if a benign uncertainty string exists only after independent two-read consensus;
7. keeps disagreement/ambiguous cases manual rather than guessing;
8. sends manual update fallback through the same verified persistence API.

## Dedicated verification

- Automatic update contract: **30 PASS**.
- Automatic name matcher: **11 PASS**.
- New automatic-update persistence runtime test: **17 PASS**.
  - saved player created;
  - age changed;
  - all 15 outfield skills changed exactly;
  - attributes mirror changed skills;
  - name/OVR/natural roles/related roles/Playstyle/SA preserved;
  - scanner metadata preserved + updated;
  - squad revision increments;
  - incomplete update rejects atomically and leaves existing age/skills untouched.

## Broader regression status

- Core: **355 PASS**.
- Tactics calibration: **178 PASS**.
- Live drain: **52 PASS**.
- Formation invariants: **27 PASS**.
- Direct all-in-one: **5 PASS**.
- SA role eligibility: **65 PASS**; picker **11 PASS**.
- Mentor: **18 PASS**.
- Set Pieces: **29 PASS**; coverage UI **13 PASS**.
- Stitched pipeline: **26 PASS**; monotonicity **8 PASS**; order invariance **4 PASS**.
- Team Training: **14 PASS**; Luiu **7 PASS**; Balanced Training **8 PASS**; representative-role matrix **24 PASS**.
- Best-in-Slot v2: **127 PASS**; squad-gap **28 PASS**; UI **29 PASS**.
- Tactic labels: **33 PASS**.
- Navigation/render, navigation/queue, cloud hydration/local-first, static, package integrity, runtime hardening and release-identity contracts: PASS before final packaging.

## Locks

No Formation, Tactics, Mentor, Set Piece, Training, Best-in-Slot or Match Ready scoring coefficient changed. Opponent information remains out of scope.

## Final recovery package gate

Checkpoint archive: `top-eleven-tool-v0.5.17-dev-pass9-2026-09-16.zip`.

The final archive must extract with **824/824 files byte-identical** to the frozen source and rerun, from that extracted copy: player-update persistence (17), automatic-update contract (31), name matcher (11), core (355), Tactics (178), direct all-in-one (5), Best-in-Slot (127 + 28 gap), SA-role (65), Set Piece coverage UI (13), navigation/render/queue, cloud local-first/hydration, static, package-integrity, runtime-hardening and release-identity gates.

The final SHA-256 is intentionally reported outside the archive in the delivery message so the archive does not contain a self-referential hash.
