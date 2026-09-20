# v0.5.3 Research Checkpoint — Formation / Tactics / Mentors

**Date:** 14 September 2026  
**Game reference:** build 30527 / Windows package 27.3.0.0  
**Purpose:** stop the broad research loop and preserve everything useful before continuing with narrow targets.

## Evidence rule

Keep the project evidence classes separate:

- **GAME FACT** — binary/native/protocol structure.
- **GAME ASSET FACT** — shipped localisation/serialized assets.
- **LIVE FACT** — controlled official-client state/capture.
- **STRONG EVIDENCE** — architecture/static evidence that is persuasive but not a recovered formula.
- **COMPANION LOGIC** — our transparent recommendation rule.
- **UNRESOLVED** — do not invent.

## Mentor findings

### Proven structure

- `Mentor.IsUnlocked` is separate from `MentorProgress.Level` in the current protocol/domain model.
- The companion therefore must not use a fake Level 0 to mean locked.
- Fresh companion state is **Locked** until the user marks a Mentor unlocked; once unlocked the selectable level begins at 1.
- Historical captured levels/XP belong in research evidence only and must not seed a user's Mentor state.

### Proven effect-family unlocks

Static/native client logic in `MentorBoostIconResolver.UnlockLevelForKind` establishes:

- Tactical Boost unlock level: **1**
- Attribute Boost unlock level: **5**
- Signature Move unlock level: **10**

This is authoritative client-side family availability logic.

### Effect magnitudes

- Live Mentor state contains `CurrentEffects[]` and `NextLevelEffects[]`.
- `MentorBoostMap.Entry` contains presentation metadata only: `boostId`, `spriteName`, description/current/next localisation keys.
- No complete static `level -> effect values` table has been recovered.
- Therefore a selected Mentor level must **not** reuse effect magnitudes captured at a different level.
- Exact per-level magnitude curves remain **SERVER RUNTIME / UNRESOLVED** until captured authoritatively.

### Match application boundary

The static live-match paths inspected (`UpdateMentorsStateIfPresentInPeriod`, halftime Mentor state update, Assign/Unassign command flow) transport/store Mentor state and notify listeners; they do not visibly apply local attribute/tactic arithmetic.

A broad metadata pass found no obvious Mentor-named fields/methods under the Football Engine namespace. Combined with snapshot transport this is **STRONG EVIDENCE** that authoritative Mentor effect application is server-side, but it is not promoted to GAME FACT without a direct server/client boundary proof.

## Formation findings

### Lineup Balance matters

Current shipped game text states that stronger **Lineup Balance** improves the team's chance of winning the ball and therefore gives more possession. The same guidance ties Balance to how well the XI's capabilities fit together plus temporary match/squad factors such as injuries, red cards and player condition.

This means Lineup Balance is **not merely decorative**. The exact private 0–10 calculation remains unresolved, so the companion must not fabricate the server formula.

### Formation status methods

Current native client contains formation status/legality helpers including:

- `SquadUtil.IsCurrentFormationLegal`
- `SquadUtil.GetFormationStatusKey`
- `SquadUtil.GetIllegalFormationStatusKey`
- `SquadUtil.GetIrregularFormationStatusKey`

These are useful future targets for distinguishing current legality/advisory rules from old retained localisation.

## Tactics findings

The exact 11-dimension condition-drain calculation remains fully proven and unchanged.

The shipped tactic tooltips provide semantic behaviour for all 11 dimensions, but this research pass still did **not** recover a second client-side numerical formula equivalent to `CalculateConditionDrain` that scores tactical effectiveness for an XI/opponent.

Therefore:

- exact drain = GAME FACT;
- tooltip/behaviour meaning = GAME ASSET FACT;
- private tactical effectiveness / best-tactic weighting = UNRESOLVED.

## Next focused research order

Do **not** resume a giant Formation+Tactics+Mentor sweep.

1. **Mentor progression ladder:** exhaust static/runtime evidence for Level 1–10 values. If absent, design the smallest legitimate capture needed to populate it.
2. **Formation legality/status:** decompile/trace the four `SquadUtil` methods and index only current rules.
3. **Lineup Balance:** retain as a meaningful server-side factor but do not block the app waiting for its private formula.
4. **Tactics effects:** only resume targeted research if a concrete class/config points to effectiveness beyond the already recovered semantics/drain.
5. After Mentor level data is usable, wire the final transparent chain: **players -> formation -> tactics -> Mentor -> combined Team Plan**.
