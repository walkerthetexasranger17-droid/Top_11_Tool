# CURRENT DEVELOPMENT OVERLAY — v0.5.17-dev-pass2

**State:** UNPUBLISHED / TESTING — do not publish as the finished v0.5.17 release yet.  
**Release base:** v0.5.17.  
**Calibrated decision model:** unchanged v0.5.15 engine.

Pass1 product work remains: age+skills-only update scanning, bulk update queue, Master Cards above normal drills, and the Luiu integrity fixture.

DEV PASS2 adds:
- automatic-only Set Piece UI with **Current XI Coverage / Who covers what**; old manual picker/overrides removed from the runtime UI;
- deterministic 400-session Training repetition audit. No maxGrowth penalty was added: repetition is a real consequence of the stated objective, not a Luiu-specific bug.

Next planned dev work: deliberate implementation of the separate long-term best-in-slot squad-goal engine.

The historical frozen-release state follows below.

---

# Top Eleven Tool — Current State

**App version:** v0.5.17  
**Release state:** RELEASE-FROZEN  
**Freeze date:** 16 September 2026  
**Stable scanner baseline:** v0.4.18 recognition pipeline / Scanner v12 runtime  
**Game reference:** build 30527 / Windows package 27.3.0.0

## Permanent rules

- The optimiser is **own-squad-only**. Never add opponent formation, strength, tactics, scouting, relative-strength or live-match-state inputs.
- Do not invent private Top Eleven formulas, hidden multipliers, server values, Mentor magnitudes, Set Piece magnitudes, Training age rates or mixed live drain weights.
- Keep GAME FACT / LIVE FACT / COMPANION LOGIC / UNRESOLVED PRIVATE-SERVER LOGIC separate.
- v0.5.17 is frozen after the live tactic UI-label hotfix; the v0.5.15 calibrated decision model is unchanged. Subsequent product/scoring changes use **v0.5.18**.

## Frozen all-in-one decision chain

`eligible squad → Formation/XI → Tactics → Set Pieces/Captain → Mentor → final Team Plan → Training context`

### Formation / XI

- 40 lineup/role quality + 10 Playstyle-role fit + 20 weak-link protection + 30 structural quality.
- Versatility is not additive match-performance score.
- Fixed absolute quality-gap scaling; no candidate min/max cliffs.
- Exact XI assignment retains a Pareto frontier so weak-link protection and Playstyle fit cannot be lost to a tiny mean-quality advantage.
- Hard-legal natural-role fallback remains available when curated shapes cannot produce a clean natural XI.

### Playstyle / Special Ability semantics

- A Playstyle contributes only when **active and eligible for the current assigned role**.
- Secondary semantic features use the same gate; Locked/wrong-role Playstyles cannot create counter-runner or dribble-reliance/Mentor signals.
- Declared current Playstyle and active-SA tactic affinities are consumed by runtime.
- Four proven identity-only overlaps are suppressed to prevent double counting.
- Exact hard-legal Playstyle/SA semantic maximum is **74 raw → 14 points**.
- Shadow Striker is the player-facing SA. `LongShots` is an internal/historical import/provenance token only.

### Tactics

- Score architecture: 32 XI fit + 26 own-squad structure + 18 internal coherence + 14 Playstyle/SA fit + 10 condition-cost efficiency.
- Live Low/Medium/High tactic-option intensities are preserved as observed categories.
- Pure-class threshold observations are used where proven.
- **Mixed Medium/High numeric exchange rate remains unresolved**, so runtime does not fabricate a numeric total; only safe categorical/partial ordering is used.

### Set Pieces / Captain

- Set Pieces are generated per candidate XI and act only as a near-tie readiness tiebreak.
- Captain is gameplay-neutral and has zero Formation/Tactics/Mentor/Set Piece readiness/final Team Plan score.
- Automatic Captain = highest OVR starter only as a deterministic convenience default.

### Mentors

- Unlock gates remain Tactical L1 / Attribute L5 / Signature L10.
- Unknown external/live-only conditions contribute zero.
- Mentor adjustment is contained to viable core plans and cannot rescue a materially weaker Formation/Tactics plan.
- Exact per-level server magnitudes remain unresolved.

### Training

- Role+Playstyle development uses the specialist target-shape model rather than flat white-skill equality.
- Current companion target ratios remain S 1.18 / A 1.05 / B 0.92 / C 0.85 / secondary-role-only 0.82.
- Verified normal-drill base XP is 1/2/3/4/5 for Very Easy/Easy/Medium/Hard/Very Hard; exact final AttributeGain remains server-owned.
- Related-only match assignments fall back to a real natural development role.

### Squad Blueprint

- Coverage remains 70% core XI + 20% flexibility + 10% availability/rotation depth.
- One player cannot satisfy two simultaneous required slots.

## All-in-one isolation guarantees

The direct `TeamPlan.buildOptimalPlan()` regression proves:

- Locked Playstyles cannot alter the final plan;
- unused weak reserves cannot alter the final plan;
- unavailable elite players cannot leak into Match Ready XI/downstream scoring;
- incomplete elite players cannot leak into the plan.

Tactics, Mentors, Set Pieces and development context consume the chosen XI. Full-squad data is intentionally used only by Formation candidate selection and Squad Blueprint/coverage.

## Persistence / cache identity

- public/runtime version: **0.5.17**;
- Strategy model: `companion-strategy-v2-own-squad-runtime-v0515`;
- Tactics model: `30527-drain-fit-v5-calibrated-v0515-affinity-dedup-sa-canonical-ps-gate`;
- Team Plan persistence schema: **v6**;
- service-worker cache: `te-v0-5-17`;
- all local runtime asset query markers: `r=0517`.

Model fingerprints invalidate older cached Team Plans automatically.

## v0.5.16 runtime hardening (preserved in v0.5.17)

No Formation, Tactics, Mentor, Set Piece, Training or all-in-one scoring coefficient changed from v0.5.15. This release only hardens the shipped application:

- inline hero asset paths are subdirectory-safe;
- service-worker runtime fallback ignores version query strings when matching the precache;
- scanner skill values are rejected outside the app's existing 0–520 input contract and the Gemini schema carries the same limits;
- account/MFA strings inserted through `innerHTML` are HTML-escaped;
- stale launcher/cloud diagnostic version labels are synchronized;
- the malformed obsolete calibration scratch probe is archived as non-executable historical evidence.

## v0.5.17 live tactic UI-label hotfix

- Internal `FocusPassingCenter` / companion key `center` remains unchanged for scoring and drain identity.
- The user-facing Top Eleven selection label is **Through the Middle**, matching the user's current live game screenshot.
- `Center` must never be displayed as a selectable Focus Passing option.
- A 33-option UI-label regression now locks every tactic selection label.
- No calibrated scoring changed.

## Explicit unresolved boundaries

- mixed Medium↔High live tactic-drain arithmetic;
- exact Mentor per-level server magnitudes;
- exact current Set Piece specialist magnitude;
- Training age-rate server values.

These remain deliberately unresolved rather than guessed and do not require opponent data.

## Parked non-release work

- official Mentor portraits until deterministic asset-index → Mentor-ID mapping is proven;
- intermittent multi-click Mentor lock/unlock and player-delete interaction pass;
- responsive collectible Player Profile redesign under the single-screenshot-only data rule.

## Recovery

Read `START_HERE.md`, then the final section of `CALIBRATION_RECOVERY_HANDOFF_v0.5.17.md`, then `docs/releases/v0.5.17.md`. Historical `.pre_*` files are never active runtime code.
