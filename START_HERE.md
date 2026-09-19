# v0.6.38 — START HERE

**CURRENT UI BRANCH:** v0.6.38 — Drills + Master Card integration.  
**FROZEN DECISION/FOOTBALL BASELINE:** v0.5.17.  
**SCANNER:** VERSION=12.

Read `DESIGN_RECOVERY_HANDOFF_v0.6.38.md` first, then `V0638_DRILLS_MASTER_VALIDATION.md`.

## v0.6.38 scope
- Approved Drills portrait background.
- Three useful Drills summary cards.
- Master Drill Cards before normal drills.
- Normal drills grouped Attacking → Defending → Possession → Physical & Mental.
- Shared category colour/tint system across Drills and Training recommendations.
- Master Card stock deducted only on `Mark Session Completed`; exhausted cards are excluded from future recalculations.

## Do not change without explicit user request
- Approved Home/Squad design.
- Frozen v0.5.17 football/decision calibration.
- Scanner VERSION=12 calibration/reference system.
- Existing Firebase/auth security contract.

## Packaging
Always produce both a lean deploy ZIP and a full recovery ZIP, then extract and verify both before handoff.
